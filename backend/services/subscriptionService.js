// src/services/subscriptionService.js
import { PrismaClient } from '@prisma/client';
import AppError from '../utils/AppError.js';

const prisma = new PrismaClient();

// This function now just creates a dummy ID for testing purposes.
const getOrCreateChargebeeCustomer = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError('User not found.', 404);

  if (user.chargebeeCustomerId) return user.chargebeeCustomerId;

  // CHARGEBEE INTEGRATION POINT (STUBBED)
  // In the future, this will call: chargebee.customer.create(...)
  console.log(`[STUB] Would create Chargebee customer for user: ${user.email}`);
  const dummyChargebeeId = `cb_stub_${user.id}`;
  
  await prisma.user.update({ where: { id: userId }, data: { chargebeeCustomerId: dummyChargebeeId } });
  return dummyChargebeeId;
};

export const createCheckoutSession = async (userId, planId) => {
  const chargebeeCustomerId = await getOrCreateChargebeeCustomer(userId);

  const plan = await prisma.gymPlan.findUnique({ where: { id: planId } }) ||
               await prisma.trainerPlan.findUnique({ where: { id: planId } });

  if (!plan) throw new AppError('Plan not found.', 404);
  // We check for the chargebeePlanId to ensure it's configured for the future.
  if (!plan.chargebeePlanId) throw new AppError('This plan is not configured for online subscription.', 400);

  // CHARGEBEE INTEGRATION POINT (STUBBED)
  // In the future, this will call: chargebee.hosted_page.checkout_new_for_items(...)
  console.log(`[STUB] Would create Chargebee Hosted Page for customer ${chargebeeCustomerId} with plan ${plan.chargebeePlanId}`);
  const dummyCheckoutUrl = `https://your-app.com/test-checkout?plan=${plan.chargebeePlanId}`;

  // We return a dummy URL that mimics the real response.
  return { checkoutUrl: dummyCheckoutUrl };
};

export const cancelSubscription = async (userId, localSubscriptionId) => {
  const subscription = await prisma.subscription.findFirst({
    where: { id: localSubscriptionId, userId: userId },
  });
  if (!subscription) throw new AppError('Subscription not found.', 404);
  if (!subscription.chargebeeSubscriptionId) throw new AppError('Cannot manage this subscription online.', 400);

  // CHARGEBEE INTEGRATION POINT (STUBBED)
  // In the future, this will call: chargebee.subscription.cancel_for_items(...)
  console.log(`[STUB] Would request cancellation for Chargebee subscription: ${subscription.chargebeeSubscriptionId}`);
  
  return { message: 'Cancellation request received. This will be processed by our subscription provider.' };
};

export const getMySubscriptions = async (userId) => {
  return await prisma.subscription.findMany({ where: { userId }, orderBy: { startDate: 'desc' } });
};

