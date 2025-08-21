// Routes/workoutRoutes.js
import express from 'express';
import * as workoutController from '../controllers/workoutController.js';
import jwtAuth from '../middlewares/jwtAuth.js';
import auth0WorkoutRoutes from './auth0WorkoutRoutes.js';
import validate, {
    logSessionSchema,
    getHistorySchema,
    sessionIdParamSchema,
} from '../validators/workoutValidator.js';

const router = express.Router();

// Add Auth0 workout routes
router.use('/auth0', auth0WorkoutRoutes);

// Apply JWT authentication to all workout-related routes
router.use(jwtAuth);

/**
 * @route   GET /api/workouts/library
 * @desc    Fetch all available exercises from the library
 * @access  Private
 */
router.get('/library', workoutController.getExerciseLibrary);

/**
 * @route   POST /api/workouts/sessions
 * @desc    Log a new complete workout session
 * @access  Private
 */
router.post('/sessions', validate(logSessionSchema), workoutController.logWorkoutSession);

/**
 * @route   GET /api/workouts/sessions
 * @desc    Get the user's paginated workout history
 * @access  Private
 */
router.get('/sessions', validate(getHistorySchema), workoutController.getWorkoutHistory);

/**
 * @route   GET /api/workouts/sessions/:sessionId
 * @desc    Get details of a single workout session
 * @access  Private
 */
router.get('/sessions/:sessionId', validate(sessionIdParamSchema), workoutController.getWorkoutSessionById);

/**
 * @route   DELETE /api/workouts/sessions/:sessionId
 * @desc    Delete a specific workout session
 * @access  Private
 */
router.delete('/sessions/:sessionId', validate(sessionIdParamSchema), workoutController.deleteWorkoutSession);

export default router;

