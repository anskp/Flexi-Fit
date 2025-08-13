// src/api/gymService.js
import apiClient from './apiClient';

/**
 * @description Fetches the list of a gym's active members.
 * @param {string} gymId - The ID of the gym.
 * @returns {Promise<object>} The backend response with the list of members.
 */
export const getGymMembers = async (gymId) => {
    // This calls the backend route: GET /api/gyms/owner/members/:gymId (we will add this)
    const response = await apiClient.get(`/gyms/owner/members/${gymId}`);
    return response.data;
};

/**
 * @description Fetches the gym profile managed by the currently logged-in owner.
 * @returns {Promise<object>} The backend response with the gym profile data.
 */
export const getMyGymProfile = async () => {
    // This assumes a backend route exists to get the owner's specific gym.
    // We will need to add this route to the backend.
    const response = await apiClient.get('/gyms/owner/my-profile');
    return response.data;
};