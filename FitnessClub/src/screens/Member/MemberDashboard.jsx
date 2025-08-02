
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Animated, TouchableOpacity,
  Dimensions, StatusBar, SafeAreaView, Alert, Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width: screenWidth } = Dimensions.get('window');

const MemberDashboard = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  
  const [dailyStats] = useState({
    steps: 8547, stepsGoal: 10000, calories: 2156, caloriesGoal: 2500,
    distance: 6.8, activeMinutes: 127
  });

  const [subscription] = useState({
    gymName: "FitZone Premium", status: "Active", daysLeft: 23,
    memberSince: "Jan 2024", planType: "Premium Annual"
  });

  const aiTips = [
    { id: 1, title: "Hydration Reminder", message: "You're 30% behind your water intake goal. Drink 2 glasses now!", type: "warning" },
    { id: 2, title: "Perfect Workout Time", message: "Your energy levels are optimal for a strength training session.", type: "success" },
    { id: 3, title: "Recovery Focus", message: "Consider a light yoga session today based on yesterday's intensity.", type: "info" }
  ];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();
  }, []);

  const getProgress = (current, goal) => (current / goal) * 100;
  const formatNumber = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const handleAction = (action) => Alert.alert('Quick Action', `${action} activated!`);

  const ProgressBar = ({ progress, color }) => (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${Math.min(progress, 100)}%`, backgroundColor: color }]} />
    </View>
  );

  const StatCard = ({ title, value, unit, progress, color, icon }) => (
    <Animated.View style={[styles.card, styles.statCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.row}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <Text style={styles.statValue}>{formatNumber(value)} <Text style={styles.unit}>{unit}</Text></Text>
      <View style={styles.row}>
        <ProgressBar progress={progress} color={color} />
        <Text style={styles.progressText}>{Math.round(progress)}%</Text>
      </View>
    </Animated.View>
  );

  const SimpleChart = () => {
    const data = [6500, 8200, 7800, 9100, 8500, 7200, 8547];
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const max = Math.max(...data);
    
    return (
      <View style={styles.card}>
        <Text style={styles.chartTitle}>Weekly Steps Overview</Text>
        <View style={styles.chartGrid}>
          {data.map((steps, i) => (
            <View key={i} style={styles.chartBar}>
              <View style={[styles.bar, { 
                height: (steps / max) * 80, 
                backgroundColor: i === 6 ? '#4A90E2' : '#2C3E50' 
              }]} />
              <Text style={styles.chartLabel}>{labels[i]}</Text>
              <Text style={styles.chartValue}>{(steps / 1000).toFixed(1)}k</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const getTypeStyle = (type) => ({
    warning: { color: '#FF9800', icon: '⚠️' },
    success: { color: '#4CAF50', icon: '✅' },
    info: { color: '#2196F3', icon: 'ℹ️' }
  }[type] || { color: '#6B7280', icon: '💡' });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.welcome}>Good Morning! 👋</Text>
          <Text style={styles.headerTitle}>Your Fitness Dashboard</Text>
          <Text style={styles.date}>Friday, June 13, 2025</Text>
        </Animated.View>

        {/* Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Progress</Text>
          <View style={styles.statsGrid}>
            <StatCard title="Steps" value={dailyStats.steps} unit="steps" 
              progress={getProgress(dailyStats.steps, dailyStats.stepsGoal)} color="#4A90E2" icon="👟" />
            <StatCard title="Calories" value={dailyStats.calories} unit="kcal" 
              progress={getProgress(dailyStats.calories, dailyStats.caloriesGoal)} color="#FF6B6B" icon="🔥" />
          </View>
          
          <View style={[styles.card, styles.row, { justifyContent: 'space-around' }]}>
            <View style={styles.center}>
              <Text style={styles.icon}>📍</Text>
              <Text style={styles.statValue}>{dailyStats.distance} km</Text>
              <Text style={styles.label}>Distance</Text>
            </View>
            <View style={styles.center}>
              <Text style={styles.icon}>⏱️</Text>
              <Text style={styles.statValue}>{dailyStats.activeMinutes} min</Text>
              <Text style={styles.label}>Active Time</Text>
            </View>
          </View>
        </View>

        {/* Chart */}
        <View style={styles.section}>
          <SimpleChart />
        </View>

        {/* Subscription */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gym Membership</Text>
          <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <View style={[styles.row, { justifyContent: 'space-between', marginBottom: 20 }]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{subscription.gymName}</Text>
                <Text style={styles.subtitle}>{subscription.planType} • Member since {subscription.memberSince}</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{subscription.status}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={[styles.center, { flex: 1 }]}>
                <Text style={styles.statValue}>{subscription.daysLeft}</Text>
                <Text style={styles.label}>Days Left</Text>
              </View>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.button} onPress={() => handleAction('Renew Subscription')}>
                <Text style={styles.buttonText}>Renew Now</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>

        {/* AI Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Recommendations</Text>
          {aiTips.map((tip) => {
            const typeStyle = getTypeStyle(tip.type);
            return (
              <Animated.View key={tip.id} style={[styles.card, styles.tipCard, 
                { borderLeftColor: typeStyle.color, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                <View style={styles.row}>
                  <Text style={styles.icon}>{typeStyle.icon}</Text>
                  <Text style={styles.cardTitle}>{tip.title}</Text>
                </View>
                <Text style={styles.subtitle}>{tip.message}</Text>
              </Animated.View>
            );
          })}
        </View>

        {/* Quick Actions */}
        <Animated.View style={[styles.section, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {[
              { title: 'Start Workout', icon: '🏋️', color: '#FF6B6B', action: () => handleAction('Start Workout') },
              { title: 'Log Meal', icon: '🍽️', color: '#4ECDC4', action: () => handleAction('Log Meal') },
              { title: 'Track Water', icon: '💧', color: '#45B7D1', action: () => handleAction('Track Water') },
              { title: 'Book Class', icon: '📅', color: '#96CEB4', action: () => handleAction('Book Class') },
            ].map((action, i) => (
              <TouchableOpacity key={i} style={[styles.actionButton, { backgroundColor: action.color }]}
                onPress={action.action}>
                <Text style={styles.icon}>{action.icon}</Text>
                <Text style={styles.buttonText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: { paddingBottom: 30 },
  header: { padding: 20, paddingTop: Platform.OS === 'ios' ? 20 : 40 },
  welcome: { fontSize: 16, color: '#666666', marginBottom: 5 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#333333', marginBottom: 5 },
  date: { fontSize: 14, color: '#666666' },
  section: { padding: 20, paddingTop: 0 },
  sectionTitle: { fontSize: 20, fontWeight: '600', color: '#333333', marginBottom: 15 },
  
  card: { backgroundColor: '#F8F9FA', borderRadius: 16, padding: 20, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  row: { flexDirection: 'row', alignItems: 'center' },
  center: { alignItems: 'center' },
  
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statCard: { width: (screenWidth - 60) / 2, marginBottom: 0 },
  
  icon: { fontSize: 20, marginRight: 8 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#333333' },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#333333', marginVertical: 10 },
  unit: { fontSize: 14, color: '#666666', fontWeight: 'normal' },
  label: { fontSize: 12, color: '#666666' },
  subtitle: { fontSize: 14, color: '#666666', marginTop: 5 },
  
  progressTrack: { flex: 1, height: 6, backgroundColor: '#E5E7EB', borderRadius: 3, marginRight: 10 },
  progressFill: { height: '100%', borderRadius: 3 },
  progressText: { fontSize: 12, color: '#666666', fontWeight: '600' },
  
  chartTitle: { fontSize: 16, fontWeight: '600', color: '#333333', marginBottom: 15, textAlign: 'center' },
  chartGrid: { flexDirection: 'row', justifyContent: 'space-between', height: 120, alignItems: 'flex-end' },
  chartBar: { alignItems: 'center', flex: 1 },
  bar: { width: 18, borderRadius: 9, minHeight: 5 },
  chartLabel: { fontSize: 12, color: '#666666', marginTop: 8 },
  chartValue: { fontSize: 10, color: '#333333', marginTop: 2 },
  
  badge: { backgroundColor: '#4CAF50', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  badgeText: { fontSize: 12, fontWeight: '600', color: '#FFFFFF' },
  divider: { width: 1, height: 40, backgroundColor: '#E5E7EB', marginHorizontal: 20 },
  button: { backgroundColor: '#4A90E2', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12, flex: 1, alignItems: 'center' },
  buttonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },
  
  tipCard: { borderLeftWidth: 4 },
  
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  actionButton: { width: (screenWidth - 60) / 2, height: 80, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
});

export default MemberDashboard;