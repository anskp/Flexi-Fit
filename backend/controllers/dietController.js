// src/controllers/dietController.js
import * as dietService from '../services/dietService.js';
import * as authService from '../services/authService.js';
import catchAsync from '../utils/catchAsync.js';

// Helper function to get user ID from either JWT or Auth0
const getUserId = async (req) => {
  // If Auth0 middleware was used
  if (req.auth?.payload) {
    console.log('[DietController] Using Auth0 user ID from payload');
    // Get our DB user ID from Auth0 sub
    const user = await authService.getUserByAuth0Id(req.auth.payload.sub);
    return user.id;
  }
  // If JWT middleware was used
  console.log('[DietController] Using JWT user ID');
  return req.user?.id;
};

export const logDietEntry = catchAsync(async (req, res) => {
  const userId = await getUserId(req);
  const newEntry = await dietService.createLog(userId, req.body);
  console.log("controller recieved dietlog")
  res.status(201).json({ success: true, message: 'Diet entry logged successfully.', data: newEntry });
});

export const getDietLogsByDate = catchAsync(async (req, res) => {
  const { date } = req.params;
  const result = await dietService.getLogsByDate(req.user.id, date);
  res.status(200).json({ success: true, data: result });
});

export const updateDietLog = catchAsync(async (req, res) => {
    const { logId } = req.params;
    const updatedLog = await dietService.updateLog(req.user.id, logId, req.body);
    res.status(200).json({ success: true, message: 'Diet log updated successfully.', data: updatedLog });
});

export const deleteDietLog = catchAsync(async (req, res) => {
    const { logId } = req.params;
    await dietService.deleteLog(req.user.id, logId);
    res.status(204).send(); // 204 No Content for successful deletion
});

