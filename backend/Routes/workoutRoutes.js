import express from 'express';
import * as workoutController from '../controllers/workoutController.js';
import validate, {
    logSessionSchema,
    getHistorySchema,
    sessionIdParamSchema,
} from '../validators/workoutValidator.js';
import { auth0Middleware } from '../middlewares/auth0Middleware.js';

const router = express.Router();

// Only keep the sessions route - remove /library routes
router.post('/sessions', auth0Middleware, validate(logSessionSchema), workoutController.logWorkoutSession);
router.get('/sessions', auth0Middleware, validate(getHistorySchema), workoutController.getWorkoutHistory);
router.delete('/sessions/:sessionId', auth0Middleware, validate(sessionIdParamSchema), workoutController.deleteWorkoutSession);

export default router;