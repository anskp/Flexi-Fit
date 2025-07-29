import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';

const Home = () => {
  const [nearestGyms, setNearestGyms] = useState([]);

  // Sample gym data with enhanced information
  const gyms = [
    {
      id: 1,
      name: "Fitness First Gym",
      location: "Connaught Place, New Delhi",
      distance: "0.5 km",
      rating: 4.5,
      price: "₹2,500/month",
      isNearest: true,
      logo: "🏋️",
      type: "Premium",
      features: ["24/7 Access", "Personal Trainer", "Pool", "Spa"],
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400"
    },
    {
      id: 2,
      name: "Power House Fitness",
      location: "Khan Market, New Delhi",
      distance: "1.2 km",
      rating: 4.2,
      price: "₹1,800/month",
      isNearest: false,
      logo: "💪",
      type: "Standard",
      features: ["Cardio Zone", "Weight Training", "Yoga Classes"],
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400"
    },
    {
      id: 3,
      name: "Elite Sports Club",
      location: "Lajpat Nagar, New Delhi",
      distance: "2.1 km",
      rating: 4.7,
      price: "₹3,200/month",
      isNearest: false,
      logo: "🏃",
      type: "Premium",
      features: ["Olympic Pool", "Tennis Court", "Spa", "Restaurant"],
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400"
    },
    {
      id: 4,
      name: "FitZone Express",
      location: "Saket, New Delhi",
      distance: "3.5 km",
      rating: 4.0,
      price: "₹1,500/month",
      isNearest: false,
      logo: "⚡",
      type: "Express",
      features: ["Quick Workouts", "Express Classes", "No Contracts"],
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400"
    }
  ];

  useEffect(() => {
    setNearestGyms(gyms);
  }, []);

  const handleGymPress = (gym) => {
    // Navigate to gym details
    console.log('Selected gym:', gym.name);
  };

  const handleQuickCheckin = (gym) => {
    // Handle quick check-in
    console.log('Quick check-in to:', gym.name);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#e74c3c', '#c0392b']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Fitness Club</Text>
          <Text style={styles.headerSubtitle}>Find your perfect workout</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome back! 👋</Text>
          <Text style={styles.welcomeSubtitle}>Ready for today's workout?</Text>
        </View>

        {/* Nearest Gyms Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nearest Gyms</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {nearestGyms.map((gym) => (
            <TouchableOpacity
              key={gym.id}
              style={styles.gymCard}
              onPress={() => handleGymPress(gym)}
            >
              <View style={styles.gymImageContainer}>
                <Image
                  source={{ uri: gym.image }}
                  style={styles.gymImage}
                  resizeMode="cover"
                />
                {gym.isNearest && (
                  <View style={styles.nearestBadge}>
                    <Text style={styles.nearestText}>Nearest</Text>
                  </View>
                )}
              </View>

              <View style={styles.gymInfo}>
                <View style={styles.gymHeader}>
                  <Text style={styles.gymLogo}>{gym.logo}</Text>
                  <Text style={styles.gymName}>{gym.name}</Text>
                  <View style={styles.gymType}>
                    <Text style={styles.gymTypeText}>{gym.type}</Text>
                  </View>
                </View>

                <View style={styles.gymLocationRow}>
                  <Text style={styles.locationIcon}>📍</Text>
                  <Text style={styles.gymLocation}>{gym.location}</Text>
                </View>

                <View style={styles.gymStats}>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Distance</Text>
                    <Text style={styles.statValue}>{gym.distance}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Rating</Text>
                    <Text style={styles.statValue}>⭐ {gym.rating}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Price</Text>
                    <Text style={styles.statValue}>{gym.price}</Text>
                  </View>
                </View>

                <View style={styles.gymFeatures}>
                  {gym.features.slice(0, 3).map((feature, index) => (
                    <Text key={index} style={styles.featureTag}>{feature}</Text>
                  ))}
                </View>

                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.checkinButton}
                    onPress={() => handleQuickCheckin(gym)}
                  >
                    <Text style={styles.checkinButtonText}>Quick Check-in</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.detailsButton}>
                    <Text style={styles.detailsButtonText}>View Details</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickActionCard}>
              <Text style={styles.quickActionIcon}>📊</Text>
              <Text style={styles.quickActionText}>Today's Progress</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionCard}>
              <Text style={styles.quickActionIcon}>🎯</Text>
              <Text style={styles.quickActionText}>Set Goals</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionCard}>
              <Text style={styles.quickActionIcon}>📅</Text>
              <Text style={styles.quickActionText}>Book Class</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;

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
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  welcomeSection: {
    marginTop: 20,
    marginBottom: 30,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#e74c3c',
    fontWeight: '600',
  },
  gymCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  gymImageContainer: {
    position: 'relative',
  },
  gymImage: {
    width: '100%',
    height: 150,
  },
  nearestBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#e74c3c',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  nearestText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  gymInfo: {
    padding: 15,
  },
  gymHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  gymLogo: {
    fontSize: 20,
    marginRight: 10,
  },
  gymName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  gymType: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  gymTypeText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  gymLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  locationIcon: {
    fontSize: 14,
    marginRight: 5,
  },
  gymLocation: {
    fontSize: 14,
    color: '#666',
  },
  gymStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  gymFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  featureTag: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    fontSize: 12,
    color: '#666',
    marginRight: 8,
    marginBottom: 5,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  checkinButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
  },
  checkinButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  detailsButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e74c3c',
    flex: 1,
  },
  detailsButtonText: {
    color: '#e74c3c',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
}); 