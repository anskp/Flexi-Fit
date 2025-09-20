// src/controllers/notificationController.js
import * as notificationService from '../services/notificationService.js';
import catchAsync from '../utils/catchAsync.js';

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
    const userId = req.user.id;
    const notifications = await notificationService.getUserNotifications(userId);
    res.status(200).json({ success: true, data: notifications });
});

export const updateNotificationSettings = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const settings = await notificationService.updateNotificationSettings(userId, req.body);
    res.status(200).json({ success: true, message: 'Notification settings updated.', data: settings });
});

export const markAsRead = catchAsync(async (req, res) => {
    const userId = req.user.id;
    await notificationService.markNotificationAsRead(userId, req.params.id);
    res.status(200).json({ success: true, message: 'Notification marked as read.' });
});

export const deleteNotification = catchAsync(async (req, res) => {
    const userId = req.user.id;
    await notificationService.deleteNotification(userId, req.params.id);
    res.status(200).json({ success: true, message: 'Notification deleted.' });
});