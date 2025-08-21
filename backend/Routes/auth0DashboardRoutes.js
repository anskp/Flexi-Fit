// Routes/auth0DashboardRoutes.js
import express from 'express';
import * as dashboardController from '../controllers/dashboardController.js';
import auth0Auth from '../middlewares/auth0Auth.js';

const router = express.Router();

// Auth0 protected dashboard routes
router.get('/', auth0Auth, dashboardController.getMemberDashboard);

export default router;
