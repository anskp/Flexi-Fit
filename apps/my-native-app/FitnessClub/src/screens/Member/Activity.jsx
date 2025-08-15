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
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';


const Activity = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('activity');
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [customStartDate, setCustomStartDate] = useState(new Date());
  const [customEndDate, setCustomEndDate] = useState(new Date());
  
  // Diet Modal States
  const [showDietModal, setShowDietModal] = useState(false);
  const [dietForm, setDietForm] = useState({
    mealName: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
    fiber: '',
    sugar: '',
    mealType: 'breakfast',
    photo: null,
    notes: ''
  });
  const [selectedMealType, setSelectedMealType] = useState('breakfast');
  const [modalScale] = useState(new Animated.Value(0));
  const [modalOpacity] = useState(new Animated.Value(0));

  // Diet Modal Functions
  const openDietModal = () => {
    setShowDietModal(true);
    Animated.parallel([
      Animated.spring(modalScale, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(modalOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeDietModal = () => {
    Animated.parallel([
      Animated.spring(modalScale, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(modalOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowDietModal(false);
      resetDietForm();
    });
  };

  const resetDietForm = () => {
    setDietForm({
      mealName: '',
      calories: '',
      protein: '',
      carbs: '',
      fats: '',
      fiber: '',
      sugar: '',
      mealType: 'breakfast',
      photo: null,
      notes: ''
    });
    setSelectedMealType('breakfast');
  };

  const handleDietInput = (key, value) => {
    setDietForm(prev => ({ ...prev, [key]: value }));
  };

  const selectMealPhoto = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 800,
      maxHeight: 800,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        return;
      }
      if (response.errorCode) {
        Alert.alert('Error', 'Failed to select image');
        return;
      }
      if (response.assets && response.assets[0]) {
        setDietForm(prev => ({ ...prev, photo: response.assets[0] }));
      }
    });
  };

  const saveDietEntry = () => {
    if (!dietForm.mealName.trim()) {
      Alert.alert('Error', 'Please enter a meal name');
      return;
    }
    if (!dietForm.calories.trim()) {
      Alert.alert('Error', 'Please enter calories');
      return;
    }

    // Here you would typically save to your database
    Alert.alert('Success', 'Meal logged successfully!', [
      { text: 'OK', onPress: closeDietModal }
    ]);
  };

  // Workout Modal States
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [workoutForm, setWorkoutForm] = useState({
    workoutType: '',
    workoutName: '',
    date: new Date().toISOString().split('T')[0],
    duration: '',
    exercises: [{ name: '', sets: '', reps: '', weight: '', notes: '' }],
    notes: '',
    intensity: 'medium',
    muscleGroups: [],
    equipment: []
  });
  const [workoutModalScale] = useState(new Animated.Value(0));
  const [workoutModalOpacity] = useState(new Animated.Value(0));
  const [selectedWorkoutCategory, setSelectedWorkoutCategory] = useState('strength');
  const [selectedPredefinedWorkout, setSelectedPredefinedWorkout] = useState(null);

  // Predefined workout data
  const workoutCategories = {
    strength: {
      name: 'Strength Training',
      icon: '💪',
      color: '#e74c3c',
      workouts: [
        { name: 'Upper Body Push', exercises: ['Bench Press', 'Overhead Press', 'Dips', 'Push-ups'] },
        { name: 'Upper Body Pull', exercises: ['Pull-ups', 'Rows', 'Lat Pulldowns', 'Bicep Curls'] },
        { name: 'Lower Body', exercises: ['Squats', 'Deadlifts', 'Lunges', 'Leg Press'] },
        { name: 'Full Body', exercises: ['Deadlifts', 'Squats', 'Push-ups', 'Rows'] }
      ]
    },
    cardio: {
      name: 'Cardio',
      icon: '🏃',
      color: '#3498db',
      workouts: [
        { name: 'HIIT Session', exercises: ['Burpees', 'Mountain Climbers', 'Jump Squats', 'High Knees'] },
        { name: 'Steady State', exercises: ['Running', 'Cycling', 'Rowing', 'Elliptical'] },
        { name: 'Circuit Training', exercises: ['Jump Rope', 'Box Jumps', 'Burpees', 'Mountain Climbers'] }
      ]
    },
    flexibility: {
      name: 'Flexibility & Mobility',
      icon: '🧘',
      color: '#9b59b6',
      workouts: [
        { name: 'Yoga Flow', exercises: ['Sun Salutation', 'Warrior Poses', 'Tree Pose', 'Child\'s Pose'] },
        { name: 'Stretching', exercises: ['Hamstring Stretch', 'Hip Flexor Stretch', 'Shoulder Stretch', 'Chest Stretch'] },
        { name: 'Mobility Work', exercises: ['Hip Circles', 'Shoulder Dislocates', 'Ankle Mobility', 'Thoracic Rotation'] }
      ]
    },
    functional: {
      name: 'Functional Training',
      icon: '⚡',
      color: '#f39c12',
      workouts: [
        { name: 'Core Focus', exercises: ['Planks', 'Russian Twists', 'Leg Raises', 'Crunches'] },
        { name: 'Balance & Stability', exercises: ['Single Leg Deadlifts', 'Bosu Ball Squats', 'Pistol Squats', 'Standing Y-Balance'] },
        { name: 'Power Training', exercises: ['Box Jumps', 'Medicine Ball Throws', 'Plyometric Push-ups', 'Explosive Squats'] }
      ]
    }
  };

  const muscleGroups = [
    'Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Forearms',
    'Quadriceps', 'Hamstrings', 'Glutes', 'Calves', 'Core', 'Full Body'
  ];

  const equipment = [
    'Barbell', 'Dumbbells', 'Kettlebell', 'Resistance Bands', 'Bodyweight',
    'Machine', 'Cable', 'Smith Machine', 'TRX', 'Medicine Ball'
  ];

  // Workout Modal Functions
  const openWorkoutModal = () => {
    setShowWorkoutModal(true);
    Animated.parallel([
      Animated.spring(workoutModalScale, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(workoutModalOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeWorkoutModal = () => {
    Animated.parallel([
      Animated.spring(workoutModalScale, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(workoutModalOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowWorkoutModal(false);
      resetWorkoutForm();
    });
  };

  const resetWorkoutForm = () => {
    setWorkoutForm({
      workoutType: '',
      workoutName: '',
      date: new Date().toISOString().split('T')[0],
      duration: '',
      exercises: [{ name: '', sets: '', reps: '', weight: '', notes: '' }],
      notes: '',
      intensity: 'medium',
      muscleGroups: [],
      equipment: []
    });
    setSelectedWorkoutCategory('strength');
  };

  const handleWorkoutInput = (key, value) => {
    setWorkoutForm(prev => ({ ...prev, [key]: value }));
  };

  const addExercise = () => {
    setWorkoutForm(prev => ({
      ...prev,
      exercises: [...prev.exercises, { name: '', sets: '', reps: '', weight: '', notes: '' }]
    }));
  };

  const removeExercise = (index) => {
    if (workoutForm.exercises.length > 1) {
      setWorkoutForm(prev => ({
        ...prev,
        exercises: prev.exercises.filter((_, i) => i !== index)
      }));
    }
  };

  const handleExerciseInput = (index, key, value) => {
    setWorkoutForm(prev => ({
      ...prev,
      exercises: prev.exercises.map((exercise, i) =>
        i === index ? { ...exercise, [key]: value } : exercise
      )
    }));
  };

  const selectWorkoutCategory = (category) => {
    setSelectedWorkoutCategory(category);
    setWorkoutForm(prev => ({ ...prev, workoutType: workoutCategories[category].name }));
  };

  const selectPredefinedWorkout = (workout) => {
    setSelectedPredefinedWorkout(workout);
    setWorkoutForm(prev => ({ 
      ...prev, 
      workoutName: workout.name,
      exercises: workout.exercises.map(exercise => ({ 
        name: exercise, 
        sets: '', 
        reps: '', 
        weight: '', 
        notes: '' 
      }))
    }));
  };

  const toggleMuscleGroup = (muscleGroup) => {
    setWorkoutForm(prev => ({
      ...prev,
      muscleGroups: prev.muscleGroups.includes(muscleGroup)
        ? prev.muscleGroups.filter(mg => mg !== muscleGroup)
        : [...prev.muscleGroups, muscleGroup]
    }));
  };

  const toggleEquipment = (equipmentItem) => {
    setWorkoutForm(prev => ({
      ...prev,
      equipment: prev.equipment.includes(equipmentItem)
        ? prev.equipment.filter(eq => eq !== equipmentItem)
        : [...prev.equipment, equipmentItem]
    }));
  };

  const saveWorkoutEntry = () => {
    // Validate required fields
    if (!workoutForm.workoutName.trim()) {
      Alert.alert('Missing Information', 'Please enter a workout name');
      return;
    }
    if (!workoutForm.date.trim()) {
      Alert.alert('Missing Information', 'Please enter a date');
      return;
    }
    if (!workoutForm.duration.trim()) {
      Alert.alert('Missing Information', 'Please enter workout duration');
      return;
    }
    if (!workoutForm.exercises[0].name.trim()) {
      Alert.alert('Missing Information', 'Please add at least one exercise');
      return;
    }

    // Validate exercise data
    const hasValidExercises = workoutForm.exercises.every(exercise => 
      exercise.name.trim() && exercise.sets.trim() && exercise.reps.trim()
    );
    
    if (!hasValidExercises) {
      Alert.alert('Missing Information', 'Please fill in exercise name, sets, and reps for all exercises');
      return;
    }

    // Success message with workout summary
    const workoutSummary = {
      name: workoutForm.workoutName,
      type: workoutForm.workoutType,
      date: workoutForm.date,
      duration: workoutForm.duration,
      intensity: workoutForm.intensity,
      exercises: workoutForm.exercises.length,
      muscleGroups: workoutForm.muscleGroups.length,
      equipment: workoutForm.equipment.length
    };

    Alert.alert(
      'Workout Saved! 💪', 
      `Successfully logged ${workoutSummary.name}\n\n` +
      `Type: ${workoutSummary.type}\n` +
      `Duration: ${workoutSummary.duration} minutes\n` +
      `Intensity: ${workoutSummary.intensity}\n` +
      `Exercises: ${workoutSummary.exercises}\n` +
      `Muscle Groups: ${workoutSummary.muscleGroups}\n` +
      `Equipment: ${workoutSummary.equipment}`,
      [{ text: 'Great!', onPress: closeWorkoutModal }]
    );
  };

  const tabs = [
    { id: 'activity', title: 'Activity', icon: '📊' },
    { id: 'diet', title: 'Diet', icon: '🥗' },
    { id: 'training', title: 'Training', icon: '💪' },
  ];

  const activityData = {
    todaySteps: 8547,
    weeklyGoal: 10000,
    caloriesBurned: 342,
    activeMinutes: 45,
    workoutsThisWeek: 4,
    streak: 7,
    weeklySteps: [6500, 7200, 8100, 7800, 9200, 8800, 8547],
    weeklyCalories: [280, 310, 350, 320, 380, 360, 342],
    weeklyWorkouts: [1, 0, 1, 1, 0, 1, 1],
    monthlyProgress: 78,
    yearToDate: 156,
    totalCalories: 12450,
  };

  const dietData = {
    todayCalories: 1850,
    dailyGoal: 2200,
    protein: 120,
    carbs: 180,
    fats: 65,
    waterIntake: 6,
    dailyGoalWater: 8,
    weeklyCalories: [2100, 1950, 2300, 1850, 2000, 2150, 1850],
    weeklyProtein: [140, 130, 150, 120, 135, 145, 120],
    weeklyCarbs: [200, 180, 220, 180, 190, 210, 180],
    weeklyFats: [70, 65, 75, 65, 68, 72, 65],
    weeklyWater: [7, 6, 8, 6, 7, 8, 6],
    meals: [
      { name: 'Breakfast', calories: 450, time: '8:00 AM', completed: true },
      { name: 'Lunch', calories: 650, time: '1:00 PM', completed: true },
      { name: 'Snack', calories: 200, time: '4:00 PM', completed: true },
      { name: 'Dinner', calories: 550, time: '8:00 PM', completed: false },
    ],
    nutritionGoals: {
      protein: { current: 120, target: 150, unit: 'g' },
      carbs: { current: 180, target: 200, unit: 'g' },
      fats: { current: 65, target: 70, unit: 'g' },
      fiber: { current: 25, target: 30, unit: 'g' },
      sugar: { current: 45, target: 50, unit: 'g' },
    }
  };

  const trainingData = {
    currentPlan: "Strength Training",
    nextWorkout: "Upper Body",
    weeklyProgress: 75,
    totalWorkouts: 12,
    thisMonth: 4,
    weeklyWorkouts: [1, 0, 1, 1, 0, 1, 1],
    monthlyWorkouts: [4, 5, 3, 4, 6, 4, 4],
    workoutTypes: [
      { name: 'Strength', count: 8, color: '#e74c3c' },
      { name: 'Cardio', count: 3, color: '#3498db' },
      { name: 'Yoga', count: 1, color: '#9b59b6' },
    ],
    currentWeek: {
      monday: { workout: 'Upper Body', completed: true, duration: 45 },
      tuesday: { workout: 'Rest', completed: true, duration: 0 },
      wednesday: { workout: 'Lower Body', completed: true, duration: 50 },
      thursday: { workout: 'Cardio', completed: true, duration: 30 },
      friday: { workout: 'Rest', completed: true, duration: 0 },
      saturday: { workout: 'Full Body', completed: true, duration: 60 },
      sunday: { workout: 'Yoga', completed: false, duration: 0 },
    },
    upcomingWorkouts: [
      { name: 'Upper Body', date: 'Today', time: '6:00 PM', duration: 45, exercises: 8 },
      { name: 'Lower Body', date: 'Tomorrow', time: '7:00 AM', duration: 50, exercises: 6 },
      { name: 'Cardio HIIT', date: 'Wednesday', time: '6:30 PM', duration: 30, exercises: 5 },
    ],
    achievements: [
      { name: 'First Workout', icon: '🏆', description: 'Completed your first workout', earned: true },
      { name: 'Week Warrior', icon: '🔥', description: 'Worked out 5 days in a week', earned: true },
      { name: 'Strength Master', icon: '💪', description: 'Completed 10 strength workouts', earned: false },
    ]
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);



  const renderActivityTab = () => (
    <Animated.View style={[styles.tabContent, { opacity: fadeAnim }]}>
      {/* Enhanced Period Selector */}
      <View style={styles.periodSelector}>
        {['today', 'week', 'month', 'custom'].map((period) => (
          <TouchableOpacity
            key={period}
            style={[styles.periodButton, selectedPeriod === period && styles.activePeriodButton]}
            onPress={() => {
              if (period === 'custom') {
                setShowCustomDatePicker(true);
              } else {
                setSelectedPeriod(period);
              }
            }}
          >
            <Text style={[styles.periodText, selectedPeriod === period && styles.activePeriodText]}>
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>



      {/* Today's Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Today's Activity</Text>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{activityData.todaySteps.toLocaleString()}</Text>
            <Text style={styles.summaryLabel}>Steps</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${(activityData.todaySteps / activityData.weeklyGoal) * 100}%` }]} />
            </View>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{activityData.caloriesBurned}</Text>
            <Text style={styles.summaryLabel}>Calories</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{activityData.activeMinutes}</Text>
            <Text style={styles.summaryLabel}>Active Min</Text>
          </View>
        </View>
      </View>

      {/* Weekly Steps Chart */}
      <View style={styles.chartCard}>
        <Text style={styles.cardTitle}>Weekly Steps Progress</Text>
        <LineChart
          data={{
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
              data: activityData.weeklySteps
            }]
          }}
          width={Dimensions.get('window').width - 40}
          height={180}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(231, 76, 60, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#e74c3c"
            }
          }}
          bezier
          style={styles.chart}
        />
      </View>

      {/* Advanced Stats */}
      <View style={styles.advancedStatsCard}>
        <Text style={styles.cardTitle}>Advanced Statistics</Text>
        <View style={styles.advancedStatsGrid}>
          <View style={styles.advancedStatItem}>
            <Text style={styles.advancedStatValue}>{activityData.monthlyProgress}%</Text>
            <Text style={styles.advancedStatLabel}>Monthly Goal</Text>
          </View>
          <View style={styles.advancedStatItem}>
            <Text style={styles.advancedStatValue}>{activityData.yearToDate}</Text>
            <Text style={styles.advancedStatLabel}>Workouts YTD</Text>
          </View>
          <View style={styles.advancedStatItem}>
            <Text style={styles.advancedStatValue}>{activityData.totalCalories.toLocaleString()}</Text>
            <Text style={styles.advancedStatLabel}>Total Calories</Text>
          </View>
          <View style={styles.advancedStatItem}>
            <Text style={styles.advancedStatValue}>4.8⭐</Text>
            <Text style={styles.advancedStatLabel}>Avg Rating</Text>
          </View>
        </View>
      </View>

      {/* Weekly Stats */}
      <View style={styles.statsCard}>
        <Text style={styles.cardTitle}>This Week</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>🔥</Text>
            <Text style={styles.statValue}>{activityData.workoutsThisWeek}</Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>⚡</Text>
            <Text style={styles.statValue}>{activityData.streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>🎯</Text>
            <Text style={styles.statValue}>85%</Text>
            <Text style={styles.statLabel}>Goal Progress</Text>
          </View>
        </View>
      </View>

      {/* Recent Activities */}
      <View style={styles.activitiesCard}>
        <Text style={styles.cardTitle}>Recent Activities</Text>
        {[
          { type: '🏃‍♂️', name: 'Morning Run', time: '7:30 AM', duration: '30 min', calories: 280 },
          { type: '🏋️‍♂️', name: 'Strength Training', time: '6:00 PM', duration: '45 min', calories: 320 },
          { type: '🧘‍♀️', name: 'Yoga Session', time: '8:00 PM', duration: '20 min', calories: 120 },
        ].map((activity, index) => (
          <View key={index} style={styles.activityItem}>
            <Text style={styles.activityIcon}>{activity.type}</Text>
            <View style={styles.activityInfo}>
              <Text style={styles.activityName}>{activity.name}</Text>
              <Text style={styles.activityTime}>{activity.time} • {activity.duration}</Text>
            </View>
            <Text style={styles.activityCalories}>{activity.calories} cal</Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );

  const renderDietTab = () => (
    <Animated.View style={[styles.tabContent, { opacity: fadeAnim }]}>
      {/* Diet Action Button */}
      <TouchableOpacity style={styles.dietActionButton} onPress={openDietModal}>
        <LinearGradient
          colors={['#FF6B6B', '#FF8E8E', '#FFB3B3']}
          style={styles.dietActionGradient}
        >
          <Text style={styles.dietActionIcon}>📸</Text>
          <View style={styles.dietActionTextContainer}>
            <Text style={styles.dietActionTitle}>Log Your Meal</Text>
            <Text style={styles.dietActionSubtitle}>Upload photos & track nutrition</Text>
          </View>
          <Text style={styles.dietActionArrow}>→</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Daily Nutrition */}
      <View style={styles.nutritionCard}>
        <Text style={styles.cardTitle}>Today's Nutrition</Text>
        <View style={styles.calorieSection}>
          <Text style={styles.calorieValue}>{dietData.todayCalories}</Text>
          <Text style={styles.calorieLabel}>/ {dietData.dailyGoal} calories</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(dietData.todayCalories / dietData.dailyGoal) * 100}%` }]} />
        </View>
      </View>

      {/* Weekly Calories Chart */}
      <View style={styles.chartCard}>
        <Text style={styles.cardTitle}>Weekly Calories Trend</Text>
        <BarChart
          data={{
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
              data: dietData.weeklyCalories
            }]
          }}
          width={Dimensions.get('window').width - 40}
          height={180}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16
            }
          }}
          style={styles.chart}
        />
      </View>

      {/* Meal Tracker */}
      <View style={styles.mealTrackerCard}>
        <Text style={styles.cardTitle}>Today's Meals</Text>
        {dietData.meals.map((meal, index) => (
          <View key={index} style={styles.mealItem}>
            <View style={styles.mealInfo}>
              <Text style={styles.mealName}>{meal.name}</Text>
              <Text style={styles.mealTime}>{meal.time}</Text>
            </View>
            <View style={styles.mealDetails}>
              <Text style={styles.mealCalories}>{meal.calories} cal</Text>
              <View style={[styles.mealStatus, meal.completed && styles.mealCompleted]}>
                <Text style={styles.mealStatusText}>{meal.completed ? '✓' : '○'}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Enhanced Macros */}
      <View style={styles.macrosCard}>
        <Text style={styles.cardTitle}>Macronutrients</Text>
        <View style={styles.macrosGrid}>
          {Object.entries(dietData.nutritionGoals).map(([key, value]) => (
            <View key={key} style={styles.macroItem}>
              <View style={styles.macroHeader}>
                <Text style={styles.macroValue}>{value.current}{value.unit}</Text>
                <Text style={styles.macroTarget}>/ {value.target}{value.unit}</Text>
              </View>
              <Text style={styles.macroLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
              <View style={[styles.macroBar, { backgroundColor: '#f0f0f0' }]}>
                <View 
                  style={[
                    styles.macroFill, 
                    { 
                      width: `${Math.min((value.current / value.target) * 100, 100)}%`,
                      backgroundColor: key === 'protein' ? '#e74c3c' : 
                                    key === 'carbs' ? '#f39c12' : 
                                    key === 'fats' ? '#3498db' :
                                    key === 'fiber' ? '#27ae60' : '#9b59b6'
                    }
                  ]} 
                />
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Water Intake */}
      <View style={styles.waterCard}>
        <Text style={styles.cardTitle}>Water Intake</Text>
        <View style={styles.waterSection}>
          <Text style={styles.waterValue}>{dietData.waterIntake}</Text>
          <Text style={styles.waterLabel}>/ {dietData.dailyGoalWater} glasses</Text>
        </View>
        <View style={styles.waterBottles}>
          {[...Array(dietData.dailyGoalWater)].map((_, index) => (
            <View
              key={index}
              style={[
                styles.waterBottle,
                index < dietData.waterIntake && styles.waterBottleFilled
              ]}
            >
              <Text style={styles.waterBottleText}>💧</Text>
            </View>
          ))}
        </View>
      </View>
    </Animated.View>
  );

  const renderTrainingTab = () => (
    <Animated.View style={[styles.tabContent, { opacity: fadeAnim }]}>
      {/* Workout Logging Button */}
      <TouchableOpacity style={styles.workoutLoggingButton} onPress={openWorkoutModal}>
        <LinearGradient
          colors={['#e74c3c', '#c0392b']}
          style={styles.workoutLoggingGradient}
        >
          <Text style={styles.workoutLoggingIcon}>💪</Text>
          <View style={styles.workoutLoggingTextContainer}>
            <Text style={styles.workoutLoggingTitle}>Log Workout</Text>
            <Text style={styles.workoutLoggingSubtitle}>Manually log your workouts</Text>
          </View>
          <Text style={styles.workoutLoggingArrow}>→</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Current Plan */}
      <View style={styles.planCard}>
        <Text style={styles.cardTitle}>Current Training Plan</Text>
        <View style={styles.planInfo}>
          <Text style={styles.planName}>{trainingData.currentPlan}</Text>
          <Text style={styles.planProgress}>Week 3 of 8</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${trainingData.weeklyProgress}%` }]} />
        </View>
        <Text style={styles.progressText}>{trainingData.weeklyProgress}% Complete</Text>
      </View>

      {/* Workout Type Distribution */}
      <View style={styles.chartCard}>
        <Text style={styles.cardTitle}>Workout Distribution</Text>
        <PieChart
          data={trainingData.workoutTypes.map((type, index) => ({
            name: type.name,
            population: type.count,
            color: type.color,
            legendFontColor: '#7F7F7F',
            legendFontSize: 12,
          }))}
          width={Dimensions.get('window').width - 40}
          height={180}
          chartConfig={{
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          style={styles.chart}
        />
      </View>

      {/* Weekly Schedule */}
      <View style={styles.weeklyScheduleCard}>
        <Text style={styles.cardTitle}>This Week's Schedule</Text>
        <View style={styles.weeklySchedule}>
          {Object.entries(trainingData.currentWeek).map(([day, workout]) => (
            <View key={day} style={styles.scheduleItem}>
              <Text style={styles.dayName}>{day.charAt(0).toUpperCase() + day.slice(1)}</Text>
              <View style={styles.workoutSchedule}>
                <Text style={styles.workoutName}>{workout.workout}</Text>
                {workout.duration > 0 && (
                  <Text style={styles.workoutDuration}>{workout.duration} min</Text>
                )}
              </View>
              <View style={[styles.completionStatus, workout.completed && styles.completedStatus]}>
                <Text style={styles.completionText}>{workout.completed ? '✓' : '○'}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Upcoming Workouts */}
      <View style={styles.upcomingWorkoutsCard}>
        <Text style={styles.cardTitle}>Upcoming Workouts</Text>
        {trainingData.upcomingWorkouts.map((workout, index) => (
          <View key={index} style={styles.upcomingWorkoutItem}>
            <View style={styles.workoutInfo}>
              <Text style={styles.workoutIcon}>💪</Text>
              <View style={styles.workoutDetails}>
                <Text style={styles.workoutName}>{workout.name}</Text>
                <Text style={styles.workoutTime}>{workout.date} at {workout.time}</Text>
                <Text style={styles.workoutDuration}>{workout.duration} minutes • {workout.exercises} exercises</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.startWorkoutButton}>
              <Text style={styles.startWorkoutText}>Start</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Achievements */}
      <View style={styles.achievementsCard}>
        <Text style={styles.cardTitle}>Achievements</Text>
        <View style={styles.achievementsGrid}>
          {trainingData.achievements.map((achievement, index) => (
            <View key={index} style={[styles.achievementItem, achievement.earned && styles.achievementEarned]}>
              <Text style={styles.achievementIcon}>{achievement.icon}</Text>
              <Text style={styles.achievementName}>{achievement.name}</Text>
              <Text style={styles.achievementDescription}>{achievement.description}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Training Stats */}
      <View style={styles.trainingStatsCard}>
        <Text style={styles.cardTitle}>Training Statistics</Text>
        <View style={styles.trainingStats}>
          <View style={styles.trainingStat}>
            <Text style={styles.trainingStatValue}>{trainingData.totalWorkouts}</Text>
            <Text style={styles.trainingStatLabel}>Total Workouts</Text>
          </View>
          <View style={styles.trainingStat}>
            <Text style={styles.trainingStatValue}>{trainingData.thisMonth}</Text>
            <Text style={styles.trainingStatLabel}>This Month</Text>
          </View>
          <View style={styles.trainingStat}>
            <Text style={styles.trainingStatValue}>12.5</Text>
            <Text style={styles.trainingStatLabel}>Avg. Duration</Text>
          </View>
        </View>
      </View>

    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#e74c3c', '#c0392b']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Activity & Training</Text>
          <Text style={styles.headerSubtitle}>Track your fitness journey</Text>
        </View>
      </LinearGradient>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'activity' && renderActivityTab()}
        {activeTab === 'diet' && renderDietTab()}
        {activeTab === 'training' && renderTrainingTab()}
      </ScrollView>

      {/* FlexiFit AI Button */}
      <TouchableOpacity 
        style={styles.flexiFitButton}
        onPress={() => navigation.navigate('FlexiFitAI')}
      >
        <LinearGradient
          colors={['#FF6B6B', '#FF8E8E']}
          style={styles.flexiFitGradient}
        >
          <Text style={styles.flexiFitIcon}>🤖</Text>
          <Text style={styles.flexiFitText}>FlexiFit AI</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Custom Date Picker Modal */}
      {showCustomDatePicker && (
        <View style={styles.modalOverlay}>
          <View style={styles.customDateModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Custom Date Range</Text>
              <TouchableOpacity onPress={() => setShowCustomDatePicker(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.datePickerContainer}>
              <View style={styles.dateInput}>
                <Text style={styles.dateLabel}>Start Date</Text>
                <TouchableOpacity style={styles.dateButton}>
                  <Text style={styles.dateButtonText}>
                    {customStartDate.toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.dateInput}>
                <Text style={styles.dateLabel}>End Date</Text>
                <TouchableOpacity style={styles.dateButton}>
                  <Text style={styles.dateButtonText}>
                    {customEndDate.toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <TouchableOpacity
              style={styles.applyDateButton}
              onPress={() => {
                setSelectedPeriod('custom');
                setShowCustomDatePicker(false);
              }}
            >
              <Text style={styles.applyDateButtonText}>Apply Date Range</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Diet Modal */}
      <Modal
        visible={showDietModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closeDietModal}
      >
        <Animated.View style={[styles.modalOverlay, { opacity: modalOpacity }]}>
          <Animated.View style={[styles.dietModalContent, { transform: [{ scale: modalScale }] }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Log Your Meal</Text>
              <TouchableOpacity onPress={closeDietModal}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dietForm}>
              <TextInput
                style={styles.input}
                placeholder="Meal Name (e.g., Chicken Salad)"
                value={dietForm.mealName}
                onChangeText={handleDietInput.bind(null, 'mealName')}
              />
              <TextInput
                style={styles.input}
                placeholder="Calories (e.g., 500)"
                keyboardType="numeric"
                value={dietForm.calories}
                onChangeText={handleDietInput.bind(null, 'calories')}
              />
              <TextInput
                style={styles.input}
                placeholder="Protein (g)"
                keyboardType="numeric"
                value={dietForm.protein}
                onChangeText={handleDietInput.bind(null, 'protein')}
              />
              <TextInput
                style={styles.input}
                placeholder="Carbs (g)"
                keyboardType="numeric"
                value={dietForm.carbs}
                onChangeText={handleDietInput.bind(null, 'carbs')}
              />
              <TextInput
                style={styles.input}
                placeholder="Fats (g)"
                keyboardType="numeric"
                value={dietForm.fats}
                onChangeText={handleDietInput.bind(null, 'fats')}
              />
              <TextInput
                style={styles.input}
                placeholder="Fiber (g)"
                keyboardType="numeric"
                value={dietForm.fiber}
                onChangeText={handleDietInput.bind(null, 'fiber')}
              />
              <TextInput
                style={styles.input}
                placeholder="Sugar (g)"
                keyboardType="numeric"
                value={dietForm.sugar}
                onChangeText={handleDietInput.bind(null, 'sugar')}
              />
              <TouchableOpacity style={styles.photoButton} onPress={selectMealPhoto}>
                <ImageBackground
                  source={{ uri: dietForm.photo ? dietForm.photo.uri : null }}
                  style={styles.photoPreview}
                >
                  {dietForm.photo ? (
                    <TouchableOpacity style={styles.removePhotoButton}>
                      <Text style={styles.removePhotoText}>✕</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.photoPlaceholder}>
                      <Text style={styles.photoPlaceholderText}>+</Text>
                    </View>
                  )}
                </ImageBackground>
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                placeholder="Notes (optional)"
                multiline
                numberOfLines={3}
                value={dietForm.notes}
                onChangeText={handleDietInput.bind(null, 'notes')}
              />
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={saveDietEntry}>
              <Text style={styles.saveButtonText}>Save Meal</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </Modal>

      {/* Workout Logging Modal */}
      <Modal
        visible={showWorkoutModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closeWorkoutModal}
      >
        <Animated.View style={[styles.modalOverlay, { opacity: workoutModalOpacity }]}>
          <Animated.View style={[styles.workoutModalContent, { transform: [{ scale: workoutModalScale }] }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Advanced Workout Logger</Text>
              <TouchableOpacity onPress={closeWorkoutModal}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.workoutForm} showsVerticalScrollIndicator={false}>
              {/* Workout Category Selection */}
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>🏷️ Select Workout Category</Text>
                <View style={styles.categoryGrid}>
                  {Object.entries(workoutCategories).map(([key, category]) => (
                    <TouchableOpacity
                      key={key}
                      style={[
                        styles.categoryCard,
                        selectedWorkoutCategory === key && styles.selectedCategoryCard,
                        { borderColor: category.color }
                      ]}
                      onPress={() => selectWorkoutCategory(key)}
                    >
                      <Text style={styles.categoryIcon}>{category.icon}</Text>
                      <Text style={[
                        styles.categoryName,
                        selectedWorkoutCategory === key && styles.selectedCategoryName
                      ]}>
                        {category.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Predefined Workout Selection */}
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>📋 Choose Predefined Workout</Text>
                <View style={styles.workoutGrid}>
                  {workoutCategories[selectedWorkoutCategory].workouts.map((workout, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.workoutCard,
                        selectedPredefinedWorkout === workout && styles.selectedWorkoutCard
                      ]}
                      onPress={() => selectPredefinedWorkout(workout)}
                    >
                      <Text style={[
                        styles.workoutCardName,
                        selectedPredefinedWorkout === workout && styles.selectedWorkoutCardName
                      ]}>
                        {workout.name}
                      </Text>
                      <Text style={[
                        styles.workoutCardExercises,
                        selectedPredefinedWorkout === workout && styles.selectedWorkoutCardExercises
                      ]}>
                        {workout.exercises.length} exercises
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Permanent Fields Section */}
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>⭐ Required Information</Text>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Workout Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter workout name"
                    value={workoutForm.workoutName}
                    onChangeText={handleWorkoutInput.bind(null, 'workoutName')}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Date</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="YYYY-MM-DD"
                    value={workoutForm.date}
                    onChangeText={handleWorkoutInput.bind(null, 'date')}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Duration (minutes)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="45"
                    keyboardType="numeric"
                    value={workoutForm.duration}
                    onChangeText={handleWorkoutInput.bind(null, 'duration')}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Intensity Level</Text>
                  <View style={styles.intensitySelector}>
                    {['low', 'medium', 'high'].map((level) => (
                      <TouchableOpacity
                        key={level}
                        style={[
                          styles.intensityButton,
                          workoutForm.intensity === level && styles.selectedIntensityButton
                        ]}
                        onPress={() => handleWorkoutInput('intensity', level)}
                      >
                        <Text style={[
                          styles.intensityText,
                          workoutForm.intensity === level && styles.selectedIntensityText
                        ]}>
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              {/* Optional Fields Section */}
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>🔧 Optional Details</Text>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Target Muscle Groups</Text>
                  <View style={styles.tagGrid}>
                    {muscleGroups.map((muscle) => (
                      <TouchableOpacity
                        key={muscle}
                        style={[
                          styles.tag,
                          workoutForm.muscleGroups.includes(muscle) && styles.selectedTag
                        ]}
                        onPress={() => toggleMuscleGroup(muscle)}
                      >
                        <Text style={[
                          styles.tagText,
                          workoutForm.muscleGroups.includes(muscle) && styles.selectedTagText
                        ]}>
                          {muscle}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Equipment Used</Text>
                  <View style={styles.tagGrid}>
                    {equipment.map((item) => (
                      <TouchableOpacity
                        key={item}
                        style={[
                          styles.tag,
                          workoutForm.equipment.includes(item) && styles.selectedTag
                        ]}
                        onPress={() => toggleEquipment(item)}
                      >
                        <Text style={[
                          styles.tagText,
                          workoutForm.equipment.includes(item) && styles.selectedTagText
                        ]}>
                          {item}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              {/* Exercises Section */}
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>💪 Exercises</Text>
                {workoutForm.exercises.map((exercise, index) => (
                  <View key={index} style={styles.exerciseItem}>
                    <View style={styles.exerciseHeader}>
                      <Text style={styles.exerciseNumber}>Exercise {index + 1}</Text>
                      {workoutForm.exercises.length > 1 && (
                        <TouchableOpacity 
                          style={styles.removeExerciseButton}
                          onPress={() => removeExercise(index)}
                        >
                          <Text style={styles.removeExerciseText}>🗑️</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                    
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Exercise Name</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="e.g., Bench Press"
                        value={exercise.name}
                        onChangeText={(text) => handleExerciseInput(index, 'name', text)}
                      />
                    </View>

                    <View style={styles.exerciseMetrics}>
                      <View style={styles.metricInput}>
                        <Text style={styles.inputLabel}>Sets</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="3"
                          keyboardType="numeric"
                          value={exercise.sets}
                          onChangeText={(text) => handleExerciseInput(index, 'sets', text)}
                        />
                      </View>
                      <View style={styles.metricInput}>
                        <Text style={styles.inputLabel}>Reps</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="10"
                          keyboardType="numeric"
                          value={exercise.reps}
                          onChangeText={(text) => handleExerciseInput(index, 'reps', text)}
                        />
                      </View>
                      <View style={styles.metricInput}>
                        <Text style={styles.inputLabel}>Weight (kg)</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="60"
                          keyboardType="numeric"
                          value={exercise.weight}
                          onChangeText={(text) => handleExerciseInput(index, 'weight', text)}
                        />
                      </View>
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Notes (optional)</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Form cues, RPE, etc."
                        multiline
                        numberOfLines={2}
                        value={exercise.notes}
                        onChangeText={(text) => handleExerciseInput(index, 'notes', text)}
                      />
                    </View>
                  </View>
                ))}
                
                <TouchableOpacity onPress={addExercise} style={styles.addExerciseButton}>
                  <Text style={styles.addExerciseButtonText}>➕ Add Exercise</Text>
                </TouchableOpacity>
              </View>

              {/* General Notes */}
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>📝 General Notes</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Overall workout notes, how you felt, etc."
                  multiline
                  numberOfLines={3}
                  value={workoutForm.notes}
                  onChangeText={handleWorkoutInput.bind(null, 'notes')}
                />
              </View>
            </ScrollView>

            <TouchableOpacity style={styles.saveButton} onPress={saveWorkoutEntry}>
              <Text style={styles.saveButtonText}>💾 Save Workout</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
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