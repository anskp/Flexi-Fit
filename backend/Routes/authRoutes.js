// Routes/authRoutes.js

import express from 'express';
import passport from 'passport';
import * as authController from '../controllers/authController.js';
import jwtAuth from '../middlewares/jwtAuth.js';

// Import the validation middleware and all schemas
import validate, {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  adminRegisterSchema,
  selectRoleSchema,
  createMemberProfileSchema,
  createTrainerProfileSchema,
  createGymProfileSchema,
  createMultiGymProfileSchema
} from '../validators/authValidator.js';

const router = express.Router();

// --- Public Authentication Routes with Validation ---
router.post('/signup', validate(signupSchema), authController.signup);
router.post('/login', validate(loginSchema), authController.login);
router.post('/logout', authController.logout); // No body to validate

// --- Password Reset Routes with Validation ---
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);

// --- Admin Registration Route with Validation ---
router.post('/register/admin', validate(adminRegisterSchema), authController.registerAdmin);


// --- Google OAuth Routes (No request body to validate) ---
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login', session: false }), 
    authController.googleCallback
);


// --- Protected Routes (Require a valid JWT) ---
// The jwtAuth middleware will run for all routes defined below this line.
router.use(jwtAuth); 

// Role and Profile Creation Routes with Validation
router.post('/select-role', validate(selectRoleSchema), authController.selectRole);
router.post('/create-member-profile', validate(createMemberProfileSchema), authController.createMemberProfile);
router.post('/create-trainer-profile', validate(createTrainerProfileSchema), authController.createTrainerProfile);
router.post('/create-gym-profile', validate(createGymProfileSchema), authController.createGymProfile);
router.post('/create-multi-gym-profile', validate(createMultiGymProfileSchema), authController.createMultiGymMemberProfile);


export default router;

