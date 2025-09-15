// // src/services/authService.js
// import { prisma } from '../lib/prisma.js';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import crypto from 'crypto';
// import AppError from '../utils/AppError.js'; // You must create this utility



// /**
//  * Generates a JWT for a given user.
//  */
// const generateToken = (user) => {
//   const payload = {
//     id: user.id,
//     email: user.email,
//     role: user.role,
//     isAdmin: user.isAdmin, // Include isAdmin for easy checking in middleware
//   };
//   return jwt.sign(payload, process.env.JWT_SECRET, {
//     expiresIn: '7d',
//   });
// };

// /**
//  * Checks if a user needs to complete the onboarding process.
//  */
// const needsOnboarding = async (user) => {
//   if (!user.role) return true;
//   switch (user.role) {
//     case 'MEMBER':
//       return !(await prisma.memberProfile.findUnique({ where: { userId: user.id } }));
//     case 'TRAINER':
//       return !(await prisma.trainerProfile.findUnique({ where: { userId: user.id } }));
//     case 'GYM_OWNER': // Assuming GYM_OWNER is the role for gym managers
//       return !(await prisma.gym.findFirst({ where: { managerId: user.id } }));
//     case 'MULTI_GYM_MEMBER':
//       return !(await prisma.multiGymMemberProfile.findUnique({ where: { userId: user.id } }));
//     default:
//       return false;
//   }
// };

// // --- Core Authentication Services ---

// export const signup = async ({ email, password }) => {
//   console.log(`[AuthService] Signup attempt for email: ${email}`); // ✅ LOGGING
  
//   const existing = await prisma.user.findUnique({ where: { email } });
//   if (existing) {
//     console.log(`[AuthService] Signup failed: Email ${email} already exists.`); // ✅ LOGGING
//     throw new AppError('An account with this email already exists.', 409);
//   }

//   const hashedPassword = await bcrypt.hash(password, 10);
//   const user = await prisma.user.create({
//     data: { email, password: hashedPassword, provider: 'email' },
//   });

//   console.log(`[AuthService] Signup successful: User created with ID ${user.id}`); // ✅ LOGGING

//   const token = generateToken(user);
//   return { token, redirectTo: '/select-role' };
// };

// export const login = async ({ email, password }) => {
//   console.log(`[AuthService] Login attempt for email: ${email}`); // ✅ LOGGING

//   const user = await prisma.user.findUnique({ where: { email } });
//   if (!user || !user.password) {
//     console.log(`[AuthService] Login failed: User not found or is a social login.`); // ✅ LOGGING
//     throw new AppError('Invalid credentials. Please check your email and password.', 401);
//   }

//   const isValid = await bcrypt.compare(password, user.password);
//   if (!isValid) {
//     console.log(`[AuthService] Login failed: Invalid password for user ${user.id}`); // ✅ LOGGING
//     throw new AppError('Invalid credentials. Please check your email and password.', 401);
//   }

//   console.log(`[AuthService] Login successful for user ID: ${user.id}`); // ✅ LOGGING

//   const needsSetup = await needsOnboarding(user);
//   const token = generateToken(user);
  
//   const { password: _, ...userResponse } = user;

//   return { token, user: userResponse, redirectTo: needsSetup ? '/select-role' : '/dashboard' };
// };


// export const findOrCreateGoogleUser = async (profile) => {
//     const userEmail = profile.emails[0].value;
    
//     let user = await prisma.user.findUnique({ where: { email: userEmail } });

//     if (!user) {
//         user = await prisma.user.create({
//             data: {
//                 email: userEmail,
//                 provider: 'google',
//                 providerId: profile.id,
//                 // Google users might be assigned a role on first login or redirected to select one
//             }
//         });
//     }

//     const needsSetup = await needsOnboarding(user);
//     const token = generateToken(user);
//     const nextStep = needsSetup ? 'select-role' : 'dashboard';
    
//     return `yourapp://auth?token=${token}&nextStep=${nextStep}`;
// };

// // --- Password Reset Services ---

// export const forgotPassword = async ({ email }) => {
//     const user = await prisma.user.findUnique({ where: { email } });
//     if (!user) throw new AppError('No user found with that email address.', 404);

