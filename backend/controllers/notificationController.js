// src/controllers/notificationController.js
import * as notificationService from '../services/notificationService.js';
import * as authService from '../services/authService.js';
import catchAsync from '../utils/catchAsync.js';

// Helper function to get user ID from either JWT or Auth0
const getUserId = async (req) => {
  // If Auth0 middleware was used
  if (req.auth?.payload) {
    console.log('[NotificationController] Using Auth0 user ID from payload');
    // Get our DB user ID from Auth0 sub
    const user = await authService.getUserByAuth0Id(req.auth.payload.sub);
    return user.id;
  }
  // If JWT middleware was used
  console.log('[NotificationController] Using JWT user ID');
  return req.user?.id;
};

export const registerFcmToken = catchAsync(async (req, res) => {
    await notificationService.saveUserFcmToken(req.user.id, req.body.token);
    res.status(200).json({ success: true, message: 'Token registered.' });
});

export const getMyNotifications = catchAsync(async (req, res) => {
    const notifications = await notificationService.getUserNotifications(req.user.id);
    res.status(200).json({ success: true, data: notifications });
});

export const sendNotificationToGymMembers = catchAsync(async (req, res) => {
    const memberCount = await notificationService.sendNotificationToGymMembers(req.user.id, req.params.gymId, req.body);
    res.status(200).json({ success: true, message: `Notification sent to ${memberCount} members.` });
});

// Auth0-specific notification endpoints
export const getUserNotifications = catchAsync(async (req, res) => {
    const userId = await getUserId(req);
    const notifications = await notificationService.getUserNotifications(userId);
    res.status(200).json({ success: true, data: notifications });
});

export const updateNotificationSettings = catchAsync(async (req, res) => {
    const userId = await getUserId(req);
    const settings = await notificationService.updateNotificationSettings(userId, req.body);
    res.status(200).json({ success: true, message: 'Notification settings updated.', data: settings });
});

export const markAsRead = catchAsync(async (req, res) => {
    const userId = await getUserId(req);
    await notificationService.markNotificationAsRead(userId, req.params.id);
    res.status(200).json({ success: true, message: 'Notification marked as read.' });
});

export const deleteNotification = catchAsync(async (req, res) => {
    const userId = await getUserId(req);
    await notificationService.deleteNotification(userId, req.params.id);
    res.status(200).json({ success: true, message: 'Notification deleted.' });
});

