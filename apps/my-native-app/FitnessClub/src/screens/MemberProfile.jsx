// // src/screens/Member/MemberProfile.jsx
// import React, { useState } from 'react';
// import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import { useNavigation } from '@react-navigation/native';
// import { useAuth } from '../context/authContext';
// import * as authService from '../api/authService';
// import parseApiError from '../utils/parseApiError';

// const MemberProfile = () => {
//   const { reloadUser } = useAuth(); // We'll use this to trigger the switch to the main app
//   const [loading, setLoading] = useState(false);
//   const navigation = useNavigation();
  
//   const [formData, setFormData] = useState({
//     name: '',
//     age: '',
//     gender: '', // Default to empty
//     weight: '',
//     height: '',
//     healthConditions: '',
//     fitnessGoal: '',
//   });

//   const handleSubmit = async () => {
//     // Basic validation
//     if (!formData.name || !formData.age || !formData.gender || !formData.weight || !formData.height || !formData.fitnessGoal) {
//         Alert.alert('Incomplete Form', 'Please fill out all fields to continue.');
//         return;
//     }

//     setLoading(true);
//     try {
//       const payload = {
//         name: formData.name,
//         age: parseInt(formData.age, 10),
//         gender: formData.gender,
//         weight: parseFloat(formData.weight),
//         height: parseFloat(formData.height),
//         healthConditions: formData.healthConditions,
//         fitnessGoal: formData.fitnessGoal,
//       };

//       const response = await authService.createMemberProfile(payload);
      
//       if (response.success) {
//         Alert.alert('Profile Updated!', 'Your profile has been saved successfully.');
//         // Navigate back to the main profile screen
//         navigation.goBack();
//       }
//     } catch (err) {
//       Alert.alert('Profile Update Failed', parseApiError(err));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
//       <Text style={styles.title}>Profile Setup</Text>
      
//       <View style={styles.inputGroup}>
//         <Text style={styles.label}>Name</Text>
//         <TextInput 
//           style={styles.input} 
//           placeholder="Enter your name" 
//           placeholderTextColor="#999"
//           value={formData.name}
//           onChangeText={(text) => setFormData({...formData, name: text})}
//         />
//       </View>
      
//       <View style={styles.inputGroup}>
//         <Text style={styles.label}>Age</Text>
//         <TextInput 
//           style={styles.input} 
//           placeholder="Enter your age" 
//           placeholderTextColor="#999" 
//           keyboardType="number-pad" 
//           value={formData.age}
//           onChangeText={(text) => setFormData({...formData, age: text})}
//         />
//       </View>
      
//       <View style={styles.inputGroup}>
//         <Text style={styles.label}>Gender</Text>
//         <View style={styles.pickerContainer}>
//             <Picker 
//                 selectedValue={formData.gender}
//                 onValueChange={(itemValue) => setFormData({...formData, gender: itemValue})}
//                 style={styles.picker}
//             >
//                 <Picker.Item label="Select gender..." value="" />
//                 <Picker.Item label="Male" value="Male" />
//                 <Picker.Item label="Female" value="Female" />
//                 <Picker.Item label="Other" value="Other" />
//             </Picker>
//         </View>
//       </View>
      
//       <View style={styles.inputGroup}>
//         <Text style={styles.label}>Weight (kg)</Text>
//         <TextInput 
//           style={styles.input} 
//           placeholder="e.g., 75" 
//           placeholderTextColor="#999" 
//           keyboardType="numeric" 
//           value={formData.weight}
//           onChangeText={(text) => setFormData({...formData, weight: text})}
//         />
//       </View>
      
//       <View style={styles.inputGroup}>
//         <Text style={styles.label}>Height (cm)</Text>
//         <TextInput 
//           style={styles.input} 
//           placeholder="e.g., 180" 
//           placeholderTextColor="#999" 
//           keyboardType="numeric" 
//           value={formData.height}
//           onChangeText={(text) => setFormData({...formData, height: text})}
//         />
//       </View>
      
//       <View style={styles.inputGroup}>
//         <Text style={styles.label}>Health Conditions (Optional)</Text>
//         <TextInput
//           style={[styles.input, styles.multilineInput]}
//           placeholder="e.g., Asthma, previous injuries"
//           placeholderTextColor="#999"
//           multiline
//           value={formData.healthConditions}
//           onChangeText={(text) => setFormData({...formData, healthConditions: text})}
//         />
//       </View>
      
//       <View style={styles.inputGroup}>
//         <Text style={styles.label}>Fitness Goal</Text>
//         <TextInput 
//           style={styles.input} 
//           placeholder="e.g., Lose 10kg, build muscle" 
//           placeholderTextColor="#999" 
//           value={formData.fitnessGoal}
//           onChangeText={(text) => setFormData({...formData, fitnessGoal: text})}
//         />
//       </View>
      
//       <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
//         {loading ? (
//             <ActivityIndicator color="#fff" />
//         ) : (
//             <Text style={styles.buttonText}>Submit & Start</Text>
//         )}
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };

// // --- Your Original Styles, with a few additions ---
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//     padding: 20,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 30,
//     marginTop: 40,
//     textAlign: 'center',
//   },
//   inputGroup: {
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 16,
//     marginBottom: 8,
//     color: '#555',
//     fontWeight: '600',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     paddingVertical: 12,
//     paddingHorizontal: 15,
//     fontSize: 16,
//     color: '#333',
//   },
//   multilineInput: {
//     height: 100,
//     textAlignVertical: 'top',
//   },
//   pickerContainer: {
//       borderWidth: 1,
//       borderColor: '#ccc',
//       borderRadius: 8,
//   },
//   picker: {
//     height: 50,
//     width: '100%',
//     color: '#333',
//   },
//   submitButton: {
//     backgroundColor: '#255f99',
//     paddingVertical: 15,
//     paddingHorizontal: 30,
//     borderRadius: 30,
//     marginTop: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//     minHeight: 50,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });

