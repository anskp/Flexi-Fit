import * as workoutService from '../services/workoutService.js';
import * as authService from '../services/authService.js';
import catchAsync from '../utils/catchAsync.js';

// Helper function to get user ID from either JWT or Auth0
const getUserId = async (req) => {
  // If Auth0 middleware was used
  if (req.auth?.payload) {
    console.log('[WorkoutController] Using Auth0 user ID from payload');
    // Get our DB user ID from Auth0 sub
    const user = await authService.getUserByAuth0Id(req.auth.payload.sub);
    return user.id;
  }
  // If JWT middleware was used
  console.log('[WorkoutController] Using JWT user ID');
  return req.user?.id;
};

export const logWorkoutSession = catchAsync(async (req, res) => {
  const userId = await getUserId(req);
  const newSession = await workoutService.logSession(userId, req.body);
  res.status(201).json({ success: true, message: 'Workout logged successfully.', data: newSession });
});

export const getWorkoutHistory = catchAsync(async (req, res) => {
  const history = await workoutService.getHistory(req.user.id, req.query);
  res.status(200).json({ success: true, data: history.data, pagination: history.pagination });
});

export const getWorkoutSessionById = catchAsync(async (req, res) => {
    const session = await workoutService.getSessionById(req.user.id, req.params.sessionId);
    res.status(200).json({ success: true, data: session });
});

export const deleteWorkoutSession = catchAsync(async (req, res) => {
    await workoutService.deleteSession(req.user.id, req.params.sessionId);
    res.status(204).send(); // 204 No Content is appropriate for a successful deletion
});

export const getExerciseLibrary = catchAsync(async (req, res) => {
  const library = await workoutService.getLibrary();
  res.status(200).json({ success: true, data: library });
});


