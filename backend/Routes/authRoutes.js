// Routes/authRoutes.js
import express from 'express';
import { auth } from 'express-oauth2-jwt-bearer';
import * as authController from '../controllers/authController.js';
import jwtAuth from '../middlewares/jwtAuth.js';

// ✅ Import all the specific schemas needed
import validate, {
  selectRoleSchema,
  createGymProfileSchema,
  createTrainerProfileSchema,
  createMerchantProfileSchema,
  createMemberProfileSchema
} from '../validators/authValidator.js';

const router = express.Router();

// --- Auth0 Middleware Configuration ---
const auth0Auth = auth({
  audience: 'https://api.fitnessclub.com',
  issuerBaseURL:'https://dev-1de0bowjvfbbcx7q.us.auth0.com/',
  // Add error handling for debugging
  tokenSigningAlg: 'RS256',
});

// --- Public Route for Auth0 Token Exchange ---
router.post('/verify-user', auth0Auth, (req, res, next) => {
  console.log('[Auth0 Middleware] Token validation successful. User payload:', req.auth?.payload);
  next();
}, authController.verifyUser);

// --- All Subsequent Routes are Protected by our INTERNAL JWT ---
router.use(jwtAuth);

// --- Onboarding Flow Routes ---

// Step 1: User selects their role
router.post('/select-role', validate(selectRoleSchema), authController.selectRole);

// Step 2: ✅ Use SEPARATE, SPECIFIC endpoints for profile creation
// Unwrap incoming payload if wrapped in { profileType, data }
router.post(
    '/create-gym-profile',
    (req, res, next) => {
      if (req.body?.data) {
        req.body = req.body.data; // replace body with inner data object for validation & controller
      }
      next();
    },
    validate(createGymProfileSchema),
    authController.createGymProfile
);

router.post(
    '/create-trainer-profile',
    (req, res, next) => {
      if (req.body?.data) {
        req.body = req.body.data; // replace body with inner data object for validation & controller
      }
      next();
    },
    validate(createTrainerProfileSchema),
    authController.createTrainerProfile
);

router.post(
    '/create-merchant-profile',
    (req, res, next) => {
      if (req.body && req.body.data) {
        req.body = req.body.data;
      }
      next();
    },
    validate(createMerchantProfileSchema),
    authController.createMerchantProfile
);

router.post(
    '/create-member-profile',
    validate(createMemberProfileSchema),
    authController.createMemberProfile
);

export default router;