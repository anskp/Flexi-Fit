// src/controllers/workoutController.js
import * as workoutService from '../services/workoutService.js';
import * as authService from '../services/authService.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

const getUserId = async (req) => {
  if (req.auth?.payload) {
    const user = await authService.getUserByAuth0Id(req.auth.payload.sub);
    if (!user) throw new AppError('User not found in database.', 404);
    return user.id;
  }
  if (req.user?.id) {
    return req.user.id;
  }
  throw new AppError('Authentication error: User ID could not be determined.', 401);
};

export const logWorkoutSession = catchAsync(async (req, res) => {
  const userId = await getUserId(req);
  const newSession = await workoutService.logSession(userId, req.body);
  
  // ✅ THIS IS THE LINE THAT SENDS THE SUCCESS MESSAGE
  res.status(201).json({ success: true, message: 'Workout logged successfully.', data: newSession });
});
export const getWorkoutHistory = catchAsync(async (req, res) => {
  const userId = await getUserId(req);
  const history = await workoutService.getHistory(userId, req.query);
  res.status(200).json({ success: true, data: history.data, pagination: history.pagination });
});

export const getWorkoutSessionById = catchAsync(async (req, res) => {
  const userId = await getUserId(req);
  const session = await workoutService.getSessionById(userId, req.params.sessionId);
  res.status(200).json({ success: true, data: session });
});

export const deleteWorkoutSession = catchAsync(async (req, res) => {
  const userId = await getUserId(req);
  await workoutService.deleteSession(userId, req.params.sessionId);
  res.status(204).send();
});


// ✅ MODIFIED: Added a final log before sending the response.
export const getExerciseLibrary = catchAsync(async (req, res) => {
  console.log('---------------------------------');
  console.log('✅ Request successfully reached getExerciseLibrary controller!');
  console.log('METHOD:', req.method);
  console.log('URL:', req.originalUrl);
  console.log('---------------------------------');

  // This will now either work or throw a catchable error.
  const library = await workoutService.getLibrary();

  // This log will only run if the above line is successful.
  console.log('[WorkoutController] Service call complete. Sending successful response.');
  res.status(200).json({ success: true, data: library });
});