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

export const createProfile = async ({ userId, profileType, data, authPayload }) => {
  console.log(`[AuthService] createProfile called. Provided userId: ${userId}, profileType: ${profileType}`);
  
  try {
    switch (profileType) {
      case 'MEMBER': {
        // ✅✅✅ THIS IS THE FINAL, CORRECT, INTEGRATED LOGIC ✅✅✅
        if (!authPayload || !authPayload.sub) {
          throw new AppError('MEMBER profile creation requires a valid Auth0 token payload.', 401);
        }

        const auth0Id = authPayload.sub;
        console.log(`[AuthService] MEMBER FLOW: Initiated for Auth0 ID: ${auth0Id}`);

        const user = await prisma.user.findUnique({
          where: { auth0_id: auth0Id },
        });

        if (!user) {
          throw new AppError(`Authenticated user with Auth0 ID ${auth0Id} could not be found in the system.`, 404);
        }

        const internalUserId = user.id;
        console.log(`[AuthService] MEMBER FLOW: Found matching internal DB ID: ${internalUserId}`);

        // This handles the { value, unit } objects from the mobile client
        const memberData = {
          name: data.name,
          age: data.age,
          gender: data.gender,
          weight: typeof data.weight === 'object' ? data.weight.value : data.weight,
          height: typeof data.height === 'object' ? data.height.value : data.height,
          fitnessGoal: data.fitnessGoal,
          healthConditions: data.healthConditions,
        };

        // Use .update() because the verify-member flow already created a blank profile
        const memberProfile = await prisma.memberProfile.update({
          where: { userId: internalUserId },
          data: memberData,
        });
        
        console.log(`[AuthService] MEMBER FLOW: Successfully updated MemberProfile with ID: ${memberProfile.id}`);
        return memberProfile;
      }

      // --- WEB CLIENT FLOWS (UNCHANGED AND WORKING) ---
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
        return await prisma.merchantProfile.create({ data: { ...data, userId } });

      default:
        throw new AppError('Invalid profile type provided.', 400);
    }
  } catch (error) {
    console.error(`[AuthService] ERROR during createProfile:`, error);
    if (error.code === 'P2025') { // Prisma code for "Record to update not found."
      throw new AppError('The profile for this user does not exist. Please log out and log in again to create one.', 404);
    }
    throw error;
  }
};

// --- Auth0 Specific Services ---

// FOR WEB: Creates a generic, role-less user.
export const verifyAuth0User = async (auth0Payload) => {
  console.log(`[AuthService] Verifying Auth0 payload for sub: ${auth0Payload.sub}`);
  try {
    let user = await prisma.user.findUnique({
      where: { auth0_id: auth0Payload.sub },
    });

    if (user) {
      console.log(`[AuthService] Found existing user with ID: ${user.id}`);
      const { password, ...userResponse } = user;
      return userResponse;
    }

    console.log(`[AuthService] Creating new, role-less user for auth0_id: ${auth0Payload.sub}`);
    const email = auth0Payload.email || auth0Payload['https://api.fitnessclub.com/email'] || `user_${auth0Payload.sub}@placeholder.com`;

    const newUser = await prisma.user.create({
      data: {
        auth0_id: auth0Payload.sub,
        email: email,
        provider: 'auth0',
      },
    });

    console.log(`[AuthService] Successfully created new user with ID: ${newUser.id}. Role is not set.`);
    const { password, ...userResponse } = newUser;
    return userResponse;

  } catch (error) {
    console.error(`[AuthService] Error in verifyAuth0User:`, error);
    throw new Error('Failed to verify or create user due to a database error.');
  }
};

// FOR MOBILE: Creates a user as a MEMBER and includes a blank profile.
export const verifyMember = async (auth0Payload) => {
  console.log(`[AuthService] verifyMember called for Auth0 sub: ${auth0Payload.sub}`);
  try {
    let user = await prisma.user.findUnique({
      where: { auth0_id: auth0Payload.sub },
      include: { memberProfile: true }
    });

    if (user) {
      if (user.role === 'MEMBER' && !user.memberProfile) {
        console.log(`[AuthService] Existing member ${user.id} is missing a profile. Creating one now.`);
        await prisma.memberProfile.create({ data: { userId: user.id } });
        user = await prisma.user.findUnique({ where: { id: user.id }, include: { memberProfile: true }});
      }
      console.log(`[AuthService] Found existing user ID: ${user.id}`);
      const { password, ...userResponse } = user;
      return userResponse;
    }

    console.log(`[AuthService] Creating new MEMBER user for Auth0 sub: ${auth0Payload.sub}`);
    const email = auth0Payload.email || auth0Payload['https://api.fitnessclub.com/email'] || `user_${auth0Payload.sub}@placeholder.com`;

    const newUser = await prisma.user.create({
      data: {
        auth0_id: auth0Payload.sub,
        email: email,
        provider: 'auth0',
        role: 'MEMBER',
        memberProfile: {
          create: {}
        }
      },
      include: {
        memberProfile: true,
      }
    });

    console.log(`[AuthService] Successfully created new MEMBER user with ID: ${newUser.id}`);
    const { password, ...userResponse } = newUser;
    return userResponse;
    
  } catch (error) {
    console.error(`[AuthService] Error in verifyMember:`, error);
    throw error;
  }
};

// HELPER: Used by web flow controllers.
export const getUserByAuth0Id = async (auth0Sub) => {
  const user = await prisma.user.findUnique({ where: { auth0_id: auth0Sub } });
  if (!user) {
    throw new AppError('User not found in database for the provided Auth0 ID', 404);
  }
  return user;
};