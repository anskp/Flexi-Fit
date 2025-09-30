// src/services/subscriptionService.js
import { PrismaClient } from '@prisma/client';
import chargebeeSdk from 'chargebee-typescript';
import AppError from '../utils/AppError.js';

const prisma = new PrismaClient();

const { ChargeBee } = chargebeeSdk;
const chargebee = new ChargeBee();
chargebee.configure({
  site: process.env.CHARGEBEE_SITE,
  api_key: process.env.CHARGEBEE_API_KEY,
});

/**
 * Utility: Ensure the plan exists in Chargebee before we use it.
 * If not found in DB, auto-create in Chargebee and save chargebeePlanId back.
 */
const ensureChargebeePrice = async (plan, planType) => {
  if (!plan.chargebeePlanId) {
    console.log(`[Plan Sync] Creating Chargebee price for ${planType} plan ID ${plan.id}`);

    const priceId = `${planType.toLowerCase()}_plan_${plan.id}`;
    const itemPrice = await chargebee.item_price
      .create({
        id: priceId,
        name: `${planType} Plan ${plan.id}`,
        currency_code: 'USD',
        price: plan.price * 100, // Chargebee expects cents
        period_unit: 'month',
        period: 1,
      })
      .request();

    const chargebeePlanId = itemPrice.item_price.id;

    if (planType === 'GYM') {
      await prisma.gymPlan.update({
        where: { id: plan.id },
        data: { chargebeePlanId },
      });
    } else if (planType === 'TRAINER') {
      await prisma.trainerPlan.update({
        where: { id: plan.id },
        data: { chargebeePlanId },
      });
    }

    console.log(`[Plan Sync] Chargebee price created: ${chargebeePlanId}`);
    return chargebeePlanId;
  }

  return plan.chargebeePlanId;
};

/**
 * Checkout Session for members subscribing to GYM or TRAINER plans
 */
export const createCheckoutSession = async ({ userId, planId, planType }) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError('User not found.', 404);

  let planFromDb;
  if (planType === 'GYM') {
    planFromDb = await prisma.gymPlan.findUnique({ where: { id: planId } });
  } else if (planType === 'TRAINER') {
    planFromDb = await prisma.trainerPlan.findUnique({ where: { id: planId } });
  } else {
    throw new AppError('Invalid plan type.', 400);
  }

  if (!planFromDb) throw new AppError('Plan not found.', 404);

  // ✅ Ensure the Chargebee price exists
  const chargebeePlanId = await ensureChargebeePrice(planFromDb, planType);

  // Create hosted checkout session
  const hostedPageResult = await chargebee.hosted_page
    .checkout_new_for_items({
      subscription_items: [{ item_price_id: chargebeePlanId, quantity: 1 }],
      customer: { email: user.email },
      redirect_url: `${process.env.FRONTEND_URL}/dashboard?subscription=success`,
      cancel_url: `${process.env.FRONTEND_URL}/explore`,
    })
    .request();

  return hostedPageResult.hosted_page.url;
};

/**
 * Customer portal session (to manage billing)
 */
export const createPortalSession = async (userId) => {
  console.log("--- Inside createPortalSession Service ---");
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) throw new AppError('User not found.', 404);
  if (!user.chargebeeCustomerId) {
    throw new AppError('No billing profile found. Please subscribe first.', 404);
  }

  const portalSessionResult = await chargebee.portal_session
    .create({
      customer: { id: user.chargebeeCustomerId },
      redirect_url: `${process.env.FRONTEND_URL}/dashboard`,
    })
    .request();

  return portalSessionResult.portal_session.access_url;
};

/**
 * Webhook handler — unified for:
 * - Gym/Trainer profile subscription setup
 * - Member subscriptions to those plans
 */
export const processWebhook = async ({ parsedBody, rawBody, headers }) => {
  let event;
  const webhookSecret = process.env.CHARGEBEE_WEBHOOK_SECRET;

  if (webhookSecret && headers['x-chargebee-webhook-signature']) {
    try {
      event = chargebee.event.deserialize(
        rawBody,
        headers['x-chargebee-webhook-signature'],
        webhookSecret
      );
    } catch (error) {
      console.error('[Webhook] Signature verification failed!', error);
      throw new AppError('Webhook signature verification failed.', 403);
    }
  } else {
    console.warn('[Webhook] Skipping signature verification (DEV ONLY).');
    event = parsedBody;
  }

  const { content, event_type } = event;
  if (!content || !event_type) {
    throw new AppError('Invalid webhook payload structure.', 400);
  }

  console.log(`[Webhook] Received event: ${event_type}`);

  const relevantEvents = [
    'subscription_created',
    'subscription_activated',
    'subscription_renewed',
    'subscription_cancelled',
    'subscription_expired',
  ];
  if (!relevantEvents.includes(event_type)) {
    console.log(`[Webhook] Ignoring event type: ${event_type}`);
    return;
  }

  const { subscription, customer } = content;
  if (!subscription || !customer) {
    console.error(`[Webhook] Missing subscription/customer in ${event_type}`);
    return;
  }

  // 1. Lookup user by email (new flow) or chargebeeCustomerId (old flow)
  let user = await prisma.user.findUnique({ where: { email: customer.email } });
  if (!user) {
    user = await prisma.user.findUnique({
      where: { chargebeeCustomerId: customer.id },
    });
  }
  if (!user) {
    console.error(
      `[Webhook] No matching user for Chargebee customer ${customer.id} (${customer.email})`
    );
    return;
  }

  // 2. Sync customerId if needed
  if (user.chargebeeCustomerId !== customer.id) {
    await prisma.user.update({
      where: { id: user.id },
      data: { chargebeeCustomerId: customer.id },
    });
  }

  // 3. Find which plan this subscription maps to
  const planItemId = subscription.subscription_items?.[0]?.item_price_id;
  if (!planItemId) {
    console.error(`[Webhook] Subscription ${subscription.id} missing item_price_id.`);
    return;
  }

  const gymPlan = await prisma.gymPlan.findFirst({
    where: { chargebeePlanId: planItemId },
  });
  const trainerPlan = await prisma.trainerPlan.findFirst({
    where: { chargebeePlanId: planItemId },
  });

  // 4. Process subscription lifecycle
  if (['subscription_created', 'subscription_activated', 'subscription_renewed'].includes(event_type)) {
    await prisma.subscription.upsert({
      where: { chargebeeSubscriptionId: subscription.id },
      update: {
        status: 'active',
        endDate: new Date(subscription.current_term_end * 1000),
      },
      create: {
        userId: user.id,
        status: 'active',
        startDate: new Date(subscription.activated_at * 1000),
        endDate: new Date(subscription.current_term_end * 1000),
        chargebeeSubscriptionId: subscription.id,
        gymPlanId: gymPlan ? gymPlan.id : null,
        trainerPlanId: trainerPlan ? trainerPlan.id : null,
      },
    });
    console.log(`[Webhook] ✅ Subscription active for user ${user.id}`);
  }

  if (['subscription_cancelled', 'subscription_expired'].includes(event_type)) {
    await prisma.subscription.updateMany({
      where: { chargebeeSubscriptionId: subscription.id },
      data: {
        status: 'cancelled',
        endDate: new Date(
          (subscription.cancelled_at || subscription.current_term_end) * 1000
        ),
      },
    });
    console.log(`[Webhook] ❌ Subscription cancelled for user ${user.id}`);
  }
};
