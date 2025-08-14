// Routes/dashboardRoutes.js
import express from 'express';
import jwtAuth from '../middlewares/jwtAuth.js';

// Import all necessary dashboard controllers
import * as memberDashboardController from '../controllers/dashboardController.js';
import * as adminDashboardController from '../controllers/adminController.js';
import * as gymDashboardController from '../controllers/gymController.js';
import * as trainerDashboardController from '../controllers/trainerController.js';

const router = express.Router();

// Apply JWT authentication to the main dashboard route
router.use(jwtAuth);

/**
 * @route   GET /api/dashboard
 * @desc    Get the dashboard data for the logged-in user based on their role.
 * @access  Private (All roles)
 */
router.get('/', (req, res, next) => {
    // The jwtAuth middleware provides the user's role and admin status
    const { role, isAdmin } = req.user;

    // Direct the request to the appropriate controller. Admin check is first.
    if (isAdmin) {
        return adminDashboardController.getAdminDashboard(req, res, next);
    }

    // Check for other specific roles
    switch (role) {
        case 'MEMBER':
            return memberDashboardController.getMemberDashboard(req, res, next);
        case 'GYM_OWNER':
            return gymDashboardController.getOwnerDashboard(req, res, next);
        case 'TRAINER':
            return trainerDashboardController.getTrainerDashboard(req, res, next);
        default:
            // Fallback for any other roles (e.g., 'MULTI_GYM_MEMBER') or users without a role
            res.status(404).json({ success: false, message: 'No dashboard available for this user role.' });
    }
});

export default router;

