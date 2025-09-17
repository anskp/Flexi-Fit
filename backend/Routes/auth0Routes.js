// Routes/auth0Routes.js
import express from 'express';
import * as authController from '../controllers/authController.js';
import auth0Auth from '../middlewares/auth0Auth.js';

// Import the validation middleware and all schemas
import validate, {
  selectRoleSchema,
  createMemberProfileSchema,
  createTrainerProfileSchema,
  createGymProfileSchema,
  createMultiGymProfileSchema
} from '../validators/authValidator.js';

const router = express.Router();

// Auth0 protected routes for profile operations
router.post('/select-role', auth0Auth, authController.selectRole);
router.post('/create-member-profile', auth0Auth, validate(createMemberProfileSchema), authController.createMemberProfile);
router.post('/create-trainer-profile', auth0Auth, validate(createTrainerProfileSchema), authController.createTrainerProfile);
router.post('/create-gym-profile', auth0Auth, validate(createGymProfileSchema), authController.createGymProfile);
router.post('/create-multi-gym-profile', auth0Auth, validate(createMultiGymProfileSchema), authController.createMultiGymMemberProfile);

export default router;

// import express from 'express';
// import * as dietController from '../controllers/dietController.js';
// import auth0Auth from '../middlewares/auth0Auth.js';
// import validate, {
//   validateParams,
//   createLogSchema,
//   updateLogBodySchema,
//   logIdParamSchema,
//   dateParamSchema      // <<< THE FIX IS HERE: We import the correct name 'dateParamSchema'
// } from '../validators/dietValidator.js';

// const router = express.Router();

// // Auth0 protected diet routes
// router.post('/logs', auth0Auth, validate(createLogSchema), dietController.logDietEntry);

// // This route now uses the correctly imported validator
// router.get('/logs/date/:date', auth0Auth, validateParams(dateParamSchema), dietController.getDietLogsByDate);

// router.put('/logs/:logId', auth0Auth, validateParams(logIdParamSchema), validate(updateLogBodySchema), dietController.updateDietLog);

// router.delete('/logs/:logId', auth0Auth, validateParams(logIdParamSchema), dietController.deleteDietLog);

// export default router;