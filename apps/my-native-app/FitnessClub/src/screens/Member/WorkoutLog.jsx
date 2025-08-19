import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Alert,
  SafeAreaView,
  StatusBar,
  Image,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { saveWorkoutEntry } from '../../api/trainingService';

const { width, height } = Dimensions.get('window');

const FloatingParticle = ({ delay = 0, style }) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animateParticle = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(translateY, {
            toValue: -30,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 30,
            duration: 3000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0.8,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.2,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    setTimeout(animateParticle, delay);
  }, [delay]);

  return (
    <Animated.View
      style={[
        styles.particle,
        style,
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
    />
  );
};

const QuickWorkoutCard = ({ workout, onPress, style }) => {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

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
        styles.quickWorkoutCard,
        style,
        {
          transform: [{ scale }],
          opacity,
        },
      ]}
    >
      <TouchableOpacity onPress={onPress} style={styles.quickWorkoutButton}>
        <Text style={styles.quickWorkoutIcon}>{workout.icon}</Text>
        <Text style={styles.quickWorkoutName}>{workout.name}</Text>
        <Text style={styles.quickWorkoutDuration}>{workout.duration} min</Text>
        <Text style={styles.quickWorkoutExercises}>{workout.exercises.length} exercises</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const WorkoutCard = ({ workout, onDelete }) => {
  const scale = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(-50)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setTimeout(() => {
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(translateX, {
          toValue: 0,
          tension: 80,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }, 100);
  }, []);

  const handleDelete = () => {
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => onDelete(workout.id));
  };

  return (
    <Animated.View
      style={[
        styles.workoutCard,
        {
          transform: [{ scale }, { translateX }],
          opacity,
        },
      ]}
    >
      <View style={styles.workoutHeader}>
        <View style={styles.workoutTitleContainer}>
          <Text style={styles.workoutIcon}>{workout.icon}</Text>
          <View style={styles.workoutTitleText}>
            <Text style={styles.workoutName}>{workout.name}</Text>
            <Text style={styles.workoutDate}>{workout.date}</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={handleDelete}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteButtonText}>×</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.workoutStats}>
        <View style={styles.statItem}>
          <Icon name="fitness" size={16} color="#4ecdc4" />
          <Text style={styles.statText}>{workout.exercises.length} exercises</Text>
        </View>
        <View style={styles.statItem}>
          <Icon name="time" size={16} color="#4ecdc4" />
          <Text style={styles.statText}>{workout.duration} min</Text>
        </View>
        <View style={styles.statItem}>
          <Icon name="flame" size={16} color="#4ecdc4" />
          <Text style={styles.statText}>{workout.intensity}</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const PulsingButton = ({ onPress, children, style }) => {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    setTimeout(onPress, 100);
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <Animated.View style={[style, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

const WorkoutLog = () => {
  const [workouts, setWorkouts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Enhanced workout templates with better categorization
  const workoutTemplates = [
    // Strength Training
    {
      name: 'Full Body Strength',
      icon: '💪',
      duration: 45,
      intensity: 'medium',
      category: 'strength',
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
      exercises: [
        { name: 'Hamstring Stretch', sets: 2, reps: '30s each', weight: 'Bodyweight' },
        { name: 'Hip Flexor Stretch', sets: 2, reps: '30s each', weight: 'Bodyweight' },
        { name: 'Shoulder Stretch', sets: 2, reps: '30s each', weight: 'Bodyweight' },
        { name: 'Chest Stretch', sets: 2, reps: '30s each', weight: 'Bodyweight' },
      ]
    },
  ];

  const workoutCategories = [
    { id: 'all', name: 'All', icon: '🏋️‍♂️' },
    { id: 'strength', name: 'Strength', icon: '💪' },
    { id: 'cardio', name: 'Cardio', icon: '🔥' },
    { id: 'flexibility', name: 'Flexibility', icon: '🧘‍♀️' },
  ];

  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredWorkouts = selectedCategory === 'all' 
    ? workoutTemplates 
    : workoutTemplates.filter(workout => workout.category === selectedCategory);

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
        // Add to local state
        const newLog = {
          ...template,
          id: Date.now().toString(),
          timestamp: new Date().toLocaleTimeString(),
          date: new Date().toLocaleDateString(),
        };
        setWorkouts([newLog, ...workouts]);
        
        // Show success animation
        Animated.sequence([
          Animated.timing(headerScale, {
            toValue: 1.1,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(headerScale, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
        ]).start();
        
        Alert.alert('Success', `${template.name} logged successfully! 🎉`);
      } else {
        Alert.alert('Error', response.message || 'Failed to log workout');
      }
    } catch (error) {
      console.error('Quick workout error:', error);
      Alert.alert('Error', 'Failed to log workout. Please try again.');
    }
  };

  const handleCustomWorkout = async () => {
    if (!workoutForm.workoutName.trim() || !workoutForm.date.trim() || !workoutForm.duration.trim()) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }
    
    try {
      const response = await saveWorkoutEntry(workoutForm);

      if (response.success) {
        const newLog = {
          ...workoutForm,
          id: Date.now().toString(),
          timestamp: new Date().toLocaleTimeString(),
          date: new Date().toLocaleDateString(),
        };
        setWorkouts([newLog, ...workouts]);
        closeModal();
        Alert.alert('Success', 'Custom workout logged successfully! 🎉');
      } else {
        Alert.alert('Error', response.message || 'Failed to save workout');
      }
    } catch (error) {
      console.error('Save workout error:', error);
      Alert.alert('Error', 'Failed to save workout. Please try again.');
    }
  };

  const deleteWorkout = (workoutId) => {
    setWorkouts(prev => prev.filter(w => w.id !== workoutId));
    setSuccessMessage('Workout deleted successfully!');
    setSuccessModalVisible(true);
  };

  const renderParticles = () => {
    return [...Array(12)].map((_, i) => (
      <FloatingParticle
        key={i}
        delay={i * 200}
        style={{
          left: Math.random() * width,
          top: Math.random() * height,
        }}
      />
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f23" />
      
      {/* Background Particles */}
      <View style={styles.particleContainer}>
        {renderParticles()}
      </View>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerIcon}>💪</Text>
          <Text style={styles.headerTitle}>Workout Log</Text>
        </View>
        <PulsingButton style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Icon name="add" size={24} color="#fff" />
        </PulsingButton>
      </View>

      {/* Quick Workouts Section */}
      <View style={styles.quickWorkoutsSection}>
        <Text style={styles.sectionTitle}>Quick Add Workouts</Text>
        
        {/* Category Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryFilter}>
          {workoutCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.selectedCategoryButton
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={[
                styles.categoryText,
                selectedCategory === category.id && styles.selectedCategoryText
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickWorkoutsScroll}>
          {filteredWorkouts.map((workout, index) => (
            <QuickWorkoutCard
              key={workout.name}
              workout={workout}
              onPress={() => handleQuickWorkout(workout)}
              style={{ marginLeft: index === 0 ? 16 : 12 }}
            />
          ))}
        </ScrollView>
      </View>

      {/* Workout List */}
      <View style={styles.workoutListSection}>
        <Text style={styles.sectionTitle}>Today's Workouts</Text>
        <ScrollView style={styles.workoutsList}>
          {workouts.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>💪 No workouts logged yet</Text>
              <Text style={styles.emptyStateSubtext}>Start your fitness journey today!</Text>
              <TouchableOpacity
                style={styles.emptyStateButton}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.emptyStateButtonText}>Start Your First Workout</Text>
              </TouchableOpacity>
            </View>
          ) : (
            workouts.map(workout => (
              <WorkoutCard key={workout.id} workout={workout} onDelete={deleteWorkout} />
            ))
          )}
        </ScrollView>
      </View>

      {/* Success Modal */}
      <Modal visible={successModalVisible} transparent animationType="fade">
        <View style={styles.successModalOverlay}>
          <View style={styles.successModalContainer}>
            <View style={styles.successTickContainer}>
              <Text style={styles.successTick}>✓</Text>
            </View>
            <Text style={styles.successMessage}>{successMessage}</Text>
            <TouchableOpacity 
              style={styles.successButton}
              onPress={() => setSuccessModalVisible(false)}
            >
              <Text style={styles.successButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
  particleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: '#4ecdc4',
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    backgroundColor: 'rgba(26, 26, 46, 0.95)',
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
    color: '#fff',
    fontFamily: 'System',
    letterSpacing: 0.5,
  },
  addButton: {
    backgroundColor: '#4ecdc4',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4ecdc4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    fontFamily: 'System',
  },
  quickWorkoutsSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    fontFamily: 'System',
    letterSpacing: 0.3,
  },
  quickWorkoutsScroll: {
    paddingVertical: 8,
  },
  quickWorkoutCard: {
    backgroundColor: '#282850',
    borderRadius: 15,
    width: width * 0.7,
    marginRight: 10,
    shadowColor: '#222',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    elevation: 5,
  },
  quickWorkoutButton: {
    padding: 15,
    alignItems: 'center',
  },
  quickWorkoutIcon: {
    fontSize: 30,
    marginBottom: 8,
  },
  quickWorkoutName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    fontFamily: 'System',
    letterSpacing: 0.2,
  },
  quickWorkoutDuration: {
    fontSize: 12,
    color: '#bbb',
    marginBottom: 4,
    fontFamily: 'System',
    fontWeight: '400',
  },
  quickWorkoutExercises: {
    fontSize: 12,
    color: '#bbb',
    fontFamily: 'System',
    fontWeight: '400',
  },
  workoutListSection: {
    flex: 1,
    paddingHorizontal: 16,
  },
  workoutsList: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: 'System',
    letterSpacing: 0.5,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#bbb',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
    fontFamily: 'System',
    fontWeight: '400',
  },
  emptyStateButton: {
    backgroundColor: '#4ecdc4',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#4ecdc4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  emptyStateButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'System',
    letterSpacing: 0.5,
  },
  workoutCard: {
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#222',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    elevation: 5,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  workoutTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  workoutIcon: {
    fontSize: 40,
    marginRight: 12,
  },
  workoutTitleText: {
    flex: 1,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'System',
    letterSpacing: 0.2,
  },
  deleteButton: {
    backgroundColor: '#ff6b6b',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'System',
  },
  workoutDate: {
    fontSize: 14,
    color: '#bbb',
    marginTop: 2,
    fontFamily: 'System',
    fontWeight: '400',
  },
  workoutStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  statIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 6,
  },
  statText: {
    color: '#4ecdc4',
    fontWeight: '600',
    fontSize: 12,
    fontFamily: 'System',
    letterSpacing: 0.3,
  },
  exercisesList: {
    maxHeight: 200,
  },
  exerciseItem: {
    marginBottom: 16,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  exerciseIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    fontFamily: 'System',
    letterSpacing: 0.2,
  },
  setsContainer: {
    paddingLeft: 32,
  },
  setItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  setIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 6,
  },
  setText: {
    fontSize: 14,
    color: '#bbb',
    fontFamily: 'System',
    fontWeight: '400',
  },
  // Enhanced Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    backgroundColor: '#202040',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    maxHeight: height * 0.85,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  modalHeaderGradient: {
    backgroundColor: '#4ecdc4',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingBottom: 15,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    paddingTop: 15,
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modalIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modalIcon: {
    fontSize: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'System',
    letterSpacing: 0.3,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'System',
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    width: '100%',
  },
  modalScrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
    fontFamily: 'System',
    letterSpacing: 0.3,
  },
  enhancedInput: {
    backgroundColor: '#282850',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#333',
    fontFamily: 'System',
    fontWeight: '400',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryFilter: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#282850',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  selectedCategoryButton: {
    backgroundColor: '#4ecdc4',
    borderColor: '#4ecdc4',
  },
  categoryIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'System',
    fontWeight: '400',
  },
  selectedCategoryText: {
    color: '#fff',
    fontWeight: '600',
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  typeButton: {
    backgroundColor: '#282850',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  typeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'System',
    fontWeight: '400',
  },
  addExerciseButton: {
    backgroundColor: '#4ecdc4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addExerciseButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'System',
  },
  exerciseCard: {
    backgroundColor: '#282850',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  exerciseCardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
    fontFamily: 'System',
    letterSpacing: 0.2,
  },
  removeText: {
    color: '#ff6b6b',
    fontWeight: 'bold',
    fontSize: 14,
    fontFamily: 'System',
  },
  setsPreview: {
    paddingLeft: 8,
    marginTop: 8,
  },
  setPreviewText: {
    color: '#bbb',
    fontSize: 14,
    marginBottom: 2,
    fontFamily: 'System',
    fontWeight: '400',
  },
  quickSelectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  quickSelectButton: {
    backgroundColor: '#282850',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  quickSelectText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'System',
    fontWeight: '400',
  },
  addSetButton: {
    backgroundColor: '#4ecdc4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addSetButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'System',
  },
  setCard: {
    backgroundColor: '#282850',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  setCardText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'System',
    fontWeight: '400',
  },
  saveWorkoutButton: {
    backgroundColor: '#4ecdc4',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#4ecdc4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveWorkoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'System',
    letterSpacing: 0.5,
  },
  addExerciseFinalButton: {
    backgroundColor: '#4ecdc4',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#4ecdc4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addExerciseFinalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'System',
    letterSpacing: 0.5,
  },
  addSetFinalButton: {
    backgroundColor: '#4ecdc4',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#4ecdc4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addSetFinalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'System',
    letterSpacing: 0.5,
  },
  // Success Modal Styles
  successModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successModalContainer: {
    backgroundColor: '#202040',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginHorizontal: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  successTickContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4ecdc4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#4ecdc4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  successTick: {
    fontSize: 40,
    color: '#fff',
    fontWeight: 'bold',
  },
  successMessage: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'System',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  successButton: {
    backgroundColor: '#4ecdc4',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginTop: 20,
    shadowColor: '#4ecdc4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  successButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'System',
    letterSpacing: 0.5,
  },
  // Delete Confirmation Modal Styles
  deleteModalContainer: {
    backgroundColor: '#202040',
    borderRadius: 20,
    marginHorizontal: 20,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  deleteModalHeader: {
    padding: 30,
    alignItems: 'center',
  },
  deleteIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ff6b6b',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#ff6b6b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  deleteIcon: {
    fontSize: 30,
  },
  deleteModalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    fontFamily: 'System',
    letterSpacing: 0.5,
  },
  deleteModalSubtitle: {
    fontSize: 16,
    color: '#bbb',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'System',
    fontWeight: '400',
    lineHeight: 22,
  },
  deleteModalWarning: {
    fontSize: 14,
    color: '#ff6b6b',
    textAlign: 'center',
    fontFamily: 'System',
    fontWeight: '600',
  },
  deleteModalActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  cancelDeleteButton: {
    flex: 1,
    paddingVertical: 20,
    alignItems: 'center',
    borderRightWidth: 0.5,
    borderRightColor: '#333',
  },
  cancelDeleteButtonText: {
    color: '#bbb',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'System',
  },
  confirmDeleteButton: {
    flex: 1,
    paddingVertical: 20,
    alignItems: 'center',
    borderLeftWidth: 0.5,
    borderLeftColor: '#333',
  },
  confirmDeleteButtonText: {
    color: '#ff6b6b',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'System',
  },
});

export default WorkoutLog;
