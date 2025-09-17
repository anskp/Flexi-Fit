import express from 'express';
import * as dietController from '../controllers/dietController.js';
import jwtAuth from '../middlewares/jwtAuth.js';
import auth0DietRoutes from './auth0DietRoutes.js';
import validate, {
  validateParams,
  createLogSchema,
  updateLogBodySchema,
  dateParamSchema,     // FIX: Ensure the correct schema name is used here too
  logIdParamSchema
} from '../validators/dietValidator.js';

const router = express.Router();

// Add Auth0 diet routes
router.use('/auth0', auth0DietRoutes);

// Protect all diet-related routes
router.use(jwtAuth);

/**
 * @route   POST /api/diet/logs
 * @desc    Log a new diet entry
 * @access  Private
 */
router.post('/logs', validate(createLogSchema), dietController.logDietEntry);

/**
 * @route   GET /api/diet/logs/date/:date
 * @desc    Get all diet logs and a summary for a specific date
 * @access  Private
 */
// This route now uses the correctly imported 'dateParamSchema'
router.get('/logs/date/:date', validateParams(dateParamSchema), dietController.getDietLogsByDate);

/**
 * @route   PUT /api/diet/logs/:logId
 * @desc    Update an existing diet log entry
 * @access  Private
 */
router.put('/logs/:logId', validateParams(logIdParamSchema), validate(updateLogBodySchema), dietController.updateDietLog);

/**
 * @route   DELETE /api/diet/logs/:logId
 * @desc    Delete a diet log entry
 * @access  Private
 */
router.delete('/logs/:logId', validateParams(logIdParamSchema), dietController.deleteDietLog);

export default router;
// import express from 'express';
// import * as dietController from '../controllers/dietController.js';
// import jwtAuth from '../middlewares/jwtAuth.js';
// import {
//   validateBody,
//   validateParams,
//   createLogSchema,
//   updateLogSchema,
//   getLogsByDateSchema,
//   logIdParamSchema
// } from '../validators/dietValidator.js';

// const router = express.Router();

// // Apply JWT auth to all routes
// router.use(jwtAuth);

// router.post('/logs', validateBody(createLogSchema), dietController.logDietEntry);
// router.get('/logs/date/:date', validateParams(getLogsByDateSchema), dietController.getDietLogsByDate);
// router.put('/logs/:logId', validateParams(logIdParamSchema), validateBody(updateLogSchema), dietController.updateDietLog);
// router.delete('/logs/:logId', validateParams(logIdParamSchema), dietController.deleteDietLog);

// export default router;
