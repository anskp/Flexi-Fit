// src/navigation/AuthStack.jsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';

const Stack = createNativeStackNavigator();

const AuthStack = () => (
  <Stack.Navigator 
    screenOptions={{ 
      headerShown: false,
      gestureEnabled: true,
      animation: 'slide_from_right'
    }}
    initialRouteName="LoginScreen"
  >
    <Stack.Screen 
      name="LoginScreen" 
      component={LoginScreen}
      options={{
        title: 'Login'
      }}
    />
  </Stack.Navigator>
);

export default AuthStack;