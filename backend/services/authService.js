// src/services/authService.js

import { PrismaClient } from '@prisma/client';
import chargebeeModule from 'chargebee-typescript';
import AppError from '../utils/AppError.js';
import { slugify } from '../utils/slugify.js';

const prisma = new PrismaClient();

// ✅ USING YOUR WORKING INITIALIZATION LOGIC - THIS IS CORRECT
const { ChargeBee } = chargebeeModule;
const chargebee = new ChargeBee();
chargebee.configure({
  site: process.env.CHARGEBEE_SITE,
  api_key: process.env.CHARGEBEE_API_KEY
});

// A robust helper for idempotently creating/retrieving Chargebee items
const findOrCreateChargebeeItem = async (itemId, itemName) => {
  try {
    const result = await chargebee.item.create({
      id: itemId,
      name: itemName,
      type: "plan",
      item_family_id: process.env.CHARGEBEE_ITEM_FAMILY_ID
    }).request();
    console.log(`[Chargebee] Created new item: ${itemId}`);
    return result.item;
  } catch (error) {
    if (error.api_error_code === 'duplicate_entry') {
      console.log(`[Chargebee Idempotency] Item ${itemId} already exists. Retrieving it.`);
      const result = await chargebee.item.retrieve(itemId).request();
      return result.item;
    }
    throw error;
  }
};

// --- Unified Role & Profile Management ---

export const selectRole = async ({ userId, role }) => {
  console.log(`[AuthService] User ID ${userId} is selecting role: ${role}`);
  const normalizedRole = role.toUpperCase();
  const validRoles = ['MEMBER', 'GYM_OWNER', 'TRAINER', 'MERCHANT'];
  if (!validRoles.includes(normalizedRole)) throw new AppError('Invalid role specified.', 400);

  const user = await prisma.user.update({ where: { id: userId }, data: { role: normalizedRole } });
  
  let redirectTo = '';
  switch (normalizedRole) {
    case 'MEMBER': redirectTo = '/create-member-profile'; break;
    case 'GYM_OWNER': redirectTo = '/create-gym-profile'; break;
    case 'TRAINER': redirectTo = '/create-trainer-profile'; break;
    case 'MERCHANT': redirectTo = '/create-merchant-profile'; break;
    default: redirectTo = '/dashboard';
  }
  console.log(`[AuthService] Role for User ID ${userId} updated to ${normalizedRole}. Redirecting to: ${redirectTo}`);
  return { role: user.role, redirectTo };
};

