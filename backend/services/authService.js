// src/services/authService.js

import { PrismaClient } from '@prisma/client';
import chargebeeModule from 'chargebee-typescript';
import AppError from '../utils/AppError.js';
import { slugify } from '../utils/slugify.js';

const prisma = new PrismaClient();

// ✅ Chargebee Initialization
const { ChargeBee } = chargebeeModule;
const chargebee = new ChargeBee();
chargebee.configure({
  site: process.env.CHARGEBEE_SITE,
  api_key: process.env.CHARGEBEE_API_KEY,
});

// --- Chargebee Helpers ---
const findOrCreateChargebeeItem = async (itemId, itemName) => {
  try {
    const result = await chargebee.item
      .create({
        id: itemId,
        name: itemName,
        type: 'plan',
        item_family_id: process.env.CHARGEBEE_ITEM_FAMILY_ID,
      })
      .request();
    console.log(`[Chargebee] Created new item: ${itemId}`);
    return result.item;
  } catch (error) {
    if (error.api_error_code === 'duplicate_entry') {
      console.log(
        `[Chargebee Idempotency] Item ${itemId} already exists. Retrieving it.`
      );
      const result = await chargebee.item.retrieve(itemId).request();
      return result.item;
    }
    throw error;
  }
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Poll Chargebee until the item exists and is active
 */
const waitForChargebeeItem = async (itemId, maxRetries = 10, interval = 1000) => {
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const result = await chargebee.item.retrieve(itemId).request();
      if (result.item && result.item.status === 'active') {
        return result.item;
      }
    } catch (err) {
      if (err.api_error_code !== 'resource_not_found') {
        throw err; // some other error, throw immediately
      }
      // else item not ready yet
    }

    await wait(interval);
    retries++;
  }

  throw new Error(`Chargebee item ${itemId} not found after ${maxRetries} retries`);
};

// --- Unified Role & Profile Management ---

export const selectRole = async ({ userId, role }) => {
  console.log(`[AuthService] User ID ${userId} is selecting role: ${role}`);
  const normalizedRole = role.toUpperCase();
  const validRoles = ['MEMBER', 'GYM_OWNER', 'TRAINER', 'MERCHANT'];
  if (!validRoles.includes(normalizedRole))
    throw new AppError('Invalid role specified.', 400);

  const user = await prisma.user.update({
    where: { id: userId },
    data: { role: normalizedRole },
  });

  let redirectTo = '';
  switch (normalizedRole) {
    case 'MEMBER':
      redirectTo = '/create-member-profile';
      break;
    case 'GYM_OWNER':
      redirectTo = '/create-gym-profile';
      break;
    case 'TRAINER':
      redirectTo = '/create-trainer-profile';
      break;
    case 'MERCHANT':
      redirectTo = '/create-merchant-profile';
      break;
    default:
      redirectTo = '/dashboard';
  }
  console.log(
    `[AuthService] Role for User ID ${userId} updated to ${normalizedRole}. Redirecting to: ${redirectTo}`
  );
  return { role: user.role, redirectTo };
};

