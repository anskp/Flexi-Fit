// src/controllers/subscriptionController.js

import * as subscriptionService from '../services/subscriptionService.js';
import * as authService from '../services/authService.js'; // ✅ IMPORT authService to find the user
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

// A new helper function to get the user ID regardless of token type
const getUserIdFromRequest = async (req) => {
    // If req.user exists (from an Internal JWT), we are done.
    if (req.user && req.user.id) {
        console.log(`[Subscription Controller] Found user ID (${req.user.id}) from Internal JWT.`);
        return req.user.id;
    }

    // If not, check req.auth (from the Auth0 middleware for mobile)
    if (req.auth && req.auth.payload && req.auth.payload.sub) {
        const auth0Id = req.auth.payload.sub;
        console.log(`[Subscription Controller] No internal user found. Finding user by Auth0 ID: ${auth0Id}`);
        const user = await authService.getUserByAuth0Id(auth0Id);
        if (!user) {
            throw new AppError('User from token not found in database.', 401);
        }
        console.log(`[Subscription Controller] Found user ID (${user.id}) from Auth0 token.`);
        return user.id;
    }

    // If neither is present, authentication has failed.
    throw new AppError('Could not identify user from token.', 401);
};


export const createCheckoutSession = catchAsync(async (req, res) => {
  // ✅✅✅ THE DEFINITIVE FIX IS HERE ✅✅✅
  const userId = await getUserIdFromRequest(req);
  
  const { planId, planType } = req.body;

  const checkoutUrl = await subscriptionService.createCheckoutSession({ userId, planId, planType });
  
  res.status(200).json({ success: true, data: { checkoutUrl } });
});

export const createPortalSession = catchAsync(async (req, res) => {
    const userId = await getUserIdFromRequest(req); // Use the helper here too for consistency
    const portalUrl = await subscriptionService.createPortalSession(userId);
    res.status(200).json({ success: true, data: { portalUrl } });
});

export const handleChargebeeWebhook = catchAsync(async (req, res) => {
    // This route is public and does not need authentication
    await subscriptionService.processWebhook(req.body, req.headers);
    res.status(200).send(); 
});