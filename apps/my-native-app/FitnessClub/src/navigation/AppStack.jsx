// src/navigation/AppStack.jsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';
// Import other post-login, non-tab screens here
import DietLog from '../screens/Member/DietLog';
import Training from '../screens/Member/Training';
import MemberProfile from '../screens/MemberProfile';
import GymDetailsScreen from '../screens/Member/GymDetailsScreen';
import LoginScreen from '../screens/LoginScreen';

const Stack = createNativeStackNavigator();

const AppStack = () => {
  console.log('AppStack: Rendering main app stack');
  
  return (
    <Stack.Navigator 
      screenOptions={{ headerShown: false }}
      initialRouteName="MainTabs"
    >
      <Stack.Screen 
        name="MainTabs" 
        component={BottomTabNavigator}
        options={{ title: 'Main App' }}
      />
      {/* Add other screens that are part of the main app but not in the tab bar */}
      <Stack.Screen name="DietLog" component={DietLog} />
      <Stack.Screen name="Training" component={Training} />
      <Stack.Screen name="MemberProfile" component={MemberProfile} />
      <Stack.Screen name="GymDetails" component={GymDetailsScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
    </Stack.Navigator>
  );
};

export default AppStack;