import express from 'express';
import * as dietController from '../controllers/dietController.js';
import auth0Auth from '../middlewares/auth0Auth.js';
import validate, {
  validateParams,
  createLogSchema,
  updateLogBodySchema, // Corrected schema for the body
  logIdParamSchema,
  dateParamSchema      // FIX: Correctly import 'dateParamSchema'
} from '../validators/dietValidator.js';

const router = express.Router();

// Auth0 protected diet routes
router.post('/logs', auth0Auth, validate(createLogSchema), dietController.logDietEntry);

// This route now uses the correctly imported 'dateParamSchema'
router.get('/logs/date/:date', auth0Auth, validateParams(dateParamSchema), dietController.getDietLogsByDate);

router.put('/logs/:logId', auth0Auth, validateParams(logIdParamSchema), validate(updateLogBodySchema), dietController.updateDietLog);

router.delete('/logs/:logId', auth0Auth, validateParams(logIdParamSchema), dietController.deleteDietLog);

export default router;