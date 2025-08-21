// Routes/auth0WorkoutRoutes.js
import express from 'express';
import * as workoutController from '../controllers/workoutController.js';
import auth0Auth from '../middlewares/auth0Auth.js';
import validate, { logSessionSchema } from '../validators/workoutValidator.js';

const router = express.Router();

// Auth0 protected workout routes
router.post('/sessions', auth0Auth, validate(logSessionSchema), workoutController.logWorkoutSession);
router.get('/sessions', auth0Auth, workoutController.getWorkoutHistory);
router.get('/sessions/:id', auth0Auth, workoutController.getWorkoutSessionById);
router.delete('/sessions/:id', auth0Auth, workoutController.deleteWorkoutSession);
router.get('/library', auth0Auth, workoutController.getExerciseLibrary);

export default router;
