// src/api/apiClient.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace with your actual backend URL. For Android emulator, use 10.0.2.2.
// For physical device, use your computer's network IP address.
const baseURL = 'http://10.0.2.2:5000/api'; 

const apiClient = axios.create({
  baseURL,
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;