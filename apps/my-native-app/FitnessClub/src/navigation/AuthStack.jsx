// src/navigation/AuthStack.jsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/Welcomepage';
import OpenPage from '../screens/OpenPage';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import RoleSelection from '../screens/RoleSelection';

const Stack = createNativeStackNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="OpenPage" component={OpenPage} />
    <Stack.Screen name="LogIn" component={LoginScreen} />
    <Stack.Screen name="SignIn" component={SignupScreen} />
    <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
    <Stack.Screen name="RoleSelection" component={RoleSelection} />
    {/* Add other pre-login screens here */}
  </Stack.Navigator>
);

export default AuthStack;