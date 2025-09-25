// src/controllers/subscriptionController.js

import * as subscriptionService from '../services/subscriptionService.js';
import catchAsync from '../utils/catchAsync.js';

export const createCheckoutSession = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { planId, planType } = req.body; // e.g., planId: 'xyz', planType: 'GYM'

  // The service returns a secure URL hosted by Chargebee
  const checkoutUrl = await subscriptionService.createCheckoutSession({ userId, planId, planType });
  
  res.status(200).json({ success: true, data: { checkoutUrl } });
});

export const createPortalSession = catchAsync(async (req, res) => {
    const userId = req.user.id;
    // The service returns a secure URL for the customer portal
    const portalUrl = await subscriptionService.createPortalSession(userId);
    res.status(200).json({ success: true, data: { portalUrl } });
});

export const handleChargebeeWebhook = catchAsync(async (req, res) => {
    // The service handles verifying and processing the webhook
    await subscriptionService.processWebhook(req.body, req.headers);
    
    // Always send a 200 OK back to Chargebee immediately to acknowledge receipt
    res.status(200).send(); 
});