//     const resetToken = crypto.randomBytes(32).toString('hex');
//     const resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

//     await prisma.user.update({
//         where: { email },
//         data: { resetToken, resetTokenExpiry },
//     });

//     // In a real app, you would email this token.
//     // For now, we return it for testing.
//     return { resetToken };
// };

// export const resetPassword = async ({ token, newPassword }) => {
//     const user = await prisma.user.findFirst({
//         where: { resetToken: token, resetTokenExpiry: { gt: new Date() } },
//     });

//     if (!user) throw new AppError('Token is invalid or has expired.', 400);

//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     await prisma.user.update({
//         where: { id: user.id },
//         data: { password: hashedPassword, resetToken: null, resetTokenExpiry: null },
//     });

//     return { message: 'Password has been reset successfully.' };
// };

// // --- Profile and Role Management Services ---

// export const selectRole = async ({ userId, role }) => {
//   console.log(`[AuthService] User ID ${userId} is selecting role: ${role}`); // ✅ LOGGING

//   const normalizedRole = role.toUpperCase();
//   const validRoles = ['MEMBER', 'GYM_OWNER', 'TRAINER', 'MULTI_GYM_MEMBER'];
//   if (!validRoles.includes(normalizedRole)) {
//     console.error(`[AuthService] Role selection failed: Invalid role '${role}' provided.`); // ✅ LOGGING
//     throw new AppError('Invalid role specified.', 400);
//   }

//   const user = await prisma.user.update({
//     where: { id: userId },
//     data: { role: normalizedRole },
//   });

//   const token = generateToken(user); // Issue new token with the updated role
//   let redirectTo = '';
//   switch (normalizedRole) {
//     case 'MEMBER': redirectTo = '/create-member-profile'; break;
//     case 'GYM_OWNER': redirectTo = '/create-gym-profile'; break;
//     case 'TRAINER': redirectTo = '/create-trainer-profile'; break;
//     case 'MULTI_GYM_MEMBER': redirectTo = '/create-multi-gym-profile'; break;
//     default: redirectTo = '/dashboard';
//   }

//   console.log(`[AuthService] Role for User ID ${userId} successfully updated to ${normalizedRole}. Redirecting to: ${redirectTo}`); // ✅ LOGGING

//   return { token, role: user.role, redirectTo };
// };


// export const createProfile = async ({ data, authPayload }) => {
//   try {
//     if (!authPayload || !authPayload.sub) {
//       throw new AppError('Invalid Auth0 token payload', 401);
//     }

//     const { sub: userId } = authPayload; // extract user ID from token
//     console.log(`[AuthService] Authenticated User ID: ${userId}`);

//     // Remove token from the profile data
//     const { token, ...profileData } = data;

//     // Decide profile type based on user role or input
//     const profileType = profileData.profileType || 'MEMBER'; // default to MEMBER

//     switch (profileType) {
//       case 'MEMBER': {
//         const memberData = {
//           ...profileData,
//           userId,
//           weight:
//             typeof profileData.weight === 'object'
//               ? profileData.weight.value
//               : profileData.weight,
//           height:
//             typeof profileData.height === 'object'
//               ? profileData.height.value
//               : profileData.height,
//         };

//         const memberProfile = await prisma.memberProfile.create({
//           data: memberData,
//         });
//         console.log(
//           `[AuthService] Successfully created MemberProfile with ID: ${memberProfile.id}`
//         );

//         // Update user role to MEMBER automatically
//         await prisma.user.update({
//           where: { auth0_id: userId },
//           data: { role: 'MEMBER' },
//         });
//         console.log(`[AuthService] Updated User role to MEMBER`);

//         return memberProfile;
//       }

//       case 'TRAINER': {
//         const trainerProfile = await prisma.$transaction(async (tx) => {
//           const profile = await tx.trainerProfile.create({
//             data: {
//               userId,
//               bio: profileData.bio,
//               experience: profileData.experience,
//               gallery: profileData.gallery,
//             },
//           });

