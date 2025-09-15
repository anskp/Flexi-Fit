// // Routes/auth0Routes.js
// import express from 'express';
// import * as authController from '../controllers/authController.js';
// import auth0Auth from '../middlewares/auth0Auth.js';

// // Import the validation middleware and all schemas
// import validate, {
//   selectRoleSchema,
//   createMemberProfileSchema,
//   createTrainerProfileSchema,
//   createGymProfileSchema,
//   createMultiGymProfileSchema
// } from '../validators/authValidator.js';

// const router = express.Router();

// // Auth0 protected routes for profile operations
// router.post('/select-role', auth0Auth, authController.selectRole);
// router.post('/create-member-profile', auth0Auth, validate(createMemberProfileSchema), authController.createMemberProfile);
// router.post('/create-trainer-profile', auth0Auth, validate(createTrainerProfileSchema), authController.createTrainerProfile);
// router.post('/create-gym-profile', auth0Auth, validate(createGymProfileSchema), authController.createGymProfile);
// router.post('/create-multi-gym-profile', auth0Auth, validate(createMultiGymProfileSchema), authController.createMultiGymMemberProfile);

// export default router;


import express from 'express';
import * as authController from '../controllers/authController.js';
import auth0Auth from '../middlewares/auth0Auth.js';

// Import validators and schemas
import validate, {
  selectRoleSchema,
  createMemberProfileSchema,
  createTrainerProfileSchema,
  createGymProfileSchema,
  createMultiGymProfileSchema
} from '../validators/authValidator.js';

const router = express.Router();

// Auth0-protected routes (JWT token required)

// Member: create profile
router.post(
  '/create-member-profile',
  auth0Auth, // Auth0 JWT middleware protects this endpoint
  validate(createMemberProfileSchema),
  authController.createMemberProfile
);

// Member: select role
router.post(
  '/select-role',
  auth0Auth,
  validate(selectRoleSchema),
  authController.selectRole
);

// Trainer: create profile
router.post(
  '/create-trainer-profile',
  auth0Auth,
  validate(createTrainerProfileSchema),
  authController.createTrainerProfile
);

// Gym: create profile
router.post(
  '/create-gym-profile',
  auth0Auth,
  validate(createGymProfileSchema),
  authController.createGymProfile
);

// Multi-gym member: create profile
router.post(
  '/create-multi-gym-profile',
  auth0Auth,
  validate(createMultiGymProfileSchema),
  authController.createMultiGymMemberProfile
);

export default router;
