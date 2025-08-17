// src/api/gymService.js
import apiClient from './apiClient';

/**
 * @description Fetches a list of gyms based on various query parameters.
 * @param {object} params - The query parameters.
 * @param {number} [params.lat] - Latitude for nearby search.
 * @param {number} [params.lon] - Longitude for nearby search.
 * @param {number} [params.radius] - Radius in km for nearby search.
 * @param {number} [params.page] - Page number for pagination.
 * @param {number} [params.limit] - Number of items per page.
 * @param {string} [params.search] - Search query.
 * @param {string} [params.filter] - Filter option.
 * @param {string} [params.sort] - Sort option.
 * @returns {Promise<object>} The backend response with the list of gyms.
 */
export const discoverGyms = async (params) => {
  const response = await apiClient.get('/gyms/discover', { params });
  return response.data;
};

/**
 * @description Fetches the details of a single gym by its ID.
 * @param {string} gymId - The ID of the gym.
 * @returns {Promise<object>} The backend response with the gym details.
 */
export const getGymDetails = async (gymId) => {
    const response = await apiClient.get(`/gyms/profile/${gymId}`);
    return response.data;
};