//           if (profileData.plans?.length) {
//             await tx.trainerPlan.createMany({
//               data: profileData.plans.map((p) => ({
//                 ...p,
//                 trainerProfileId: profile.id,
//               })),
//             });
//           }
//           return profile;
//         });
//         return trainerProfile;
//       }

//       case 'GYM': {
//         const { plans, ...gymData } = profileData;
//         const gymProfile = await prisma.$transaction(async (tx) => {
//           const gym = await tx.gym.create({
//             data: { ...gymData, managerId: userId },
//           });

//           if (plans?.length) {
//             const plansToCreate = plans.map((p) => ({
//               ...p,
//               gymId: gym.id,
//             }));
//             await tx.gymPlan.createMany({ data: plansToCreate });
//           }
//           return gym;
//         });
//         return gymProfile;
//       }

//       case 'MULTI_GYM': {
//         const multiGymProfile = await prisma.multiGymMemberProfile.create({
//           data: { ...profileData, userId },
//         });
//         return multiGymProfile;
//       }

//       default:
//         throw new AppError('Invalid profile type', 400);
//     }
//   } catch (error) {
//     console.error(`[AuthService] Error creating profile for user:`, error);
//     throw error;
//   }
// };


// // --- Admin Services ---

// export const registerAdmin = async ({ email, password, secretKey }) => {
//     if (!secretKey || secretKey !== process.env.ADMIN_SIGNUP_SECRET_KEY) {
//         throw new AppError('Forbidden: Invalid secret key.', 403);
//     }

//     const existingUser = await prisma.user.findUnique({ where: { email } });
//     if (existingUser) {
//         throw new AppError('An account with this email already exists.', 409);
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const adminUser = await prisma.user.create({
//         data: {
//             email,
//             password: hashedPassword,
//             provider: 'email',
//             isAdmin: true,
//             role: 'ADMIN',
//         },
//     });
    
//     // Do not return a token. Admin should log in separately.
//     const { password: _, ...userResponse } = adminUser;
//     return userResponse;
// };

// // --- Auth0 Services ---

// export const verifyAuth0User = async (auth0Payload) => {
//   console.log(`[AuthService] Auth0 payload received:`, auth0Payload); // ✅ LOGGING
  
//   try {
//     // Search for existing user by auth0_id
//     let user = await prisma.user.findUnique({
//       where: { auth0_id: auth0Payload.sub },
//       include: {
//         memberProfile: true,
//         trainerProfile: true,
//         multiGymProfile: true,
//         managedGyms: true,
//       }
//     });

//     if (user) {
//       console.log(`[AuthService] Found existing user with auth0_id: ${auth0Payload.sub}, User ID: ${user.id}`); // ✅ LOGGING
//       const { password, ...userResponse } = user;
//       return userResponse;
//     }

//     // User doesn't exist, create new user
//     // Extract email from Auth0 payload - it might be in different fields
//     const email = auth0Payload.email || auth0Payload['https://api.fitnessclub.com/email'] || `user_${auth0Payload.sub}@auth0.com`;
    
//     console.log(`[AuthService] Creating new user for auth0_id: ${auth0Payload.sub}, email: ${email}`); // ✅ LOGGING
    
//     user = await prisma.user.create({
//       data: {
//         auth0_id: auth0Payload.sub,
//         email: email,
//         provider: 'auth0',
//         role: 'MEMBER', // Default role for new Auth0 users
//       },
//       include: {
//         memberProfile: true,
//         trainerProfile: true,
//         multiGymProfile: true,
//         managedGyms: true,
//       }
//     });

//     console.log(`[AuthService] Successfully created new user with ID: ${user.id}`); // ✅ LOGGING
    
//     const { password, ...userResponse } = user;
//     return userResponse;
    
//   } catch (error) {
//     console.error(`[AuthService] Error in verifyAuth0User:`, error); // ✅ LOGGING
//     throw error;
//   }
// };

// // Helper function to get user by Auth0 ID
// export const getUserByAuth0Id = async (auth0Sub) => {
//   console.log(`[AuthService] Getting user by Auth0 ID: ${auth0Sub}`); // ✅ LOGGING
  
//   const user = await prisma.user.findUnique({
//     where: { auth0_id: auth0Sub }
//   });
  
//   if (!user) {
//     throw new AppError('User not found', 404);
//   }
  
//   console.log(`[AuthService] Found user with ID: ${user.id}`); // ✅ LOGGING
//   return user;
// };


// src/services/authService.js

// src/services/authService.js
import { prisma } from '../lib/prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import AppError from '../utils/AppError.js';


/**
 * Generates a JWT for a given user.
 */
const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    isAdmin: user.isAdmin,
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
      const profile = await prisma.memberProfile.findUnique({ where: { userId: user.id } });
      // Needs onboarding if profile exists but has no name (is blank)
      return !profile || !profile.name;
    case 'TRAINER':
      return !(await prisma.trainerProfile.findUnique({ where: { userId: user.id } }));
    case 'GYM_OWNER':
      return !(await prisma.gym.findFirst({ where: { managerId: user.id } }));
    case 'MULTI_GYM_MEMBER':
      return !(await prisma.multiGymMemberProfile.findUnique({ where: { userId: user.id } }));
    default:
      return false;
  }
};

