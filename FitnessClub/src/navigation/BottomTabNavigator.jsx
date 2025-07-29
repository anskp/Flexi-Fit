import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// Import screens
import Location from '../screens/Member/Location';
import Activity from '../screens/Member/Activity';
import Camera from '../screens/Member/Camera';
import Store from '../screens/Member/Store';
import Profile from '../screens/Member/Profile';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
                   screenOptions={({ route }) => ({
               tabBarIcon: ({ focused, color, size }) => {
                 let iconName;
       
                 if (route.name === 'Location') {
                   iconName = focused ? 'location' : 'location-outline';
                 } else if (route.name === 'Activity') {
                   iconName = focused ? 'fitness' : 'fitness-outline';
                 } else if (route.name === 'Camera') {
                   iconName = focused ? 'camera' : 'camera-outline';
                 } else if (route.name === 'Store') {
                   iconName = focused ? 'bag' : 'bag-outline';
                 } else if (route.name === 'Profile') {
                   iconName = focused ? 'person' : 'person-outline';
                 }
       
                 return <Icon name={iconName} size={size} color={color} />;
               },
        tabBarActiveTintColor: '#e74c3c',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Location" 
        component={Location}
        options={{
          title: 'Location',
        }}
      />
      <Tab.Screen 
        name="Activity" 
        component={Activity}
        options={{
          title: 'Activity',
        }}
      />
      <Tab.Screen 
        name="Camera" 
        component={Camera}
        options={{
          title: 'Camera',
        }}
      />
      <Tab.Screen 
        name="Store" 
        component={Store}
        options={{
          title: 'Store',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={Profile}
        options={{
          title: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator; 