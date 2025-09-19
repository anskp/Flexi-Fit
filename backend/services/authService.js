// src/services/authService.js
import { PrismaClient } from '@prisma/client';
import AppError from '../utils/AppError.js';

const prisma = new PrismaClient();

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

export const createProfile = async ({ userId, profileType, data }) => {
  console.log(`[AuthService] Profile creation for User ID: ${userId}, Type: ${profileType}`);
  try {
    switch (profileType) {
      case 'MEMBER':
        return await prisma.memberProfile.upsert({
            where: { userId: userId },
            update: data,
            create: { ...data, userId: userId }
        });
      case 'TRAINER':
        const { plans: trainerPlans, ...trainerData } = data;
        return await prisma.$transaction(async (tx) => {
          const profile = await tx.trainerProfile.create({ data: { userId, ...trainerData } });
          if (trainerPlans?.length) {
            await tx.trainerPlan.createMany({ data: trainerPlans.map(p => ({ ...p, trainerProfileId: profile.id })) });
          }
          return profile;
        });
      case 'GYM_OWNER':
        const { plans: gymPlans, ...gymData } = data;
        return await prisma.$transaction(async (tx) => {
            const gym = await tx.gym.create({ data: { ...gymData, managerId: userId } });
            if (gymPlans?.length) {
                await tx.gymPlan.createMany({ data: gymPlans.map(p => ({ ...p, gymId: gym.id })) });
            }
            return gym;
        });
      case 'MERCHANT':
        console.log('[AuthService] Creating Merchant Profile with userId:', userId, 'and data:', data);
        return await prisma.merchantProfile.create({ data: { ...data, userId } });
      default:
        throw new AppError('Invalid profile type provided.', 400);
    }
  } catch (error) {
    console.error(`[AuthService] ERROR during createProfile for User ID ${userId}:`, error);
    if (error.code === 'P2025') {
        throw new AppError('The profile for this user does not exist to be updated.', 404);
    }
    throw error;
  }
};

// --- Auth0 (Mobile App) Specific Services ---

export const verifyAuth0User = async (auth0Payload) => {
  console.log(`[AuthService] Verifying Auth0 payload for sub: ${auth0Payload.sub}`);
  let user = await prisma.user.findUnique({ where: { auth0_id: auth0Payload.sub } });

  if (user) {
    console.log(`[AuthService] Found existing user ID: ${user.id}`);
    // Fetch associated profile based on user's role
    if (user.role === 'MERCHANT') {
      const merchantProfile = await prisma.merchantProfile.findUnique({ where: { userId: user.id } });
      if (merchantProfile) {
        user.merchantProfile = merchantProfile;
      }
    }
    return user;
  }
  
  const email = auth0Payload.email || `user_${auth0Payload.sub}@auth0-placeholder.com`;
  console.log(`[AuthService] Creating new user for Auth0 sub: ${auth0Payload.sub}`);
  user = await prisma.user.create({
    data: {
      auth0_id: auth0Payload.sub,
      email: email,
      provider: 'auth0',
      // We don't set a role here. Onboarding will handle it.
    },
  });
  console.log(`[AuthService] Created new user with ID: ${user.id}`);
  return user;
};

export const getUserByAuth0Id = async (auth0Sub) => {
  const user = await prisma.user.findUnique({ where: { auth0_id: auth0Sub } });
  if (!user) {
    throw new AppError('User not found in database for the provided Auth0 ID', 404);
  }
  return user;
};
