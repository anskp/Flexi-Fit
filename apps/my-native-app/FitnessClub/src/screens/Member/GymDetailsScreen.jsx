// src/screens/Member/GymDetailsScreen.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as gymService from '../../api/gymService';
import parseApiError from '../../utils/parseApiError';
import Icon from 'react-native-vector-icons/Ionicons';

const GymDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { gymId } = route.params; // Get the gymId passed from the previous screen

  const [gym, setGym] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGymDetails = async () => {
      if (!gymId) {
        setError('Gym ID was not provided.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError('');
        console.log('[GymDetailsScreen] Fetching gym details for ID:', gymId);
        
        const response = await gymService.getGymDetails(gymId);
        console.log('[GymDetailsScreen] API response:', response);
        
        if (response.success && response.data) {
          setGym(response.data);
        } else {
          setError(response.message || 'Failed to load gym details');
        }
      } catch (err) {
        console.error('[GymDetailsScreen] Error fetching gym details:', err);
        setError(parseApiError(err) || 'Failed to load gym details');
      } finally {
        setLoading(false);
      }
    };
    fetchGymDetails();
  }, [gymId]);

  const handleSubscribe = (plan) => {
    // This is where you would navigate to the checkout flow
    Alert.alert('Start Subscription', `You selected the ${plan.name} plan for $${plan.price}.`);
    // Example navigation to a future checkout screen:
    // navigation.navigate('Checkout', { planId: plan.id, planType: 'gym' });
  };
  
  const handleBuyPass = (passType) => {
    Alert.alert('Buy Pass', `You selected the ${passType} pass.`);
    // Example navigation to a future checkout screen:
    // navigation.navigate('Checkout', { itemId: gym.id, purchaseType: 'gym_pass', bookingType: passType });
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#e74c3c" />
        <Text style={styles.loadingText}>Loading gym details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Icon name="alert-circle-outline" size={48} color="#e74c3c" style={styles.errorIcon} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => {
            setLoading(true);
            setError('');
            // Re-fetch gym details
            const fetchGymDetails = async () => {
              try {
                const response = await gymService.getGymDetails(gymId);
                if (response.success && response.data) {
                  setGym(response.data);
                } else {
                  setError(response.message || 'Failed to load gym details');
                }
              } catch (err) {
                setError(parseApiError(err) || 'Failed to load gym details');
              } finally {
                setLoading(false);
              }
            };
            fetchGymDetails();
          }}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!gym) {
    return (
      <View style={styles.centerContainer}>
        <Icon name="fitness-outline" size={48} color="#ccc" />
        <Text style={styles.noDataText}>Gym details could not be loaded.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: gym.photos?.[0] || 'https://placehold.co/600x400' }} style={styles.headerImage} />
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>
      
      <View style={styles.contentContainer}>
        <Text style={styles.gymName}>{gym.name}</Text>
        <Text style={styles.address}>{gym.address}</Text>
        <View style={styles.badgeContainer}>
          {gym.badges?.map(badge => (
            <Text key={badge} style={styles.badge}>{badge}</Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Facilities</Text>
          <View style={styles.facilityContainer}>
            {gym.facilities?.map(facility => (
              <Text key={facility} style={styles.facilityTag}>{facility}</Text>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>One-Time Passes</Text>
            <View style={styles.passContainer}>
                {gym.dailyPassPrice && (
                    <TouchableOpacity style={styles.planCard} onPress={() => handleBuyPass('daily')}>
                        <Text style={styles.planName}>Daily Pass</Text>
                        <Text style={styles.planPrice}>₹{gym.dailyPassPrice}</Text>
                    </TouchableOpacity>
                )}
                {gym.weeklyPassPrice && (
                    <TouchableOpacity style={styles.planCard} onPress={() => handleBuyPass('weekly')}>
                        <Text style={styles.planName}>Weekly Pass</Text>
                        <Text style={styles.planPrice}>₹{gym.weeklyPassPrice}</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Membership Plans</Text>
          {gym.plans && gym.plans.length > 0 ? (
            gym.plans.map(plan => (
              <TouchableOpacity key={plan.id || plan.name} style={styles.planCard} onPress={() => handleSubscribe(plan)}>
                <Text style={styles.planName}>{plan.name} ({plan.duration})</Text>
                <Text style={styles.planPrice}>₹{plan.price}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noPlansText}>No membership plans available</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

// Add your styles here
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    errorText: { color: '#e74c3c', fontSize: 16, textAlign: 'center', marginTop: 10 },
    errorIcon: { marginBottom: 10 },
    loadingText: { marginTop: 10, fontSize: 16, color: '#666' },
    noDataText: { fontSize: 16, color: '#666', textAlign: 'center', marginTop: 10 },
    retryButton: { 
        backgroundColor: '#e74c3c', 
        paddingVertical: 12, 
        paddingHorizontal: 24, 
        borderRadius: 8, 
        marginTop: 20 
    },
    retryButtonText: { 
        color: 'white', 
        fontSize: 16, 
        fontWeight: 'bold' 
    },
    headerImage: { width: '100%', height: 250 },
    backButton: { position: 'absolute', top: 40, left: 15, backgroundColor: 'rgba(255,255,255,0.8)', padding: 8, borderRadius: 20 },
    contentContainer: { padding: 20 },
    gymName: { fontSize: 28, fontWeight: 'bold', color: '#333' },
    address: { fontSize: 16, color: '#666', marginTop: 4, marginBottom: 12 },
    badgeContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
    badge: { backgroundColor: '#e74c3c', color: '#fff', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 15, marginRight: 8, marginBottom: 8, fontSize: 12, fontWeight: '600' },
    section: { marginTop: 20, borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingTop: 20 },
    sectionTitle: { fontSize: 20, fontWeight: '700', color: '#444', marginBottom: 15 },
    facilityContainer: { flexDirection: 'row', flexWrap: 'wrap' },
    facilityTag: { backgroundColor: '#f0f0f0', color: '#555', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 18, marginRight: 10, marginBottom: 10 },
    passContainer: { flexDirection: 'row', justifyContent: 'space-around'},
    planCard: { backgroundColor: '#f8f8f8', padding: 15, borderRadius: 10, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#eee' },
    planName: { fontSize: 16, fontWeight: '600', color: '#333' },
    planPrice: { fontSize: 16, fontWeight: 'bold', color: '#e74c3c' },
    noPlansText: { fontSize: 14, color: '#999', textAlign: 'center', fontStyle: 'italic' },
});

export default GymDetailsScreen;