import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Modal,
  Dimensions,
  StatusBar,
  Alert,
  Animated,
  Easing,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { saveDietEntry } from '../../api/dietService';

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

const QuickMealCard = ({ meal, onPress, style }) => {
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
        styles.quickMealCard,
        style,
        {
          transform: [{ scale }],
          opacity,
        },
      ]}
    >
      <TouchableOpacity onPress={onPress} style={styles.quickMealButton}>
        <Text style={styles.quickMealIcon}>{meal.icon}</Text>
        <Text style={styles.quickMealName}>{meal.name}</Text>
        <Text style={styles.quickMealCalories}>{meal.calories} kcal</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const MealCard = ({ item, index, onDelete }) => {
  const scale = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(-50)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const delay = index * 100;

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
    }, delay);
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
    ]).start(() => onDelete(item.id));
  };

  return (
    <Animated.View
      style={[
        styles.mealCard,
        {
          transform: [{ scale }, { translateX }],
          opacity,
        },
      ]}
    >
      <View style={styles.mealCardContent}>
        <View style={styles.mealHeader}>
          <Text style={styles.mealName}>{item.mealName}</Text>
          <View style={styles.caloriesBadge}>
            <Text style={styles.caloriesText}>{item.calories} kcal</Text>
          </View>
        </View>
        <View style={styles.macroRow}>
          <View style={styles.macroItem}>
            <Text style={styles.macroLabel}>Protein</Text>
            <Text style={styles.macroValue}>{item.protein || 0}g</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroLabel}>Carbs</Text>
            <Text style={styles.macroValue}>{item.carbs || 0}g</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroLabel}>Fat</Text>
            <Text style={styles.macroValue}>{item.fat || 0}g</Text>
          </View>
        </View>
        <View style={styles.cardFooter}>
          <Text style={styles.timeStamp}>{item.timestamp}</Text>
          <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

