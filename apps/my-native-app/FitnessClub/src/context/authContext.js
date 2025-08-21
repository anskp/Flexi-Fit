// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth0 } from 'react-native-auth0';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const AuthContext = createContext();

// Platform-specific redirect URI
const getRedirectUri = () => {
  if (Platform.OS === 'ios') {
    return 'com.fitnessclub.auth0://dev-1de0bowjvfbbcx7q.us.auth0.com/ios/com.fitnessclub/callback';
  } else {
    return 'com.fitnessclub.auth0://dev-1de0bowjvfbbcx7q.us.auth0.com/android/com.fitnessclub/callback';
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
          setIsAuthenticated(true);
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
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      setToken(null);
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
        audience: 'https://dev-1de0bowjvfbbcx7q.us.auth0.com/api/v2/',
        prompt: 'login',
        redirectUri: redirectUri
      });
      
      console.log('AuthContext: Login successful, credentials:', credentials ? 'Received' : 'None');
      
      if (credentials && credentials.accessToken) {
        console.log('AuthContext: Setting token and authenticated state');
        setToken(credentials.accessToken);
        setIsAuthenticated(true);
        
        // Store user role if available
        if (credentials.user && credentials.user.role) {
          await AsyncStorage.setItem('userRole', credentials.user.role);
        }
        
        // Store user info
        if (credentials.user) {
          await AsyncStorage.setItem('userInfo', JSON.stringify(credentials.user));
        }
      }
    } catch (e) {
      console.error("AuthContext: Login error:", e);
      setAuthError(e);
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
      setAuthError(null);
      
      // Clear stored user data
      await AsyncStorage.removeItem('userRole');
      await AsyncStorage.removeItem('userInfo');
      
      console.log('AuthContext: Logout successful');
    } catch (e) {
      console.error("AuthContext: Logout error:", e);
      setAuthError(e);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
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
    isAuthenticated, 
    userRole: user?.role 
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