import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, StatusBar, Platform, Alert, Animated, PermissionsAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import LocationContent from './LocationContent';

const LocationMain = () => {
  const [selectedGym, setSelectedGym] = useState(null);
  const [mapSelectedGym, setMapSelectedGym] = useState(null);
  const [userLocation, setUserLocation] = useState({
    latitude: 28.7041,
    longitude: 77.1025,
  });
  const [locationPermission, setLocationPermission] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationAccuracy, setLocationAccuracy] = useState(null);
  const [locationAddress, setLocationAddress] = useState('');
  const [watchId, setWatchId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedSort, setSelectedSort] = useState('distance');

  // Animation for user location pulse
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Request location permission
  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        // Always show permission dialog, even if previously granted
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission Required',
            message: 'This app needs access to your current location to show nearby gyms and provide accurate recommendations.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'Allow',
          }
        );
        
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setLocationPermission(true);
          getCurrentLocation();
        } else if (granted === PermissionsAndroid.RESULTS.DENIED) {
          Alert.alert(
            'Location Permission Denied',
            'Location access is required to find gyms near you. Please grant permission to continue.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Try Again', onPress: requestLocationPermission }
            ]
          );
        } else {
          // User selected "Ask Me Later"
          Alert.alert(
            'Location Access Needed',
            'To provide you with the best gym recommendations, we need your current location.',
            [
              { text: 'Not Now', style: 'cancel' },
              { text: 'Grant Permission', onPress: requestLocationPermission }
            ]
          );
        }
      } else {
        // For iOS, always try to get location (will trigger permission if needed)
        getCurrentLocation();
      }
    } catch (err) {
      console.warn('Location permission error:', err);
      Alert.alert(
        'Permission Error',
        'There was an issue requesting location permission. Please try again.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Retry', onPress: requestLocationPermission }
        ]
      );
    }
  };

  // Get current location with enhanced detection
  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy, altitude, heading, speed } = position.coords;
        const timestamp = position.timestamp;
        
        setUserLocation({ latitude, longitude });
        setLocationAccuracy(accuracy);
        setLocationPermission(true);
        setIsLoadingLocation(false);
        
        console.log('📍 Current location detected:', {
          latitude,
          longitude,
          accuracy: `${accuracy}m`,
          altitude: altitude ? `${altitude}m` : 'N/A',
          heading: heading ? `${heading}°` : 'N/A',
          speed: speed ? `${speed}m/s` : 'N/A',
          timestamp: new Date(timestamp).toLocaleString()
        });
        
        // Get address from coordinates
        getAddressFromCoordinates(latitude, longitude);
        
        // Start watching location for updates
        startLocationWatching();
        
        Alert.alert(
          '📍 Location Detected!',
          `Your current location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}\nAccuracy: ${accuracy.toFixed(1)}m`,
          [{ text: 'OK' }]
        );
      },
      (error) => {
        console.log('❌ Location error:', error);
        setIsLoadingLocation(false);
        
        if (error.code === 1) {
          // Permission denied
          Alert.alert(
            'Location Permission Required',
            'To find gyms near you, we need access to your current location. Please grant permission.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Grant Permission', onPress: requestLocationPermission }
            ]
          );
        } else if (error.code === 2) {
          // Location unavailable
          Alert.alert(
            'Location Unavailable',
            'Unable to determine your location. Please check your GPS settings and try again.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Try Again', onPress: getCurrentLocation }
            ]
          );
        } else if (error.code === 3) {
          // Timeout
          Alert.alert(
            'Location Timeout',
            'Getting your location took too long. Please check your GPS signal and try again.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Try Again', onPress: getCurrentLocation }
            ]
          );
        } else {
          Alert.alert(
            'Location Error',
            'There was an issue getting your location. Please try again.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Retry', onPress: getCurrentLocation }
            ]
          );
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 20000, // Increased timeout for better accuracy
        maximumAge: 0, // Always get fresh location
        distanceFilter: 10, // Update every 10 meters
      }
    );
  };

  // Get address from coordinates using reverse geocoding
  const getAddressFromCoordinates = (latitude, longitude) => {
    // For now, we'll use a simple approach
    // In a real app, you'd use Google Geocoding API or similar
    setLocationAddress('Getting address...');
    
    // Simulate getting address (replace with actual geocoding API)
    setTimeout(() => {
      setLocationAddress(`Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
    }, 1000);
  };

  // Start watching location for real-time updates
  const startLocationWatching = () => {
    if (watchId) {
      Geolocation.clearWatch(watchId);
    }
    
    const newWatchId = Geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        
        // Only update if accuracy is better or location changed significantly
        if (accuracy < (locationAccuracy || 100) || 
            Math.abs(latitude - userLocation.latitude) > 0.0001 ||
            Math.abs(longitude - userLocation.longitude) > 0.0001) {
          
          setUserLocation({ latitude, longitude });
          setLocationAccuracy(accuracy);
          
          console.log('🔄 Location updated:', {
            latitude: latitude.toFixed(6),
            longitude: longitude.toFixed(6),
            accuracy: `${accuracy.toFixed(1)}m`
          });
        }
      },
      (error) => {
        console.log('Location watching error:', error);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 10, // Update every 10 meters
        interval: 5000, // Check every 5 seconds
      }
    );
    
    setWatchId(newWatchId);
  };

  // Stop watching location
  const stopLocationWatching = () => {
    if (watchId) {
      Geolocation.clearWatch(watchId);
      setWatchId(null);
      console.log('📍 Location watching stopped');
    }
  };

  // Start pulse animation
  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.5,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    
    pulseAnimation.start();
    
    return () => pulseAnimation.stop();
  }, [pulseAnim]);

  // Cleanup location watching on component unmount
  useEffect(() => {
    return () => {
      stopLocationWatching();
    };
  }, []);

  // No automatic permission request - only manual

  // Sample gym data with enhanced information
  const gyms = [
    {
      id: 1,
      name: "Oxygen Gym Connaught Place",
      location: "Connaught Place, New Delhi",
      distance: "0.5 km",
      rating: 4.5,
      isNearest: true,
      coordinates: {
        latitude: 28.7041,
        longitude: 77.1025,
      },
      logo: "OXYGEN",
      type: "Premium",
      price: "₹2,500/month",
      features: ["24/7 Access", "Personal Trainer", "Pool", "Spa"],
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
      openNow: true,
      crowdLevel: "Low"
    },
    {
      id: 2,
      name: "Platinum Gym Khan Market",
      location: "Khan Market, New Delhi",
      distance: "1.2 km",
      rating: 4.2,
      isNearest: false,
      coordinates: {
        latitude: 28.7200,
        longitude: 77.1200,
      },
      logo: "PLATINUM",
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
      location: "Hauz Khas, New Delhi",
      distance: "2.1 km",
      rating: 4.7,
      isNearest: false,
      coordinates: {
        latitude: 28.6900,
        longitude: 77.0900,
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

  const handleGymPress = (gym) => {
    setSelectedGym(gym);
    setMapSelectedGym(gym);
  };

  const handleMapMarkerPress = (gym) => {
    setMapSelectedGym(gym);
    setSelectedGym(gym);
  };

  const handleMyLocation = () => {
    if (locationPermission) {
      getCurrentLocation();
    } else {
      Alert.alert(
        'Enable Location Access',
        'Would you like to enable location access to find gyms near you?',
        [
          { text: 'Not Now', style: 'cancel' },
          { text: 'Enable Location', onPress: requestLocationPermission }
        ]
      );
    }
  };

  // Show current location details
  const showLocationDetails = () => {
    if (locationPermission && locationAccuracy) {
      Alert.alert(
        '📍 Current Location Details',
        `Latitude: ${userLocation.latitude.toFixed(6)}\nLongitude: ${userLocation.longitude.toFixed(6)}\nAccuracy: ${locationAccuracy.toFixed(1)}m\nAddress: ${locationAddress || 'Getting address...'}`,
        [
          { text: 'OK' },
          { text: 'Refresh Location', onPress: getCurrentLocation }
        ]
      );
    } else {
      Alert.alert(
        'Location Not Available',
        'Please enable location access first to view your current location details.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Enable Location', onPress: requestLocationPermission }
        ]
      );
    }
  };

  const handleCameraPress = () => {
    Alert.alert(
      'Camera Options',
      'What would you like to do?',
      [
        { 
          text: '📸 Take Photo', 
          onPress: () => {
            console.log('Take photo pressed');
            Alert.alert('Camera', 'Opening camera to take photo...');
          }
        },
        { 
          text: '📍 Check-in with Photo', 
          onPress: () => {
            console.log('Check-in with photo pressed');
            Alert.alert('Check-in', 'Taking photo for gym check-in...');
          }
        },
        { 
          text: '🎯 Scan QR Code', 
          onPress: () => {
            console.log('Scan QR code pressed');
            Alert.alert('QR Scanner', 'Opening QR code scanner...');
          }
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      
      <LocationContent
        gyms={gyms}
        selectedGym={selectedGym}
        mapSelectedGym={mapSelectedGym}
        userLocation={userLocation}
        pulseAnim={pulseAnim}
        locationPermission={locationPermission}
        isLoadingLocation={isLoadingLocation}
        locationAccuracy={locationAccuracy}
        locationAddress={locationAddress}
        searchQuery={searchQuery}
        showSearchModal={showSearchModal}
        showFilterModal={showFilterModal}
        selectedFilter={selectedFilter}
        selectedSort={selectedSort}
        filterOptions={filterOptions}
        sortOptions={sortOptions}
        onGymPress={handleGymPress}
        onMapMarkerPress={handleMapMarkerPress}
        onMyLocation={handleMyLocation}
        onShowLocationDetails={showLocationDetails}
        onCameraPress={handleCameraPress}
        onSearchPress={() => setShowSearchModal(true)}
        onFilterPress={() => setShowFilterModal(true)}
        onSearchQueryChange={setSearchQuery}
        onSearchModalClose={() => setShowSearchModal(false)}
        onFilterModalClose={() => setShowFilterModal(false)}
        onFilterChange={setSelectedFilter}
        onSortChange={setSelectedSort}
        onRequestLocationPermission={requestLocationPermission}
      />
    </SafeAreaView>
  );
};

export default LocationMain; 