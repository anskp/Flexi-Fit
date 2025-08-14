// src/services/notificationService.js
import admin from 'firebase-admin';
import { PrismaClient } from '@prisma/client';
import AppError from '../utils/AppError.js';
// We no longer need fs, path, or url modules for this

const prisma = new PrismaClient();

// --- ✅ SIMPLIFIED: Initialize Firebase Admin using the environment variable ---
// The Firebase Admin SDK automatically looks for the GOOGLE_APPLICATION_CREDENTIALS
// environment variable if you initialize it without an explicit path.

if (!admin.apps.length) {
  admin.initializeApp();
}


// --- (The rest of the file is unchanged and correct) ---

export const saveUserFcmToken = async (userId, token) => {
    await prisma.fcmToken.upsert({
        where: { token },
        update: { userId },
        create: { userId, token },
    });
};

export const getUserNotifications = async (userId) => {
    return await prisma.notification.findMany({
        where: { recipientId: userId },
        orderBy: { createdAt: 'desc' }
    });
};

export const sendPushNotification = async (userIds, notification, data = {}) => {
  try {
    const userTokens = await prisma.fcmToken.findMany({
      where: { userId: { in: userIds } },
      select: { token: true },
    });
    if (userTokens.length === 0) {
      console.log(`No FCM tokens found for user(s). Cannot send notification.`);
      return;
    }
    const tokens = userTokens.map(t => t.token);
    const message = { notification, data, tokens };
    const response = await admin.messaging().sendMulticast(message);
    console.log(`Push notifications sent: ${response.successCount} success, ${response.failureCount} failure.`);
    if (response.failureCount > 0) {
        const tokensToDelete = response.responses
            .map((resp, idx) => !resp.success ? tokens[idx] : null)
            .filter(token => token !== null);
        if (tokensToDelete.length > 0) {
            await prisma.fcmToken.deleteMany({ where: { token: { in: tokensToDelete } } });
            console.log(`Cleaned up ${tokensToDelete.length} invalid FCM tokens.`);
        }
    }
  } catch (error) {
    console.error(`Failed to send push notification:`, error);
  }
};

export const sendNotificationToGymMembers = async (ownerId, gymId, { title, message }) => {
    const gym = await prisma.gym.findUnique({ where: { id: gymId } });
    if (!gym || gym.managerId !== ownerId) throw new AppError('Gym not found or you do not own it.', 403);
    const activeSubs = await prisma.subscription.findMany({
        where: { status: 'active', gymPlan: { gymId } },
        select: { userId: true },
    });
    if (activeSubs.length === 0) throw new AppError('This gym has no active members.', 404);
    const memberIds = activeSubs.map(sub => sub.userId);
    await prisma.notification.createMany({
      data: memberIds.map(id => ({ recipientId: id, gymId, title, message }))
    });
    await sendPushNotification(memberIds, { title, body: message }, { gymId });
    return memberIds.length;
};

