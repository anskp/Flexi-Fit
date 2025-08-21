// Routes/auth0UserRoutes.js
import express from 'express';
import * as userController from '../controllers/userController.js';
import auth0Auth from '../middlewares/auth0Auth.js';

const router = express.Router();

// Auth0 protected user routes
router.get('/profile', auth0Auth, userController.getUserProfile);
router.get('/stats', auth0Auth, userController.getUserStats);
router.put('/profile', auth0Auth, userController.updateUserProfile);

export default router;
