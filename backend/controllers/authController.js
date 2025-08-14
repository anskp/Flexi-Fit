// src/controllers/authController.js

import * as authService from '../services/authService.js';

// Helper to catch errors from async functions and pass to global error handler
import catchAsync from '../utils/catchAsync.js';
// --- Core Auth ---
export const signup = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const result = await authService.signup({ email, password });
  res.status(201).json({ success: true, message: 'Signup successful.', data: result });
});

export const login = catchAsync(async (req, res, next) => {
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


// --- Profile & Role Management (Requires JWT) ---
export const selectRole = catchAsync(async (req, res, next) => {
  const { role } = req.body;
  const userId = req.user.id;
  const result = await authService.selectRole({ userId, role });
  res.status(200).json({ success: true, message: 'Role selected successfully.', data: result });
});

export const createMemberProfile = catchAsync(async (req, res, next) => {
  const profile = await authService.createProfile({
    userId: req.user.id,
    profileType: 'MEMBER',
    data: req.body,
  });
  res.status(201).json({ success: true, message: 'Member profile created.', data: profile });
});

export const createTrainerProfile = catchAsync(async (req, res, next) => {
  const profile = await authService.createProfile({
    userId: req.user.id,
    profileType: 'TRAINER',
    data: req.body,
  });
  res.status(201).json({ success: true, message: 'Trainer profile created.', data: profile });
});

export const createGymProfile = catchAsync(async (req, res, next) => {
    const gym = await authService.createProfile({
        userId: req.user.id,
        profileType: 'GYM',
        data: req.body
    });
    res.status(201).json({ success: true, message: 'Gym profile created.', data: gym });
});

export const createMultiGymMemberProfile = catchAsync(async (req, res, next) => {
  const profile = await authService.createProfile({
    userId: req.user.id,
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

