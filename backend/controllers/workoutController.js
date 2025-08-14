import * as workoutService from '../services/workoutService.js';

import catchAsync from '../utils/catchAsync.js';

export const logWorkoutSession = catchAsync(async (req, res) => {
  const newSession = await workoutService.logSession(req.user.id, req.body);
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


