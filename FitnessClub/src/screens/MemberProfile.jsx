// src/screens/Member/MemberProfile.jsx
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../../context/AuthContext';
import * as authService from '../../api/authService';
import parseApiError from '../../utils/parseApiError';

const MemberProfile = () => {
  const { reloadUser } = useAuth(); // We'll use this to trigger the switch to the main app
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '', // Default to empty
    weight: '',
    height: '',
    healthConditions: '',
    fitnessGoal: '',
  });

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.name || !formData.age || !formData.gender || !formData.weight || !formData.height || !formData.fitnessGoal) {
        Alert.alert('Incomplete Form', 'Please fill out all fields to continue.');
        return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        age: parseInt(formData.age, 10),
        gender: formData.gender,
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height),
        healthConditions: formData.healthConditions,
        fitnessGoal: formData.fitnessGoal,
      };

      const response = await authService.createMemberProfile(payload);
      
      if (response.success) {
        Alert.alert('Profile Complete!', 'Welcome to FitFlex. Let\'s get started.');
        // This will refresh the user data in the context. The AppNavigator will see
        // that the user is now fully onboarded and automatically switch to the AppStack.
        await reloadUser();
      }
    } catch (err) {
      Alert.alert('Profile Setup Failed', parseApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>Profile Setup</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Name</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Enter your name" 
          placeholderTextColor="#999"
          value={formData.name}
          onChangeText={(text) => setFormData({...formData, name: text})}
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Age</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Enter your age" 
          placeholderTextColor="#999" 
          keyboardType="number-pad" 
          value={formData.age}
          onChangeText={(text) => setFormData({...formData, age: text})}
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Gender</Text>
        <View style={styles.pickerContainer}>
            <Picker 
                selectedValue={formData.gender}
                onValueChange={(itemValue) => setFormData({...formData, gender: itemValue})}
                style={styles.picker}
            >
                <Picker.Item label="Select gender..." value="" />
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
                <Picker.Item label="Other" value="Other" />
            </Picker>
        </View>
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Weight (kg)</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g., 75" 
          placeholderTextColor="#999" 
          keyboardType="numeric" 
          value={formData.weight}
          onChangeText={(text) => setFormData({...formData, weight: text})}
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Height (cm)</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g., 180" 
          placeholderTextColor="#999" 
          keyboardType="numeric" 
          value={formData.height}
          onChangeText={(text) => setFormData({...formData, height: text})}
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Health Conditions (Optional)</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="e.g., Asthma, previous injuries"
          placeholderTextColor="#999"
          multiline
          value={formData.healthConditions}
          onChangeText={(text) => setFormData({...formData, healthConditions: text})}
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Fitness Goal</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g., Lose 10kg, build muscle" 
          placeholderTextColor="#999" 
          value={formData.fitnessGoal}
          onChangeText={(text) => setFormData({...formData, fitnessGoal: text})}
        />
      </View>
      
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
        {loading ? (
            <ActivityIndicator color="#fff" />
        ) : (
            <Text style={styles.buttonText}>Submit & Start</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

// --- Your Original Styles, with a few additions ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    marginTop: 40,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#255f99',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MemberProfile;