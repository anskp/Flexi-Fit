import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, StatusBar, Platform, Alert, Animated, PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { useNavigation } from '@react-navigation/native';
import LocationContent from './LocationContent';
import * as gymService from '../../api/gymService';
import parseApiError from '../../utils/parseApiError';

const LocationMain = () => {
  const navigation = useNavigation();

  // API Data State
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // UI & Location State
  const [selectedGym, setSelectedGym] = useState(null);
  const [mapSelectedGym, setMapSelectedGym] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(false);
  const [locationAddress, setLocationAddress] = useState('');
  const [watchId, setWatchId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedSort, setSelectedSort] = useState('distance');

  const pulseAnim = useRef(new Animated.Value(1)).current;

  const fetchGyms = async (location = null) => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page: 1,
        limit: 50,
        sort: selectedSort,
        filter: selectedFilter,
        search: searchQuery,
      };

      if (location) {
        params.lat = location.latitude;
        params.lon = location.longitude;
      }
      
      console.log("[LocationMain] Fetching gyms with params:", params);
      const response = await gymService.discoverGyms(params);

      if (response.success) {
        const fetchedGyms = Array.isArray(response.data) ? response.data : response.data.gyms;
        const formattedGyms = fetchedGyms.map(gym => ({
            ...gym,
            coordinates: { latitude: gym.latitude, longitude: gym.longitude }
        }));
        setGyms(formattedGyms);
      }
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  };
  
  const getCurrentLocation = () => {
    setLoading(true);
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newLocation = { latitude, longitude };
        setUserLocation(newLocation);
        setLocationPermission(true);
        fetchGyms(newLocation);
      },
      (error) => {
        console.log('Location error:', error);
        Alert.alert('Location Error', 'Could not get your location. Showing a general list of gyms.');
        fetchGyms();
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000, distanceFilter: 10 }
    );
  };
  
  const requestLocationPermission = async () => {
    let permissionGranted = false;
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location to show nearby gyms.',
          buttonPositive: 'Allow',
          buttonNegative: 'Deny'
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        permissionGranted = true;
      }
    } else if (Platform.OS === 'ios') {
      const result = await Geolocation.requestAuthorization('whenInUse');
      if (result === 'granted') {
        permissionGranted = true;
      }
    }

    if (permissionGranted) {
      getCurrentLocation();
    } else {
      Alert.alert('Permission Denied', 'Location access is needed to find gyms near you. Showing a general list.');
      fetchGyms(); // Fetch gyms without location if permission is denied
    }
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    // This effect re-fetches data when a filter or sort option is changed.
    // It's "debounced" by being outside the initial load effect.
    if (!loading) { // Avoid re-fetching while an initial fetch is in progress
        fetchGyms(userLocation);
    }
  }, [selectedFilter, selectedSort, searchQuery]);

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.5, duration: 1500, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
      ])
    );
    pulseAnimation.start();
    return () => pulseAnimation.stop();
  }, [pulseAnim]);

  useEffect(() => {
    return () => { if (watchId) Geolocation.clearWatch(watchId); };
  }, [watchId]);

  const handleGymPress = (gym) => {
    if (gym && gym.id) {
      navigation.navigate('GymDetails', { gymId: gym.id });
    }
  };

  const handleMapMarkerPress = (gym) => {
    setMapSelectedGym(gym);
    setSelectedGym(gym);
  };

  const handleMyLocation = () => {
    if (locationPermission) {
      getCurrentLocation();
    } else {
      requestLocationPermission();
    }
  };

  const handleCameraPress = () => {
    Alert.alert('Camera', 'Camera functionality will be implemented here.');
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
        loading={loading}
        error={error}
        selectedGym={selectedGym}
        mapSelectedGym={mapSelectedGym}
        userLocation={userLocation}
        pulseAnim={pulseAnim}
        locationPermission={locationPermission}
        isLoadingLocation={loading && !userLocation}
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