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

