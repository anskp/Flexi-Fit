import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Modal,
  TextInput,
  ImageBackground,
  Alert,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';

// --- NEW, REFACTORED API IMPORTS ---
import { getDashboardData } from '../../api/dashboardService';
import { saveDietEntry } from '../../api/dietService';
import { saveWorkoutEntry } from '../../api/trainingService';

const Activity = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('activity');
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [customStartDate, setCustomStartDate] = useState(new Date());
  const [customEndDate, setCustomEndDate] = useState(new Date());

  // --- API DATA STATES ---
  const [activityData, setActivityData] = useState(null);
  const [dietData, setDietData] = useState(null);
  const [trainingData, setTrainingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // --- Diet Modal States (No changes needed) ---
  const [showDietModal, setShowDietModal] = useState(false);
  const [dietForm, setDietForm] = useState({
    mealName: '', calories: '', protein: '', carbs: '', fats: '',
    fiber: '', sugar: '', mealType: 'breakfast', photo: null, notes: ''
  });
  const [modalScale] = useState(new Animated.Value(0));
  const [modalOpacity] = useState(new Animated.Value(0));

  // --- Workout Modal States (No changes needed) ---
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [workoutForm, setWorkoutForm] = useState({
    workoutType: '', workoutName: '', date: new Date().toISOString().split('T')[0], duration: '',
    exercises: [{ name: '', sets: '', reps: '', weight: '', notes: '' }],
    notes: '', intensity: 'medium', muscleGroups: [], equipment: []
  });
  const [workoutModalScale] = useState(new Animated.Value(0));
  const [workoutModalOpacity] = useState(new Animated.Value(0));
  const [selectedWorkoutCategory, setSelectedWorkoutCategory] = useState('strength');
  const [selectedPredefinedWorkout, setSelectedPredefinedWorkout] = useState(null);

  // --- UPDATED DATA FETCHING AND SUBMISSION LOGIC ---
  
  const fetchDashboard = async () => {
    const response = await getDashboardData();
    if (response.success && response.data) {
        setActivityData(response.data.activity);
        setDietData(response.data.diet);
        setTrainingData(response.data.training);
        setError(null);
    } else {
        setError(response.message);
        Alert.alert('Loading Error', response.message);
    }
  };

  useEffect(() => {
    const initialFetch = async () => {
        setLoading(true);
        await fetchDashboard();
        setLoading(false);
    }
    initialFetch();
  
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSaveDiet = async () => {
    if (!dietForm.mealName.trim() || !dietForm.calories.trim()) {
      Alert.alert('Validation Error', 'Please enter at least a meal name and calories.');
      return;
    }
    
    const response = await saveDietEntry(dietForm); 

    if (response.success) {
      Alert.alert('Success', response.message || 'Meal logged successfully!');
      closeDietModal();
      // Refetch all dashboard data to ensure all stats are updated
      await fetchDashboard();
    } else {
      Alert.alert('API Error', response.message);
    }
  };
  
  const handleSaveWorkout = async () => {
    if (!workoutForm.workoutName.trim() || !workoutForm.date.trim() || !workoutForm.duration.trim() || !workoutForm.exercises[0].name.trim()) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }
    
    const response = await saveWorkoutEntry(workoutForm);

    if (response.success) {
        Alert.alert('Success', response.message || 'Workout saved successfully!');
        closeWorkoutModal();
        // Refetch all dashboard data to ensure all stats are updated
        await fetchDashboard();
    } else {
        Alert.alert('API Error', response.message);
    }
  };

  // --- MODAL AND HELPER FUNCTIONS (No changes needed) ---
  const openDietModal = () => { setShowDietModal(true); /*...animations...*/ };
  const closeDietModal = () => { /*...animations...*/ setShowDietModal(false); resetDietForm(); };
  const resetDietForm = () => { setDietForm({ mealName: '', calories: '', protein: '', carbs: '', fats: '', fiber: '', sugar: '', mealType: 'breakfast', photo: null, notes: '' }); };
  const handleDietInput = (key, value) => setDietForm(prev => ({ ...prev, [key]: value }));
  const selectMealPhoto = () => { /* ...image picker logic... */ };
  const openWorkoutModal = () => { setShowWorkoutModal(true); /*...animations...*/ };
  const closeWorkoutModal = () => { /*...animations...*/ setShowWorkoutModal(false); resetWorkoutForm(); };
  const resetWorkoutForm = () => { setWorkoutForm({ workoutType: '', workoutName: '', date: new Date().toISOString().split('T')[0], duration: '', exercises: [{ name: '', sets: '', reps: '', weight: '', notes: '' }], notes: '', intensity: 'medium', muscleGroups: [], equipment: [] }); };
  const handleWorkoutInput = (key, value) => setWorkoutForm(prev => ({ ...prev, [key]: value }));
  const addExercise = () => setWorkoutForm(prev => ({ ...prev, exercises: [...prev.exercises, { name: '', sets: '', reps: '', weight: '', notes: '' }] }));
  const removeExercise = (index) => { if (workoutForm.exercises.length > 1) { setWorkoutForm(prev => ({ ...prev, exercises: prev.exercises.filter((_, i) => i !== index) })); } };
  const handleExerciseInput = (index, key, value) => setWorkoutForm(prev => ({ ...prev, exercises: prev.exercises.map((exercise, i) => i === index ? { ...exercise, [key]: value } : exercise) }));
  const selectWorkoutCategory = (category) => { setSelectedWorkoutCategory(category); /*...*/ };
  const selectPredefinedWorkout = (workout) => { setSelectedPredefinedWorkout(workout); /*...*/ };
  const toggleMuscleGroup = (muscleGroup) => { setWorkoutForm(prev => ({...prev, muscleGroups: prev.muscleGroups.includes(muscleGroup) ? prev.muscleGroups.filter(mg => mg !== muscleGroup) : [...prev.muscleGroups, muscleGroup]})); };
  const toggleEquipment = (equipmentItem) => { setWorkoutForm(prev => ({...prev, equipment: prev.equipment.includes(equipmentItem) ? prev.equipment.filter(eq => eq !== equipmentItem) : [...prev.equipment, equipmentItem]})); };

  // Local UI data for modals can remain
  const workoutCategories = { /* ...original data... */ };
  const muscleGroups = [ /* ...original data... */ ];
  const equipment = [ /* ...original data... */ ];

  const tabs = [
    { id: 'activity', title: 'Activity', icon: '📊' },
    { id: 'diet', title: 'Diet', icon: '🥗' },
    { id: 'training', title: 'Training', icon: '💪' },
  ];

  // --- CONDITIONAL RENDERING FOR LOADING AND ERROR STATES ---
  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#e74c3c" />
        <Text style={{ marginTop: 15, fontSize: 16, color: '#555' }}>Loading Your Fitness Data...</Text>
      </View>
    );
  }

  if (error || !activityData || !dietData || !trainingData) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
        <Text style={{ color: '#c0392b', marginBottom: 20, fontSize: 16, textAlign: 'center' }}>
          {error || 'An unexpected error occurred while loading your data.'}
        </Text>
        <TouchableOpacity onPress={fetchDashboard} style={styles.applyDateButton}>
          <Text style={styles.applyDateButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- RENDER FUNCTIONS ---
  const renderActivityTab = () => (
    <Animated.View style={[styles.tabContent, { opacity: fadeAnim }]}>
      {/* (Your original JSX for the Activity Tab goes here) */}
    </Animated.View>
  );

  const renderDietTab = () => (
    <Animated.View style={[styles.tabContent, { opacity: fadeAnim }]}>
      {/* (Your original JSX for the Diet Tab goes here) */}
    </Animated.View>
  );

  const renderTrainingTab = () => (
    <Animated.View style={[styles.tabContent, { opacity: fadeAnim }]}>
      {/* (Your original JSX for the Training Tab goes here) */}
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {/* Header and Tab Navigation (No changes needed) */}
      <LinearGradient colors={['#e74c3c', '#c0392b']} style={styles.header}>
        {/* ... */}
      </LinearGradient>
      <View style={styles.tabContainer}>
        {/* ... */}
      </View>

      {/* Tab Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'activity' && renderActivityTab()}
        {activeTab === 'diet' && renderDietTab()}
        {activeTab === 'training' && renderTrainingTab()}
      </ScrollView>

      {/* Buttons and Modals */}
      <TouchableOpacity 
        style={styles.flexiFitButton}
        onPress={() => navigation.navigate('FlexiFitAI')}
      >
        {/* ... */}
      </TouchableOpacity>
      
      {/* ... other modals like Custom Date Picker ... */}

      {/* Diet Modal - with updated onPress */}
      <Modal visible={showDietModal} transparent={true} animationType="fade" onRequestClose={closeDietModal}>
          {/* ... modal content ... */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveDiet}>
              <Text style={styles.saveButtonText}>Save Meal</Text>
          </TouchableOpacity>
          {/* ... */}
      </Modal>

      {/* Workout Logging Modal - with updated onPress */}
      <Modal visible={showWorkoutModal} transparent={true} animationType="fade" onRequestClose={closeWorkoutModal}>
          {/* ... modal content ... */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveWorkout}>
              <Text style={styles.saveButtonText}>💾 Save Workout</Text>
          </TouchableOpacity>
          {/* ... */}
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  activePeriodButton: {
    backgroundColor: '#e74c3c',
  },
  periodText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activePeriodText: {
    color: 'white',
  },
  chartCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  advancedStatsCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  advancedStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  advancedStatItem: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 10,
  },
  advancedStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 5,
  },
  advancedStatLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  mealTrackerCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  mealTime: {
    fontSize: 12,
    color: '#666',
  },
  mealDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealCalories: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e74c3c',
    marginRight: 10,
  },
  mealStatus: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mealCompleted: {
    backgroundColor: '#27ae60',
  },
  mealStatusText: {
    fontSize: 12,
    color: '#666',
  },
  macroHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 5,
  },
  macroTarget: {
    fontSize: 12,
    color: '#999',
    marginLeft: 5,
  },
  weeklyScheduleCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  weeklySchedule: {
    gap: 10,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dayName: {
    width: 80,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  workoutSchedule: {
    flex: 1,
    marginLeft: 15,
  },
  completionStatus: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedStatus: {
    backgroundColor: '#27ae60',
  },
  completionText: {
    fontSize: 12,
    color: '#666',
  },
  upcomingWorkoutsCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  upcomingWorkoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  achievementsCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementItem: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 10,
    opacity: 0.5,
  },
  achievementEarned: {
    opacity: 1,
    backgroundColor: '#e8f5e8',
  },
  achievementIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  achievementName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  achievementDescription: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#e74c3c',
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 5,
  },
  tabText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  activeTabText: {
    color: 'white',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  tabContent: {
    paddingTop: 20,
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#e74c3c',
    borderRadius: 2,
  },
  statsCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  activitiesCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activityIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  activityInfo: {
    flex: 1,
  },
  activityName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#666',
  },
  activityCalories: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e74c3c',
  },
  nutritionCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  calorieSection: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  calorieValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  calorieLabel: {
    fontSize: 16,
    color: '#666',
    marginLeft: 5,
  },
  macrosCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  macrosGrid: {
    gap: 15,
  },
  macroItem: {
    marginBottom: 10,
  },
  macroValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  macroLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  macroBar: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
  },
  macroFill: {
    height: '100%',
    borderRadius: 3,
  },
  waterCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  waterSection: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 15,
  },
  waterValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3498db',
  },
  waterLabel: {
    fontSize: 16,
    color: '#666',
    marginLeft: 5,
  },
  waterBottles: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  waterBottle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  waterBottleFilled: {
    backgroundColor: '#3498db',
  },
  waterBottleText: {
    fontSize: 16,
  },
  planCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  planInfo: {
    marginBottom: 15,
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  planProgress: {
    fontSize: 14,
    color: '#666',
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  nextWorkoutCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  workoutInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  workoutIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  workoutDetails: {
    flex: 1,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  workoutTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  workoutDuration: {
    fontSize: 12,
    color: '#999',
  },
  startWorkoutButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  startWorkoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  trainingStatsCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  trainingStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  trainingStat: {
    alignItems: 'center',
    flex: 1,
  },
  trainingStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  trainingStatLabel: {
    fontSize: 12,
    color: '#666',
  },

  // Custom Date Picker Modal Styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  customDateModal: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    fontSize: 24,
    color: '#666',
    fontWeight: 'bold',
  },
  datePickerContainer: {
    marginBottom: 20,
  },
  dateInput: {
    marginBottom: 15,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  dateButton: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  applyDateButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyDateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  flexiFitButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    zIndex: 1000,
  },
  flexiFitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  flexiFitIcon: {
    fontSize: 20,
    marginRight: 6,
  },
  flexiFitText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  
  // Diet Modal Styles
  dietModalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  dietForm: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  photoButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    overflow: 'hidden',
  },
  photoPreview: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  photoPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 50,
  },
  photoPlaceholderText: {
    fontSize: 30,
    color: '#999',
  },
  removePhotoButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removePhotoText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dietActionButton: {
    width: '100%',
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
  },
  dietActionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  dietActionIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  dietActionTextContainer: {
    flex: 1,
  },
  dietActionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 2,
  },
  dietActionSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  dietActionArrow: {
    fontSize: 20,
    color: 'white',
    marginLeft: 10,
  },

  // Workout Logging Button Styles
  workoutLoggingButton: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  workoutLoggingGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingHorizontal: 25,
  },
  workoutLoggingIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  workoutLoggingTextContainer: {
    flex: 1,
  },
  workoutLoggingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  workoutLoggingSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  workoutLoggingArrow: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },

  // Workout Logging Modal Styles
  workoutModalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    maxHeight: '85%',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  workoutForm: {
    width: '100%',
    marginBottom: 20,
  },
  sectionContainer: {
    marginBottom: 25,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 12,
  },
  categoryCard: {
    width: '45%',
    aspectRatio: 1.2,
    borderRadius: 15,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedCategoryCard: {
    borderColor: '#e74c3c',
    backgroundColor: '#fff5f5',
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    lineHeight: 16,
  },
  selectedCategoryName: {
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  workoutGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 12,
  },
  workoutCard: {
    width: '45%',
    aspectRatio: 1.2,
    borderRadius: 15,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedWorkoutCard: {
    borderColor: '#e74c3c',
    backgroundColor: '#fff5f5',
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
  },
  workoutCardName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
    lineHeight: 16,
  },
  selectedWorkoutCardName: {
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  workoutCardExercises: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
  selectedWorkoutCardExercises: {
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  inputGroup: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  intensitySelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 6,
  },
  intensityButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: 'white',
  },
  selectedIntensityButton: {
    backgroundColor: '#e74c3c',
    borderColor: '#e74c3c',
  },
  intensityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  selectedIntensityText: {
    color: 'white',
  },
  tagGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedTag: {
    backgroundColor: '#e74c3c',
    borderColor: '#e74c3c',
  },
  tagText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  selectedTagText: {
    color: 'white',
    fontWeight: '600',
  },
  exerciseItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    padding: 18,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  exerciseNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  removeExerciseButton: {
    padding: 8,
    backgroundColor: '#ffe6e6',
    borderRadius: 20,
  },
  removeExerciseText: {
    fontSize: 16,
    color: '#e74c3c',
  },
  exerciseMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    gap: 8,
  },
  metricInput: {
    flex: 1,
  },
  addExerciseButton: {
    backgroundColor: '#e8f5e8',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 15,
    borderWidth: 2,
    borderColor: '#4CAF50',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  addExerciseButtonText: {
    color: '#2E7D32',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Input styles
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: 'white',
    color: '#333',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  // Save button styles
  saveButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 18,
    paddingHorizontal: 35,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderWidth: 2,
    borderColor: '#c0392b',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

});

export default Activity;