// src/api/authService.js
import apiClient from './apiClient';
export const login = async (email, password) => {
const response = await apiClient.post('/auth/login', { email, password });
return response.data;
};
export const signup = async (email, password) => {
const response = await apiClient.post('/auth/signup', { email, password });
return response.data;
};
export const selectRole = async (role) => {
const response = await apiClient.post('/auth/select-role', { role });
return response.data;
};
export const createGymProfile = async (profileData) => {
const response = await apiClient.post('/auth/create-gym-profile', profileData);
return response.data;
};
export const createTrainerProfile = async (profileData) => {
const response = await apiClient.post('/auth/create-trainer-profile', profileData);
return response.data;
};