// src/navigation/AuthStack.jsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RoleSelection from '../screens/RoleSelection';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import MemberProfile from '../screens/MemberProfile';

const Stack = createNativeStackNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }} >
    <Stack.Screen name="LoginScreen" component={LoginScreen} />
    <Stack.Screen name="SignupScreen" component={SignupScreen} />
    <Stack.Screen name="RoleSelection" component={RoleSelection} />
    <Stack.Screen name="MemberProfile" component={MemberProfile} />
    {/* Add other pre-login screens here */}
  </Stack.Navigator>
);

export default AuthStack;