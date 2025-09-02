import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
  StatusBar,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import { saveWorkoutEntry } from '../../api/trainingService';

const { width, height } = Dimensions.get('window');

export const WorkoutPlanCard = ({ workout, onPress, style }) => {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const { colors } = useTheme();

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.workoutPlanCard,
        { backgroundColor: colors.card, borderColor: colors.border },
        style,
        {
          transform: [{ scale }],
          opacity,
        },
      ]}
    >
              {/* Workout Title Header */}
        <View style={styles.workoutTitleHeader}>
          <Text style={styles.workoutTitleText}>{workout.name}</Text>
        </View>
        
        <TouchableOpacity onPress={onPress} style={styles.workoutPlanButton}>
          {/* Background Image Container */}
          <View style={[styles.workoutPlanImageContainer, { backgroundColor: colors.surface }]}>
            <Image 
              source={require('../../assets/trainer-helping-beginner-gym.jpg')}
              style={styles.workoutPlanImage}
              resizeMode="cover"
              onError={(error) => console.log('Image loading error:', error)}
            />
          </View>
        </TouchableOpacity>
    </Animated.View>
  );
};

const WorkoutLog = () => {
  const { colors } = useTheme();
  // Enhanced workout templates with better categorization
  const workoutTemplates = [
    // Strength Training
    {
      name: 'Full Body Strength',
      icon: '💪',
      duration: 45,
      intensity: 'medium',
      category: 'strength',
      createdFor: 'Abhishekh',
      day: 'Sunday',
      calories: '630',
      exercises: [
        { name: 'Squats', sets: 3, reps: 12, weight: 'Bodyweight' },
        { name: 'Push-ups', sets: 3, reps: 10, weight: 'Bodyweight' },
        { name: 'Dumbbell Rows', sets: 3, reps: 12, weight: 'Medium' },
        { name: 'Plank', sets: 3, reps: '30s', weight: 'Bodyweight' },
      ]
    },
    {
      name: 'Upper Body Focus',
      icon: '🏋️',
      duration: 40,
      intensity: 'hard',
      category: 'strength',
      createdFor: 'Abhishekh',
      day: 'Monday',
      calories: '580',
      exercises: [
        { name: 'Bench Press', sets: 4, reps: 8, weight: 'Heavy' },
        { name: 'Pull-ups', sets: 3, reps: 8, weight: 'Bodyweight' },
        { name: 'Shoulder Press', sets: 3, reps: 10, weight: 'Medium' },
        { name: 'Bicep Curls', sets: 3, reps: 12, weight: 'Light' },
      ]
    },
    {
      name: 'Lower Body Power',
      icon: '🦵',
      duration: 50,
      intensity: 'hard',
      category: 'strength',
      createdFor: 'Abhishekh',
      day: 'Wednesday',
      calories: '720',
      exercises: [
        { name: 'Deadlifts', sets: 4, reps: 6, weight: 'Heavy' },
        { name: 'Lunges', sets: 3, reps: 12, weight: 'Medium' },
        { name: 'Calf Raises', sets: 4, reps: 15, weight: 'Light' },
        { name: 'Glute Bridges', sets: 3, reps: 15, weight: 'Bodyweight' },
      ]
    },
    
    // Cardio
    {
      name: 'HIIT Cardio',
      icon: '🔥',
      duration: 30,
      intensity: 'hard',
      category: 'cardio',
      createdFor: 'Abhishekh',
      day: 'Tuesday',
      calories: '450',
      exercises: [
        { name: 'Burpees', sets: 5, reps: '30s', weight: 'Bodyweight' },
        { name: 'Mountain Climbers', sets: 5, reps: '30s', weight: 'Bodyweight' },
        { name: 'Jump Squats', sets: 5, reps: '30s', weight: 'Bodyweight' },
        { name: 'High Knees', sets: 5, reps: '30s', weight: 'Bodyweight' },
      ]
    },
    {
      name: 'Steady State Cardio',
      icon: '🏃‍♂️',
      duration: 45,
      intensity: 'medium',
      category: 'cardio',
      createdFor: 'Abhishekh',
      day: 'Thursday',
      calories: '380',
      exercises: [
        { name: 'Running', sets: 1, reps: '45min', weight: 'Bodyweight' },
        { name: 'Cycling', sets: 1, reps: '45min', weight: 'Bodyweight' },
        { name: 'Rowing', sets: 1, reps: '45min', weight: 'Bodyweight' },
      ]
    },
    
    // Flexibility & Recovery
    {
      name: 'Yoga Flow',
      icon: '🧘‍♀️',
      duration: 60,
      intensity: 'light',
      category: 'flexibility',
      createdFor: 'Abhishekh',
      day: 'Friday',
      calories: '220',
      exercises: [
        { name: 'Sun Salutation', sets: 3, reps: '5 rounds', weight: 'Bodyweight' },
        { name: 'Warrior Poses', sets: 2, reps: '30s each', weight: 'Bodyweight' },
        { name: 'Tree Pose', sets: 2, reps: '1min each', weight: 'Bodyweight' },
        { name: 'Savasana', sets: 1, reps: '5min', weight: 'Bodyweight' },
      ]
    },
    {
      name: 'Stretching Routine',
      icon: '🤸‍♀️',
      duration: 20,
      intensity: 'light',
      category: 'flexibility',
      createdFor: 'Abhishekh',
      day: 'Saturday',
      calories: '150',
      exercises: [
        { name: 'Hamstring Stretch', sets: 2, reps: '30s each', weight: 'Bodyweight' },
        { name: 'Hip Flexor Stretch', sets: 2, reps: '30s each', weight: 'Bodyweight' },
        { name: 'Shoulder Stretch', sets: 2, reps: '30s each', weight: 'Bodyweight' },
        { name: 'Chest Stretch', sets: 2, reps: '30s each', weight: 'Bodyweight' },
      ]
    },
  ];

  const handleQuickWorkout = async (template) => {
    try {
      const workoutData = {
        workoutName: template.name,
        workoutType: template.category.charAt(0).toUpperCase() + template.category.slice(1),
        date: new Date().toISOString().split('T')[0],
        duration: template.duration.toString(),
        exercises: template.exercises,
        notes: `Quick ${template.category} workout`,
        intensity: template.intensity,
      };

      const response = await saveWorkoutEntry(workoutData);

      if (response.success) {
        Alert.alert('Success', `${template.name} logged successfully! 🎉`);
      } else {
        Alert.alert('Error', response.message || 'Failed to log workout');
      }
    } catch (error) {
      console.error('Quick workout error:', error);
      Alert.alert('Error', 'Failed to log workout. Please try again.');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.background === '#0f0f23' ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <View style={styles.headerContent}>
          <Text style={styles.headerIcon}>💪</Text>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Workout Plans</Text>
        </View>
      </View>

      {/* Workout Plans Section */}
      <View style={styles.workoutPlansSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.workoutPlansScroll}>
          {workoutTemplates.map((workout, index) => (
            <WorkoutPlanCard
              key={workout.name}
              workout={workout}
              onPress={() => handleQuickWorkout(workout)}
              style={{ marginLeft: 0 }}
            />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'System',
    letterSpacing: 0.5,
  },
  workoutPlansSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  workoutPlansScroll: {
    paddingVertical: 8,
  },
  workoutPlanCard: {
    borderRadius: 20,
    width: width * 0.7,
    height: 250,
    marginRight: 10,
    shadowColor: '#222',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
    borderWidth: 2,
  },
  workoutPlanButton: {
    flex: 1,
  },
  workoutPlanImageContainer: {
    position: 'relative',
    height: 250,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  workoutPlanImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  workoutTitleHeader: {
    padding: 15,
    backgroundColor: '#2196F3',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  workoutTitleText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'System',
    letterSpacing: 0.5,
  },


});

export default WorkoutLog;
