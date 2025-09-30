import { PrismaClient } from '@prisma/client';
import AppError from '../utils/AppError.js';

const prisma = new PrismaClient();

/**
 * ✅ THE FINAL, INTELLIGENT LOGIC
 * This function receives the full workout data from the frontend. For each exercise in the payload,
 * it uses `upsert` to create the exercise in the database if it doesn't already exist.
 * Then, it creates the workout session and links everything together.
 * This is the core of the solution you wanted.
 */
export const logSession = async (userId, sessionData) => {
  const { 
    date, exercises, workoutName, workoutType, duration, 
    intensity, notes, muscleGroups
  } = sessionData;

  try {
    // A transaction ensures that if any step fails, the entire operation is rolled back.
    // This prevents partial or corrupted data from being saved.
    return await prisma.$transaction(async (tx) => {
      
      // STEP 1: For each exercise sent from the frontend, find its ID or create it.
      const exerciseIds = await Promise.all(
        exercises.map(async (exerciseDetail) => {
          // 'upsert' is a powerful command that combines UPDATE and INSERT.
          const exerciseRecord = await tx.exercise.upsert({
            // It tries to find a record where the name matches.
            where: { name: exerciseDetail.name },
            // If it finds one, it updates it (optional, but good practice).
            update: {
              type: exerciseDetail.type,
              equipment: exerciseDetail.equipment,
              difficulty: exerciseDetail.difficulty,
            },
            // If it does NOT find one, it creates a new record.
            create: {
              name: exerciseDetail.name,
              type: exerciseDetail.type,
              equipment: exerciseDetail.equipment,
              difficulty: exerciseDetail.difficulty,
            },
          });
          return exerciseRecord.id; // Return the ID of the found or created exercise.
        })
      );

      // STEP 2: Create the main Workout Session record.
      const allEquipment = exercises.flatMap(ex => ex.equipment);
      const uniqueEquipment = [...new Set(allEquipment)];

      const session = await tx.workoutSession.create({
        data: {
          userId,
          date: date ? new Date(date) : new Date(),
          workoutName,
          workoutType,
          duration,
          intensity,
          notes,
          muscleGroups: muscleGroups || [],
          equipment: uniqueEquipment || [], // Store the equipment used in this session.
        },
      });

      // STEP 3: Create the WorkoutLog entries to link the session with the exercises.
      const logData = exerciseIds.map(exerciseId => ({
        sessionId: session.id,
        exerciseId: exerciseId,
        // You can add sets, reps, etc., here if you send them from the frontend.
      }));
      await tx.workoutLog.createMany({ data: logData });

      // STEP 4: Return the complete, newly created session data.
      return await tx.workoutSession.findUnique({
          where: { id: session.id },
          include: { logs: { include: { exercise: true } } }
      });
    });
  } catch (error) {
    console.error("Error in logSession service:", error);
    throw new AppError('Failed to log workout session.', 500);
  }
};

/**
 * This function is for other parts of your app, like viewing a history or library page.
 * It is NOT used for the main screen anymore.
 */
export const getLibrary = async () => {
  console.log('[WorkoutService] Attempting to fetch all exercises from the database...');
  return await prisma.exercise.findMany({
    orderBy: { name: 'asc' },
  });
};

// ... other functions like getHistory, deleteSession are unchanged and correct ...