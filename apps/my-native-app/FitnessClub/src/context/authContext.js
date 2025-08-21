// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth0 } from 'react-native-auth0';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import apiClient from '../api/apiClient.js';

const AuthContext = createContext();

// Platform-specific redirect URI
const getRedirectUri = () => {
  if (Platform.OS === 'ios') {
    return 'com.fitnessclub://callback';
  } else {
    return 'com.fitnessclub://callback';
  }
};

export const AuthProvider = ({ children }) => {
  const { 
    authorize, 
    clearSession, 
    user, 
    error, 
    getCredentials,
    isLoading 
  } = useAuth0();

  const [token, setToken] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Check for existing credentials on app start
  useEffect(() => {
    const checkExistingAuth = async () => {
      try {
        console.log('AuthContext: Checking for existing credentials...');
        const credentials = await getCredentials();
        console.log('AuthContext: Credentials check result:', credentials ? 'Found' : 'Not found');
        
        if (credentials && credentials.accessToken) {
          console.log('AuthContext: Setting authenticated state with existing token');
          setToken(credentials.accessToken);
          
          // Verify user with backend
          try {
            const response = await apiClient.post('/auth/auth0/verify-user');
            if (response.data.success) {
              console.log('AuthContext: Backend verification successful');
              const backendUser = response.data.data;
              setUserProfile(backendUser);
              setIsAuthenticated(true);
              
              // Store user profile from backend
              await AsyncStorage.setItem('userProfile', JSON.stringify(backendUser));
              
              // Store user role if available
              if (backendUser.role) {
                await AsyncStorage.setItem('userRole', backendUser.role);
              }
            }
          } catch (backendError) {
            console.error('AuthContext: Backend verification failed:', backendError);
            // If backend verification fails, clear the token
            setToken(null);
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.log('AuthContext: No existing credentials found:', error.message);
      } finally {
        setLoading(false);
      }
    };

    checkExistingAuth();
  }, [getCredentials]);

  // Update authentication state when user changes
  useEffect(() => {
    console.log('AuthContext: User state changed:', user ? 'User found' : 'No user');
    if (user) {
      // Don't automatically set authenticated - wait for backend verification
      console.log('AuthContext: Auth0 user found, waiting for backend verification');
    } else {
      setIsAuthenticated(false);
      setToken(null);
      setUserProfile(null);
    }
  }, [user]);

  // Handle Auth0 errors
  useEffect(() => {
    if (error) {
      console.error('AuthContext: Auth0 error:', error);
      setAuthError(error);
    }
  }, [error]);

  const login = async () => {
    try {
      console.log('AuthContext: Starting login process...');
      setLoading(true);
      setAuthError(null);
      
      const redirectUri = getRedirectUri();
      console.log('AuthContext: Using redirect URI:', redirectUri);
      
      const credentials = await authorize({
        scope: 'openid profile email',
        audience: 'https://api.fitnessclub.com',
        prompt: 'login',
        redirectUri: redirectUri
      });
      
      console.log('AuthContext: Auth0 login successful, credentials:', credentials ? 'Received' : 'None');
      
      if (credentials && credentials.accessToken) {
        console.log('AuthContext: Setting Auth0 token');
        setToken(credentials.accessToken);
        
        // Call backend to verify user and get profile
        console.log('AuthContext: Calling backend to verify user...');
        try {
          const response = await apiClient.post('/auth/auth0/verify-user');
          
          if (response.data.success) {
            console.log('AuthContext: Backend verification successful');
            const backendUser = response.data.data;
            setUserProfile(backendUser);
            setIsAuthenticated(true);
            
            // Store user profile from backend
            await AsyncStorage.setItem('userProfile', JSON.stringify(backendUser));
            
            // Store user role if available
            if (backendUser.role) {
              await AsyncStorage.setItem('userRole', backendUser.role);
            }
            
            console.log('AuthContext: User authenticated with backend profile');
          } else {
            console.error('AuthContext: Backend verification failed - no success response');
            throw new Error('Backend verification failed');
          }
        } catch (backendError) {
          console.error('AuthContext: Backend verification error:', backendError);
          setAuthError(backendError);
          setToken(null);
          setIsAuthenticated(false);
          throw backendError;
        }
      }
    } catch (e) {
      console.error("AuthContext: Login error:", e);
      setAuthError(e);
      setToken(null);
      setIsAuthenticated(false);
      setUserProfile(null);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('AuthContext: Starting logout process...');
      setLoading(true);
      await clearSession();
      setToken(null);
      setIsAuthenticated(false);
      setUserProfile(null);
      setAuthError(null);
      
      // Clear stored user data
      await AsyncStorage.removeItem('userRole');
      await AsyncStorage.removeItem('userInfo');
      await AsyncStorage.removeItem('userProfile');
      
      console.log('AuthContext: Logout successful');
    } catch (e) {
      console.error("AuthContext: Logout error:", e);
      setAuthError(e);
    } finally {
      setLoading(false);
    }
  };

  const refreshUserProfile = async () => {
    try {
      console.log('AuthContext: Refreshing user profile...');
      const response = await apiClient.post('/auth/auth0/verify-user');
      if (response.data.success) {
        console.log('AuthContext: User profile refreshed successfully');
        const backendUser = response.data.data;
        setUserProfile(backendUser);
        
        // Store updated user profile
        await AsyncStorage.setItem('userProfile', JSON.stringify(backendUser));
        
        if (backendUser.role) {
          await AsyncStorage.setItem('userRole', backendUser.role);
        }
      }
    } catch (error) {
      console.error('AuthContext: Error refreshing user profile:', error);
    }
  };

  const value = {
    user,
    userProfile, // Add backend user profile to context
    setUserProfile, // Add setter for user profile
    refreshUserProfile, // Add function to refresh user profile
    token,
    loading: loading || isLoading,
    isAuthenticated,
    login,
    logout,
    getCredentials,
    error: authError || error
  };

  console.log('AuthContext: State changed', { 
    hasToken: !!token, 
    hasUser: !!user, 
    hasUserProfile: !!userProfile,
    isAuthenticated, 
    userRole: userProfile?.role 
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};