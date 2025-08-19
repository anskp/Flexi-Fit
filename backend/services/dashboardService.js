// src/services/dashboardService.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// --- Private Helper Functions for each Tab ---

const _buildActivityData = async (userId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)); // Monday as start
  
  const startOfYear = new Date(today.getFullYear(), 0, 1);

  // 1. Get Today's Steps
  const todayStepsRecord = await prisma.stepCount.findFirst({
    where: { userId, date: today },
  });
  const todaySteps = todayStepsRecord?.value || 0;

  // 2. Get Weekly Steps for Chart
  const weeklyStepsRecords = await prisma.stepCount.findMany({
    where: { userId, date: { gte: startOfWeek } },
    orderBy: { date: 'asc' },
  });
  const weeklySteps = Array(7).fill(0);
  weeklyStepsRecords.forEach(record => {
    const dayIndex = record.date.getDay() === 0 ? 6 : record.date.getDay() - 1; // Monday=0, Sunday=6
    weeklySteps[dayIndex] = record.value;
  });

  // 3. Get Workout Counts (CORRECTED QUERY: using WorkoutSession)
  const workoutsThisWeek = await prisma.workoutSession.count({
    where: { userId, date: { gte: startOfWeek } },
  });
  const yearToDate = await prisma.workoutSession.count({
    where: { userId, date: { gte: startOfYear } },
  });

  // 4. Get Recent Activities (Real Data)
  const recentSessions = await prisma.workoutSession.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 3,
  });
  const recentActivities = recentSessions.map(session => ({
      type: session.workoutType === 'Cardio' ? '🏃‍♂️' : '🏋️‍♂️',
      name: session.workoutName || 'Workout Session',
      time: session.date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      duration: `${session.duration || 0} min`,
      calories: Math.round((session.duration || 0) * 8.5), // Estimate
  }));

  // 5. Calculate Active Minutes and Calories
  const sessionsThisWeek = await prisma.workoutSession.findMany({
      where: { userId, date: { gte: startOfWeek } },
      select: { duration: true }
  });
  const activeMinutes = sessionsThisWeek.reduce((sum, s) => sum + (s.duration || 0), 0);
  const caloriesBurned = Math.round((todaySteps * 0.04) + (activeMinutes * 8.5));


  // --- Final Assembled Object ---
  return {
    todaySteps,
    weeklySteps,
    workoutsThisWeek,
    yearToDate,
    recentActivities,
    activeMinutes,
    caloriesBurned,
    // --- Placeholders for features to be built later ---
    weeklyGoal: 10000, // This could be a field on MemberProfile
    streak: 7, // This requires complex logic to check daily activity
    monthlyProgress: 78, // Requires a goal system
    totalCalories: 12450, // Requires summing historical data
  };
};

const _buildDietData = async (userId) => {
  // This function can be expanded just like the activity one
  // For now, it mirrors the logic from our previous step
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const mealsToday = await prisma.dietLog.findMany({
    where: { userId, createdAt: { gte: today } },
  });

  let todayCalories = 0, protein = 0, carbs = 0, fats = 0;
  mealsToday.forEach(meal => {
    todayCalories += meal.calories;
    protein += meal.protein || 0;
    carbs += meal.carbs || 0;
    fats += meal.fats || 0;
  });

  return {
    todayCalories, protein, carbs, fats,
    meals: mealsToday.map(m => ({...m, completed: true, time: m.createdAt.toLocaleTimeString()})),
    // Placeholders:
    dailyGoal: 2200,
    weeklyCalories: [2100, 1950, 2300, todayCalories, 2000, 2150, 1850],
    nutritionGoals: { /* ... */ }
  };
};

const _buildTrainingData = async (userId) => {
  // This function can be expanded just like the activity one
  const totalWorkouts = await prisma.workoutSession.count({ where: { userId } });
  
  const workoutTypesData = await prisma.workoutSession.groupBy({
      by: ['workoutType'], _count: { _all: true }, where: { userId, workoutType: { not: null } }
  });
  
  const workoutTypes = workoutTypesData.map(item => ({
      name: item.workoutType, count: item._count._all,
      color: item.workoutType === 'Strength' ? '#e74c3c' : '#3498db',
  }));

  const upcomingWorkouts = await prisma.trainingPlanAssignment.findMany({
      where: { memberId: userId, endDate: { gte: new Date() } },
      take: 3
  });

  return {
    totalWorkouts,
    workoutTypes,
    upcomingWorkouts,
    // Placeholders
    currentPlan: "Strength Training",
    weeklyProgress: 75,
    thisMonth: 4,
    achievements: []
  };
};


/**
 * @desc    Builds the complete dashboard object for a member.
 * @param   {string} userId - The ID of the user.
 * @returns {Promise<object>} A nested object containing data for all three tabs.
 */
export const buildMemberDashboard = async (userId) => {
  // Run all three data-building functions in parallel for max efficiency
  const [activityData, dietData, trainingData] = await Promise.all([
    _buildActivityData(userId),
    _buildDietData(userId),
    _buildTrainingData(userId),
  ]);

  return {
    activity: activityData,
    diet: dietData,
    training: trainingData,
  };
};