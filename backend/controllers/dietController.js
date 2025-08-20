// src/controllers/dietController.js
import * as dietService from '../services/dietService.js';

import catchAsync from '../utils/catchAsync.js';

export const logDietEntry = catchAsync(async (req, res) => {
  const newEntry = await dietService.createLog(req.user.id, req.body);
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

