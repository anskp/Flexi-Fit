// src/context/AuthContext.js
import { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../api/apiClient';
import * as authService from '../api/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem('authToken');
      if (storedToken) {
        setToken(storedToken);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        // You can add a call here to verify the token and fetch user data if you want
      }
      setLoading(false);
    };
    loadToken();
  }, []);

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    if (response.data.success) {
      const { token, user } = response.data.data;
      setToken(token);
      setUser(user);
      await AsyncStorage.setItem('authToken', token);
    }
    return response.data;
  };

  const signup = async (email, password) => {
    const response = await authService.signup(email, password);
    if (response.data.success) {
        const { token } = response.data.data;
        setToken(token);
        await AsyncStorage.setItem('authToken', token);
    }
    return response.data;
  }

  const logout = async () => {
    setToken(null);
    setUser(null);
    await AsyncStorage.removeItem('authToken');
    delete apiClient.defaults.headers.common['Authorization'];
  };
const reloadUser = async () => {
        try {
            console.log("Context: Reloading user data...");
            const response = await userService.getMyProfile();
            if (response.success) {
                console.log("Context: User data reloaded.", response.data);
                setUser(response.data);
            }
        } catch (error) {
            console.error("Failed to reload user", error);
        }
    };
  const value = { user, token, loading, isAuthenticated: !!token, login, signup, logout, reloadUser };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};