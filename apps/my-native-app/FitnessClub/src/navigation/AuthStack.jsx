// src/navigation/AuthStack.jsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RoleSelection from '../screens/RoleSelection';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import MemberProfile from '../screens/MemberProfile';
import BottomTabNavigator from './BottomTabNavigator';

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
    <Stack.Screen 
      name="SignupScreen" 
      component={SignupScreen}
      options={{
        title: 'Sign Up',
        gestureEnabled: true
      }}
    />
    <Stack.Screen 
      name="RoleSelection" 
      component={RoleSelection}
      options={{
        title: 'Select Role'
      }}
    />
    <Stack.Screen 
      name="MemberProfile" 
      component={MemberProfile}
      options={{
        title: 'Member Profile'
      }}
    />

     <Stack.Screen 
      name="MainTabs" 
      component={BottomTabNavigator}
      options={{
        title: 'MainTabs'
      }}
    />
  </Stack.Navigator>
);

export default AuthStack;