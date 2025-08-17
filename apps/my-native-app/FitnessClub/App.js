// App.js
import React from 'react';
import 'react-native-gesture-handler';
import { AuthProvider } from '../FitnessClub/src/context/authContext';
import AppNavigator from '../FitnessClub/src/navigation/AppNavigator';

const App = () => {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
};

export default App;