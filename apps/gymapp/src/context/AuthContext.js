// src/context/AuthContext.js
import { createContext, useState, useEffect, useContext } from 'react';
import apiClient from '../api/apiClient';
import * as userService from '../api/userService';
import * as authService from '../api/authService';
import * as gymService from '../api/gymService'; // ✅ Import gymService

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [gymProfile, setGymProfile] = useState(null); // ✅ State for the gym profile
  const [token, setToken] = useState(() => localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          // Verify token by fetching the user's core profile
          const profileResponse = await userService.getMyProfile();
          if (profileResponse.success) {
            const fetchedUser = profileResponse.data;
            setUser(fetchedUser);

            // ✅ If the logged-in user is a Gym Owner, automatically fetch their managed gym profile
            if (fetchedUser.role === 'GYM_OWNER') {
              try {
                const gymResponse = await gymService.getMyGymProfile();
                if (gymResponse.success) {
                  setGymProfile(gymResponse.data);
                }
              } catch (gymError) {
                // This can happen if the owner hasn't created their gym profile yet.
                // It's not a critical error, so we just log it.
                console.warn("Could not fetch gym profile for owner:", gymError);
                setGymProfile(null);
              }
            }
          }
        } catch (error) {
          console.error("Auth initialization failed (token might be invalid). Logging out.", error);
          logout(); // If the main profile fetch fails, the token is bad.
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [token]);

  const setAuthData = (newToken, newUser = null) => {
    setToken(newToken);
    if (newUser) {
      setUser(newUser);
      // If the new user is not a gym owner, clear any old gym profile data
      if (newUser.role !== 'GYM_OWNER') {
          setGymProfile(null);
      }
    }
    localStorage.setItem('authToken', newToken);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  };

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      if (response.success) {
        // After login, the user object is available. The useEffect will handle fetching the gym profile.
        setAuthData(response.data.token, response.data.user);
      }
      return response;
    } catch (error) {
      throw error;
    }
  };
  
  const logout = () => {
    setUser(null);
    setGymProfile(null); // ✅ Clear gym profile on logout
    setToken(null);
    localStorage.removeItem('authToken');
    delete apiClient.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    gymProfile, // ✅ Expose the gym profile to the app
    token,
    setAuthData,
    login,
    logout,
    isAuthenticated: !!token,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};