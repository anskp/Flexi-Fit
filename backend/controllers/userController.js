// src/controllers/userController.js
import * as userService from '../services/userService.js';

import catchAsync from '../utils/catchAsync.js';

export const changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  await userService.changeUserPassword(req.user.id, currentPassword, newPassword);
  res.status(200).json({ success: true, message: 'Password changed successfully.' });
});

/**
 * A single, intelligent endpoint to update the user's profile.
 * The service layer handles the logic of which profile to update based on the user's role.
 */
export const updateMyProfile = catchAsync(async (req, res) => {
  // Pass the entire user object from the token and the request body to the service
  const updatedProfile = await userService.updateUserProfile(req.user, req.body);
  res.status(200).json({ success: true, message: 'Profile updated successfully.', data: updatedProfile });
});
export const getMyProfile = catchAsync(async (req, res) => {
    // We exclude the password from the response for security
    const { password, ...userProfile } = await userService.getUserProfile(req.user.id);
    res.status(200).json({ success: true, data: userProfile });
});

