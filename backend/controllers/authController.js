// src/controllers/authController.js
import * as authService from '../services/authService.js';
import jwt from 'jsonwebtoken';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

// --- Token Generation ---
const generateInternalToken = (user) => {
  const payload = { id: user.id, email: user.email, role: user.role };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// --- Auth0 Verification & Token Exchange ---
export const verifyUser = catchAsync(async (req, res, next) => {
  console.log('[AuthController] verifyUser called. Auth0 payload:', req.auth?.payload);
  
  const auth0Payload = req.auth?.payload;
  if (!auth0Payload) {
    console.error('[AuthController] Auth0 token is missing or invalid. Auth object:', req.auth);
    throw new AppError('Auth0 token is missing or invalid. Please check the Authorization header.', 401);
  }

  console.log('[AuthController] Auth0 payload received:', {
    sub: auth0Payload.sub,
    email: auth0Payload.email,
    iss: auth0Payload.iss
  });

  // Find or create a user in our database based on the Auth0 ID
  const user = await authService.verifyAuth0User(auth0Payload);

  // Generate our own internal JWT
  const internalToken = generateInternalToken(user);

  console.log('[AuthController] User verification successful. Generated token for user:', user.id);

  // Return our token and the user's profile from our database
  res.status(200).json({
    success: true,
    message: 'User verified successfully.',
    data: {
      token: internalToken,
      user: user,
    },
  });
});

// --- Profile & Role Management (Protected by internal JWT) ---
export const selectRole = catchAsync(async (req, res, next) => {
  const { role } = req.body;
  const userId = req.user.id; // Provided by jwtAuth middleware
  
  const result = await authService.selectRole({ userId, role });

  // Re-issue a token with the new role included
  const updatedUser = { ...req.user, role: result.role };
  const newToken = generateInternalToken(updatedUser);

  res.status(200).json({
    success: true,
    message: 'Role selected successfully.',
    data: {
      token: newToken,
      redirectTo: result.redirectTo,
    },
  });
});

export const createMemberProfile = catchAsync(async (req, res, next) => {
  const userId = req.user.id; // Provided by jwtAuth middleware
  const profile = await authService.createProfile({
    userId,
    profileType: 'MEMBER',
    data: req.body,
  });
  res.status(201).json({ success: true, message: 'Member profile created successfully.', data: profile });
});

export const createTrainerProfile = catchAsync(async (req, res, next) => {
  const userId = req.user.id; // Provided by jwtAuth middleware
  const profile = await authService.createProfile({
    userId,
    profileType: 'TRAINER',
    data: req.body,
  });
  res.status(201).json({ success: true, message: 'Trainer profile created successfully.', data: profile });
});

export const createGymProfile = catchAsync(async (req, res, next) => {
  const userId = req.user.id; // Provided by jwtAuth middleware
  // Allow frontend to send either flat fields or wrapped in { data: { ... } }
  const profileData = req.body.data || req.body;
  const gym = await authService.createProfile({
    userId,
    profileType: 'GYM_OWNER',
    data: profileData,
  });
  res.status(201).json({ success: true, message: 'Gym profile created successfully.', data: gym });
});

export const createMerchantProfile = catchAsync(async (req, res, next) => {
  const { user } = req;
  const profileData = req.body;
  const newProfile = await authService.createProfile({ userId: user.id, profileType: 'MERCHANT', data: profileData });
  
  // Re-issue a token with the updated user role and include the new profile
  const updatedUser = { ...user, role: 'MERCHANT', merchantProfile: newProfile };
  const newToken = generateInternalToken(updatedUser);

  res.status(201).json({
    status: 'success',
    message: 'Merchant profile created successfully',
    data: {
      token: newToken,
      user: updatedUser,
      profile: newProfile,
    },
  });
});