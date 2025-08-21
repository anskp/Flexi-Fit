// src/services/authService.js
import { prisma } from '../lib/prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import AppError from '../utils/AppError.js'; // You must create this utility



/**
 * Generates a JWT for a given user.
 */
const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    isAdmin: user.isAdmin, // Include isAdmin for easy checking in middleware
  };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

/**
 * Checks if a user needs to complete the onboarding process.
 */
const needsOnboarding = async (user) => {
  if (!user.role) return true;
  switch (user.role) {
    case 'MEMBER':
      return !(await prisma.memberProfile.findUnique({ where: { userId: user.id } }));
    case 'TRAINER':
      return !(await prisma.trainerProfile.findUnique({ where: { userId: user.id } }));
    case 'GYM_OWNER': // Assuming GYM_OWNER is the role for gym managers
      return !(await prisma.gym.findFirst({ where: { managerId: user.id } }));
    case 'MULTI_GYM_MEMBER':
      return !(await prisma.multiGymMemberProfile.findUnique({ where: { userId: user.id } }));
    default:
      return false;
  }
};

// --- Core Authentication Services ---

export const signup = async ({ email, password }) => {
  console.log(`[AuthService] Signup attempt for email: ${email}`); // ✅ LOGGING
  
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`[AuthService] Signup failed: Email ${email} already exists.`); // ✅ LOGGING
    throw new AppError('An account with this email already exists.', 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashedPassword, provider: 'email' },
  });

  console.log(`[AuthService] Signup successful: User created with ID ${user.id}`); // ✅ LOGGING

  const token = generateToken(user);
  return { token, redirectTo: '/select-role' };
};

export const login = async ({ email, password }) => {
  console.log(`[AuthService] Login attempt for email: ${email}`); // ✅ LOGGING

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.password) {
    console.log(`[AuthService] Login failed: User not found or is a social login.`); // ✅ LOGGING
    throw new AppError('Invalid credentials. Please check your email and password.', 401);
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    console.log(`[AuthService] Login failed: Invalid password for user ${user.id}`); // ✅ LOGGING
    throw new AppError('Invalid credentials. Please check your email and password.', 401);
  }

  console.log(`[AuthService] Login successful for user ID: ${user.id}`); // ✅ LOGGING

  const needsSetup = await needsOnboarding(user);
  const token = generateToken(user);
  
  const { password: _, ...userResponse } = user;

  return { token, user: userResponse, redirectTo: needsSetup ? '/select-role' : '/dashboard' };
};


export const findOrCreateGoogleUser = async (profile) => {
    const userEmail = profile.emails[0].value;
    
    let user = await prisma.user.findUnique({ where: { email: userEmail } });

    if (!user) {
        user = await prisma.user.create({
            data: {
                email: userEmail,
                provider: 'google',
                providerId: profile.id,
                // Google users might be assigned a role on first login or redirected to select one
            }
        });
    }

    const needsSetup = await needsOnboarding(user);
    const token = generateToken(user);
    const nextStep = needsSetup ? 'select-role' : 'dashboard';
    
    return `yourapp://auth?token=${token}&nextStep=${nextStep}`;
};

// --- Password Reset Services ---

export const forgotPassword = async ({ email }) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new AppError('No user found with that email address.', 404);

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await prisma.user.update({
        where: { email },
        data: { resetToken, resetTokenExpiry },
    });

    // In a real app, you would email this token.
    // For now, we return it for testing.
    return { resetToken };
};

export const resetPassword = async ({ token, newPassword }) => {
    const user = await prisma.user.findFirst({
        where: { resetToken: token, resetTokenExpiry: { gt: new Date() } },
    });

    if (!user) throw new AppError('Token is invalid or has expired.', 400);

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword, resetToken: null, resetTokenExpiry: null },
    });

    return { message: 'Password has been reset successfully.' };
};

// --- Profile and Role Management Services ---

export const selectRole = async ({ userId, role }) => {
  console.log(`[AuthService] User ID ${userId} is selecting role: ${role}`); // ✅ LOGGING

  const normalizedRole = role.toUpperCase();
  const validRoles = ['MEMBER', 'GYM_OWNER', 'TRAINER', 'MULTI_GYM_MEMBER'];
  if (!validRoles.includes(normalizedRole)) {
    console.error(`[AuthService] Role selection failed: Invalid role '${role}' provided.`); // ✅ LOGGING
    throw new AppError('Invalid role specified.', 400);
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { role: normalizedRole },
  });

  const token = generateToken(user); // Issue new token with the updated role
  let redirectTo = '';
  switch (normalizedRole) {
    case 'MEMBER': redirectTo = '/create-member-profile'; break;
    case 'GYM_OWNER': redirectTo = '/create-gym-profile'; break;
    case 'TRAINER': redirectTo = '/create-trainer-profile'; break;
    case 'MULTI_GYM_MEMBER': redirectTo = '/create-multi-gym-profile'; break;
    default: redirectTo = '/dashboard';
  }

  console.log(`[AuthService] Role for User ID ${userId} successfully updated to ${normalizedRole}. Redirecting to: ${redirectTo}`); // ✅ LOGGING

  return { token, role: user.role, redirectTo };
};


