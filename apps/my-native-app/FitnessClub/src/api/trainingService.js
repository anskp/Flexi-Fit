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
    
    // Transform the data to match backend expectations
    const transformedData = {
      date: workoutData.date,
      exercises: workoutData.exercises.map(exercise => ({
        exerciseId: exercise.exerciseId || null,
        name: exercise.name,
        sets: parseInt(exercise.sets) || 0,
        reps: exercise.reps || '',
        weight: exercise.weight || '',
        notes: exercise.notes || '',
      })),
    };

    console.log('[TrainingService] Transformed data:', transformedData);
    
    const response = await apiClient.post('/workouts/sessions', transformedData);
    
    console.log('[TrainingService] Raw response:', response.data);
    
    return {
      success: true,
      message: 'Workout saved successfully!',
      data: response.data.data || response.data,
    };
  } catch (error) {
    console.error('[TrainingService] Error saving workout entry:', error);
    const errorMessage = parseApiError(error);
    return {
      success: false,
      message: errorMessage,
      data: null,
    };
  }
};

/**
 * @description Fetches workout history with pagination.
 * @param {object} pagination - Pagination parameters { page, limit }.
 * @returns {Promise<{success: boolean, message: string, data: object|null}>} A structured response.
 */
export const getWorkoutHistory = async (pagination = { page: 1, limit: 10 }) => {
  try {
    console.log('[TrainingService] Fetching workout history:', pagination);
    
    const response = await apiClient.get('/workouts/sessions', { params: pagination });
    
    console.log('[TrainingService] Raw response:', response.data);
    
    return {
      success: true,
      message: 'Workout history fetched successfully.',
      data: response.data.data || response.data,
      pagination: response.data.pagination,
    };
  } catch (error) {
    console.error('[TrainingService] Error fetching workout history:', error);
    const errorMessage = parseApiError(error);
    return {
      success: false,
      message: errorMessage,
      data: null,
    };
  }
};

/**
 * @description Fetches a specific workout session by ID.
 * @param {string} sessionId - The ID of the workout session.
 * @returns {Promise<{success: boolean, message: string, data: object|null}>} A structured response.
 */
export const getWorkoutSessionById = async (sessionId) => {
  try {
    console.log('[TrainingService] Fetching workout session:', sessionId);
    
    const response = await apiClient.get(`/workouts/sessions/${sessionId}`);
    
    console.log('[TrainingService] Raw response:', response.data);
    
    return {
      success: true,
      message: 'Workout session fetched successfully.',
      data: response.data.data || response.data,
    };
  } catch (error) {
    console.error('[TrainingService] Error fetching workout session:', error);
    const errorMessage = parseApiError(error);
    return {
      success: false,
      message: errorMessage,
      data: null,
    };
  }
};

/**
 * @description Fetches the exercise library.
 * @returns {Promise<{success: boolean, message: string, data: object|null}>} A structured response.
 */
export const getExerciseLibrary = async () => {
  try {
    console.log('[TrainingService] Fetching exercise library');
    
    const response = await apiClient.get('/workouts/library');
    
    console.log('[TrainingService] Raw response:', response.data);
    
    return {
      success: true,
      message: 'Exercise library fetched successfully.',
      data: response.data.data || response.data,
    };
  } catch (error) {
    console.error('[TrainingService] Error fetching exercise library:', error);
    const errorMessage = parseApiError(error);
    return {
      success: false,
      message: errorMessage,
      data: null,
    };
  }
};

/**
 * @description Deletes a workout session.
 * @param {string} sessionId - The ID of the workout session to delete.
 * @returns {Promise<{success: boolean, message: string, data: object|null}>} A structured response.
 */
export const deleteWorkoutSession = async (sessionId) => {
  try {
    console.log('[TrainingService] Deleting workout session:', sessionId);
    
    await apiClient.delete(`/workouts/sessions/${sessionId}`);
    
    return {
      success: true,
      message: 'Workout session deleted successfully!',
      data: null,
    };
  } catch (error) {
    console.error('[TrainingService] Error deleting workout session:', error);
    const errorMessage = parseApiError(error);
    return {
      success: false,
      message: errorMessage,
      data: null,
    };
  }
};