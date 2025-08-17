// src/screens/SignupScreen.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/authContext';
import parseApiError from '../utils/parseApiError';
import * as authService from '../api/authService';
 // Assuming you create this util

const SignupScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  const { signup, selectRole } = useAuth(); // We'll use the signup and selectRole functions from context

   const handleSignup = async () => {
     if (password !== confirmPassword) {
       Alert.alert('Password Mismatch', 'Passwords do not match. Please try again.');
       return;
     }
     
     if (!email || !password) {
       Alert.alert('Incomplete Form', 'Please fill in all fields.');
       return;
     }
     
     setLoading(true);
     try {
       // Step 1: Create the user account using the context signup function
       const signupResponse = await signup(email, password);
       
       if (signupResponse.success) {
         // Step 2: Automatically assign the 'MEMBER' role
         const roleResponse = await selectRole('MEMBER');
         
         if (roleResponse.success) {
           // Step 3: Navigate to the member profile setup
           navigation.navigate('MemberProfile'); 
         } else {
             throw new Error(roleResponse.message || 'Failed to assign role');
         }
       } else {
           throw new Error(signupResponse.message || 'Signup failed');
       }
     } catch (err) {
       Alert.alert('Signup Failed', parseApiError(err));
     } finally {
       setLoading(false);
     }
   };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#C53030" />

      <LinearGradient colors={['#E53E3E', '#C53030']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create your{'\n'}Account</Text>
        </View>
      </LinearGradient>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter password"
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
              <Text style={styles.eyeIconText}>👁</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirm password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm password"
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Text style={styles.eyeIconText}>👁</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.signInButton} onPress={handleSignup} disabled={loading}>
          <LinearGradient colors={['#E53E3E', '#C53030']} style={styles.signInGradient}>
            {loading ? (
                <ActivityIndicator color="#ffffff" />
            ) : (
                <Text style={styles.signInButtonText}>SIGN UP</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
            <Text style={styles.signInLinkText}>sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 20,
    padding: 10,
  },
  backButtonText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    lineHeight: 40,
    fontFamily: 'System',
    letterSpacing: 0.5,
    flex: 1,
  },
  formContainer: {
    borderTopLeftRadius: 32,      // Rounded top left
    borderTopRightRadius: 32,     // Rounded top right
    backgroundColor: '#FFF',      // White background for card effect
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    marginTop: -24,               // Overlap header for stand effect
    // Remove borderBottomLeftRadius and borderBottomRightRadius
    // for sharp bottom corners
    shadowColor: "#000",          // Optional: for shadow effect
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,                 // For Android shadow
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: '#E53E3E',
    fontWeight: '600',
    marginBottom: 8,
    fontFamily: 'System',
    letterSpacing: 0.3,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingVertical: 12,
    paddingHorizontal: 0,
    fontSize: 16,
    color: '#4A5568',
    fontFamily: 'System',
    fontWeight: '400',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 0,
    fontSize: 16,
    color: '#4A5568',
    fontFamily: 'System',
    fontWeight: '400',
  },
  eyeIcon: {
    padding: 8,
  },
  eyeIconText: {
    fontSize: 18,
    fontFamily: 'System',
  },
  signInButton: {
    marginTop: 32,
    borderRadius: 25,
    overflow: 'hidden',
  },
  signInGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
    fontFamily: 'System',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#A0AEC0',
    fontSize: 14,
    fontFamily: 'System',
    fontWeight: '400',
  },
  signInLinkText: {
    color: '#E53E3E',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'System',
  },
});

export default SignupScreen;
