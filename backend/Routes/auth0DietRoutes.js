// Routes/auth0DietRoutes.js
import express from 'express';
import * as dietController from '../controllers/dietController.js';
import auth0Auth from '../middlewares/auth0Auth.js';
import validate, { createLogSchema } from '../validators/dietValidator.js';

const router = express.Router();

// Auth0 protected diet routes
router.post('/logs', auth0Auth, validate(createLogSchema), dietController.logDietEntry);
router.get('/logs/date/:date', auth0Auth, dietController.getDietLogsByDate);
router.put('/logs/:id', auth0Auth, dietController.updateDietLog);
router.delete('/logs/:id', auth0Auth, dietController.deleteDietLog);

export default router;
