// src/services/workoutService.js
import { PrismaClient } from '@prisma/client';
import AppError from '../utils/AppError.js';

const prisma = new PrismaClient();

export const logSession = async (userId, sessionData) => {
  const { date, exercises } = sessionData;

  try {
    return await prisma.$transaction(async (tx) => {
      const session = await tx.workoutSession.create({
        data: {
          userId,
          date: date ? new Date(date) : new Date(),
        },
      });

      const logData = exercises.map(ex => ({ ...ex, sessionId: session.id }));
      await tx.workoutLog.createMany({ data: logData });

      // Return the full session with details for the response
      return await tx.workoutSession.findUnique({
          where: { id: session.id },
          include: { logs: { include: { exercise: true } } }
      });
    });
  } catch (error) {
    if (error.code === 'P2003') { // Foreign key constraint failed
      throw new AppError('One or more exercise IDs provided are invalid.', 400);
    }
    throw error; // Re-throw other errors to be caught by the global handler
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
        where: { id: sessionId, userId: userId }, // Ensures user can only access their own sessions
        include: {
            logs: { include: { exercise: true } }
        }
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
    // onDelete: Cascade on the schema will automatically delete all related WorkoutLog entries
    await prisma.workoutSession.delete({ where: { id: sessionId } });
};

export const getLibrary = async () => {
  return await prisma.exercise.findMany({ orderBy: { name: 'asc' } });
};

