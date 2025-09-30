import express from 'express';
import * as workoutController from '../controllers/workoutController.js';
import validate, {
    logSessionSchema,
    getHistorySchema,
    sessionIdParamSchema,
    seedLibrarySchema, // ✅ Import the new schema
} from '../validators/workoutValidator.js';
import { auth0Middleware } from '../middlewares/auth0Middleware.js';

const router = express.Router();

// ✅ NEW ROUTE: To push the frontend exercise list to the backend database.
router.post(
  '/library/seed',
  auth0Middleware,
  // Custom validation middleware for the array payload
  (req, res, next) => {
    const { error } = seedLibrarySchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details.map((d) => d.message).join('; ') });
    }
    next();
  },
  workoutController.seedExerciseLibrary
);

// --- Your original routes for normal app operation ---
router.get('/library', auth0Middleware, workoutController.getExerciseLibrary);
router.post('/sessions', auth0Middleware, validate(logSessionSchema), workoutController.logWorkoutSession);
router.get('/sessions', auth0Middleware, validate(getHistorySchema), workoutController.getWorkoutHistory);
router.delete('/sessions/:sessionId', auth0Middleware, validate(sessionIdParamSchema), workoutController.deleteWorkoutSession);

export default router;