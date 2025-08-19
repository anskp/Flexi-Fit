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

  // Debug authentication state changes only when they actually change
  useEffect(() => {
    console.log('AuthContext: State changed', { 
      hasUser: !!user, 
      hasToken: !!token, 
      isAuthenticated: !!token,
      userRole: user?.role 
    });
  }, [user, token]);

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    if (response.data.success) {
      const { token, user } = response.data.data;
      console.log('AuthContext: Setting token and user after login', { token: !!token, user });
      
      // Set state and storage in the correct order
      setToken(token);
      setUser(user);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      await AsyncStorage.setItem('authToken', token);
      
      console.log('AuthContext: Login completed, isAuthenticated should be true');
    }
    return response.data;
  };

  const signup = async (email, password) => {
    const response = await authService.signup(email, password);
    if (response.data.success) {
        const { token } = response.data.data;
        console.log('AuthContext: Setting token after signup', { token: !!token });
        
        // Set state and storage in the correct order
        setToken(token);
        setUser({ email, role: null });
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        await AsyncStorage.setItem('authToken', token);
        
        console.log('AuthContext: Signup completed, isAuthenticated should be true');
    }
    return response.data;
  }

  const logout = async () => {
    setToken(null);
    setUser(null);
    await AsyncStorage.removeItem('authToken');
    delete apiClient.defaults.headers.common['Authorization'];
  };

  const selectRole = async (role) => {
    const response = await authService.selectRole(role);
    if (response.data.success) {
        const { token, role: userRole } = response.data.data;
        console.log('AuthContext: Setting token and role after role selection', { token: !!token, role: userRole });
        
        // Set state and storage in the correct order
        setToken(token);
        setUser(prevUser => ({ ...prevUser, role: userRole }));
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        await AsyncStorage.setItem('authToken', token);
        
        console.log('AuthContext: Role selection completed, isAuthenticated should be true');
    }
    return response.data;
  };

  const reloadUser = async () => {
        try {
            console.log("Context: Reloading user data...");
            // For now, we'll just set a basic user object
            // You can implement userService.getMyProfile() later
            setUser({ id: 'temp-user', email: 'user@example.com', profileComplete: true });
            // Ensure the token is still set for authentication
            const storedToken = await AsyncStorage.getItem('authToken');
            if (storedToken) {
                setToken(storedToken);
                apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            }
        } catch (error) {
            console.error("Failed to reload user", error);
        }
    };

  const value = { 
    user, 
    token, 
    loading, 
    isAuthenticated: !!token, 
    login, 
    signup, 
    logout, 
    selectRole, 
    reloadUser 
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};