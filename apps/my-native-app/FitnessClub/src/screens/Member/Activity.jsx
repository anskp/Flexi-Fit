import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';


// Import WorkoutPlanCard from WorkoutLog
import { WorkoutPlanCard } from './WorkoutLog';

const { width, height } = Dimensions.get('window');

const Activity = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState('daily');

  // Single workout plan data
  const workoutPlan = {
    name: 'Gain Muscles Plan',
    createdFor: 'Abhishekh',
    day: 'Sunday',
    duration: 90,
    calories: '630',
    category: 'strength'
  };

  // Diet log data
  const dietLog = {
    name: 'Healthy Diet Plan',
    createdFor: 'Abhishekh',
    day: 'Sunday',
    meals: 5,
    calories: '1800',
    category: 'nutrition'
  };

    return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
          {/* Period Selector */}
      <View style={[styles.periodSelector, { backgroundColor: colors.surface }]}>
            <TouchableOpacity
              style={[
                styles.periodButton,
            selectedPeriod === 'daily' && [styles.activePeriodButton, { backgroundColor: colors.primary }]
              ]}
          onPress={() => setSelectedPeriod('daily')}
            >
              <Text style={[
                styles.periodText,
            { color: colors.textSecondary },
            selectedPeriod === 'daily' && [styles.activePeriodText, { color: colors.primaryText }]
          ]}>Daily</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.periodButton,
            selectedPeriod === 'weekly' && [styles.activePeriodButton, { backgroundColor: colors.primary }]
              ]}
          onPress={() => setSelectedPeriod('weekly')}
            >
              <Text style={[
                styles.periodText,
            { color: colors.textSecondary },
            selectedPeriod === 'weekly' && [styles.activePeriodText, { color: colors.primaryText }]
          ]}>Weekly</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.periodButton,
            selectedPeriod === 'monthly' && [styles.activePeriodButton, { backgroundColor: colors.primary }]
              ]}
          onPress={() => setSelectedPeriod('monthly')}
            >
              <Text style={[
                styles.periodText,
            { color: colors.textSecondary },
            selectedPeriod === 'monthly' && [styles.activePeriodText, { color: colors.primaryText }]
          ]}>Monthly</Text>
            </TouchableOpacity>
          </View>

      {/* Single Workout Plan Card */}
      <View style={styles.workoutPlansSection}>
        <WorkoutPlanCard
          workout={workoutPlan}
          onPress={() => navigation.navigate('WorkoutPlanDetail', { workout: workoutPlan })}
          style={{ marginHorizontal: 16 }}
        />
      </View>

      {/* Diet Log Card */}
      <View style={styles.dietLogSection}>
        <View style={[styles.dietLogCard, { backgroundColor: colors.surface }]}>
          <Image 
            source={require('../../assets/diet.jpg')}
            style={styles.dietLogImage}
            resizeMode="cover"
          />
          
          <TouchableOpacity 
            style={[styles.dietLogButton, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('DietLog')}
          >
            <Text style={styles.dietLogButtonText}>View Diet Plan</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  periodSelector: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    margin: 20,
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
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  activePeriodButton: {
    // backgroundColor will be set dynamically
  },
  periodText: {
    fontSize: 14,
    fontWeight: '600',
  },
  activePeriodText: {
    // color will be set dynamically
  },
  workoutPlansSection: {
    paddingTop: 20,
    marginBottom: 20,
  },
  workoutPlansScroll: {
    paddingVertical: 10,
  },
  dietLogSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  dietLogCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  dietLogImage: {
    width: '100%',
    height: 200,
  },
  dietLogButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  dietLogButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Activity;