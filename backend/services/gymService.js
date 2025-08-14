// src/services/gymService.js

import { PrismaClient } from '@prisma/client';
import AppError from '../utils/AppError.js';

const prisma = new PrismaClient();

// A helper function to verify ownership, keeping services DRY
const verifyOwnership = async (gymId, ownerId) => {
  const gym = await prisma.gym.findUnique({ where: { id: gymId } });
  if (!gym) throw new AppError('Gym not found.', 404);
  if (gym.managerId !== ownerId) throw new AppError('Forbidden: You do not own this gym.', 403);
  return gym;
};

export const getAll = async (queryParams) => {
  const { lat, lon, radius, page, limit } = queryParams;
  const skip = (page - 1) * limit;

  if (lat && lon) {
    return await prisma.$queryRaw`
      SELECT *, ( 6371 * acos( cos(radians(${lat})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${lon})) + sin(radians(${lat})) * sin(radians(latitude)) ) ) AS distance
      FROM "Gym"
      WHERE latitude IS NOT NULL AND longitude IS NOT NULL
      HAVING ( 6371 * acos( cos(radians(${lat})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${lon})) + sin(radians(${lat})) * sin(radians(latitude)) ) ) < ${radius}
      ORDER BY distance
      LIMIT ${limit};
    `;
  }

  const [gyms, total] = await prisma.$transaction([
    prisma.gym.findMany({ skip, take: limit, orderBy: { name: 'asc' } }),
    prisma.gym.count(),
  ]);
  return { gyms, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const getById = async (id) => {
  const gym = await prisma.gym.findUnique({
    where: { id },
    include: { plans: { orderBy: { price: 'asc' } } },
  });
  if (!gym) throw new AppError('Gym not found.', 404);
  return gym;
};

export const update = async (gymId, ownerId, updateData) => {
  await verifyOwnership(gymId, ownerId);
  return await prisma.gym.update({ where: { id: gymId }, data: updateData });
};

export const checkIn = async (userId, gymId) => {
    const activeSubscription = await prisma.subscription.findFirst({
        where: { userId, status: 'active', gymPlan: { gymId } },
    });
    if (!activeSubscription) throw new AppError('No active subscription found for this gym.', 403);

    const existingCheckIn = await prisma.checkIn.findFirst({ where: { userId, checkOut: null } });
    if (existingCheckIn) throw new AppError('You are already checked in.', 400);

    return await prisma.checkIn.create({ data: { userId, gymId } });
};

export const checkOut = async (userId, checkInId) => {
    const checkInRecord = await prisma.checkIn.findFirst({
        where: { id: checkInId, userId, checkOut: null },
    });
    if (!checkInRecord) throw new AppError('Active check-in record not found.', 404);

    return await prisma.checkIn.update({ where: { id: checkInId }, data: { checkOut: new Date() } });
};



export const getMembers = async (gymId, ownerId) => {
    await verifyOwnership(gymId, ownerId);
    return await prisma.subscription.findMany({
        where: { status: 'active', gymPlan: { gymId } },
        include: { user: { select: { id: true, email: true, memberProfile: true } } },
    });
};

export const assignTrainer = async (gymId, ownerId, trainerUserId) => {
    await verifyOwnership(gymId, ownerId);
    const trainerProfile = await prisma.trainerProfile.findUnique({ where: { userId: trainerUserId } });
    if (!trainerProfile) throw new AppError('Trainer profile not found.', 404);

    return await prisma.gym.update({
        where: { id: gymId },
        data: { trainers: { connect: { id: trainerProfile.id } } },
    });
};

export const unassignTrainer = async (gymId, ownerId, trainerUserId) => {
    await verifyOwnership(gymId, ownerId);
    const trainerProfile = await prisma.trainerProfile.findUnique({ where: { userId: trainerUserId } });
    if (!trainerProfile) throw new AppError('Trainer profile not found.', 404);
    
    return await prisma.gym.update({
        where: { id: gymId },
        data: { trainers: { disconnect: { id: trainerProfile.id } } },
    });
};

export const getAssignedTrainers = async (gymId) => {
    const gym = await getById(gymId); // re-use getById
    return gym.trainers;
};

// --- Plan Management Services ---

export const createPlan = async (gymId, ownerId, planData) => {
    await verifyOwnership(gymId, ownerId);
    return await prisma.gymPlan.create({ data: { ...planData, gymId } });
};

export const updatePlan = async (planId, ownerId, planData) => {
    const plan = await prisma.gymPlan.findUnique({
        where: { id: planId },
        include: { gym: true },
    });
    if (!plan) throw new AppError('Plan not found.', 404);
    if (plan.gym.managerId !== ownerId) throw new AppError('Forbidden: You do not own this plan.', 403);
    
    return await prisma.gymPlan.update({ where: { id: planId }, data: planData });
};

export const deletePlan = async (planId, ownerId) => {
    const plan = await prisma.gymPlan.findUnique({
        where: { id: planId },
        include: { gym: true },
    });
    if (!plan) throw new AppError('Plan not found.', 404);
    if (plan.gym.managerId !== ownerId) throw new AppError('Forbidden: You do not own this plan.', 403);

    const activeSubs = await prisma.subscription.count({ where: { gymPlanId: planId, status: 'active' } });
    if (activeSubs > 0) throw new AppError(`Cannot delete plan with ${activeSubs} active subscriber(s).`, 400);

    return await prisma.gymPlan.delete({ where: { id: planId } });
};

export const getPlans = async (gymId) => {
    return await prisma.gymPlan.findMany({ where: { gymId }, orderBy: { price: 'asc' } });
};

/**
 * @description Fetches aggregated data for the Gym Owner's dashboard.
 */
export const getGymOwnerDashboard = async (ownerId) => {
  const ownedGym = await prisma.gym.findFirst({ where: { managerId: ownerId } });
  if (!ownedGym) {
    // Return a default empty state if the owner hasn't created a gym yet.
    return { totalRevenue: 0, totalMembers: 0, todaysCheckIns: 0, upcomingRenewals: 0 };
  }

  const gymId = ownedGym.id;
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);

  const [totalMembers, aggregateResult, todaysCheckIns] = await prisma.$transaction([
    prisma.subscription.count({
      where: { status: 'active', gymPlan: { gymId: gymId } },
    }),
    prisma.gymPlan.aggregate({
        where: { gymId: gymId, subscriptions: { some: { status: 'active' } } },
        _sum: { price: true }
    }),
    prisma.checkIn.count({
      where: { gymId: gymId, checkIn: { gte: todayStart } },
    }),
  ]);

  return {
    totalRevenue: aggregateResult._sum.price || 0,
    totalMembers: totalMembers,
    todaysCheckIns: todaysCheckIns,
    upcomingRenewals: 0, // Placeholder
  };
};

/**
 * @description Fetches the gym profile for the currently logged-in owner.
 */
export const getMyGym = async (ownerId) => {
    // ✅ LOG: Announce that the function has been entered and show the ID we are looking for.
    console.log(`[GymService] Attempting to find gym for manager ID: ${ownerId}`);

    if (!ownerId) {
        // This is a sanity check in case the user object from the token is malformed.
        console.error("[GymService] CRITICAL ERROR: getMyGym was called with a null or undefined ownerId.");
        throw new AppError("User ID was not provided to the service.", 500);
    }

    const gym = await prisma.gym.findFirst({
        where: { managerId: ownerId },
        include: { plans: { orderBy: { price: 'asc' } } }
    });

    // ✅ LOG: The most important check. Did the database query find anything?
    if (!gym) {
        console.log(`[GymService] No gym found for manager ID: ${ownerId}. Throwing 404 error.`);
        throw new AppError('No managed gym found for this account.', 404);
    }
    
    // ✅ LOG: Success! We found the gym.
    console.log(`[GymService] Successfully found gym "${gym.name}" (ID: ${gym.id}) for manager ID: ${ownerId}`);

    return gym;
};

/**
 * @description Fetches active members for the gym managed by the logged-in owner.
 */
export const getMyMembers = async (ownerId) => {
    // First, find the gym managed by this owner
    const gym = await prisma.gym.findFirst({
        where: { managerId: ownerId },
        select: { id: true }
    });
    if (!gym) throw new AppError('No managed gym found for this account.', 404);

    // Now, use the found gymId to get the members
    return await prisma.subscription.findMany({
        where: { status: 'active', gymPlan: { gymId: gym.id } },
        include: {
            user: { select: { id: true, email: true, memberProfile: true } },
            gymPlan: { select: { name: true } }
        },
        orderBy: { startDate: 'desc' }
    });
};