export const createProfile = async ({ userId, profileType, data, authPayload }) => {
  try {
    switch (profileType) {
      case 'MEMBER': {
        if (!authPayload || !authPayload.sub) { throw new AppError('MEMBER profile creation requires a valid Auth0 token payload.', 401); }
        const user = await prisma.user.findUnique({ where: { auth0_id: authPayload.sub } });
        if (!user) { throw new AppError(`Authenticated user with Auth0 ID ${authPayload.sub} could not be found.`, 404); }
        const memberData = {
          name: data.name, age: data.age, gender: data.gender,
          weight: typeof data.weight === 'object' ? data.weight.value : data.weight,
          height: typeof data.height === 'object' ? data.height.value : data.height,
          fitnessGoal: data.fitnessGoal, healthConditions: data.healthConditions,
        };
        return await prisma.memberProfile.update({ where: { userId: user.id }, data: memberData });
      }

       case 'TRAINER': {
        const { plans: trainerPlansData, ...trainerData } = data;
        return await prisma.$transaction(async (tx) => {
          const profile = await tx.trainerProfile.upsert({
            where: { userId }, 
            update: trainerData, 
            create: { userId, ...trainerData },
            include: { user: { select: { email: true } } }
          });
          
          await tx.trainerPlan.deleteMany({ where: { trainerProfileId: profile.id } });

          const validPlans = (trainerPlansData || []).filter(p => 
              p.name && p.name.trim() !== '' && 
              p.duration && p.duration.trim() !== '' &&
              p.price != null && p.price !== '' && !isNaN(parseFloat(p.price)) && parseFloat(p.price) > 0
          );

          if (validPlans.length > 0) {
            for (const planData of validPlans) {
              const chargebeeItemId = `trainer-${profile.id}-${slugify(planData.name)}`;
              const chargebeeItemName = `${profile.user.email} - ${planData.name}`;

              const chargebeeProduct = await findOrCreateChargebeeItem(chargebeeItemId, chargebeeItemName);

              const chargebeePriceId = `${chargebeeItemId}-${planData.duration.toLowerCase()}`;
              
              const chargebeePriceResult = await chargebee.item_price.create({
                id: chargebeePriceId, 
                name: planData.name, 
                item_id: chargebeeProduct.id,
                price: Math.round(parseFloat(planData.price) * 100), // Corrected param name
                period: 1,
                period_unit: planData.duration.toLowerCase(),
                currency_code: "INR"
              }).request().catch(async (err) => {
                  if (err.api_error_code === 'duplicate_entry') {
                    console.log(`[Chargebee Idempotency] Price ${chargebeePriceId} already exists. Retrieving it.`);
                    return chargebee.item_price.retrieve(chargebeePriceId).request();
                  }
                  throw err;
              });
              
              await tx.trainerPlan.create({
                data: {
                  trainerProfileId: profile.id, name: planData.name, price: parseFloat(planData.price),
                  duration: planData.duration, chargebeePlanId: chargebeePriceResult.item_price.id,
                },
              });
            }
          }
          return profile;
        });
      }
         case 'GYM_OWNER': {
        const { plans: gymPlansData, ...gymData } = data;
        return await prisma.$transaction(async (tx) => {
             const gym = await tx.gym.upsert({
                where: { managerId: userId }, // The missing 'where' clause is restored.
                update: gymData, 
                create: { ...gymData, managerId: userId },
            });
            await tx.gymPlan.deleteMany({ where: { gymId: gym.id } });

            const validPlans = (gymPlansData || []).filter(p => 
                p.name && p.name.trim() !== '' && 
                p.duration && p.duration.trim() !== '' &&
                p.price != null && p.price !== '' && !isNaN(parseFloat(p.price)) && parseFloat(p.price) > 0
            );

            if (validPlans.length > 0) {
              for (const planData of validPlans) {
                const chargebeeItemId = `gym-${gym.id}-${slugify(planData.name)}`;
                const chargebeeItemName = `${gym.name} - ${planData.name}`;
                const chargebeeProduct = await findOrCreateChargebeeItem(chargebeeItemId, chargebeeItemName);
                const chargebeePriceId = `${chargebeeItemId}-${planData.duration.toLowerCase()}`;
                
                // ✅✅✅ THE DEFINITIVE FIX IS HERE ✅✅✅
                const chargebeePriceResult = await chargebee.item_price.create({
                    id: chargebeePriceId, 
                    name: planData.name, 
                    item_id: chargebeeProduct.id,
                    
                    // The parameter is `price`, not `price_in_cents`.
                    price: Math.round(parseFloat(planData.price) * 100), 

                    period: 1,
                    period_unit: planData.duration.toLowerCase(),
                    currency_code: "INR"
                }).request().catch(async (err) => {
                    if (err.api_error_code === 'duplicate_entry') {
                        return chargebee.item_price.retrieve(chargebeePriceId).request();
                    }
                    throw err;
                });
                
                await tx.gymPlan.create({
                    data: {
                        gymId: gym.id, name: planData.name, price: parseFloat(planData.price),
                        duration: planData.duration, chargebeePlanId: chargebeePriceResult.item_price.id,
                    },
                });
              }
            }
            return gym;
        });
      }

      case 'MERCHANT':
        return await prisma.merchantProfile.upsert({
          where: { userId }, update: data, create: { ...data, userId },
        });

      default:
        throw new AppError('Invalid profile type provided.', 400);
    }
  } catch (error) {
      console.error(`[AuthService] ERROR during createProfile:`, error);
      if (error.type === 'chargebee') {
        throw new AppError(`A billing service error occurred: ${error.message}`, 500);
      }
      throw error;
  }
};

// --- Auth0 Specific Services ---
export const verifyAuth0User = async (auth0Payload) => {
  try {
    const basicUser = await prisma.user.findUnique({ where: { auth0_id: auth0Payload.sub } });
    if (basicUser) { return getFullUserById(basicUser.id); }
    const email = auth0Payload.email || `user_${auth0Payload.sub}@placeholder.com`;
    const newUser = await prisma.user.create({ data: { auth0_id: auth0Payload.sub, email, provider: 'auth0' } });
    const { password, ...userResponse } = newUser;
    return userResponse;
  } catch (error) {
    console.error(`[AuthService] Error in verifyAuth0User:`, error);
    throw new Error('Failed to verify or create user due to a database error.');
  }
};

export const verifyMember = async (auth0Payload) => {
  try {
    let user = await prisma.user.findUnique({ where: { auth0_id: auth0Payload.sub }, include: { memberProfile: true } });
    if (user) {
      if (user.role === 'MEMBER' && !user.memberProfile) {
        await prisma.memberProfile.create({ data: { userId: user.id } });
        user = await prisma.user.findUnique({ where: { id: user.id }, include: { memberProfile: true }});
      }
      const { password, ...userResponse } = user;
      return userResponse;
    }
    const email = auth0Payload.email || `user_${auth0Payload.sub}@placeholder.com`;
    const newUser = await prisma.user.create({
      data: { auth0_id: auth0Payload.sub, email, provider: 'auth0', role: 'MEMBER', memberProfile: { create: {} } },
      include: { memberProfile: true }
    });
    const { password, ...userResponse } = newUser;
    return userResponse;
  } catch (error) {
    console.error(`[AuthService] Error in verifyMember:`, error);
    throw error;
  }
};

// --- HELPER FUNCTIONS ---
export const getUserByAuth0Id = async (auth0Sub) => {
  const user = await prisma.user.findUnique({ where: { auth0_id: auth0Sub } });
  if (!user) { throw new AppError('User not found for the provided Auth0 ID', 404); }
  return user;
};

export const getFullUserById = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { memberProfile: true, managedGyms: true, trainerProfile: true, merchantProfile: true },
  });
  if (!user) { throw new AppError('User not found.', 404); }
  const { password, ...userResponse } = user;
  return userResponse;
};