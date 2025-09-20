// src/services/workoutService.js
import { PrismaClient } from '@prisma/client';
import AppError from '../utils/AppError.js';

const prisma = new PrismaClient();

// --- No changes to the functions below ---
export const logSession = async (userId, sessionData) => {
  const { 
    date, exercises, workoutName, workoutType, duration, 
    intensity, notes, muscleGroups, equipment 
  } = sessionData;
  try {
    return await prisma.$transaction(async (tx) => {
      const session = await tx.workoutSession.create({
        data: {
          userId,
          date: date ? new Date(date) : new Date(),
          workoutName, workoutType, duration, intensity, notes,
          muscleGroups: muscleGroups || [],
          equipment: equipment || [],
        },
      });
      const logData = exercises.map(ex => ({ ...ex, sessionId: session.id }));
      await tx.workoutLog.createMany({ data: logData });
      return await tx.workoutSession.findUnique({
          where: { id: session.id },
          include: { logs: { include: { exercise: true } } }
      });
    });
  } catch (error) {
    if (error.code === 'P2003') {
      throw new AppError('One or more exercise IDs provided are invalid.', 400);
    }
    throw error;
  }
};

export const getHistory = async (userId, pagination) => {
  const { page, limit } = pagination;
  const skip = (page - 1) * limit;
  const [sessions, total] = await prisma.$transaction([
    prisma.workoutSession.findMany({
      where: { userId },
      include: {
        logs: { include: { exercise: { select: { name: true, type: true } } } },
      },
      orderBy: { date: 'desc' },
      skip,
      take: limit,
    }),
    prisma.workoutSession.count({ where: { userId } }),
  ]);
  return { data: sessions, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
};

export const getSessionById = async (userId, sessionId) => {
    const session = await prisma.workoutSession.findFirst({
        where: { id: sessionId, userId: userId },
        include: { logs: { include: { exercise: true } } }
    });
    if (!session) {
        throw new AppError('Workout session not found.', 404);
    }
    return session;
}

export const deleteSession = async (userId, sessionId) => {
    const session = await prisma.workoutSession.findFirst({ where: { id: sessionId, userId } });
    if (!session) {
        throw new AppError('Workout session not found or you do not have permission to delete it.', 404);
    }
    await prisma.workoutSession.delete({ where: { id: sessionId } });
};

// ✅ MODIFIED: This is the corrected function with proper logging and error handling.
export const getLibrary = async () => {
  console.log('[WorkoutService] Attempting to fetch exercise library from database...');
  try {
    const exercises = await prisma.exercise.findMany({
      orderBy: { name: 'asc' },
    });

    // This log confirms the database query was successful.
    console.log(`[WorkoutService] Successfully fetched ${exercises.length} exercises from the database.`);
    return exercises;

  } catch (error) {
    // This log will show the specific Prisma error in your terminal.
    console.error('[WorkoutService] CRITICAL DATABASE ERROR fetching library:', error);

    // This sends a proper error back to the controller.
    throw new AppError('Could not fetch exercise library from the database.', 500);
  }
};