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

const AnimatedModal = ({ visible, onClose, children, title }) => {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={styles.modalBackdrop} 
          activeOpacity={1} 
          onPress={onClose}
        />
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ translateY: slideAnim }],
              opacity: fadeAnim,
            },
          ]}
        >
          {/* Modal Header with Gradient */}
          <View style={styles.modalHeaderGradient}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderLeft}>
                <View style={styles.modalIconContainer}>
                  <Text style={styles.modalIcon}>💪</Text>
                </View>
                <Text style={styles.modalTitle}>{title}</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Modal Content */}
          <View style={styles.modalContent}>
            {children}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const SuccessModal = ({ visible, onClose, message }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const tickScaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(tickScaleAnim, {
          toValue: 1,
          tension: 200,
          friction: 5,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto close after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="none">
      <Animated.View style={[styles.successModalOverlay, { opacity: fadeAnim }]}>
        <Animated.View
          style={[
            styles.successModalContainer,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Animated.View
            style={[
              styles.successTickContainer,
              {
                transform: [{ scale: tickScaleAnim }],
              },
            ]}
          >
            <Text style={styles.successTick}>✓</Text>
          </Animated.View>
          <Text style={styles.successMessage}>{message}</Text>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const DeleteConfirmationModal = ({ visible, onClose, onConfirm, workoutName }) => {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleConfirm = () => {
    // Shake animation before confirming
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onConfirm();
      onClose();
    });
  };

  return (
    <Modal visible={visible} transparent animationType="none">
      <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
        <TouchableOpacity 
          style={styles.modalBackdrop} 
          activeOpacity={1} 
          onPress={onClose}
        />
        <Animated.View
          style={[
            styles.deleteModalContainer,
            {
              transform: [
                { translateY: slideAnim },
                { translateX: shakeAnim }
              ],
            },
          ]}
        >
          <View style={styles.deleteModalHeader}>
            <View style={styles.deleteIconContainer}>
              <Text style={styles.deleteIcon}>🗑️</Text>
            </View>
            <Text style={styles.deleteModalTitle}>Delete Workout</Text>
            <Text style={styles.deleteModalSubtitle}>
              Are you sure you want to delete "{workoutName}"?
            </Text>
            <Text style={styles.deleteModalWarning}>
              This action cannot be undone.
            </Text>
          </View>

          <View style={styles.deleteModalActions}>
            <TouchableOpacity style={styles.cancelDeleteButton} onPress={onClose}>
              <Text style={styles.cancelDeleteButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmDeleteButton} onPress={handleConfirm}>
              <Text style={styles.confirmDeleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
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
          <Image 
            source={require('../../assets/men.jpg')} 
            style={styles.workoutImage}
          />
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
          <Image source={require('../../assets/boy.jpg')} style={styles.statIcon} />
          <Text style={styles.statText}>{workout.exercises.length} exercises</Text>
        </View>
        <View style={styles.statItem}>
          <Image source={require('../../assets/women.jpg')} style={styles.statIcon} />
          <Text style={styles.statText}>{workout.totalSets} sets</Text>
        </View>
        <View style={styles.statItem}>
          <Image source={require('../../assets/men.jpg')} style={styles.statIcon} />
          <Text style={styles.statText}>{workout.totalReps} reps</Text>
        </View>
      </View>
      <ScrollView style={styles.exercisesList}>
        {workout.exercises.map(exercise => (
          <View key={exercise.id} style={styles.exerciseItem}>
            <View style={styles.exerciseHeader}>
              <Image source={require('../../assets/boy.jpg')} style={styles.exerciseIcon} />
              <Text style={styles.exerciseName}>{exercise.name}</Text>
            </View>
            <View style={styles.setsContainer}>
              {exercise.sets.map((set, index) => (
                <View key={set.id} style={styles.setItem}>
                  <Image source={require('../../assets/women.jpg')} style={styles.setIcon} />
                  <Text style={styles.setText}>
                    Set {index + 1}: {set.reps} reps {set.weight > 0 ? `@ ${set.weight}kg` : ''}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
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
  const [currentWorkout, setCurrentWorkout] = useState({
    name: '',
    exercises: [],
    date: new Date().toLocaleDateString(),
  });
  const [exerciseModalVisible, setExerciseModalVisible] = useState(false);
  const [currentExercise, setCurrentExercise] = useState({
    name: '',
    sets: [],
  });
  const [setModalVisibleSet, setSetModalVisible] = useState(false);
  const [currentSet, setCurrentSet] = useState({ reps: '', weight: '' });
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [workoutToDelete, setWorkoutToDelete] = useState(null);

  const workoutTypes = [
    'Strength Training',
    'Cardio',
    'Yoga',
    'Pilates',
    'CrossFit',
    'Bodyweight',
    'Olympic Lifting',
    'Powerlifting',
  ];

  const commonExercises = [
    'Bench Press', 'Squat', 'Deadlift', 'Pull-ups', 'Push-ups',
    'Overhead Press', 'Barbell Row', 'Dips', 'Lunges', 'Plank'
  ];

  const addSet = () => {
    if (!currentSet.reps) {
      Alert.alert('Error', 'Please enter reps');
      return;
    }

    const newSet = {
      reps: parseInt(currentSet.reps),
      weight: currentSet.weight ? parseFloat(currentSet.weight) : 0,
      id: Date.now(),
    };

    setCurrentExercise(prev => ({
      ...prev,
      sets: [...prev.sets, newSet],
    }));

    setCurrentSet({ reps: '', weight: '' });
    setSetModalVisible(false);
  };

  const removeSet = (setId) => {
    setCurrentExercise(prev => ({
      ...prev,
      sets: prev.sets.filter(set => set.id !== setId),
    }));
  };

  const addExercise = () => {
    if (!currentExercise.name) {
      Alert.alert('Error', 'Please enter exercise name');
      return;
    }

    if (currentExercise.sets.length === 0) {
      Alert.alert('Error', 'Please add at least one set');
      return;
    }

    const newExercise = {
      ...currentExercise,
      id: Date.now(),
    };

    setCurrentWorkout(prev => ({
      ...prev,
      exercises: [...prev.exercises, newExercise],
    }));

    setCurrentExercise({ name: '', sets: [] });
    setExerciseModalVisible(false);
  };

  const removeExercise = (exerciseId) => {
    setCurrentWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.filter(ex => ex.id !== exerciseId),
    }));
  };

  const saveWorkout = () => {
    if (!currentWorkout.name) {
      Alert.alert('Error', 'Please enter workout name');
      return;
    }

    if (currentWorkout.exercises.length === 0) {
      Alert.alert('Error', 'Please add at least one exercise');
      return;
    }

    const newWorkout = {
      ...currentWorkout,
      id: Date.now(),
      totalSets: currentWorkout.exercises.reduce((total, ex) => total + ex.sets.length, 0),
      totalReps: currentWorkout.exercises.reduce((total, ex) => 
        total + ex.sets.reduce((reps, set) => reps + set.reps, 0), 0),
    };

    setWorkouts(prev => [newWorkout, ...prev]);
    setCurrentWorkout({ name: '', exercises: [], date: new Date().toLocaleDateString() });
    setModalVisible(false);
    
    // Show success modal
    setSuccessMessage('Workout saved successfully!');
    setSuccessModalVisible(true);
  };

  const deleteWorkout = (workoutId) => {
    const workout = workouts.find(w => w.id === workoutId);
    setWorkoutToDelete(workout);
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    if (workoutToDelete) {
      setWorkouts(prev => prev.filter(w => w.id !== workoutToDelete.id));
      setWorkoutToDelete(null);
      
      // Show success modal
      setSuccessMessage('Workout deleted successfully!');
      setSuccessModalVisible(true);
    }
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
          <Image source={require('../../assets/men.jpg')} style={styles.headerIcon} />
          <Text style={styles.headerTitle}>💪 Workout Log</Text>
        </View>
        <PulsingButton style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>+</Text>
        </PulsingButton>
      </View>

      {/* Workout List */}
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

      {/* Enhanced New Workout Modal */}
      <AnimatedModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Create New Workout"
      >
        <ScrollView 
          style={styles.modalContent} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.modalScrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Workout Name Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Workout Name</Text>
            <TextInput
              style={styles.enhancedInput}
              placeholder="e.g., Push Day, Leg Day, Full Body"
              value={currentWorkout.name}
              onChangeText={(text) => setCurrentWorkout(prev => ({ ...prev, name: text }))}
              placeholderTextColor="#999"
            />
          </View>

          {/* Workout Type Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Workout Type</Text>
            <View style={styles.typeContainer}>
              {workoutTypes.map((type, index) => (
                <TouchableOpacity
                  key={type}
                  style={styles.typeButton}
                  onPress={() => setCurrentWorkout(prev => ({ ...prev, type }))}
                >
                  <Text style={styles.typeButtonText}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Exercises Section */}
          <View style={styles.inputGroup}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Exercises</Text>
              <TouchableOpacity
                style={styles.addExerciseButton}
                onPress={() => setExerciseModalVisible(true)}
              >
                <Text style={styles.addExerciseButtonText}>+ Add Exercise</Text>
              </TouchableOpacity>
            </View>
            
            {currentWorkout.exercises.map(exercise => (
              <View key={exercise.id} style={styles.exerciseCard}>
                <View style={styles.exerciseHeader}>
                  <Text style={styles.exerciseCardName}>{exercise.name}</Text>
                  <TouchableOpacity onPress={() => removeExercise(exercise.id)}>
                    <Text style={styles.removeText}>Remove</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.setsPreview}>
                  {exercise.sets.map((set, index) => (
                    <Text key={set.id} style={styles.setPreviewText}>
                      Set {index + 1}: {set.reps} reps {set.weight > 0 ? `@ ${set.weight}kg` : ''}
                    </Text>
                  ))}
                </View>
              </View>
            ))}
          </View>

          {/* Save Button */}
          <TouchableOpacity style={styles.saveWorkoutButton} onPress={saveWorkout}>
            <Text style={styles.saveWorkoutButtonText}>💾 Save Workout</Text>
          </TouchableOpacity>
        </ScrollView>
      </AnimatedModal>

      {/* Enhanced Exercise Modal */}
      <AnimatedModal
        visible={exerciseModalVisible}
        onClose={() => setExerciseModalVisible(false)}
        title="Add Exercise"
      >
        <ScrollView 
          style={styles.modalContent} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.modalScrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Exercise Name Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Exercise Name</Text>
            <TextInput
              style={styles.enhancedInput}
              placeholder="Enter exercise name"
              value={currentExercise.name}
              onChangeText={(text) => setCurrentExercise(prev => ({ ...prev, name: text }))}
              placeholderTextColor="#999"
            />
          </View>

          {/* Quick Select Exercises */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Quick Select</Text>
            <View style={styles.quickSelectContainer}>
              {commonExercises.map(exercise => (
                <TouchableOpacity
                  key={exercise}
                  style={styles.quickSelectButton}
                  onPress={() => setCurrentExercise(prev => ({ ...prev, name: exercise }))}
                >
                  <Text style={styles.quickSelectText}>{exercise}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Sets Section */}
          <View style={styles.inputGroup}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Sets</Text>
              <TouchableOpacity
                style={styles.addSetButton}
                onPress={() => setSetModalVisible(true)}
              >
                <Text style={styles.addSetButtonText}>+ Add Set</Text>
              </TouchableOpacity>
            </View>
            
            {currentExercise.sets.map((set, index) => (
              <View key={set.id} style={styles.setCard}>
                <Text style={styles.setCardText}>
                  Set {index + 1}: {set.reps} reps {set.weight > 0 ? `@ ${set.weight}kg` : ''}
                </Text>
                <TouchableOpacity onPress={() => removeSet(set.id)}>
                  <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Add Exercise Button */}
          <TouchableOpacity style={styles.addExerciseFinalButton} onPress={addExercise}>
            <Text style={styles.addExerciseFinalButtonText}>➕ Add Exercise</Text>
          </TouchableOpacity>
        </ScrollView>
      </AnimatedModal>

      {/* Enhanced Set Modal */}
      <AnimatedModal
        visible={setModalVisibleSet}
        onClose={() => setSetModalVisible(false)}
        title="Add Set"
      >
        <View style={styles.modalContent}>
          {/* Reps Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Reps</Text>
            <TextInput
              style={styles.enhancedInput}
              placeholder="Enter number of reps"
              value={currentSet.reps}
              onChangeText={(text) => setCurrentSet(prev => ({ ...prev, reps: text }))}
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>

          {/* Weight Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Weight (kg) - Optional</Text>
            <TextInput
              style={styles.enhancedInput}
              placeholder="Enter weight in kg"
              value={currentSet.weight}
              onChangeText={(text) => setCurrentSet(prev => ({ ...prev, weight: text }))}
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>

          {/* Add Set Button */}
          <TouchableOpacity style={styles.addSetFinalButton} onPress={addSet}>
            <Text style={styles.addSetFinalButtonText}>➕ Add Set</Text>
          </TouchableOpacity>
        </View>
      </AnimatedModal>

      {/* Success Modal */}
      <SuccessModal
        visible={successModalVisible}
        onClose={() => setSuccessModalVisible(false)}
        message={successMessage}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        visible={deleteModalVisible}
        onClose={() => {
          setDeleteModalVisible(false);
          setWorkoutToDelete(null);
        }}
        onConfirm={confirmDelete}
        workoutName={workoutToDelete?.name || ''}
      />
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
  workoutsList: {
    flex: 1,
    padding: 16,
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
  workoutImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'System',
    letterSpacing: 0.3,
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
