import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/authContext';
import AuthStack from '../navigation/AuthStack';
import AppStack from '../navigation/AppStack';
import { View, ActivityIndicator } from 'react-native';

const AppNavigator = () => {
  const { isAuthenticated, loading } = useAuth();

  // Show a loading spinner while the context checks for a token
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;