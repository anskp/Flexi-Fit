// src/controllers/subscriptionController.js

import * as subscriptionService from '../services/subscriptionService.js';

// A utility to wrap async functions and catch errors, passing them to the global error handler
import catchAsync from '../utils/catchAsync.js';
/**
 * Creates a "stubbed" checkout session.
 * In the future, this will return a real Chargebee Hosted Page URL.
 */
export const createSubscriptionCheckout = catchAsync(async (req, res, next) => {
  const { planId } = req.body;
  const result = await subscriptionService.createCheckoutSession(req.user.id, planId);
  
  res.status(200).json({
    success: true,
    message: 'Checkout session created successfully.',
    data: result, // This will contain the { checkoutUrl: '...' } object
  });
});

/**
 * Initiates a "stubbed" subscription cancellation.
 * In the future, this will trigger a real cancellation request to Chargebee.
 */
export const cancelSubscription = catchAsync(async (req, res, next) => {
  const { subscriptionId } = req.params;
  const result = await subscriptionService.cancelSubscription(req.user.id, subscriptionId);
  
  res.status(200).json({
    success: true,
    data: result, // This will contain the { message: '...' } object
  });
});

/**
 * Gets the subscriptions for the currently logged-in user from the local database.
 * This function remains fully operational.
 */
export const getMySubscriptions = catchAsync(async (req, res, next) => {
  const subscriptions = await subscriptionService.getMySubscriptions(req.user.id);
  
  res.status(200).json({
    success: true,
    data: subscriptions,
  });
});

