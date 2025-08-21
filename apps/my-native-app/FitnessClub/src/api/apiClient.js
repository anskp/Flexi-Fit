// src/api/apiClient.js
import axios from 'axios';
import Auth0 from 'react-native-auth0';

const auth0 = new Auth0({
  domain: "dev-1de0bowjvfbbcx7q.us.auth0.com",
  clientId: "rwah022fY6bSPr5gstiKqPAErQjgynT2"
});

const apiClient = axios.create({
  baseURL: 'http://192.168.31.86:5000/api', // Make sure this IP is correct
  timeout: 15000, // Increased timeout to 15 seconds
  headers: { 'Content-Type': 'application/json' }
});

// REPLACE the old request interceptor with this new one
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const credentials = await auth0.credentialsManager.getCredentials();
      const token = credentials?.accessToken;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    } catch (error) {
      console.error('[API] Interceptor error: Could not get credentials.', error);
      return config;
    }
  },
  (error) => {
    console.error('[API] Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(`[API] Response ${response.status} from ${response.config.url}`);
    console.log('[API] Response data:', response.data);
    
    // Handle empty responses or 204 No Content
    if (response.status === 204 || !response.data) {
      console.log('[API] Empty response received, treating as success');
      return {
        ...response,
        data: { success: true, data: [], message: 'No data found' }
      };
    }
    
    // Handle responses that might be strings or other formats
    if (typeof response.data === 'string') {
      console.log('[API] String response received, treating as success');
      return {
        ...response,
        data: { success: true, data: [], message: response.data || 'No data found' }
      };
    }
    
    return response;
  },
  (error) => {
    console.error('[API] Response error details:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data,
      headers: error.response?.headers
    });
    
    // Handle specific error types
    if (error.code === 'ECONNABORTED') {
      console.error('[API] Request timeout');
      error.message = 'Request timeout - please try again';
    } else if (!error.response) {
      console.error('[API] Network error - no response received');
      error.message = 'Network error - please check your connection';
    } else if (error.response.status === 404) {
      console.error('[API] Not found - treating as success with no data');
      // Return a success response instead of error for 404
      return Promise.resolve({
        data: { success: true, data: [], message: 'No gyms found in your area' }
      });
    } else if (error.response.status >= 500) {
      console.error('[API] Server error');
      error.message = 'Server error - please try again later';
    } else if (error.response.status === 200 && !error.response.data) {
      // Handle successful response with no data
      console.log('[API] Successful response with no data');
      return Promise.resolve({
        data: { success: true, data: [], message: 'No gyms found' }
      });
    } else if (error.response.status === 200) {
      // If we get a 200 status but axios still treats it as error, it might be due to response format
      console.log('[API] 200 status but treated as error, checking response format');
      if (error.response.data) {
        return Promise.resolve({
          data: error.response.data
        });
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;