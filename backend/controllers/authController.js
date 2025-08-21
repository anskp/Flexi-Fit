// src/controllers/authController.js

import * as authService from '../services/authService.js';

// Helper to catch errors from async functions and pass to global error handler
import catchAsync from '../utils/catchAsync.js';
// --- Core Auth ---
export const signup = catchAsync(async (req, res, next) => {
  console.log("Route hit, before service");
  const { email, password } = req.body;
  const result = await authService.signup({ email, password });
  res.status(201).json({ success: true, message: 'Signup successful.', data: result });
});

export const login = catchAsync(async (req, res, next) => {
  console.log("Route hit, before service");
  const { email, password } = req.body;
  const result = await authService.login({ email, password });
  res.status(200).json({ success: true, message: 'Login successful.', data: result });
});

export const googleCallback = catchAsync(async (req, res, next) => {
    const redirectUrl = await authService.findOrCreateGoogleUser(req.user);
    res.redirect(redirectUrl);
});

export const logout = (req, res) => {
  // For JWT, logout is a client-side action (deleting the token).
  // This endpoint is for semantics and confirming the action.
  res.status(200).json({ success: true, message: 'Logged out successfully.' });
};


// --- Password Reset ---
export const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const result = await authService.forgotPassword({ email });
  res.status(200).json({ success: true, message: 'Password reset token has been generated.', data: result });
});

export const resetPassword = catchAsync(async (req, res, next) => {
  const { token, newPassword } = req.body;
  const result = await authService.resetPassword({ token, newPassword });
  res.status(200).json({ success: true, data: result });
});


// Helper function to get user ID from either JWT or Auth0
const getUserId = async (req) => {
  // If Auth0 middleware was used
  if (req.auth?.payload) {
    console.log('[AuthController] Using Auth0 user ID from payload');
    // Get our DB user ID from Auth0 sub
    const user = await authService.getUserByAuth0Id(req.auth.payload.sub);
    return user.id;
  }
  // If JWT middleware was used
  console.log('[AuthController] Using JWT user ID');
  return req.user?.id;
};

// --- Profile & Role Management (Requires JWT or Auth0) ---
export const selectRole = catchAsync(async (req, res, next) => {
  const { role } = req.body;
  const userId = await getUserId(req);
  const result = await authService.selectRole({ userId, role });
  res.status(200).json({ success: true, message: 'Role selected successfully.', data: result });
});

export const createMemberProfile = catchAsync(async (req, res, next) => {
  const userId = await getUserId(req);
  const profile = await authService.createProfile({
    userId: userId,
    profileType: 'MEMBER',
    data: req.body,
  });
  res.status(201).json({ success: true, message: 'Member profile created.', data: profile });
});

export const createTrainerProfile = catchAsync(async (req, res, next) => {
  const userId = await getUserId(req);
  const profile = await authService.createProfile({
    userId: userId,
    profileType: 'TRAINER',
    data: req.body,
  });
  res.status(201).json({ success: true, message: 'Trainer profile created.', data: profile });
});

export const createGymProfile = catchAsync(async (req, res, next) => {
    const userId = await getUserId(req);
    const gym = await authService.createProfile({
        userId: userId,
        profileType: 'GYM',
        data: req.body
    });
    res.status(201).json({ success: true, message: 'Gym profile created.', data: gym });
});

export const createMultiGymMemberProfile = catchAsync(async (req, res, next) => {
  const userId = await getUserId(req);
  const profile = await authService.createProfile({
    userId: userId,
    profileType: 'MULTI_GYM',
    data: req.body,
  });
  res.status(201).json({ success: true, message: 'Multi-gym profile created.', data: profile });
});


// --- Admin Registration ---
export const registerAdmin = catchAsync(async (req, res, next) => {
    const { email, password, secretKey } = req.body;
    const newAdmin = await authService.registerAdmin({ email, password, secretKey });
    res.status(201).json({ success: true, message: 'Admin user created successfully.', data: newAdmin });
});

// --- Auth0 Verification ---
export const verifyAuth0User = catchAsync(async (req, res, next) => {
  console.log('[AuthController] Auth0 verification endpoint hit'); // ✅ LOGGING
  console.log('[AuthController] Request headers:', req.headers);
  console.log('[AuthController] Request body:', req.body);
  console.log('[AuthController] Auth object:', req.auth);
  
  // The auth0Auth middleware has already validated the token and populated req.auth
  const auth0Payload = req.auth?.payload;
  
  if (!auth0Payload) {
    console.error('[AuthController] No auth0 payload found in request');
    return res.status(401).json({ 
      success: false, 
      message: 'No Auth0 payload found' 
    });
  }
  
  console.log('[AuthController] Auth0 payload:', auth0Payload);
  
  const user = await authService.verifyAuth0User(auth0Payload);
  
  console.log('[AuthController] User verification result:', user ? 'Success' : 'Failed');
  
  res.status(200).json({ 
    success: true, 
    message: 'Auth0 user verified successfully.', 
    data: user 
  });
});

