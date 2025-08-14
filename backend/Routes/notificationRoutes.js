// Routes/notificationRoutes.js
import express from 'express';
import * as notificationController from '../controllers/notificationController.js';
import jwtAuth from '../middlewares/jwtAuth.js';
import roleAuth from '../middlewares/roleAuth.js';
import validate, { registerTokenSchema, sendGymNotificationSchema } from '../validators/notificationValidator.js';

const router = express.Router();
router.use(jwtAuth);

// --- Member Routes ---
router.get('/me', notificationController.getMyNotifications);
router.post('/register-fcm', validate(registerTokenSchema), notificationController.registerFcmToken);

// --- Gym Owner Routes ---
router.post(
    '/gym/:gymId',
    roleAuth('GYM_OWNER'),
    validate(sendGymNotificationSchema),
    notificationController.sendNotificationToGymMembers
);

export default router;

