// Routes/auth0NotificationRoutes.js
import express from 'express';
import * as notificationController from '../controllers/notificationController.js';
import auth0Auth from '../middlewares/auth0Auth.js';

const router = express.Router();

// Auth0 protected notification routes
router.get('/', auth0Auth, notificationController.getUserNotifications);
router.put('/settings', auth0Auth, notificationController.updateNotificationSettings);
router.put('/:id/read', auth0Auth, notificationController.markAsRead);
router.delete('/:id', auth0Auth, notificationController.deleteNotification);

export default router;
