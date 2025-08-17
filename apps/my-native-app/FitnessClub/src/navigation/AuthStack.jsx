// src/navigation/AuthStack.jsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/Welcomepage';


import RoleSelection from '../screens/RoleSelection';

import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';

const Stack = createNativeStackNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}  initialRouteName="OpenPage">
    
    <Stack.Screen name="LoginScreen" component={LoginScreen} />
    
    <Stack.Screen name="SignupScreen" component={SignupScreen} />
    <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
    <Stack.Screen name="RoleSelection" component={RoleSelection} />
    {/* Add other pre-login screens here */}
  </Stack.Navigator>
);

export default AuthStack;