import React from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

const MemberProfile = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      {/* Beautiful Back Button */}

      <Text style={styles.title}>Profile Setup</Text>
      
      {/* Name */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Name</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Enter your name" 
          placeholderTextColor="#999" 
        />
      </View>
      
      {/* Age */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Age</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Enter your age" 
          placeholderTextColor="#999" 
          keyboardType="numeric" 
        />
      </View>
      
      {/* Gender */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Gender</Text>
        <Picker style={styles.picker}>
          <Picker.Item label="Select gender" value="" />
          <Picker.Item label="Male" value="male" />
          <Picker.Item label="Female" value="female" />
          <Picker.Item label="Other" value="other" />
        </Picker>
      </View>
      
      {/* Weight */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Weight (kg)</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Enter your weight" 
          placeholderTextColor="#999" 
          keyboardType="numeric" 
        />
      </View>
      
      {/* Height */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Height (cm)</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Enter your height" 
          placeholderTextColor="#999" 
          keyboardType="numeric" 
        />
      </View>
      
      {/* Health Conditions */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Health Conditions</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Enter any health conditions"
          placeholderTextColor="#999"
          multiline
          numberOfLines={3}
        />
      </View>
      
      {/* Fitness Goal */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Fitness Goal</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Enter your fitness goal" 
          placeholderTextColor="#999" 
        />
      </View>
      
      {/* Submit Button */}
      <TouchableOpacity style={styles.smallButton} 
        onPress={() => {
            navigation.navigate('MemberDashboard');
          }}
      >
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 10,
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 25,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#eee',
  },
  backButtonText: {
    fontSize: 24,
    color: '#555555',
    fontWeight: 'bold',
    fontFamily: 'System',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#555555',
    marginBottom: 20,
    marginTop: 40,
    textAlign: 'center',
    letterSpacing: 1,
    fontFamily: 'System',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555555',
    fontFamily: 'System',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#555555',
    borderRadius: 30,
    padding: 10,
    fontSize: 16,
    color: '#555555',
    fontFamily: 'System',
    fontWeight: '400',
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#555555',
    borderRadius: 8,
    color: '#555555',
    fontFamily: 'System',
    fontWeight: '400',
  },
  smallButton: {
    alignSelf: 'center',
    backgroundColor: '#255f99',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 50,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
    fontFamily: 'System',
  },
});

export default MemberProfile;