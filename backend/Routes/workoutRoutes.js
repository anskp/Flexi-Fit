// src/routes/workoutRoutes.js
import express from 'express';
import auth0WorkoutRoutes from './auth0WorkoutRoutes.js';

const router = express.Router();

// All routes starting with /api/workouts/auth0 will be handled by this router.
// This is the single, clear entry point for all Auth0-protected endpoints.
router.use('/auth0', auth0WorkoutRoutes);

// You could add other, non-Auth0 routes here if needed in the future.
// For example: router.get('/public-info', someController);

export default router;