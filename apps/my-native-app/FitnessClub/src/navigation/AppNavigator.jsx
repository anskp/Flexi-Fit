import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/authContext';
import AuthStack from '../navigation/AuthStack';
import AppStack from '../navigation/AppStack';
import RoleSelection from '../screens/RoleSelection';
import MemberProfile from '../screens/MemberProfile';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated, loading, userProfile } = useAuth();

  console.log('AppNavigator: Current state', { 
    isAuthenticated, 
    loading, 
    hasUserProfile: !!userProfile,
    userRole: userProfile?.role,
    hasMemberProfile: !!userProfile?.memberProfile
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

  console.log('AppNavigator: Rendering navigation stack');

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthStack} />
        ) : !userProfile?.role ? (
          <Stack.Screen name="RoleSelection" component={RoleSelection} />
        ) : userProfile?.role === 'MEMBER' && !userProfile?.memberProfile ? (
          <Stack.Screen name="MemberProfile" component={MemberProfile} />
        ) : (
          <Stack.Screen name="MainApp" component={AppStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;