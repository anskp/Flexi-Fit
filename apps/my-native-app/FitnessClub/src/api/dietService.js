// src/api/dietService.js
import apiClient from './apiClient';
import parseApiError from '../utils/parseApiError';

/**
 * @description Saves a new diet/meal entry to the backend.
 * @param {object} dietData - The diet form data from the component.
 * @returns {Promise<{success: boolean, message: string, data: object|null}>} A structured response.
 */
export const saveDietEntry = async (dietData) => {
  try {
    console.log('[DietService] Saving diet entry:', dietData);
    const response = await apiClient.post('/diet/logs', dietData);
    
    return {
      success: true,
      message: response.data.message || 'Meal logged successfully!',
      data: response.data.data || null,
    };
  } catch (error) {
    console.error('[DietService] Save diet entry error:', error.response?.data || error.message);
    if (error.code === 'ECONNABORTED') {
      return { success: false, message: 'Request timeout, please try again.', data: null };
    }
    if (!error.response) {
      return { success: false, message: 'Network error, please check your connection.', data: null };
    }
    return { success: false, message: parseApiError(error), data: null };
  }
};