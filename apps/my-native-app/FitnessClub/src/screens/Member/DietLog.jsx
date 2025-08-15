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
  const [form, setForm] = useState({
    mealName: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
  });
  const [logs, setLogs] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [stats, setStats] = useState({
    totalCalories: 0,
    totalProtein: 0,
    totalMeals: 0,
  });

  const headerScale = useRef(new Animated.Value(1)).current;
  const modalSlide = useRef(new Animated.Value(height)).current;

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

  const handleInput = (key, value) => setForm({ ...form, [key]: value });

  const clearForm = () => setForm({
    mealName: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
  });

  const validateForm = () => {
    if (!form.mealName.trim()) return 'Meal name required';
    if (!form.calories.trim()) return 'Calories required';
    return null;
  };

  const handleSave = () => {
    const error = validateForm();
    if (error) {
      Alert.alert('Validation Error', error);
      return;
    }
    setLogs([
      {
        ...form,
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString(),
      },
      ...logs,
    ]);
    clearForm();
    closeModal();
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
      clearForm();
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

      {/* Meal List */}
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

      {/* Floating Action Button */}
      <PulsingButton style={styles.fab} onPress={openModal}>
        <Text style={styles.fabText}>+</Text>
      </PulsingButton>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalContent,
              { transform: [{ translateY: modalSlide }] },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🍽️ Log Your Meal</Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Meal Name (e.g., Grilled Chicken)"
              placeholderTextColor="#999"
              value={form.mealName}
              onChangeText={(t) => handleInput('mealName', t)}
            />

            <View style={styles.inputRow}>
              <TextInput
                style={styles.inputHalf}
                placeholder="Calories"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={form.calories}
                onChangeText={(t) => handleInput('calories', t.replace(/[^0-9]/g, ''))}
              />
              <TextInput
                style={styles.inputHalf}
                placeholder="Protein (g)"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={form.protein}
                onChangeText={(t) => handleInput('protein', t.replace(/[^0-9]/g, ''))}
              />
            </View>

            <View style={styles.inputRow}>
              <TextInput
                style={styles.inputHalf}
                placeholder="Carbs (g)"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={form.carbs}
                onChangeText={(t) => handleInput('carbs', t.replace(/[^0-9]/g, ''))}
              />
              <TextInput
                style={styles.inputHalf}
                placeholder="Fat (g)"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={form.fat}
                onChangeText={(t) => handleInput('fat', t.replace(/[^0-9]/g, ''))}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>💾 Save Meal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
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
});

export default DietLog;
