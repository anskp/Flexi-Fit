// src/services/subscriptionService.js

import { PrismaClient } from '@prisma/client';
import chargebeeModule from 'chargebee-typescript';
import AppError from '../utils/AppError.js';

const prisma = new PrismaClient();

const { ChargeBee } = chargebeeModule;
const chargebee = new ChargeBee();
chargebee.configure({
  site: process.env.CHARGEBEE_SITE, 
  api_key: process.env.CHARGEBEE_API_KEY
});

const getOrCreateChargebeeCustomer = async (userId) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError('User not found', 404);

    if (user.chargebeeCustomerId) {
        return user.chargebeeCustomerId;
    }

    const customerResult = await chargebee.customer.create({
        email: user.email,
        cf_internal_user_id: user.id 
    }).request();
    
    const customerId = customerResult.customer.id;
    await prisma.user.update({ where: { id: userId }, data: { chargebeeCustomerId: customerId } });
    
    return customerId;
};

export const createCheckoutSession = async ({ userId, planId, planType }) => {
    const customerId = await getOrCreateChargebeeCustomer(userId);

    let plan;
    // ✅ REFINEMENT: Look in the correct table based on planType
    if (planType === 'GYM') {
        plan = await prisma.gymPlan.findUnique({ where: { id: planId } });
    } else if (planType === 'TRAINER') {
        plan = await prisma.trainerPlan.findUnique({ where: { id: planId } });
    } else {
        throw new AppError('Invalid plan type specified.', 400);
    }
    
    if (!plan || !plan.chargebeePlanId) {
        throw new AppError('Plan not found or is not configured for billing.', 404);
    }

    const hostedPageResult = await chargebee.hosted_page.checkout_new_for_items({
        customer_id: customerId,
        subscription_items: [{ item_price_id: plan.chargebeePlanId, quantity: 1 }],
        redirect_url: `${process.env.FRONTEND_URL}/dashboard?subscription=success`,
        cancel_url: `${process.env.FRONTEND_URL}/explore`,
    }).request();

    return hostedPageResult.hosted_page.url;
};

export const createPortalSession = async (userId) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.chargebeeCustomerId) {
        throw new AppError('Customer profile not found.', 404);
    }
    
    const portalSessionResult = await chargebee.portal_session.create({
        customer: { id: user.chargebeeCustomerId },
        redirect_url: `${process.env.FRONTEND_URL}/dashboard`
    }).request();

    return portalSessionResult.portal_session.access_url;
};

export const processWebhook = async (rawPayload, headers) => {
    const event = chargebee.event.deserialize(
        rawPayload.toString(), 
        headers['x-chargebee-webhook-signature'], 
        process.env.CHARGEBEE_WEBHOOK_SECRET
    );
    if (!event) throw new AppError('Webhook verification failed.', 403);
    
    const { content, event_type } = event;
    const { subscription, customer } = content;

    console.log(`Received Chargebee webhook: ${event_type} for subscription ${subscription.id}`);

    const user = await prisma.user.findUnique({ where: { chargebeeCustomerId: customer.id } });
    if (!user) {
        console.error(`Webhook error: User not found for Chargebee customer ID ${customer.id}`);
        return;
    }
    
    // ✅ REFINEMENT: Find out which type of plan this subscription is for
    const planItemId = subscription.subscription_items[0].item_price_id;
    const gymPlan = await prisma.gymPlan.findFirst({ where: { chargebeePlanId: planItemId } });
    const trainerPlan = await prisma.trainerPlan.findFirst({ where: { chargebeePlanId: planItemId } });

    switch (event_type) {
        case 'subscription_created':
        case 'subscription_activated':
        case 'subscription_renewed': {
            await prisma.subscription.upsert({
                where: { chargebeeSubscriptionId: subscription.id },
                update: {
                    status: 'active',
                    endDate: new Date(subscription.current_term_end * 1000),
                },
                create: {
                    userId: user.id, status: 'active',
                    startDate: new Date(subscription.activated_at * 1000),
                    endDate: new Date(subscription.current_term_end * 1000),
                    chargebeeSubscriptionId: subscription.id,
                    // ✅ REFINEMENT: Link to the correct plan type
                    gymPlanId: gymPlan ? gymPlan.id : null,
                    trainerPlanId: trainerPlan ? trainerPlan.id : null,
                }
            });
            console.log(`Successfully activated/renewed subscription for user ${user.id}`);
            break;
        }
        
        case 'subscription_cancelled':
        case 'subscription_expired': {
            await prisma.subscription.updateMany({
                where: { chargebeeSubscriptionId: subscription.id },
                data: {
                    status: 'cancelled',
                    endDate: new Date((subscription.cancelled_at || subscription.current_term_end) * 1000)
                }
            });
            console.log(`Cancelled subscription for user ${user.id}`);
            break;
        }
    }
};