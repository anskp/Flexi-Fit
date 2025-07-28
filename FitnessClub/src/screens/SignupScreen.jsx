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
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const SignIn = () => {
  const [gmail, setGmail] = useState('abhishekhvk123@gmail.com');
  const [phoneOrEmail, setPhoneOrEmail] = useState('Abhishekhvk123@gmail.com');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigation = useNavigation();

  const handleSignIn = () => {
    if (!password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    Alert.alert('Success', 'Account created successfully!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#C53030" />

      {/* Header with gradient background */}
      <LinearGradient
        colors={['#E53E3E', '#C53030']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Create your{'\n'}Account</Text>
      </LinearGradient>

      {/* Form Container */}
      <View style={styles.formContainer}>
        {/* Gmail Field */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Gmail</Text>
          <TextInput
            style={styles.input}
            value={gmail}
            onChangeText={setGmail}
            placeholder="Enter your Gmail"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Phone or Email Field */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone or email</Text>
          <TextInput
            style={styles.input}
            value={phoneOrEmail}
            onChangeText={setPhoneOrEmail}
            placeholder="Enter phone or email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password Field */}
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
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text style={styles.eyeIconText}>👁</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Confirm Password Field */}
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
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Text style={styles.eyeIconText}>👁</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sign In Button */}
        <TouchableOpacity
          style={styles.signInButton}
          onPress={() => {
            navigation.navigate('RoleSelection');
          }}
        >
          <LinearGradient
            colors={['#E53E3E', '#C53030']}
            style={styles.signInGradient}
          >
            <Text style={styles.signInButtonText}>SIGN IN</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Already have Account */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Already have Account? </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('LogIn');
            }}
          >
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
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    lineHeight: 40,
    fontFamily: 'System',
    letterSpacing: 0.5,
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

export default SignIn;
