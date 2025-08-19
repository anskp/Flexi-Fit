// src/api/trainingService.js
import apiClient from './apiClient';
import parseApiError from '../utils/parseApiError';

/**
 * @description Saves a new workout entry to the backend.
 * @param {object} workoutData - The workout form data from the component.
 * @returns {Promise<{success: boolean, message: string, data: object|null}>} A structured response.
 */
export const saveWorkoutEntry = async (workoutData) => {
  try {
    console.log('[TrainingService] Saving workout entry:', workoutData);
    const response = await apiClient.post('/training/logs', workoutData);

    return {
      success: true,
      message: response.data.message || 'Workout logged successfully!',
      data: response.data.data || null,
    };
  } catch (error) {
    console.error('[TrainingService] Save workout entry error:', error.response?.data || error.message);
    if (error.code === 'ECONNABORTED') {
      return { success: false, message: 'Request timeout, please try again.', data: null };
    }
    if (!error.response) {
      return { success: false, message: 'Network error, please check your connection.', data: null };
    }
    return { success: false, message: parseApiError(error), data: null };
  }
};