import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { LinearGradient } from 'react-native-linear-gradient';
import { Picker } from '@react-native-picker/picker';

const Location = () => {
  const [selectedGym, setSelectedGym] = useState(null);
  const [userLocation, setUserLocation] = useState({
    latitude: 28.6139,
    longitude: 77.2090,
  });
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedSort, setSelectedSort] = useState('distance');

  // Sample gym data with enhanced information
  const gyms = [
    {
      id: 1,
      name: "Fitness First Gym",
      location: "Connaught Place, New Delhi",
      distance: "0.5 km",
      rating: 4.5,
      isNearest: true,
      coordinates: {
        latitude: 28.6139,
        longitude: 77.2090,
      },
      logo: "🏋️",
      type: "Premium",
      price: "₹2,500/month",
      features: ["24/7 Access", "Personal Trainer", "Pool", "Spa"],
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
      openNow: true,
      crowdLevel: "Low"
    },
    {
      id: 2,
      name: "Power House Fitness",
      location: "Khan Market, New Delhi",
      distance: "1.2 km",
      rating: 4.2,
      isNearest: false,
      coordinates: {
        latitude: 28.6000,
        longitude: 77.2300,
      },
      logo: "💪",
      type: "Standard",
      price: "₹1,800/month",
      features: ["Cardio Zone", "Weight Training", "Yoga Classes"],
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
      openNow: true,
      crowdLevel: "Medium"
    },
    {
      id: 3,
      name: "Elite Sports Club",
      location: "Lajpat Nagar, New Delhi",
      distance: "2.1 km",
      rating: 4.7,
      isNearest: false,
      coordinates: {
        latitude: 28.6300,
        longitude: 77.2400,
      },
      logo: "🏃",
      type: "Premium",
      price: "₹3,200/month",
      features: ["Olympic Pool", "Tennis Court", "Spa", "Restaurant"],
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
      openNow: false,
      crowdLevel: "High"
    },
    {
      id: 4,
      name: "FitZone Express",
      location: "Saket, New Delhi",
      distance: "3.5 km",
      rating: 4.0,
      isNearest: false,
      coordinates: {
        latitude: 28.5500,
        longitude: 77.2000,
      },
      logo: "⚡",
      type: "Express",
      price: "₹1,500/month",
      features: ["Quick Workouts", "Express Classes", "No Contracts"],
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
      openNow: true,
      crowdLevel: "Low"
    }
  ];

  const initialRegion = {
    latitude: 28.6139,
    longitude: 77.2090,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  const handleGymPress = (gym) => {
    setSelectedGym(gym);
    // You can add navigation to gym details here
  };

  const handleMyLocation = () => {
    // Add location permission and get current location
    console.log('Getting current location...');
  };

  const filterOptions = [
    { label: 'All Gyms', value: 'all' },
    { label: 'Premium', value: 'premium' },
    { label: 'Standard', value: 'standard' },
    { label: 'Express', value: 'express' },
    { label: 'Open Now', value: 'open' },
  ];

  const sortOptions = [
    { label: 'Distance', value: 'distance' },
    { label: 'Rating', value: 'rating' },
    { label: 'Price', value: 'price' },
    { label: 'Name', value: 'name' },
  ];

  const handleFilter = () => {
    // Add filter functionality
    console.log('Opening filters...');
  };

  return (
    <View style={styles.container}>
      {/* Map Section */}
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={false}
        provider={PROVIDER_GOOGLE}
        mapType="standard"
        showsBuildings={true}
        showsTraffic={false}
        showsIndoors={true}
      >
        {/* User Location Marker */}
        <Marker
          coordinate={userLocation}
          title="You are here"
          description="Your current location"
          pinColor="#3498db"
        />
        
        {/* Gym Markers */}
        {gyms.map((gym) => (
          <Marker
            key={gym.id}
            coordinate={gym.coordinates}
            title={gym.name}
            description={`${gym.distance} • ${gym.rating}⭐ • ${gym.price}`}
            pinColor={gym.isNearest ? "#e74c3c" : "#27ae60"}
          />
        ))}
      </MapView>

      {/* Enhanced Map Control Buttons */}
      <View style={styles.mapControls}>
        <TouchableOpacity style={styles.controlButton} onPress={handleMyLocation}>
          <LinearGradient
            colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.8)']}
            style={styles.controlButtonGradient}
          >
            <Text style={styles.controlButtonText}>📍</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Enhanced Bottom Sheet */}
      <View style={styles.bottomSheet}>
        <View style={styles.bottomSheetHandle} />
        <View style={styles.bottomSheetHeader}>
          <View style={styles.headerInfo}>
            <Text style={styles.bottomSheetTitle}>🏋️ Gyms Near You</Text>
            <Text style={styles.bottomSheetSubtitle}>{gyms.length} fitness centers found</Text>
          </View>
          <View style={styles.headerStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{gyms.length}</Text>
              <Text style={styles.statLabel}>Gyms</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>4.3</Text>
              <Text style={styles.statLabel}>Avg Rating</Text>
            </View>
          </View>
        </View>
        
        <ScrollView style={styles.gymList} showsVerticalScrollIndicator={false}>
          {gyms.map((gym) => (
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
                <View style={styles.gymLogo}>
                  <Text style={styles.gymLogoText}>{gym.logo}</Text>
                </View>
              </View>
              
              <View style={styles.gymInfo}>
                <View style={styles.gymHeader}>
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
                  {gym.features.slice(0, 2).map((feature, index) => (
                    <Text key={index} style={styles.featureTag}>{feature}</Text>
                  ))}
                </View>

                <View style={styles.gymStatus}>
                  <View style={styles.statusItem}>
                    <View style={[styles.statusDot, { backgroundColor: gym.openNow ? '#27ae60' : '#e74c3c' }]} />
                    <Text style={styles.statusText}>{gym.openNow ? 'Open Now' : 'Closed'}</Text>
                  </View>
                  <View style={styles.statusItem}>
                    <Text style={styles.crowdLevel}>👥 {gym.crowdLevel}</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.gymArrow}>
                <Text style={styles.arrowText}>›</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default Location;

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  map: {
    height: '50%',
  },
  mapControls: {
    position: 'absolute',
    right: 20,
    top: 50,
    gap: 15,
  },
  controlButton: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  controlButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 27.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonText: {
    fontSize: 22,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 15,
    paddingHorizontal: 20,
    paddingBottom: 30,
    height: '50%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 15,
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerInfo: {
    flex: 1,
  },
  bottomSheetTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  bottomSheetSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  headerStats: {
    flexDirection: 'row',
    gap: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  gymList: {
    flex: 1,
  },
  gymCard: {
    backgroundColor: 'white',
    borderRadius: 18,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    overflow: 'hidden',
  },
  gymImageContainer: {
    position: 'relative',
    height: 120,
  },
  gymImage: {
    width: '100%',
    height: '100%',
  },
  nearestBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#e74c3c',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  nearestText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  gymLogo: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gymLogoText: {
    fontSize: 20,
  },
  gymInfo: {
    padding: 18,
  },
  gymHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  gymName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  gymType: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  gymTypeText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  gymLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  gymLocation: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  gymStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  gymFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  featureTag: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    fontSize: 11,
    color: '#666',
    marginRight: 8,
    marginBottom: 4,
  },
  gymStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#666',
  },
  crowdLevel: {
    fontSize: 12,
    color: '#666',
  },
  gymArrow: {
    position: 'absolute',
    right: 18,
    top: '50%',
    marginTop: -10,
  },
  arrowText: {
    fontSize: 24,
    color: '#ccc',
    fontWeight: 'bold',
  },
});
