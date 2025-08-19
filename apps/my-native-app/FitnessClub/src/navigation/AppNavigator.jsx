import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/authContext';
import AuthStack from '../navigation/AuthStack';
import AppStack from '../navigation/AppStack';
import { View, ActivityIndicator } from 'react-native';

const AppNavigator = () => {
  const { isAuthenticated, loading, token, user } = useAuth();
  const [shouldRenderAppStack, setShouldRenderAppStack] = useState(false);

  // Monitor authentication state changes
  useEffect(() => {
    console.log('AppNavigator: Authentication state changed', { 
      isAuthenticated, 
      loading, 
      hasToken: !!token, 
      hasUser: !!user,
      userRole: user?.role 
    });

    // Add a small delay to ensure state is stable before switching
    if (isAuthenticated && !loading) {
      const timer = setTimeout(() => {
        console.log('AppNavigator: Setting shouldRenderAppStack to true');
        setShouldRenderAppStack(true);
      }, 50);
      return () => clearTimeout(timer);
    } else if (!isAuthenticated) {
      setShouldRenderAppStack(false);
    }
  }, [isAuthenticated, loading, token, user]);

  console.log('AppNavigator: Current state', { 
    isAuthenticated, 
    loading, 
    hasToken: !!token, 
    hasUser: !!user,
    userRole: user?.role,
    shouldRenderAppStack
  });

  // Show a loading spinner while the context checks for a token
  if (loading) {
    console.log('AppNavigator: Loading state, showing spinner');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  console.log('AppNavigator: Rendering', shouldRenderAppStack ? 'AppStack' : 'AuthStack');

  return (
    <NavigationContainer>
      {shouldRenderAppStack ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;