// export default MemberProfile;



// src/screens/Member/MemberProfile.jsx
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/authContext';
import * as authService from '../api/authService';
import parseApiError from '../utils/parseApiError';

const MemberProfile = () => {
  const { reloadUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(0);
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    weight: '',
    height: '',
    healthConditions: '',
    fitnessGoal: '',
  });

  const steps = [
    {
      title: "What's your name?",
      subtitle: "Let's start with the basics",
      field: 'name',
      placeholder: 'Enter your full name',
      type: 'text'
    },
    {
      title: "How old are you?",
      subtitle: "This helps us personalize your fitness plan",
      field: 'age',
      placeholder: 'Enter your age',
      type: 'number'
    },
    {
      title: "What's your gender?",
      subtitle: "This helps with fitness calculations",
      field: 'gender',
      type: 'picker',
      options: [
        { label: 'Select gender...', value: '' },
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' },
        { label: 'Other', value: 'Other' }
      ]
    },
    {
      title: "What's your weight?",
      subtitle: "In kilograms (kg)",
      field: 'weight',
      placeholder: 'e.g., 75',
      type: 'number'
    },
    {
      title: "What's your height?",
      subtitle: "In centimeters (cm)",
      field: 'height',
      placeholder: 'e.g., 180',
      type: 'number'
    },
    {
      title: "Any health conditions?",
      subtitle: "Optional - helps us keep you safe",
      field: 'healthConditions',
      placeholder: 'e.g., Asthma, previous injuries (or leave blank)',
      type: 'multiline',
      optional: true
    },
    {
      title: "What's your fitness goal?",
      subtitle: "What do you want to achieve?",
      field: 'fitnessGoal',
      placeholder: 'e.g., Lose 10kg, build muscle, get stronger',
      type: 'text'
    }
  ];

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const totalSteps = steps.length;

  const validateCurrentStep = () => {
    const currentField = currentStepData.field;
    const value = formData[currentField];
    
    if (!currentStepData.optional && (!value || value.trim() === '')) {
      Alert.alert('Required Field', 'Please fill out this field to continue.');
      return false;
    }
    
    if (currentField === 'age') {
      const age = parseInt(value, 10);
      if (isNaN(age) || age < 1 || age > 120) {
        Alert.alert('Invalid Age', 'Please enter a valid age between 1 and 120.');
        return false;
      }
    }
    
    if (currentField === 'weight') {
      const weight = parseFloat(value);
      if (isNaN(weight) || weight < 1 || weight > 500) {
        Alert.alert('Invalid Weight', 'Please enter a valid weight between 1 and 500 kg.');
        return false;
      }
    }
    
    if (currentField === 'height') {
      const height = parseFloat(value);
      if (isNaN(height) || height < 50 || height > 300) {
        Alert.alert('Invalid Height', 'Please enter a valid height between 50 and 300 cm.');
        return false;
      }
    }
    
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    
    if (isLastStep) {
      handleSubmit();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
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
        await reloadUser();
        navigation.navigate('MainTabs');
      }
    } catch (err) {
      Alert.alert('Profile Setup Failed', parseApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (value) => {
    setFormData({
      ...formData,
      [currentStepData.field]: value
    });
  };

  const renderInput = () => {
    switch (currentStepData.type) {
      case 'text':
        return (
          <TextInput
            style={styles.input}
            placeholder={currentStepData.placeholder}
            placeholderTextColor="#999"
            value={formData[currentStepData.field]}
            onChangeText={updateFormData}
            autoFocus={true}
          />
        );
      
      case 'number':
        return (
          <TextInput
            style={styles.input}
            placeholder={currentStepData.placeholder}
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={formData[currentStepData.field]}
            onChangeText={updateFormData}
            autoFocus={true}
          />
        );
      
      case 'multiline':
        return (
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder={currentStepData.placeholder}
            placeholderTextColor="#999"
            multiline
            value={formData[currentStepData.field]}
            onChangeText={updateFormData}
            autoFocus={true}
          />
        );
      
      case 'picker':
        return (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData[currentStepData.field]}
              onValueChange={updateFormData}
              style={styles.picker}
            >
              {currentStepData.options.map((option, index) => (
                <Picker.Item 
                  key={index} 
                  label={option.label} 
                  value={option.value} 
                />
              ))}
            </Picker>
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${((currentStep + 1) / totalSteps) * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {currentStep + 1} of {totalSteps}
        </Text>
      </View>

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Step Content */}
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>{currentStepData.title}</Text>
          <Text style={styles.stepSubtitle}>{currentStepData.subtitle}</Text>
          
          <View style={styles.inputContainer}>
            {renderInput()}
          </View>
        </View>
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
        {currentStep > 0 && (
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleBack}
            disabled={loading}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={[
            styles.nextButton,
            currentStep === 0 && styles.nextButtonFull
          ]} 
          onPress={handleNext}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.nextButtonText}>
              {isLastStep ? 'Complete Profile' : 'Next'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E5E5',
    borderRadius: 2,
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#255f99',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  stepContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  inputContainer: {
    width: '100%',
    maxWidth: 300,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    fontSize: 18,
    color: '#333',
    backgroundColor: '#FAFAFA',
  },
  multilineInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    backgroundColor: '#FAFAFA',
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
    gap: 15,
  },
  backButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#255f99',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#255f99',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    flex: 2,
    backgroundColor: '#255f99',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  nextButtonFull: {
    flex: 1,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MemberProfile;