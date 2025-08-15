// src/api/authService.js
import apiClient from './apiClient';

export const login = (email, password) => apiClient.post('/auth/login', { email, password });
export const signup = (email, password) => apiClient.post('/auth/signup', { email, password });
export const selectRole = (role) => apiClient.post('/auth/select-role', { role });
/**
 * @description Sends the member's profile details to the backend.
 * Requires the user to be authenticated.
 */
export const createMemberProfile = async (profileData) => {
    const response = await apiClient.post('/auth/create-member-profile', profileData);
    return response.data;
};