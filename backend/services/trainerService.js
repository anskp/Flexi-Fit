// src/services/trainerService.js

import { PrismaClient } from '@prisma/client';
import AppError from '../utils/AppError.js';

const prisma = new PrismaClient();

// Helper to get trainer profile and verify existence, keeping services DRY
const getTrainerProfileByUserId = async (userId) => {
  const trainerProfile = await prisma.trainerProfile.findUnique({ where: { userId } });
  if (!trainerProfile) {
    throw new AppError('A trainer profile for the logged-in user was not found.', 404);
  }
  return trainerProfile;
};

// --- Public Services ---
export const getAll = async (queryParams) => {
  const { page, limit } = queryParams;
  const skip = (page - 1) * limit;

  const [trainers, total] = await prisma.$transaction([
    prisma.trainerProfile.findMany({
      skip,
      take: limit,
      orderBy: { user: { id: 'asc' } },
      include: { user: { select: { id: true, email: true } } }, // Include public user info
    }),
    prisma.trainerProfile.count(),
  ]);

  return { trainers, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const getById = async (userId) => {
  const profile = await prisma.trainerProfile.findUnique({
    where: { userId },
    include: {
      user: { select: { id: true, email: true } },
      plans: { orderBy: { price: 'asc' } }, // Subscription plans
      gyms: { select: { id: true, name: true } },
    },
  });
  if (!profile) throw new AppError('Trainer not found.', 404);
  return profile;
};

// --- Trainer-Specific Services ---
export const updateProfile = async (userId, updateData) => {
  await getTrainerProfileByUserId(userId); // Verifies the user is a trainer
  return await prisma.trainerProfile.update({ where: { userId }, data: updateData });
};

export const getDashboard = async (userId) => {
  const trainerProfile = await getTrainerProfileByUserId(userId);
  const planIds = (await prisma.trainerPlan.findMany({
      where: { trainerProfileId: trainerProfile.id },
      select: { id: true }
  })).map(p => p.id);

  const totalSubscribers = await prisma.subscription.count({
      where: { trainerPlanId: { in: planIds }, status: 'active' }
  });
  // More complex earning logic would go here
  return { totalSubscribers, monthlyEarnings: 0, profileCompleteness: 85 };
};

export const getSubscribers = async (userId) => {
  const trainerProfile = await getTrainerProfileByUserId(userId);
  return await prisma.subscription.findMany({
    where: { status: 'active', trainerPlan: { trainerProfileId: trainerProfile.id } },
    include: {
      user: { select: { id: true, email: true, memberProfile: true } },
      trainerPlan: { select: { name: true } },
    },
    orderBy: { startDate: 'desc' },
  });
};

export const createTrainingPlan = async (userId, planData) => {
  const trainerProfile = await getTrainerProfileByUserId(userId);
  return await prisma.trainingPlan.create({
    data: { ...planData, trainerProfileId: trainerProfile.id },
  });
};

export const getMyTrainingPlans = async (userId) => {
    const trainerProfile = await getTrainerProfileByUserId(userId);
    return await prisma.trainingPlan.findMany({
        where: { trainerProfileId: trainerProfile.id },
        orderBy: { name: 'asc' }
    });
};

export const updateTrainingPlan = async (userId, planId, updateData) => {
    const trainerProfile = await getTrainerProfileByUserId(userId);
    const plan = await prisma.trainingPlan.findUnique({ where: { id: planId }});
    if(!plan || plan.trainerProfileId !== trainerProfile.id) {
        throw new AppError('Training plan not found or you do not own it.', 404);
    }
    return await prisma.trainingPlan.update({ where: { id: planId }, data: updateData });
};

export const assignPlanToMember = async (userId, planId, memberId) => {
  const trainerProfile = await getTrainerProfileByUserId(userId);

  // Security: Verify the plan exists and belongs to the trainer
  const plan = await prisma.trainingPlan.findFirst({
    where: { id: planId, trainerProfileId: trainerProfile.id },
  });
  if (!plan) throw new AppError('Training plan not found or does not belong to you.', 404);

  // Security: Verify the member is an active subscriber to this trainer
  const activeSub = await prisma.subscription.findFirst({
    where: {
      userId: memberId,
      status: 'active',
      trainerPlan: { trainerProfileId: trainerProfile.id },
    },
  });
  if (!activeSub) throw new AppError('Cannot assign plan: The user is not an active subscriber.', 403);
  
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(startDate.getDate() + plan.duration);

  return await prisma.trainingPlanAssignment.create({
    data: { planId, memberId, trainerProfileId: trainerProfile.id, startDate, endDate, status: 'active' },
  });
};

export const updatePlanTrial = async (userId, planId, trialData) => {
    const trainerProfile = await getTrainerProfileByUserId(userId);
    const plan = await prisma.trainerPlan.findUnique({ where: { id: planId }});

    if (!plan || plan.trainerProfileId !== trainerProfile.id) {
        throw new AppError('Subscription plan not found or you do not own it.', 404);
    }
    return await prisma.trainerPlan.update({
        where: { id: planId },
        data: {
            trialEnabled: trialData.trialEnabled,
            trialDurationDays: trialData.trialEnabled ? trialData.trialDurationDays : null
        }
    });
};
/**
 * @description Fetches aggregated data for the Trainer's dashboard.
 */
export const getTrainerDashboardStats = async (userId) => {
  const trainerProfile = await prisma.trainerProfile.findUnique({ where: { userId } });
  if (!trainerProfile) throw new AppError('Trainer profile not found.', 404);

  const plans = await prisma.trainerPlan.findMany({
      where: { trainerProfileId: trainerProfile.id },
      include: { _count: { select: { subscriptions: { where: { status: 'active' } } } } }
  });

  let totalSubscribers = 0;
  let monthlyEarnings = 0;

  for (const plan of plans) {
    const activeSubs = plan._count.subscriptions;
    totalSubscribers += activeSubs;
    monthlyEarnings += activeSubs * plan.price;
  }

  return {
    totalSubscribers,
    monthlyEarnings,
    profileCompleteness: 85, // Placeholder
  };
};

