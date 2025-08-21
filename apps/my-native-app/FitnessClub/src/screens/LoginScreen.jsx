// src/screens/LoginScreen.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useAuth } from '../context/authContext';
import { testAuth0Configuration, testAuth0Login, clearAuth0Credentials } from '../utils/auth0Test';

const LoginScreen = () => {
  const { login, loading, error, isAuthenticated, user } = useAuth();
  const [loginError, setLoginError] = useState(null);
  const [debugInfo, setDebugInfo] = useState({});
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    // Update debug info
    setDebugInfo({
      isAuthenticated,
      hasUser: !!user,
      userEmail: user?.email,
      userRole: user?.role,
      timestamp: new Date().toISOString()
    });
  }, [isAuthenticated, user]);

  const handleLogin = async () => {
    try {
      console.log('LoginScreen: Starting login...');
      setLoginError(null);
      await login();
      console.log('LoginScreen: Login completed successfully');
    } catch (err) {
      console.error('LoginScreen: Login failed:', err);
      const errorMessage = err.message || 'Login failed. Please try again.';
      setLoginError(errorMessage);
      Alert.alert('Login Error', errorMessage);
    }
  };

  const handleTestAuth0Config = async () => {
    try {
      setTesting(true);
      const result = await testAuth0Configuration();
      Alert.alert(
        'Auth0 Configuration Test',
        result.success ? 'Configuration is valid!' : `Error: ${result.error}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Test Error', error.message);
    } finally {
      setTesting(false);
    }
  };

  const handleTestAuth0Login = async () => {
    try {
      setTesting(true);
      const result = await testAuth0Login();
      Alert.alert(
        'Auth0 Login Test',
        result.success ? 'Login test successful!' : `Error: ${result.error}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Test Error', error.message);
    } finally {
      setTesting(false);
    }
  };

  const handleClearCredentials = async () => {
    try {
      setTesting(true);
      const result = await clearAuth0Credentials();
      Alert.alert(
        'Clear Credentials',
        result.success ? 'Credentials cleared!' : `Error: ${result.error}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Clear Error', error.message);
    } finally {
      setTesting(false);
    }
  };

  const showDebugInfo = () => {
    Alert.alert(
      'Debug Information',
      `Auth State: ${JSON.stringify(debugInfo, null, 2)}`,
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Welcome to FitnessClub</Text>
        </View>
        
        <View style={styles.formContainer}>
          <Text style={styles.subtitleText}>Sign in to continue</Text>
          
          <TouchableOpacity 
            style={styles.signInButton} 
            onPress={handleLogin} 
            disabled={loading || testing}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.signInButtonText}>CONTINUE</Text>
            )}
          </TouchableOpacity>
          
          {(error || loginError) && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>
                Error: {loginError || error?.message || 'Unknown error occurred'}
              </Text>
            </View>
          )}
          
          {/* Debug and Test Buttons */}
          <View style={styles.debugContainer}>
            <TouchableOpacity 
              style={styles.debugButton} 
              onPress={showDebugInfo}
              disabled={testing}
            >
              <Text style={styles.debugButtonText}>Debug Info</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.testButton} 
              onPress={handleTestAuth0Config}
              disabled={testing}
            >
              <Text style={styles.testButtonText}>
                {testing ? 'Testing...' : 'Test Auth0 Config'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.testButton} 
              onPress={handleTestAuth0Login}
              disabled={testing}
            >
              <Text style={styles.testButtonText}>
                {testing ? 'Testing...' : 'Test Auth0 Login'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.clearButton} 
              onPress={handleClearCredentials}
              disabled={testing}
            >
              <Text style={styles.clearButtonText}>
                {testing ? 'Clearing...' : 'Clear Credentials'}
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>
              Status: {loading ? 'Loading...' : isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
            </Text>
            {user && (
              <Text style={styles.userText}>
                User: {user.email || user.name || 'Unknown'}
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({ 
  container: { 
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  scrollContainer: {
    flexGrow: 1
  },
  header: { 
    backgroundColor: '#d32f2f', 
    padding: 60 
  }, 
  headerText: { 
    color: '#ffffff', 
    fontSize: 32, 
    fontWeight: 'bold', 
    textAlign: 'center' 
  },
  subtitleText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30
  },
  formContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 30 
  }, 
  signInButton: { 
    backgroundColor: '#d32f2f', 
    padding: 15, 
    borderRadius: 25, 
    alignItems: 'center',
    marginBottom: 20
  }, 
  signInButtonText: { 
    color: '#ffffff', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  errorContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#ffebee',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f44336'
  },
  errorText: { 
    color: '#d32f2f', 
    textAlign: 'center',
    fontSize: 14
  },
  debugContainer: {
    marginTop: 20,
    gap: 10
  },
  debugButton: {
    padding: 10,
    backgroundColor: '#2196f3',
    borderRadius: 8,
    alignItems: 'center'
  },
  debugButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold'
  },
  testButton: {
    padding: 10,
    backgroundColor: '#ff9800',
    borderRadius: 8,
    alignItems: 'center'
  },
  testButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold'
  },
  clearButton: {
    padding: 10,
    backgroundColor: '#f44336',
    borderRadius: 8,
    alignItems: 'center'
  },
  clearButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold'
  },
  statusContainer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#e8f5e8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4caf50'
  },
  statusText: {
    color: '#2e7d32',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  userText: {
    color: '#2e7d32',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5
  }
});

export default LoginScreen;
