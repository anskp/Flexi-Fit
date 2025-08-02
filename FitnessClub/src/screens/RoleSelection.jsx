import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const roles = [
  { label: 'Member', description: 'Access gym facilities and classes' },
  { label: 'Gym Owner', description: 'Manage your gym and members' },
  { label: 'Trainer', description: 'Coach and guide gym members' },
  { label: 'Multi-Gym Member', description: 'Access multiple gyms with one account' },
];

const RoleSelection = () => {
  const navigation = useNavigation();

  // Function to handle navigation based on role
  const handleRolePress = (roleLabel) => {
    if (roleLabel === 'Member') {
      navigation.navigate('MemberProfile');
    } else if (roleLabel === 'Trainer') {
      // Redirect trainers to website
      Alert.alert(
        'Trainer Registration',
        'Trainer registration is available on our website. Would you like to visit the website?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Visit Website', 
            onPress: () => Linking.openURL('https://fitnessclub.com/trainer-signup') 
          }
        ]
      );
    } else if (roleLabel === 'Gym Owner') {
      // Redirect gym owners to website
      Alert.alert(
        'Gym Owner Registration',
        'Gym owner registration is available on our website. Would you like to visit the website?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Visit Website', 
            onPress: () => Linking.openURL('https://fitnessclub.com/gym-signup') 
          }
        ]
      );
    } else if (roleLabel === 'Multi-Gym Member') {
      navigation.navigate('MemberProfile');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Choose User Type</Text>
      <View style={styles.rolesContainer}>
        {roles.map((role) => (
          <TouchableOpacity
            key={role.label}
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => handleRolePress(role.label)}
          >
            <Text style={styles.roleLabel}>{role.label}</Text>
            <Text style={styles.roleDesc}>{role.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // White background
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: '600',
    color: '#666666', // Changed to gray
    marginBottom: 30,
    letterSpacing: 0.5,
    fontFamily: 'System',
  },
  rolesContainer: {
    width: '100%',
    alignItems: 'center',
  },
  card: {
    width: '90%',
    backgroundColor: '#F8F9FB',
    borderRadius: 18,
    paddingVertical: 24,
    paddingHorizontal: 18,
    marginBottom: 22,
    alignItems: 'flex-start',
    shadowColor: '#666666', // Changed shadow to gray
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E3E8F0',
  },
  roleLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: '#555555', // Changed to darker gray
    marginBottom: 6,
    fontFamily: 'System',
    letterSpacing: 0.3,
  },
  roleDesc: {
    fontSize: 15,
    color: '#777777', // Changed to medium gray
    opacity: 0.9,
    fontFamily: 'System',
    lineHeight: 20,
    fontWeight: '400',
  },
});

export default RoleSelection;