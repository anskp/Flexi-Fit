// src/services/authService.js

import { PrismaClient } from '@prisma/client';
import AppError from '../utils/AppError.js';

const prisma = new PrismaClient();

// --- Unified Role & Profile Management ---

export const selectRole = async ({ userId, role }) => {
  // This function is correct and remains unchanged.
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
  console.log(`[AuthService] createProfile called for userId: ${userId}, profileType: ${profileType}`);
  
  try {
    switch (profileType) {
      case 'MEMBER': {
        // This logic is for a different client and remains unchanged.
        if (!authPayload || !authPayload.sub) {
          throw new AppError('MEMBER profile creation requires a valid Auth0 token payload.', 401);
        }
        const user = await prisma.user.findUnique({ where: { auth0_id: authPayload.sub } });
        if (!user) {
          throw new AppError(`Authenticated user with Auth0 ID ${authPayload.sub} could not be found.`, 404);
        }
        const memberData = {
          name: data.name, age: data.age, gender: data.gender,
          weight: typeof data.weight === 'object' ? data.weight.value : data.weight,
          height: typeof data.height === 'object' ? data.height.value : data.height,
          fitnessGoal: data.fitnessGoal, healthConditions: data.healthConditions,
        };
        return await prisma.memberProfile.update({ where: { userId: user.id }, data: memberData });
      }

      // ✅ FIXED AND COMPLETE TRAINER LOGIC
      case 'TRAINER': {
        const { plans: trainerPlans, ...trainerData } = data;
        return await prisma.$transaction(async (tx) => {
          const profile = await tx.trainerProfile.upsert({
            where: { userId },
            update: trainerData,
            create: { userId, ...trainerData },
          });

          // Idempotent plan update: delete old plans, create new ones.
          await tx.trainerPlan.deleteMany({ where: { trainerProfileId: profile.id } });
          if (trainerPlans?.length) {
            await tx.trainerPlan.createMany({
              data: trainerPlans.map(p => ({ ...p, trainerProfileId: profile.id })),
            });
          }
          return profile;
        });
      }

      // ✅ FIXED AND COMPLETE GYM_OWNER LOGIC
      case 'GYM_OWNER': {
        const { plans: gymPlans, ...gymData } = data;
        return await prisma.$transaction(async (tx) => {
            const gym = await tx.gym.upsert({
                where: { managerId: userId },
                update: gymData,
                create: { ...gymData, managerId: userId },
            });

            // Idempotent plan update: delete old plans, create new ones.
            await tx.gymPlan.deleteMany({ where: { gymId: gym.id } });
            if (gymPlans?.length) {
                await tx.gymPlan.createMany({
                    data: gymPlans.map(p => ({ ...p, gymId: gym.id })),
                });
            }
            return gym;
        });
      }

      // ✅ FIXED AND COMPLETE MERCHANT LOGIC
      case 'MERCHANT':
        return await prisma.merchantProfile.upsert({
          where: { userId },
          update: data,
          create: { ...data, userId },
        });

      default:
        throw new AppError('Invalid profile type provided.', 400);
    }
  } catch (error) {
    console.error(`[AuthService] ERROR during createProfile:`, error);
    if (error.code === 'P2025') { 
      throw new AppError('The profile for this user does not exist. Please log out and log in again to create one.', 404);
    }
    throw error;
  }
};

// --- Auth0 Specific Services ---
// These functions are correct and remain unchanged.
export const verifyAuth0User = async (auth0Payload) => {
  try {
    const basicUser = await prisma.user.findUnique({ where: { auth0_id: auth0Payload.sub } });
    if (basicUser) {
      return getFullUserById(basicUser.id);
    }
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
// These functions are correct and remain unchanged.
export const getUserByAuth0Id = async (auth0Sub) => {
  const user = await prisma.user.findUnique({ where: { auth0_id: auth0Sub } });
  if (!user) { throw new AppError('User not found in database for the provided Auth0 ID', 404); }
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