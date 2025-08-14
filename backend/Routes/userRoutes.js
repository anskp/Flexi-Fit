
import express from 'express';
import * as userController from '../controllers/userController.js';
import jwtAuth from '../middlewares/jwtAuth.js';
import validate, {
  changePasswordSchema,
  updateMemberProfileSchema,
  updateTrainerProfileSchema,
  updateGymProfileSchema
} from '../validators/userValidator.js';

const router = express.Router();

// All routes in this file are for the currently authenticated user
router.use(jwtAuth);

/**
 * @route   PATCH /api/users/me/password
 * @desc    Change the logged-in user's password.
 * @access  Private
 */
router.patch(
    '/me/password',
    validate(changePasswordSchema),
    userController.changePassword
);

/**
 * @route   PATCH /api/users/me/profile
 * @desc    Update the logged-in user's role-specific profile (Member, Trainer, or Gym).
 * @access  Private
 */
router.patch(
    '/me/profile',
    (req, res, next) => {
        // This is a dynamic validation middleware.
        // It checks the user's role and applies the correct validation schema.
        const role = req.user.role;
        let schema;
        switch (role) {
            case 'MEMBER':
                schema = updateMemberProfileSchema;
                break;
            case 'TRAINER':
                schema = updateTrainerProfileSchema;
                break;
            case 'GYM_OWNER':
                schema = updateGymProfileSchema;
                break;
            default:
                return res.status(400).json({ success: false, message: "No profile to update for this role." });
        }
        // Run the validation
        validate(schema)(req, res, next);
    },
    userController.updateMyProfile
    
);
/**
 * @route   GET /api/users/me/profile
 * @desc    Get the logged-in user's complete profile.
 * @access  Private
 */
router.get(
    '/me/profile',
    userController.getMyProfile
);
export default router;

