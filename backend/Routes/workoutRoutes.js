// src/routes/workoutRoutes.js
import express from 'express';
import * as workoutController from '../controllers/workoutController.js';
import jwtAuth from '../middlewares/jwtAuth.js';
import validate, {
    logSessionSchema,
    getHistorySchema,
    sessionIdParamSchema,
} from '../validators/workoutValidator.js';

const router = express.Router();

// You could add other, non-Auth0 routes here if needed in the future.
// For example: router.get('/public-info', someController);

export default router;