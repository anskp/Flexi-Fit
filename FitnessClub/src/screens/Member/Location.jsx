import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const Location = () => {
  const [selectedGym, setSelectedGym] = useState(null);
  const [userLocation, setUserLocation] = useState({
    latitude: 28.6139,
    longitude: 77.2090,
  });

  // Sample gym data
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
      type: "Premium"
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
      type: "Standard"
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
      type: "Premium"
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
      type: "Express"
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
      >
        {/* User Location Marker */}
        <Marker
          coordinate={userLocation}
          title="You are here"
          description="Your current location"
          pinColor="blue"
        />
        
        {/* Gym Markers */}
        {gyms.map((gym) => (
          <Marker
            key={gym.id}
            coordinate={gym.coordinates}
            title={gym.name}
            description={gym.location}
            pinColor={gym.isNearest ? "red" : "green"}
          />
        ))}
      </MapView>

      {/* Map Control Buttons */}
      <View style={styles.mapControls}>
        <TouchableOpacity style={styles.controlButton} onPress={handleFilter}>
          <Text style={styles.controlButtonText}>🔍</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={handleMyLocation}>
          <Text style={styles.controlButtonText}>📍</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Sheet */}
      <View style={styles.bottomSheet}>
        <View style={styles.bottomSheetHeader}>
          <Text style={styles.bottomSheetTitle}>Gyms around you</Text>
          <Text style={styles.bottomSheetSubtitle}>In New Delhi</Text>
        </View>
        
        <ScrollView style={styles.gymList} showsVerticalScrollIndicator={false}>
          {gyms.map((gym) => (
            <TouchableOpacity
              key={gym.id}
              style={styles.gymCard}
              onPress={() => handleGymPress(gym)}
            >
              <View style={styles.gymLogo}>
                <Text style={styles.gymLogoText}>{gym.logo}</Text>
              </View>
              
              <View style={styles.gymInfo}>
                <Text style={styles.gymName}>{gym.name}</Text>
                <View style={styles.gymLocationRow}>
                  <Text style={styles.locationIcon}>📍</Text>
                  <Text style={styles.gymLocation}>{gym.location}</Text>
                  {gym.isNearest && (
                    <View style={styles.nearestTag}>
                      <Text style={styles.nearestText}>Nearest</Text>
                    </View>
                  )}
                </View>
                <View style={styles.gymDetails}>
                  <Text style={styles.gymDistance}>{gym.distance}</Text>
                  <Text style={styles.gymRating}>⭐ {gym.rating}</Text>
                  <Text style={styles.gymType}>{gym.type}</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  map: {
    flex: 1,
  },
  mapControls: {
    position: 'absolute',
    right: 20,
    top: 100,
    gap: 10,
  },
  controlButton: {
    width: 50,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  controlButtonText: {
    fontSize: 20,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
    maxHeight: '60%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bottomSheetHeader: {
    marginBottom: 20,
  },
  bottomSheetTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  bottomSheetSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e74c3c',
  },
  gymList: {
    flex: 1,
  },
  gymCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  gymLogo: {
    width: 50,
    height: 50,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  gymLogoText: {
    fontSize: 24,
  },
  gymInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  gymName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  gymLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  locationIcon: {
    fontSize: 12,
    marginRight: 5,
  },
  gymLocation: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  nearestTag: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 10,
  },
  nearestText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  gymDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  gymDistance: {
    fontSize: 12,
    color: '#666',
  },
  gymRating: {
    fontSize: 12,
    color: '#666',
  },
  gymType: {
    fontSize: 12,
    color: '#e74c3c',
    fontWeight: '600',
  },
  gymArrow: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
  },
  arrowText: {
    fontSize: 20,
    color: '#ccc',
    fontWeight: 'bold',
  },
});
