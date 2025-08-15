import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';


const TrainerProfile = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Profile Setup</Text>
      
      <Text style={styles.label}>Full Name</Text>
      <TextInput style={styles.input} placeholder="Enter your name" />

      <Text style={styles.label}>Gym/Business Name</Text>
      <TextInput style={styles.input} placeholder="Enter gym or business name" />

      <Text style={styles.label}>Contact Details</Text>
      <TextInput style={styles.input} placeholder="Email or phone number" keyboardType="email-address" />

      <Text style={styles.label}>Verification</Text>
      <TextInput style={styles.input} placeholder="Enter verification code" />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Verify & Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF', // Massive white background[1][10]
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#d32f2f', // Deep blue for accent[10]
    marginBottom: 32,
    alignSelf: 'center',
    fontFamily: 'System',
    letterSpacing: 0.5,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    marginTop: 16,
    fontFamily: 'System',
    fontWeight: '600',
    letterSpacing: 0.3,
    color: '#333',
  },
  input: {
    backgroundColor: '#F3F4F6', // Light gray for input backgrounds
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontFamily: 'System',
    fontWeight: '400',
  },

button: {
  backgroundColor: '#d32f2f',
  borderRadius: 50,
  paddingVertical: 10,
  paddingHorizontal: 22, // Adjust as needed
  marginTop: 25,
  alignItems: 'center',
  alignSelf: 'center', // Center the button horizontally
},

  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'System',
    letterSpacing: 0.5,
  },
});

export default TrainerProfile;
