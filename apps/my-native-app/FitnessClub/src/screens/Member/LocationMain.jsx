import React, { useState, useRef, useEffect } from 'react';
import { 
  SafeAreaView, 
  StatusBar, 
  Platform, 
  Alert, 
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  Animated,
  TextInput,
  Modal,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PermissionsAndroid } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons';
import Geolocation from '@react-native-community/geolocation';
import * as gymService from '../../api/gymService';
import parseApiError from '../../utils/parseApiError';

const { width } = Dimensions.get('window');

const LocationMain = () => {
  const navigation = useNavigation();

  // Basic states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(false);
  const [gyms, setGyms] = useState([]);
  const [gymsLoading, setGymsLoading] = useState(false);
  const [selectedGym, setSelectedGym] = useState(null);
  const [mapSelectedGym, setMapSelectedGym] = useState(null);
  const [showPermissionRequest, setShowPermissionRequest] = useState(false);

  // Radius Filter states
  const [radius, setRadius] = useState('10'); // km, string for input
  const [radiusModalVisible, setRadiusModalVisible] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreGyms, setHasMoreGyms] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Animation ref
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Start pulse animation
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  // Check location permission on component mount
  useEffect(() => {
    initializeLocation();
  }, []);

  const initializeLocation = async () => {
    console.log('🚀 Initializing location...');
    setLoading(true);
    setError('');
    
    try {
      await checkLocationPermission();
    } catch (error) {
      console.error('❌ Location initialization failed:', error);
      setError('Failed to initialize location. Please try again.');
      setLoading(false);
    }
  };

  const checkLocationPermission = async () => {
    console.log('🔍 Checking location permission...');
    
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        console.log('📱 Android permission check result:', granted);
        
        if (granted) {
          console.log('✅ Permission already granted, getting location...');
          await getCurrentLocation();
        } else {
          console.log('❌ Permission not granted, showing request modal');
          setShowPermissionRequest(true);
          setLoading(false);
        }
      } catch (err) {
        console.error('❌ Error checking location permission:', err);
        setShowPermissionRequest(true);
        setLoading(false);
      }
    } else {
      // iOS - Geolocation will handle permission automatically
      console.log('🍎 iOS - Getting location directly');
      await getCurrentLocation();
    }
  };

  const fetchGyms = async (location = null, page = 1, append = false) => {
    try {
      if (page === 1) {
        setGymsLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError('');

      const params = {
        page: page,
        limit: 20, // Reduced for better pagination
        sort: 'distance',
        filter: 'all',
        search: '',
        radius: parseFloat(radius) || 10,
      };

      // Debug: Log the location being used
      console.log('📍 Fetching gyms with location:', location);
      console.log('📍 Current userLocation state:', userLocation);

      // Only proceed if we have valid coordinates
      let hasValidLocation = false;
      
      if (location && location.latitude && location.longitude) {
        params.lat = location.latitude;
        params.lon = location.longitude;
        hasValidLocation = true;
        console.log('✅ Using provided location - Lat:', location.latitude, 'Lon:', location.longitude);
      } else if (userLocation && userLocation.latitude && userLocation.longitude) {
        params.lat = userLocation.latitude;
        params.lon = userLocation.longitude;
        hasValidLocation = true;
        console.log('✅ Using userLocation state - Lat:', userLocation.latitude, 'Lon:', userLocation.longitude);
      } else {
        console.log('⚠️ No valid location available, skipping API request');
        setGymsLoading(false);
        setLoadingMore(false);
        setError('Location not available. Please enable location access to find nearby gyms.');
        return; // Don't make the API call without location
      }

      console.log('🌐 API params being sent:', params);
      const response = await gymService.discoverGyms(params);

      if (response && response.success) {
        const fetchedGyms = Array.isArray(response.data) ? response.data : response.data.gyms || [];
        const formattedGyms = fetchedGyms.map(gym => ({
          ...gym,
          coordinates: { 
            latitude: parseFloat(gym.latitude) || 0, 
            longitude: parseFloat(gym.longitude) || 0 
          }
        }));

        if (append) {
          setGyms(prevGyms => [...prevGyms, ...formattedGyms]);
        } else {
          setGyms(formattedGyms);
        }

        // Check if there are more gyms
        setHasMoreGyms(formattedGyms.length === 20); // If we got less than limit, no more pages

        if (formattedGyms.length === 0 && page === 1) {
          setError('No gyms found in this radius.');
        } else {
          setError('');
        }
      } else {
        if (!append) {
          setGyms([]);
        }
        setError(response?.message || 'Failed to load gyms');
      }
    } catch (err) {
      if (!append) {
        setGyms([]);
      }
      setError(parseApiError(err) || 'Failed to fetch gyms');
    } finally {
      setGymsLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreGyms = () => {
    if (!loadingMore && hasMoreGyms && userLocation) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchGyms(userLocation, nextPage, true);
    }
  };

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      console.log('📍 Getting current location...');
      setLoading(true);
      setError('');
      setShowPermissionRequest(false);
      
      // Set a timeout for location request
      const locationTimeout = setTimeout(() => {
        console.log('⏰ Location request timed out');
        setLocationPermission(false);
        setUserLocation(null);
        setError('Location request timed out. Please try again.');
        setLoading(false);
        reject(new Error('Location request timed out'));
      }, 15000); // 15 second timeout
      
      Geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(locationTimeout);
          const { latitude, longitude } = position.coords;
          const newLocation = { latitude, longitude };
          console.log('✅ Location obtained successfully:', newLocation);
          setUserLocation(newLocation);
          setLocationPermission(true); // Only set to true after we actually get location
          setLoading(false);
          setCurrentPage(1);
          // Use the newly obtained location
          fetchGyms(newLocation, 1, false);
          resolve(newLocation);
        },
        (error) => {
          clearTimeout(locationTimeout);
          console.error('❌ Location error:', error);
          setLocationPermission(false);
          setUserLocation(null);
          
          // Provide more specific error messages
          let errorMessage = 'Could not get your location. ';
          switch (error.code) {
            case 1:
              errorMessage += 'Location permission denied.';
              break;
            case 2:
              errorMessage += 'Location unavailable. Please check your GPS settings.';
              break;
            case 3:
              errorMessage += 'Location request timed out. Please try again.';
              break;
            default:
              errorMessage += error.message || 'Unknown error occurred.';
          }
          
          setError(errorMessage);
          setLoading(false);
          setGyms([]);
          reject(error);
        },
        { 
          enableHighAccuracy: true, 
          timeout: 15000, 
          maximumAge: 300000, // 5 minutes cache
          distanceFilter: 10 // Update if moved more than 10 meters
        }
      );
    });
  };

  const requestLocationPermission = async () => {
    console.log('🔐 Requesting location permission...');
    setLoading(true);
    setError('');
    
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location to show nearby gyms.',
            buttonPositive: 'Allow',
            buttonNegative: 'Deny',
            buttonNeutral: 'Ask Me Later',
          }
        );
        console.log('📱 Permission request result:', granted);
        
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('✅ Permission granted, getting location...');
          try {
            await getCurrentLocation();
          } catch (error) {
            console.error('❌ Failed to get location after permission granted:', error);
            setError('Permission granted but failed to get location. Please try again.');
            setLoading(false);
          }
        } else if (granted === PermissionsAndroid.RESULTS.DENIED) {
          setLocationPermission(false);
          setShowPermissionRequest(false);
          setError('Location permission denied. Please enable location access in settings to find nearby gyms.');
          setLoading(false);
          setGyms([]);
        } else {
          // Ask Me Later
          setLocationPermission(false);
          setShowPermissionRequest(false);
          setError('Location permission not granted. Please enable location access to find nearby gyms.');
          setLoading(false);
          setGyms([]);
        }
      } catch (err) {
        console.error('❌ Permission request failed:', err);
        setLocationPermission(false);
        setShowPermissionRequest(false);
        setError('Permission request failed: ' + err.message);
        setLoading(false);
        setGyms([]);
      }
    } else {
      // iOS fallback
      console.log('🍎 iOS - Getting location directly');
      try {
        await getCurrentLocation();
      } catch (error) {
        console.error('❌ iOS location failed:', error);
        setError('Failed to get location on iOS. Please check your location settings.');
        setLoading(false);
      }
    }
  };

  const skipLocationPermission = () => {
    console.log('⏭️ User skipped location permission');
    setShowPermissionRequest(false);
    setLocationPermission(false);
    setUserLocation(null);
    setError('Location access is required to find nearby gyms. Please enable location access.');
    setGyms([]);
    setLoading(false);
  };

  const retryLocation = async () => {
    console.log('🔄 Retrying location...');
    setError('');
    setLoading(true);
    
    try {
      if (locationPermission) {
        await getCurrentLocation();
      } else {
        await requestLocationPermission();
      }
    } catch (error) {
      console.error('❌ Retry failed:', error);
      setError('Failed to get location. Please check your GPS settings and try again.');
      setLoading(false);
    }
  };

  // Radius modal UX helpers
  const confirmRadius = () => {
    setRadiusModalVisible(false);
    setCurrentPage(1);
    // Only fetch if we have location
    if (userLocation) {
      fetchGyms(userLocation, 1, false);
    }
  };

  // Auto-retry location after a delay if no location is available
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!userLocation && !gymsLoading && gyms.length === 0 && !loading) {
        console.log('🔄 No location available after delay - showing retry option');
        setError('Location access is required to find nearby gyms. Please enable location access or try again.');
      }
    }, 5000); // 5 second delay

    return () => clearTimeout(timer);
  }, [userLocation, gymsLoading, gyms.length, loading]);

  const renderPermissionRequest = () => (
    <Modal
      visible={showPermissionRequest}
      transparent
      animationType="fade"
      onRequestClose={skipLocationPermission}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.permissionModal}>
          <Icon name="location" size={60} color="#e74c3c" style={styles.permissionIcon} />
          <Text style={styles.permissionTitle}>Location Access</Text>
          <Text style={styles.permissionMessage}>
            To show you the nearest gyms, we need access to your location. This helps us find gyms closest to you.
          </Text>
          <View style={styles.permissionButtons}>
            <TouchableOpacity onPress={skipLocationPermission} style={[styles.permissionButton, styles.skipButton]}>
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={requestLocationPermission} style={[styles.permissionButton, styles.allowButton]}>
              <Text style={styles.allowButtonText}>Allow</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderRadiusModal = () => (
    <Modal
      visible={radiusModalVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setRadiusModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.radiusModal}>
          <Text style={styles.modalTitle}>Select Radius (km)</Text>
          <TextInput
            style={styles.radiusInput}
            keyboardType="numeric"
            value={radius}
            onChangeText={setRadius}
            maxLength={3}
            placeholder="Enter radius in km"
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity onPress={() => setRadiusModalVisible(false)} style={[styles.modalButton, styles.cancelButton]}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={confirmRadius} style={[styles.modalButton, styles.confirmButton]}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const initialRegion = {
    latitude: 28.7041,
    longitude: 77.1025,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const mapRegion = userLocation ? { ...userLocation, latitudeDelta: 0.0922, longitudeDelta: 0.0421 } : initialRegion;

  const renderGymList = () => {
    if (gymsLoading) {
      return (
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <ActivityIndicator size="small" color="#e74c3c" />
          <Text style={{ marginTop: 10, fontSize: 14 }}>Loading gyms...</Text>
        </View>
      );
    }

    if (gyms.length === 0) {
      return (
        <View style={styles.noGymsContainer}>
          <Icon name="fitness-outline" size={60} color="#ccc" />
          <Text style={styles.noGymsText}>No gyms found</Text>
          <Text style={styles.noGymsSubtext}>
            {locationPermission 
              ? 'Try increasing the radius or check back later for new gyms.'
              : 'No gyms available in the database at the moment.'
            }
          </Text>
        </View>
      );
    }

    return (
      <ScrollView style={{ marginTop: 20, maxHeight: 300 }}>
        {gyms.map((gym) => (
          <TouchableOpacity 
            key={gym.id} 
            style={[
              styles.gymCard,
              selectedGym?.id === gym.id && styles.selectedGymCard
            ]}
            onPress={() => navigation.navigate('GymProfile', { gymData: gym })}
          >
            <Text style={styles.gymName}>{gym.name}</Text>
            <Text style={styles.gymAddress}>{gym.address}</Text>
            <View style={styles.gymStats}>
              <Text style={styles.gymStat}>⭐ {gym.rating || 'N/A'}</Text>
              <Text style={styles.gymStat}>₹{gym.dailyPassPrice || 'N/A'}/day</Text>
              <Text style={styles.gymStat}>{gym.type || 'Standard'}</Text>
            </View>
          </TouchableOpacity>
        ))}
        
        {hasMoreGyms && (
          <TouchableOpacity 
            style={styles.loadMoreButton}
            onPress={loadMoreGyms}
            disabled={loadingMore}
          >
            {loadingMore ? (
              <ActivityIndicator size="small" color="#e74c3c" />
            ) : (
              <Text style={styles.loadMoreText}>Load More Gyms</Text>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <View style={{ flex: 1 }}>
        {/* Header with Radius */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Gyms Near You</Text>
          {locationPermission && (
            <TouchableOpacity onPress={() => setRadiusModalVisible(true)} style={styles.radiusButton}>
              <Text style={styles.radiusText}>Radius: {radius} km</Text>
              <Icon name="chevron-down" size={20} color="#e74c3c" />
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={retryLocation}
          >
            <Icon name="refresh" size={24} color="#e74c3c" />
          </TouchableOpacity>
        </View>

        {/* Location Status Bar */}
        <View style={styles.locationStatusBar}>
          <View style={styles.locationStatusContent}>
            <Icon 
              name={locationPermission ? "location" : "location-outline"} 
              size={20} 
              color={locationPermission ? "#27ae60" : "#e74c3c"} 
            />
            <Text style={[styles.locationStatusText, { color: locationPermission ? "#27ae60" : "#e74c3c" }]}>
              {locationPermission ? 'Location Available' : 'Location Not Available'}
            </Text>
          </View>
          {!locationPermission && (
            <TouchableOpacity 
              style={styles.enableLocationButton}
              onPress={requestLocationPermission}
            >
              <Text style={styles.enableLocationText}>Enable</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Map Section */}
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            region={mapRegion}
            showsUserLocation={false}
            showsMyLocationButton={false}
            provider={PROVIDER_GOOGLE}
          >
            {userLocation && (
              <Marker coordinate={userLocation} title="You are here">
                <View style={styles.userLocationMarker}>
                  <Animated.View style={[styles.userLocationPulse, { transform: [{ scale: pulseAnim }] }]} />
                  <View style={styles.userLocationDot} />
                </View>
              </Marker>
            )}
            {gyms.map((gym) => (
              <Marker
                key={gym.id}
                coordinate={gym.coordinates}
                title={gym.name}
                description={gym.address}
                pinColor={mapSelectedGym?.id === gym.id ? "#e74c3c" : "#27ae60"}
                onPress={() => setMapSelectedGym(gym)}
              />
            ))}
          </MapView>
        </View>

        {/* Details Section */}
        <View style={styles.contentContainer}>
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#e74c3c" />
              <Text style={styles.loadingText}>
                {locationPermission ? 'Getting location...' : 'Requesting permission...'}
              </Text>
            </View>
          )}

          {error && (
            <View style={styles.errorContainer}>
              <Icon name="alert-circle-outline" size={24} color="#e74c3c" style={styles.errorIcon} />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={retryLocation}
              >
                <Text style={styles.retryButtonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          )}

          {!loading && !error && (
            <View style={styles.locationInfo}>
              <View style={styles.locationInfoHeader}>
                <Text style={styles.locationStatus}>
                  Location: {userLocation ? 'Available' : 'Not Available'}
                </Text>
                {userLocation && (
                  <TouchableOpacity 
                    style={styles.refreshLocationButton}
                    onPress={retryLocation}
                  >
                    <Icon name="refresh" size={16} color="#e74c3c" />
                    <Text style={styles.refreshLocationText}>Refresh</Text>
                  </TouchableOpacity>
                )}
              </View>
              {userLocation && (
                <Text style={styles.coordinates}>
                  Lat: {userLocation.latitude.toFixed(4)}, Lon: {userLocation.longitude.toFixed(4)}
                </Text>
              )}
              {!userLocation && locationPermission && (
                <Text style={styles.coordinates}>
                  Getting your location...
                </Text>
              )}
            </View>
          )}

          <Text style={styles.gymListTitle}>
            {userLocation ? `Gyms Found (${gyms.length})` : 'Location Required'}
          </Text>

          {!userLocation && !loading && (
            <View style={styles.noLocationContainer}>
              <Icon name="location-outline" size={60} color="#ccc" />
              <Text style={styles.noLocationText}>Location Access Required</Text>
              <Text style={styles.noLocationSubtext}>
                We need your location to show nearby gyms. Please enable location access.
              </Text>
              <TouchableOpacity 
                style={styles.enableLocationButton}
                onPress={retryLocation}
              >
                <Text style={styles.enableLocationText}>Enable Location</Text>
              </TouchableOpacity>
            </View>
          )}

          {userLocation && renderGymList()}

        </View>

        {renderPermissionRequest()}
        {renderRadiusModal()}
      </View>
    </SafeAreaView>
  );
};

const styles = {
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  radiusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: '#fbd9d9',
    borderRadius: 20,
  },
  radiusText: {
    color: '#e74c3c',
    fontWeight: '600',
    marginRight: 6,
  },
  refreshButton: {
    padding: 8,
  },
  mapContainer: {
    height: '40%',
  },
  map: {
    flex: 1,
  },
  userLocationMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  userLocationDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#e74c3c',
    borderWidth: 3,
    borderColor: '#fff',
  },
  userLocationPulse: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(231, 76, 60, 0.3)',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  loadingOverlay: {
    alignItems: 'center',
    marginBottom: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 16,
    textAlign: 'center',
  },
  errorIcon: {
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  locationInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  locationInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 5,
  },
  locationStatus: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  coordinates: {
    fontSize: 14,
    color: '#666',
  },
  refreshLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fbd9d9',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  refreshLocationText: {
    color: '#e74c3c',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  gymListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  gymCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedGymCard: {
    borderColor: '#e74c3c',
    borderWidth: 2,
  },
  gymName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  gymAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  gymStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gymStat: {
    fontSize: 12,
    color: '#888',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radiusModal: {
    backgroundColor: 'white',
    width: '80%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  radiusInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  confirmButton: {
    backgroundColor: '#e74c3c',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  permissionModal: {
    backgroundColor: 'white',
    width: '80%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  permissionIcon: {
    marginBottom: 15,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  permissionMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  permissionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  skipButton: {
    backgroundColor: '#ccc',
  },
  skipButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  allowButton: {
    backgroundColor: '#e74c3c',
  },
  allowButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  noGymsContainer: {
    alignItems: 'center',
    marginTop: 50,
    padding: 20,
  },
  noGymsText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 10,
  },
  noGymsSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
    textAlign: 'center',
  },
  loadMoreButton: {
    alignItems: 'center',
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#e74c3c',
    borderRadius: 8,
  },
  loadMoreText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  locationStatusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  locationStatusContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationStatusText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: 'bold',
  },
  enableLocationButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#e74c3c',
    borderRadius: 8,
  },
  enableLocationText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  noLocationContainer: {
    alignItems: 'center',
    marginTop: 50,
    padding: 20,
  },
  noLocationText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 10,
  },
  noLocationSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
    textAlign: 'center',
  },
};

export default LocationMain;