// --- Core Authentication Services ---

export const signup = async ({ email, password }) => {
  console.log(`[AuthService] Signup attempt for email: ${email}`);
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`[AuthService] Signup failed: Email ${email} already exists.`);
    throw new AppError('An account with this email already exists.', 409);
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashedPassword, provider: 'email' },
  });
  console.log(`[AuthService] Signup successful: User created with ID ${user.id}`);
  const token = generateToken(user);
  return { token, redirectTo: '/select-role' };
};

export const login = async ({ email, password }) => {
  console.log(`[AuthService] Login attempt for email: ${email}`);
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.password) {
    console.log(`[AuthService] Login failed: User not found or is a social login.`);
    throw new AppError('Invalid credentials. Please check your email and password.', 401);
  }
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    console.log(`[AuthService] Login failed: Invalid password for user ${user.id}`);
    throw new AppError('Invalid credentials. Please check your email and password.', 401);
  }
  console.log(`[AuthService] Login successful for user ID: ${user.id}`);
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
    const resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 60);
    await prisma.user.update({
        where: { email },
        data: { resetToken, resetTokenExpiry },
    });
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
  console.log(`[AuthService] User ID ${userId} is selecting role: ${role}`);
  const normalizedRole = role.toUpperCase();
  const validRoles = ['MEMBER', 'GYM_OWNER', 'TRAINER', 'MULTI_GYM_MEMBER'];
  if (!validRoles.includes(normalizedRole)) {
    console.error(`[AuthService] Role selection failed: Invalid role '${role}' provided.`);
    throw new AppError('Invalid role specified.', 400);
  }
  const user = await prisma.user.update({
    where: { id: userId },
    data: { role: normalizedRole },
  });
  const token = generateToken(user);
  let redirectTo = '';
  switch (normalizedRole) {
    case 'MEMBER': redirectTo = '/create-member-profile'; break;
    case 'GYM_OWNER': redirectTo = '/create-gym-profile'; break;
    case 'TRAINER': redirectTo = '/create-trainer-profile'; break;
    case 'MULTI_GYM_MEMBER': redirectTo = '/create-multi-gym-profile'; break;
    default: redirectTo = '/dashboard';
  }
  console.log(`[AuthService] Role for User ID ${userId} successfully updated to ${normalizedRole}. Redirecting to: ${redirectTo}`);
  return { token, role: user.role, redirectTo };
};