export const createProfile = async ({
  userId,
  profileType,
  data,
  authPayload,
}) => {
  try {
    switch (profileType) {
      // --- MEMBER Profile Creation with Email Update ---
      case 'MEMBER': {
        if (!authPayload || !authPayload.sub) {
          throw new AppError(
            'MEMBER profile creation requires a valid Auth0 token payload.',
            401
          );
        }
        const user = await prisma.user.findUnique({
          where: { auth0_id: authPayload.sub },
        });
        if (!user) throw new AppError('Authenticated user not found.', 404);

        const { email, ...profileData } = data;

        const updatedProfile = await prisma.$transaction(async (tx) => {
          // 1. Update user email if provided
          if (email && email.trim() !== '' && email !== user.email) {
            console.log(
              `[AuthService] Updating email for user ${user.id} to ${email}`
            );
            const existingUserWithEmail = await tx.user.findUnique({
              where: { email },
            });
            if (existingUserWithEmail && existingUserWithEmail.id !== user.id) {
              throw new AppError(
                'This email is already in use by another account.',
                409
              );
            }
            await tx.user.update({
              where: { id: user.id },
              data: { email },
            });
          }

          // 2. Member Profile data
          const memberData = {
            name: profileData.name,
            age: profileData.age ? parseInt(profileData.age, 10) : null,
            gender: profileData.gender,
            weight:
              profileData.weight != null
                ? typeof profileData.weight === 'object'
                  ? profileData.weight.value
                  : parseFloat(profileData.weight)
                : null,
            height:
              profileData.height != null
                ? typeof profileData.height === 'object'
                  ? profileData.height.value
                  : parseFloat(profileData.height)
                : null,
            fitnessGoal: profileData.fitnessGoal,
            healthConditions: profileData.healthConditions,
          };

          // 3. Update memberProfile
          const updatedMemberProfile = await tx.memberProfile.update({
            where: { userId: user.id },
            data: memberData,
          });

          return updatedMemberProfile;
        });

        return updatedProfile;
      }

      // --- TRAINER Profile Creation (with Chargebee Item, but no Price) ---
      case 'TRAINER': {
        const { plans: trainerPlansData, ...trainerData } = data;

        return await prisma.$transaction(async (tx) => {
          // 1️⃣ Upsert trainer profile
          const profile = await tx.trainerProfile.upsert({
            where: { userId },
            update: trainerData,
            create: { userId, ...trainerData },
            include: { user: { select: { email: true } } },
          });

          // 2️⃣ Delete existing plans
          await tx.trainerPlan.deleteMany({ where: { trainerProfileId: profile.id } });

          const validPlans = (trainerPlansData || []).filter(
            (p) =>
              p.name &&
              p.name.trim() !== '' &&
              p.duration &&
              p.duration.trim() !== '' &&
              p.price != null &&
              !isNaN(parseFloat(p.price)) &&
              parseFloat(p.price) > 0
          );

          // 3️⃣ Create Chargebee item (but skip price creation)
          for (const planData of validPlans) {
            const chargebeeItemId = `trainer-${profile.id}-${slugify(planData.name)}`;
            const chargebeeItemName = `${profile.user.email} - ${planData.name}`;

            // ✅ Ensure item exists
            await findOrCreateChargebeeItem(chargebeeItemId, chargebeeItemName);

            // ✅ Poll until item is fully available in Chargebee
            await waitForChargebeeItem(chargebeeItemId);

            // 4️⃣ Save trainer plan in DB (without chargebeePlanId, webhook will attach price later)
            await tx.trainerPlan.create({
              data: {
                trainerProfileId: profile.id,
                name: planData.name,
                price: parseFloat(planData.price),
                duration: planData.duration,
              },
            });
          }

          return profile;
        });
      }

      // --- GYM OWNER Profile Creation (with Chargebee Item, but no Price) ---
      case 'GYM_OWNER': {
        const { plans: gymPlansData, ...gymData } = data;

        return await prisma.$transaction(async (tx) => {
          // 1️⃣ Upsert gym
          const gym = await tx.gym.upsert({
            where: { managerId: userId },
            update: gymData,
            create: { ...gymData, managerId: userId },
          });

          // 2️⃣ Delete existing plans
          await tx.gymPlan.deleteMany({ where: { gymId: gym.id } });

          const validPlans = (gymPlansData || []).filter(
            (p) =>
              p.name &&
              p.name.trim() !== '' &&
              p.duration &&
              p.duration.trim() !== '' &&
              p.price != null &&
              !isNaN(parseFloat(p.price)) &&
              parseFloat(p.price) > 0
          );

          // 3️⃣ Create Chargebee item (but skip price creation)
          for (const planData of validPlans) {
            const chargebeeItemId = `gym-${gym.id}-${slugify(planData.name)}`;
            const chargebeeItemName = `${gym.name} - ${planData.name}`;

            await findOrCreateChargebeeItem(chargebeeItemId, chargebeeItemName);

            await waitForChargebeeItem(chargebeeItemId);

            await tx.gymPlan.create({
              data: {
                gymId: gym.id,
                name: planData.name,
                price: parseFloat(planData.price),
                duration: planData.duration,
              },
            });
          }

          return gym;
        });
      }

      // --- MERCHANT Profile Creation ---
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
    if (error.type === 'chargebee') {
      throw new AppError(`A billing service error occurred: ${error.message}`, 500);
    }
    throw error;
  }
};

// --- Auth0 Specific Services ---
export const verifyAuth0User = async (auth0Payload) => {
  try {
    const basicUser = await prisma.user.findUnique({
      where: { auth0_id: auth0Payload.sub },
    });
    if (basicUser) return getFullUserById(basicUser.id);

    const email =
      auth0Payload.email || `user_${auth0Payload.sub}@placeholder.com`;
    const newUser = await prisma.user.create({
      data: { auth0_id: auth0Payload.sub, email, provider: 'auth0' },
    });
    const { password, ...userResponse } = newUser;
    return userResponse;
  } catch (error) {
    console.error(`[AuthService] Error in verifyAuth0User:`, error);
    throw new Error('Failed to verify or create user due to a database error.');
  }
};

export const verifyMember = async (auth0Payload) => {
  try {
    let user = await prisma.user.findUnique({
      where: { auth0_id: auth0Payload.sub },
      include: { memberProfile: true },
    });
    if (user) {
      if (user.role === 'MEMBER' && !user.memberProfile) {
        await prisma.memberProfile.create({ data: { userId: user.id } });
        user = await prisma.user.findUnique({
          where: { id: user.id },
          include: { memberProfile: true },
        });
      }
      const { password, ...userResponse } = user;
      return userResponse;
    }
    const email =
      auth0Payload.email || `user_${auth0Payload.sub}@placeholder.com`;
    const newUser = await prisma.user.create({
      data: {
        auth0_id: auth0Payload.sub,
        email,
        provider: 'auth0',
        role: 'MEMBER',
        memberProfile: { create: {} },
      },
      include: { memberProfile: true },
    });
    const { password, ...userResponse } = newUser;
    return userResponse;
  } catch (error) {
    console.error(`[AuthService] Error in verifyMember:`, error);
    throw error;
  }
};

// --- Helpers ---
export const getUserByAuth0Id = async (auth0Sub) => {
  const user = await prisma.user.findUnique({ where: { auth0_id: auth0Sub } });
  if (!user) throw new AppError('User not found for the provided Auth0 ID', 404);
  return user;
};

export const getFullUserById = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      memberProfile: true,
      managedGyms: true,
      trainerProfile: true,
      merchantProfile: true,
    },
  });
  if (!user) throw new AppError('User not found.', 404);
  const { password, ...userResponse } = user;
  return userResponse;
};
