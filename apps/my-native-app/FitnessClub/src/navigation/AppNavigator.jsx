import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/authContext';
import AuthStack from '../navigation/AuthStack';
import AppStack from '../navigation/AppStack';
import { View, ActivityIndicator } from 'react-native';

const AppNavigator = () => {
  const { isAuthenticated, loading, user } = useAuth();

  console.log('AppNavigator: Current state', { 
    isAuthenticated, 
    loading, 
    hasUser: !!user,
    userRole: user?.role
  });

  // Show a loading spinner while checking authentication
  if (loading) {
    console.log('AppNavigator: Loading state, showing spinner');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  console.log('AppNavigator: Rendering', isAuthenticated ? 'AppStack' : 'AuthStack');

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;