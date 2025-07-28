import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LogIn = () => {
  const [email, setEmail] = useState('abhishekhvk123@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#d32f2f" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Hello</Text>
        <Text style={styles.headerText}>Sign in!</Text>
      </View>

      {/* Form Container */}
      <View style={styles.formContainer}>
        {/* Gmail Section */}
        <View style={styles.section}>
          <Text style={styles.label}>Gmail</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <View style={styles.checkmark}>
              <Text style={styles.checkmarkText}>✓</Text>
            </View>
          </View>
        </View>

        {/* Password Section */}
        <View style={styles.section}>
          <Text style={styles.passwordLabel}>password</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholder="••••••••"
              placeholderTextColor="#999"
            />
            <TouchableOpacity 
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text style={styles.eyeIconText}>👁</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Forgot Password */}
        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>forgot password?</Text>
        </TouchableOpacity>

        {/* Sign In Button */}
        <TouchableOpacity style={styles.signInButton}
        onPress={() => {navigation.navigate('RoleSelection')}}>
          <Text style={styles.signInButtonText}>SIGN IN</Text>
        </TouchableOpacity>

        {/* Sign Up Link */}
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Don't have account?</Text>
          <TouchableOpacity
            onPress={() => {navigation.navigate('SignIn')}}>
            <Text style={styles.signUpLink}>sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#d32f2f',
    paddingHorizontal: 30,
    paddingVertical: 40,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    position: 'relative',
  },
  headerText: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 38,
    fontFamily: 'System',
    letterSpacing: 0.5,
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 30,
    paddingTop: 40,
  },
  section: {
    marginBottom: 30,
  },
  label: {
    color: '#d32f2f',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    fontFamily: 'System',
    letterSpacing: 0.3,
  },
  passwordLabel: {
    color: '#d32f2f',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    fontFamily: 'System',
    letterSpacing: 0.3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 5,
    fontFamily: 'System',
    fontWeight: '400',
  },
  checkmark: {
    width: 24,
    height: 24,
    backgroundColor: '#4caf50',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'System',
  },
  eyeIcon: {
    padding: 5,
  },
  eyeIconText: {
    fontSize: 18,
    color: '#666',
    fontFamily: 'System',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 40,
    marginTop: 10,
  },
  forgotPasswordText: {
    color: '#333',
    fontSize: 14,
    fontFamily: 'System',
    fontWeight: '400',
  },
  signInButton: {
    backgroundColor: '#d32f2f',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  signInButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
    fontFamily: 'System',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    color: '#999',
    fontSize: 14,
    marginRight: 5,
    fontFamily: 'System',
    fontWeight: '400',
  },
  signUpLink: {
    color: '#d32f2f',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'System',
  },
});

export default LogIn;