const StatCard = ({ title, value, subtitle, color, delay = 0 }) => {
  const scale = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    setTimeout(() => {
      Animated.sequence([
        Animated.spring(scale, {
          toValue: 1,
          tension: 100,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(rotate, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(rotate, {
            toValue: -1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(rotate, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }, delay);
  }, [value]);

  const rotateInterpolate = rotate.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-5deg', '0deg', '5deg'],
  });

  return (
    <Animated.View
      style={[
        styles.statCard,
        { borderLeftColor: color },
        {
          transform: [{ scale }, { rotate: rotateInterpolate }],
        },
      ]}
    >
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statSubtitle}>{subtitle}</Text>
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

const DietLog = () => {
  const [logs, setLogs] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [stats, setStats] = useState({
    totalCalories: 0,
    totalProtein: 0,
    totalMeals: 0,
  });

  const headerScale = useRef(new Animated.Value(1)).current;
  const modalSlide = useRef(new Animated.Value(height)).current;

  // Quick meal options with more variety and better categorization
  const quickMeals = [
    // Breakfast
    { name: 'Oatmeal Bowl', calories: 150, icon: '🥣', protein: 6, carbs: 27, fats: 3, category: 'breakfast' },
    { name: 'Greek Yogurt', calories: 59, icon: '🥛', protein: 10, carbs: 3.6, fats: 0.4, category: 'breakfast' },
    { name: 'Eggs & Toast', calories: 155, icon: '🥚', protein: 13, carbs: 1.1, fats: 11, category: 'breakfast' },
    { name: 'Smoothie Bowl', calories: 180, icon: '🍓', protein: 8, carbs: 25, fats: 5, category: 'breakfast' },
    
    // Lunch
    { name: 'Chicken Salad', calories: 165, icon: '🍗', protein: 31, carbs: 0, fats: 3.6, category: 'lunch' },
    { name: 'Tuna Sandwich', calories: 220, icon: '🥪', protein: 18, carbs: 25, fats: 8, category: 'lunch' },
    { name: 'Quinoa Bowl', calories: 185, icon: '🥗', protein: 12, carbs: 28, fats: 6, category: 'lunch' },
    { name: 'Turkey Wrap', calories: 195, icon: '🌯', protein: 22, carbs: 18, fats: 7, category: 'lunch' },
    
    // Dinner
    { name: 'Salmon Fillet', calories: 208, icon: '🐟', protein: 25, carbs: 0, fats: 12, category: 'dinner' },
    { name: 'Beef Steak', calories: 250, icon: '🥩', protein: 26, carbs: 0, fats: 15, category: 'dinner' },
    { name: 'Pasta Primavera', calories: 320, icon: '🍝', protein: 12, carbs: 45, fats: 10, category: 'dinner' },
    { name: 'Stir Fry', calories: 280, icon: '🥘', protein: 18, carbs: 22, fats: 12, category: 'dinner' },
    
    // Snacks
    { name: 'Banana', calories: 89, icon: '🍌', protein: 1.1, carbs: 23, fats: 0.3, category: 'snack' },
    { name: 'Almonds', calories: 164, icon: '🥜', protein: 6, carbs: 6, fats: 14, category: 'snack' },
    { name: 'Apple', calories: 52, icon: '🍎', protein: 0.3, carbs: 14, fats: 0.2, category: 'snack' },
    { name: 'Protein Bar', calories: 200, icon: '🍫', protein: 20, carbs: 15, fats: 8, category: 'snack' },
  ];

  const mealCategories = [
    { id: 'all', name: 'All', icon: '🍽️' },
    { id: 'breakfast', name: 'Breakfast', icon: '🌅' },
    { id: 'lunch', name: 'Lunch', icon: '☀️' },
    { id: 'dinner', name: 'Dinner', icon: '🌙' },
    { id: 'snack', name: 'Snacks', icon: '🍿' },
  ];

  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredMeals = selectedCategory === 'all' 
    ? quickMeals 
    : quickMeals.filter(meal => meal.category === selectedCategory);

  useEffect(() => {
    const totalCalories = logs.reduce((sum, log) => sum + parseInt(log.calories || 0), 0);
    const totalProtein = logs.reduce((sum, log) => sum + parseInt(log.protein || 0), 0);
    setStats({
      totalCalories,
      totalProtein,
      totalMeals: logs.length,
    });
  }, [logs]);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(headerScale, {
        toValue: 1.02,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(headerScale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [logs.length]);

  const handleQuickMeal = async (meal) => {
    try {
      const response = await saveDietEntry({
        mealName: meal.name,
        calories: meal.calories.toString(),
        protein: meal.protein.toString(),
        carbs: meal.carbs.toString(),
        fats: meal.fats.toString(),
        mealType: meal.category
      });

      if (response.success) {
        // Add to local state with enhanced data
        const newLog = {
          ...meal,
          id: Date.now().toString(),
          timestamp: new Date().toLocaleTimeString(),
          date: new Date().toLocaleDateString(),
        };
        setLogs([newLog, ...logs]);
        
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
        
        Alert.alert('Success', `${meal.name} logged successfully! 🎉`);
      } else {
        Alert.alert('Error', response.message || 'Failed to log meal');
      }
    } catch (error) {
      console.error('Quick meal error:', error);
      Alert.alert('Error', 'Failed to log meal. Please try again.');
    }
  };

  const handleCustomMeal = async () => {
    if (!dietForm.mealName.trim() || !dietForm.calories.trim()) {
      Alert.alert('Validation Error', 'Please enter at least a meal name and calories.');
      return;
    }
    
    try {
      const response = await saveDietEntry(dietForm);

      if (response.success) {
        const newLog = {
          ...dietForm,
          id: Date.now().toString(),
          timestamp: new Date().toLocaleTimeString(),
          date: new Date().toLocaleDateString(),
        };
        setLogs([newLog, ...logs]);
        closeModal();
        Alert.alert('Success', 'Custom meal logged successfully! 🎉');
      } else {
        Alert.alert('Error', response.message || 'Failed to save meal');
      }
    } catch (error) {
      console.error('Save diet error:', error);
      Alert.alert('Error', 'Failed to save meal. Please try again.');
    }
  };

  const openModal = () => {
    setModalVisible(true);
    Animated.spring(modalSlide, {
      toValue: 0,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(modalSlide, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
    });
  };

  const deleteMeal = (id) => {
    setLogs(logs.filter(log => log.id !== id));
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

  // ---- NORMAL UI ----
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f23" />

      {/* Background Particles */}
      <View style={styles.particleContainer}>
        {renderParticles()}
      </View>

      {/* Header */}
      <Animated.View style={[styles.header, { transform: [{ scale: headerScale }] }]}>
        <Text style={styles.headerTitle}>🍎 Diet Log</Text>
        <Text style={styles.headerSubtitle}>Transform your nutrition journey</Text>

        {/* Stats Row */}
        <View style={styles.statsContainer}>
          <StatCard
            title="Calories"
            value={stats.totalCalories}
            subtitle="kcal today"
            color="#ff6b6b"
            delay={100}
          />
          <StatCard
            title="Protein"
            value={stats.totalProtein}
            subtitle="grams"
            color="#4ecdc4"
            delay={200}
          />
          <StatCard
            title="Meals"
            value={stats.totalMeals}
            subtitle="logged"
            color="#45b7d1"
            delay={300}
          />
        </View>
      </Animated.View>

      {/* Quick Meals Section */}
      <View style={styles.quickMealsSection}>
        <Text style={styles.sectionTitle}>Quick Add Meals</Text>
        
        {/* Category Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryFilter}>
          {mealCategories.map((category) => (
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
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickMealsScroll}>
          {filteredMeals.map((meal, index) => (
            <QuickMealCard
              key={meal.name}
              meal={meal}
              onPress={() => handleQuickMeal(meal)}
              style={{ marginLeft: index === 0 ? 16 : 12 }}
            />
          ))}
        </ScrollView>
      </View>

      {/* Meal List */}
      <View style={styles.mealListSection}>
        <Text style={styles.sectionTitle}>Today's Meals</Text>
        {logs.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>🍽️ No meals logged yet</Text>
            <Text style={styles.emptySubtitle}>Start tracking your nutrition by adding your first meal!</Text>
            <TouchableOpacity style={styles.addFirstMealButton} onPress={openModal}>
              <Text style={styles.addFirstMealButtonText}>➕ Add Your First Meal</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={logs}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <MealCard item={item} index={index} onDelete={deleteMeal} />
            )}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Floating Action Button */}
      <PulsingButton style={styles.fab} onPress={openModal}>
        <Icon name="add" size={32} color="#fff" />
      </PulsingButton>
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
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 5,
    fontFamily: 'System',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginBottom: 25,
    fontFamily: 'System',
    fontWeight: '400',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 5,
    borderLeftWidth: 4,
    alignItems: 'center',
  },
  statTitle: {
    fontSize: 14,
    color: '#bbb',
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: 'System',
    letterSpacing: 0.3,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 2,
    fontFamily: 'System',
  },
  statSubtitle: {
    fontSize: 12,
    color: '#888',
    fontFamily: 'System',
    fontWeight: '400',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  mealCard: {
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderRadius: 18,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#222',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    elevation: 5,
  },
  mealCardContent: {},
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  mealName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    fontFamily: 'System',
    letterSpacing: 0.2,
  },
  caloriesBadge: {
    backgroundColor: '#ff6b6b',
    borderRadius: 12,
    paddingVertical: 2,
    paddingHorizontal: 10,
    marginLeft: 8,
  },
  caloriesText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
    fontFamily: 'System',
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  macroItem: {
    alignItems: 'center',
    flex: 1,
  },
  macroLabel: {
    color: '#bbb',
    fontSize: 13,
    marginBottom: 2,
    fontFamily: 'System',
    fontWeight: '500',
  },
  macroValue: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    fontFamily: 'System',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeStamp: {
    fontSize: 12,
    color: '#aaa',
    fontFamily: 'System',
    fontWeight: '400',
  },
  deleteButton: {
    padding: 6,
    backgroundColor: '#ff6b6b',
    borderRadius: 8,
    marginLeft: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
    fontFamily: 'System',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 34,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4ecdc4',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.28,
    shadowRadius: 6,
  },
  fabText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: -2,
    fontFamily: 'System',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.32)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#202040',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 22,
    paddingBottom: 32,
    minHeight: 380,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  modalTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'System',
    letterSpacing: 0.3,
  },
  closeButton: {
    padding: 6,
    borderRadius: 12,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'System',
  },
  input: {
    backgroundColor: '#282850',
    borderRadius: 10,
    padding: 12,
    color: '#fff',
    marginBottom: 12,
    fontSize: 15,
    fontFamily: 'System',
    fontWeight: '400',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  inputHalf: {
    flex: 1,
    backgroundColor: '#282850',
    borderRadius: 10,
    padding: 12,
    color: '#fff',
    fontSize: 15,
    marginRight: 8,
    fontFamily: 'System',
    fontWeight: '400',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  saveButton: {
    backgroundColor: '#4ecdc4',
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 12,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'System',
    letterSpacing: 0.5,
  },
  cancelButton: {
    backgroundColor: '#282850',
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 12,
    marginLeft: 10,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'System',
    letterSpacing: 0.5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: 50,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: 'System',
    letterSpacing: 0.5,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#bbb',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
    fontFamily: 'System',
    fontWeight: '400',
  },
  addFirstMealButton: {
    backgroundColor: '#4ecdc4',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  addFirstMealButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'System',
    letterSpacing: 0.5,
  },
  quickMealsSection: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 15,
    fontFamily: 'System',
    letterSpacing: 0.3,
  },
  quickMealsScroll: {
    paddingVertical: 5,
  },
  quickMealCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 15,
    padding: 15,
    marginRight: 10,
    width: 120,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickMealButton: {
    alignItems: 'center',
  },
  quickMealIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  quickMealName: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 4,
    fontFamily: 'System',
    textAlign: 'center',
  },
  quickMealCalories: {
    fontSize: 12,
    color: '#4ecdc4',
    fontWeight: '600',
    fontFamily: 'System',
  },
  categoryFilter: {
    flexDirection: 'row',
    marginBottom: 15,
    paddingHorizontal: 16,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedCategoryButton: {
    borderColor: '#4ecdc4',
    borderWidth: 1,
  },
  categoryIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    color: '#bbb',
    fontWeight: '500',
    fontFamily: 'System',
  },
  selectedCategoryText: {
    color: '#4ecdc4',
    fontWeight: '600',
  },
});

export default DietLog;
