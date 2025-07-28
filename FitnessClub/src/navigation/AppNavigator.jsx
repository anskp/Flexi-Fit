import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import LoginScreen from '../screens/LoginScreen';
// import SignupScreen from '../screens/SignupScreen';
import WelcomeScreen from '../screens/Welcomepage';
import OpenPage from '../screens/OpenPage';
import LogIn from '../screens/LoginScreen';
import SignIn from '../screens/SignupScreen';
import RoleSelection from '../screens/RoleSelection';
import MemberProfile from '../screens/MemberProfile';
import TrainerProfile from '../screens/TrainerProfile';
import MemberDashboard from '../screens/Member/MemberDashboard';

import MyGym from '../screens/Member/Mygym';
import WorkoutLog from '../screens/Member/WorkoutLog';
import Location from '../screens/Member/Location';
import DietLog from '../screens/Member/DietLog';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Location">

        <Stack.Screen name="OpenPage" component={OpenPage}
        options={{ headerShown: false }}  />

        <Stack.Screen name="LogIn" component={LogIn}
        options={{ headerShown: false }}  />

        <Stack.Screen name="SignIn" component={SignIn} 
        options={{ headerShown: false }} />

        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen}  
         options={{ headerShown: false }} />

         <Stack.Screen name="RoleSelection" component={RoleSelection}  
         options={{ headerShown: false }} />

           <Stack.Screen name="MemberProfile" component={MemberProfile}  
         options={{ headerShown: false }} />

            <Stack.Screen name="TrainerProfile" component={TrainerProfile}  
         options={{ headerShown: false }} />

            <Stack.Screen name="MemberDashboard" component={MemberDashboard}  
         options={{ headerShown: false }} />

           <Stack.Screen name="MyGym" component={MyGym}  
         options={{ headerShown: false }} />

         
           <Stack.Screen name="WorkoutLog" component={WorkoutLog}  
         options={{ headerShown: false }} />

             <Stack.Screen name="Location" component={Location}  
         options={{ headerShown: false }} />

         
             <Stack.Screen name="DietLog" component={DietLog}  
         options={{ headerShown: false }} />


      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
