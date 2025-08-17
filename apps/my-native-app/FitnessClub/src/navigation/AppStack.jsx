// src/navigation/AppStack.jsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';
// Import other post-login, non-tab screens here
import DietLog from '../screens/Member/DietLog';
import MemberProfile from '../screens/MemberProfile';
import SignupScreen from '../screens/SignupScreen';
import LoginScreen from '../screens/LoginScreen';

const Stack = createNativeStackNavigator();

const AppStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
    {/* Add other screens that are part of the main app but not in the tab bar */}
    <Stack.Screen name="DietLog" component={DietLog} />
    <Stack.Screen name="MemberProfile" component={MemberProfile} />
    <Stack.Screen name="SignupScreen" component={SignupScreen} />
    <Stack.Screen name="LoginScreen" component={LoginScreen} />
  </Stack.Navigator>
);

export default AppStack;