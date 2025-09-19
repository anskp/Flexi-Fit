// src/routes/auth0WorkoutRoutes.js
import express from 'express';
import * as workoutController from '../controllers/workoutController.js';
import auth0Auth from '../middlewares/auth0Auth.js';
import validate, {
    logSessionSchema,
    getHistorySchema,
    sessionIdParamSchema
} from '../validators/workoutValidator.js';

const router = express.Router();

// Apply Auth0 authentication to ALL routes defined in this file.
router.use(auth0Auth);

/**
 * @route   GET /api/workouts/auth0/library
 * @desc    Fetch all available exercises from the library
 * @access  Private (Auth0 Authenticated)
 */
router.get('/library', workoutController.getExerciseLibrary);

/**
 * @route   POST /api/workouts/auth0/sessions
 * @desc    Log a new complete workout session
 * @access  Private (Auth0 Authenticated)
 */
router.post('/sessions', validate(logSessionSchema), workoutController.logWorkoutSession);

/**
 * @route   GET /api/workouts/auth0/sessions
 * @desc    Get the user's paginated workout history
 * @access  Private (Auth0 Authenticated)
 */
router.get('/sessions', validate(getHistorySchema), workoutController.getWorkoutHistory);

/**
 * @route   GET /api/workouts/auth0/sessions/:sessionId
 * @desc    Get details of a single workout session
 * @access  Private (Auth0 Authenticated)
 */
router.get('/sessions/:sessionId', validate(sessionIdParamSchema), workoutController.getWorkoutSessionById);

/**
 * @route   DELETE /api/workouts/auth0/sessions/:sessionId
 * @desc    Delete a specific workout session
 * @access  Private (Auth0 Authenticated)
 */
router.delete('/sessions/:sessionId', validate(sessionIdParamSchema), workoutController.deleteWorkoutSession);

export default router;
