
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
  // ✅ LOG to confirm this function is being called
  console.log('[Trainer Service] The getAll function was successfully called.');

  // ---  diagnosing with mock data to test the request-response cycle. ---
  // If your app displays this data, it means your routes and controllers are working
  // and the problem is 100% your database connection string or the database itself.
  try {
    const mockTrainers = [
      {
        experience: 5,
        bio: "This is a mock trainer. If you see this, your API route is working correctly!",
        user: { id: 'clxka12340000mock12345', email: 'mock.trainer.one@test.com' }
      },
      {
        experience: 10,
        bio: "This is a second mock trainer to confirm the API is responding with a list.",
        user: { id: 'clxka56780000mock67890', email: 'mock.trainer.two@test.com' }
      }
    ];
    // Return data in the exact same format as the real function would.
    return { trainers: mockTrainers, total: 2, page: 1, limit: 10, totalPages: 1 };
  } catch(e) {
    console.error("This mock function should not fail, but if it does:", e);
  }
  // --- END OF MOCK DATA TEST ---

  /*
  // --- YOUR ORIGINAL DATABASE CODE (Keep this commented out for the test) ---
  const { page, limit } = queryParams;
  const skip = (page - 1) * limit;

  try {
    console.log(`[Trainer Service] Attempting to query the database...`);
    const [trainers, total] = await prisma.$transaction([
      prisma.trainerProfile.findMany({
        skip,
        take: limit,
        orderBy: { user: { id: 'asc' } },
        include: { user: { select: { id: true, email: true } } },
      }),
      prisma.trainerProfile.count(),
    ]);

    console.log(`[Trainer Service] Database query successful. Found ${total} trainers.`);
    return { trainers, total, page, limit, totalPages: Math.ceil(total / limit) };

  } catch (dbError) {
    console.error("[Trainer Service] CRITICAL: Database connection or query failed!", dbError);
    throw new AppError('The database could not be reached.', 500);
  }
  */
};

export const getById = async (userId) => {
  const profile = await prisma.trainerProfile.findUnique({
    where: { userId },
    include: {
      user: { select: { id: true, email: true } },
      plans: { orderBy: { price: 'asc' } },
      gyms: { select: { id: true, name: true } },
    },
  });
  if (!profile) throw new AppError('Trainer not found.', 404);
  return profile;
};

// --- Trainer-Specific Services ---
export const updateProfile = async (userId, updateData) => {
  await getTrainerProfileByUserId(userId);
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

  const plan = await prisma.trainingPlan.findFirst({
    where: { id: planId, trainerProfileId: trainerProfile.id },
  });
  if (!plan) throw new AppError('Training plan not found or does not belong to you.', 404);

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