export const createProfile = async ({ userId, profileType, data }) => {
  console.log(`[AuthService] Attempting to create profile of type '${profileType}' for User ID: ${userId}`); // ✅ LOGGING
  console.log(`[AuthService] Received Profile Data:`, data); // ✅ LOGGING

  try {
    switch (profileType) {
      case 'MEMBER':
        const memberProfile = await prisma.memberProfile.create({ data: { ...data, userId } });
        console.log(`[AuthService] Successfully created MemberProfile with ID: ${memberProfile.id}`); // ✅ LOGGING
        return memberProfile;

      case 'TRAINER':
        const trainerProfile = await prisma.$transaction(async (tx) => {
          const profile = await tx.trainerProfile.create({
            data: { userId, bio: data.bio, experience: data.experience, gallery: data.gallery },
          });
          console.log(`[AuthService] Created TrainerProfile with ID: ${profile.id} inside transaction.`); // ✅ LOGGING
          if (data.plans && data.plans.length > 0) {
            await tx.trainerPlan.createMany({
              data: data.plans.map(p => ({ ...p, trainerProfileId: profile.id })),
            });
            console.log(`[AuthService] Created ${data.plans.length} trainer plans for TrainerProfile ID: ${profile.id}`); // ✅ LOGGING
          }
          return profile;
        });
        console.log(`[AuthService] Transaction for TrainerProfile creation completed successfully.`); // ✅ LOGGING
        return trainerProfile;

       case 'GYM':
        // 1. Separate the gym data from the plans data
        const { plans, ...gymData } = data;

        const gymProfile = await prisma.$transaction(async (tx) => {
            // 2. Create the Gym using only the gym-specific data
            const gym = await tx.gym.create({
                data: {
                    ...gymData, // name, address, latitude, etc.
                    managerId: userId
                }
            });
            console.log(`[AuthService] Created Gym with ID: ${gym.id} inside transaction.`);

            // 3. If plans exist, create them and connect them to the new gym
            if (plans && plans.length > 0) {
                // Prepare the plan data by adding the gymId to each plan
                const plansToCreate = plans.map(p => ({
                    ...p,
                    gymId: gym.id
                }));
                await tx.gymPlan.createMany({
                    data: plansToCreate
                });
                console.log(`[AuthService] Created ${plans.length} gym plans for Gym ID: ${gym.id}`);
            }
            return gym;
        });
        console.log(`[AuthService] Transaction for Gym creation completed successfully.`);
        return gymProfile;


      case 'MULTI_GYM':
        const multiGymProfile = await prisma.multiGymMemberProfile.create({ data: { ...data, userId } });
        console.log(`[AuthService] Successfully created MultiGymMemberProfile with ID: ${multiGymProfile.id}`); // ✅ LOGGING
        return multiGymProfile;

      default:
        throw new AppError('Invalid profile type.', 400);
    }
  } catch (error) {
    console.error(`[AuthService] Error creating profile for User ID ${userId}:`, error); // ✅ LOGGING
    throw error; // Re-throw the original error to be handled by the global error handler
  }
};

// --- Admin Services ---

export const registerAdmin = async ({ email, password, secretKey }) => {
    if (!secretKey || secretKey !== process.env.ADMIN_SIGNUP_SECRET_KEY) {
        throw new AppError('Forbidden: Invalid secret key.', 403);
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new AppError('An account with this email already exists.', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const adminUser = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            provider: 'email',
            isAdmin: true,
            role: 'ADMIN',
        },
    });
    
    // Do not return a token. Admin should log in separately.
    const { password: _, ...userResponse } = adminUser;
    return userResponse;
};

// --- Auth0 Services ---

export const verifyAuth0User = async (auth0Payload) => {
  console.log(`[AuthService] Auth0 verification attempt for user: ${auth0Payload.sub}`); // ✅ LOGGING
  console.log(`[AuthService] Auth0 payload received:`, auth0Payload); // ✅ LOGGING
  
  try {
    // Search for existing user by auth0_id
    let user = await prisma.user.findUnique({
      where: { auth0_id: auth0Payload.sub },
      include: {
        memberProfile: true,
        trainerProfile: true,
        multiGymProfile: true,
        managedGyms: true,
      }
    });

    if (user) {
      console.log(`[AuthService] Found existing user with auth0_id: ${auth0Payload.sub}, User ID: ${user.id}`); // ✅ LOGGING
      const { password, ...userResponse } = user;
      return userResponse;
    }

    // User doesn't exist, create new user
    // Extract email from Auth0 payload - it might be in different fields
    const email = auth0Payload.email || auth0Payload['https://api.fitnessclub.com/email'] || `user_${auth0Payload.sub}@auth0.com`;
    
    console.log(`[AuthService] Creating new user for auth0_id: ${auth0Payload.sub}, email: ${email}`); // ✅ LOGGING
    
    user = await prisma.user.create({
      data: {
        auth0_id: auth0Payload.sub,
        email: email,
        provider: 'auth0',
        role: 'MEMBER', // Default role for new Auth0 users
      },
      include: {
        memberProfile: true,
        trainerProfile: true,
        multiGymProfile: true,
        managedGyms: true,
      }
    });

    console.log(`[AuthService] Successfully created new user with ID: ${user.id}`); // ✅ LOGGING
    
    const { password, ...userResponse } = user;
    return userResponse;
    
  } catch (error) {
    console.error(`[AuthService] Error in verifyAuth0User:`, error); // ✅ LOGGING
    throw error;
  }
};

// Helper function to get user by Auth0 ID
export const getUserByAuth0Id = async (auth0Sub) => {
  console.log(`[AuthService] Getting user by Auth0 ID: ${auth0Sub}`); // ✅ LOGGING
  
  const user = await prisma.user.findUnique({
    where: { auth0_id: auth0Sub }
  });
  
  if (!user) {
    throw new AppError('User not found', 404);
  }
  
  console.log(`[AuthService] Found user with ID: ${user.id}`); // ✅ LOGGING
  return user;
};

