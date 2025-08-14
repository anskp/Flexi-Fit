// src/services/dashboardService.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getMemberDashboard = async (userId) => {
  // Define the date range for "today"
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setUTCHours(23, 59, 59, 999);

  // Use a single, parallelized transaction to fetch all data at once
  const [
    activeSubscription,
    todaysDietLogs,
    todaysStepCount,
    lastWorkoutSession,
  ] = await prisma.$transaction([
    // Query 1: Get the user's single active subscription with all relevant details
    prisma.subscription.findFirst({
      where: { userId, status: { in: ['active', 'in_trial'] } },
      include: {
        gymPlan: { include: { gym: { select: { id: true, name: true, badges: true } } } },
        trainerPlan: { include: { trainer: { include: { user: { select: { id: true, email: true } } } } } },
      },
    }),

    // Query 2: Get all diet logs for today to calculate total calories
    prisma.dietLog.findMany({
      where: { userId, createdAt: { gte: todayStart, lte: todayEnd } },
    }),

    // Query 3: Get today's step count from synced health data
    prisma.stepCount.findFirst({
        where: { userId, date: { gte: todayStart, lte: todayEnd } },
        orderBy: { value: 'desc' } // Get the highest value if multiple sources sync
    }),

    // Query 4: Get the user's most recent workout session
    prisma.workoutSession.findFirst({
        where: { userId },
        orderBy: { date: 'desc' },
        include: {
            logs: {
                select: { exercise: { select: { name: true } } },
                take: 1 // Just need a glimpse of what they did
            }
        }
    })
  ]);

  // --- Process the fetched data ---

  // Calculate total calories from today's diet logs
  const totalCaloriesToday = todaysDietLogs.reduce((sum, log) => sum + log.calories, 0);

  // Prepare the final dashboard object
  const dashboard = {
    subscription: activeSubscription,
    healthMetrics: {
      dailySteps: todaysStepCount?.value || 0,
      dailyCalories: totalCaloriesToday,
    },
    recentActivity: {
        lastWorkout: lastWorkoutSession
    },
    aiTips: "Start your day with a glass of water to boost your metabolism!",
  };

  return dashboard;
};

