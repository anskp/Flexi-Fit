// src/api/dashboardService.js
import apiClient from './apiClient';
import parseApiError from '../utils/parseApiError';

/**
 * @description Fetches all dashboard data (activity, diet, training) in one efficient call.
 * @returns {Promise<{success: boolean, message: string, data: object|null}>} A structured response.
 */
export const getDashboardData = async () => {
  try {
    console.log('[DashboardService] Fetching member dashboard data...');
    const response = await apiClient.get('/dashboard/auth0');
    
    console.log('[DashboardService] Raw response:', response.data);
    
    // The backend returns { success: true, data: { activity, diet, training } }
    return {
      success: true,
      message: 'Dashboard data fetched successfully.',
      data: response.data.data || response.data,
    };
  } catch (error) {
    console.error('[DashboardService] Fetch dashboard error:', error.response?.data || error.message);
    if (error.code === 'ECONNABORTED') {
      return { success: false, message: 'Request timeout, please try again.', data: null };
    }
    if (!error.response) {
      return { success: false, message: 'Network error, please check your connection.', data: null };
    }
    return { success: false, message: parseApiError(error), data: null };
  }
};