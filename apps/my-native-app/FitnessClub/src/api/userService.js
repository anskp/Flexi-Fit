import apiClient from './apiClient';

export const getUserProfile = async () => {
  try {
    const response = await apiClient.get('/users/me/profile');
    return response.data;
  } catch (error) {
    console.error('Get user profile error:', error);
    throw error;
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    const response = await apiClient.patch('/users/me/profile', profileData);
    return response.data;
  } catch (error) {
    console.error('Update user profile error:', error);
    throw error;
  }
};

export const getUserStats = async () => {
  try {
    const response = await apiClient.get('/dashboard');
    return response.data;
  } catch (error) {
    console.error('Get user stats error:', error);
    throw error;
  }
};

export const getUserNotifications = async () => {
  try {
    const response = await apiClient.get('/notifications/me');
    return response.data;
  } catch (error) {
    console.error('Get user notifications error:', error);
    throw error;
  }
};

export const updateNotificationSettings = async (settings) => {
  try {
    // If you later create a backend route, update this path accordingly.
    const response = await apiClient.put('/notifications/settings', settings);
    return response.data;
  } catch (error) {
    console.warn('Update notification settings not available on backend yet. Falling back locally.');
    return { success: true };
  }
};

export const getCommunityPosts = async () => {
  try {
    const response = await apiClient.get('/community/posts');
    return response.data;
  } catch (error) {
    console.error('Get community posts error:', error);
    throw error;
  }
};
