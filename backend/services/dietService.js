// src/services/dietService.js
import { PrismaClient } from '@prisma/client';
import AppError from '../utils/AppError.js';

const prisma = new PrismaClient();

export const createLog = async (userId, logData) => {
  return await prisma.dietLog.create({
    data: {
      userId,
      ...logData,
    },
  });
};

export const getLogsByDate = async (userId, dateString) => {
  const startDate = new Date(dateString);
  startDate.setUTCHours(0, 0, 0, 0);

  const endDate = new Date(dateString);
  endDate.setUTCHours(23, 59, 59, 999);

  const logs = await prisma.dietLog.findMany({
    where: {
      userId,
      createdAt: { gte: startDate, lte: endDate },
    },
    orderBy: { createdAt: 'asc' },
  });

  const summary = logs.reduce((acc, log) => {
    acc.totalCalories += log.calories;
    acc.totalProtein += log.protein || 0;
    acc.totalCarbs += log.carbs || 0;
    acc.totalFat += log.fat || 0;
    return acc;
  }, { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 });

  return { logs, summary };
};

export const updateLog = async (userId, logId, updateData) => {
    // First, verify the user owns the log they are trying to update
    const log = await prisma.dietLog.findFirst({
        where: { id: logId, userId: userId }
    });
    
    if (!log) {
        throw new AppError('Diet log not found or you do not have permission to edit it.', 404);
    }
    
    return await prisma.dietLog.update({
        where: { id: logId },
        data: updateData
    });
};

export const deleteLog = async (userId, logId) => {
    // Verify ownership before deleting
    const log = await prisma.dietLog.findFirst({
        where: { id: logId, userId: userId }
    });

    if (!log) {
        throw new AppError('Diet log not found or you do not have permission to delete it.', 404);
    }

    await prisma.dietLog.delete({
        where: { id: logId }
    });
};

