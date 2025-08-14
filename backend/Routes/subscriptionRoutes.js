// Routes/subscriptionRoutes.js

import express from 'express';
import * as subController from '../controllers/subscriptionController.js';
import jwtAuth from '../middlewares/jwtAuth.js';
import validate, {
  createCheckoutSchema,
  cancelSubscriptionSchema
} from '../validators/subscriptionValidator.js'; // Assumes validator file is created

const router = express.Router();

// Apply JWT authentication to all subscription routes.
// A user must be logged in to perform any of these actions.
router.use(jwtAuth);

/**
 * @route   POST /api/subscriptions/checkout
 * @desc    Creates a checkout session for a specific plan.
 * @access  Private (Authenticated User)
 */
router.post(
  '/checkout',
  validate(createCheckoutSchema),
  subController.createSubscriptionCheckout
);

/**
 * @route   POST /api/subscriptions/cancel/:subscriptionId
 * @desc    Requests to cancel a specific subscription.
 * @access  Private (Authenticated User)
 */
router.post(
  '/cancel/:subscriptionId',
  validate(cancelSubscriptionSchema),
  subController.cancelSubscription
);

/**
 * @route   GET /api/subscriptions/me
 * @desc    Get all subscriptions for the logged-in user.
 * @access  Private (Authenticated User)
 */
router.get(
  '/me',
  subController.getMySubscriptions
);

export default router;