// ✅✅✅ THIS IS THE FINAL, CORRECTED FUNCTION. IT NOW PERFORMS AN UPDATE. ✅✅✅
export const createProfile = async ({ data, authPayload }) => {
  try {
    if (!authPayload || !authPayload.sub) {
      throw new AppError('Invalid Auth0 token payload', 401);
    }
    
    const auth0Id = authPayload.sub;
    console.log(`[AuthService] UPDATE ATTEMPT: Profile update initiated for Auth0 ID: ${auth0Id}`);

    const user = await prisma.user.findUnique({
        where: { auth0_id: auth0Id } 
    });

    if (!user) {
        console.error(`[AuthService] FATAL ERROR: The user with Auth0 ID ${auth0Id} does NOT exist in the User table.`);
        throw new AppError(`Authenticated user could not be found in the system.`, 404);
    }

    const internalUserId = user.id;
    console.log(`[AuthService] SUCCESS: Found matching internal database ID: ${internalUserId}`);

    const { token, ...profileData } = data;
    const profileType = profileData.profileType || 'MEMBER';

    switch (profileType) {
      case 'MEMBER': {
        const memberData = {
            name: profileData.name,
            age: profileData.age,
            gender: profileData.gender,
            weight: typeof profileData.weight === 'object' ? profileData.weight.value : profileData.weight,
            height: typeof profileData.height === 'object' ? profileData.height.value : profileData.height,
            fitnessGoal: profileData.fitnessGoal,
            healthConditions: profileData.healthConditions,
        };

        // This command finds the existing blank profile by its unique link to the user
        // and updates it with the new data from the onboarding questions.
        const memberProfile = await prisma.memberProfile.update({
            where: { userId: internalUserId },
            data: memberData,
        });
        
        console.log(`[AuthService] DATABASE SUCCESS: Updated MemberProfile with ID: ${memberProfile.id}`);

        await prisma.user.update({
          where: { id: internalUserId },
          data: { role: 'MEMBER' },
        });

        return memberProfile;
      }
      default:
        throw new AppError('Invalid profile type', 400);
    }
  } catch (error) {
    console.error(`[AuthService] ERROR DURING UPDATE ATTEMPT:`, error);
    if (error.code === 'P2025') { // Prisma code for "Record to update not found."
        throw new AppError('The profile for this user does not exist. Please log out and log in again to create one.', 404);
    }
    throw error;
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
    const { password: _, ...userResponse } = adminUser;
    return userResponse;
};

// --- Auth0 Services ---

// ✅✅✅ THIS FUNCTION IS NOW MORE ROBUST ✅✅✅
// It guarantees a blank profile exists for every user upon login.
export const verifyAuth0User = async (auth0Payload) => {
  console.log(`[AuthService] Auth0 payload received:`, auth0Payload);
  try {
    let user = await prisma.user.findUnique({
      where: { auth0_id: auth0Payload.sub },
      include: {
        memberProfile: true, // Check if a profile already exists
      }
    });

    if (user) {
      // If the user exists but somehow their profile was deleted, create a new blank one.
      if (!user.memberProfile) {
        console.log(`[AuthService] User ${user.id} exists but is missing a MemberProfile. Creating a blank one now.`);
        await prisma.memberProfile.create({
            data: { userId: user.id } // Create a blank profile linked to the user
        });
      }
      console.log(`[AuthService] Found existing user with auth0_id: ${auth0Payload.sub}, User ID: ${user.id}`);
      const { password, ...userResponse } = user;
      return userResponse;
    }

    // If user does not exist, create the user AND their blank profile in one transaction.
    const email = auth0Payload.email || auth0Payload['https://api.fitnessclub.com/email'] || `user_${auth0Payload.sub}@auth0.com`;
    console.log(`[AuthService] Creating new user for auth0_id: ${auth0Payload.sub}, email: ${email}`);
    
    user = await prisma.user.create({
      data: {
        auth0_id: auth0Payload.sub,
        email: email,
        provider: 'auth0',
        role: 'MEMBER',
        // This creates a blank member profile at the same time the user is created.
        memberProfile: {
            create: {}
        }
      },
      include: {
        memberProfile: true,
      }
    });

    console.log(`[AuthService] Successfully created new user with ID: ${user.id} and blank MemberProfile.`);
    const { password, ...userResponse } = user;
    return userResponse;
    
  } catch (error) {
    console.error(`[AuthService] Error in verifyAuth0User:`, error);
    throw error;
  }
};

// Helper function to get user by Auth0 ID
export const getUserByAuth0Id = async (auth0Sub) => {
  console.log(`[AuthService] Getting user by Auth0 ID: ${auth0Sub}`);
  
  const user = await prisma.user.findUnique({
    where: { auth0_id: auth0Sub }
  });
  
  if (!user) {
    throw new AppError('User not found', 404);
  }
  
  console.log(`[AuthService] Found user with ID: ${user.id}`);
  return user;
};