import React, { useState, useRef } from 'react';
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

  // Radius Filter states
  const [radius, setRadius] = useState('10'); // km, string for input
  const [radiusModalVisible, setRadiusModalVisible] = useState(false);

  // Animation ref
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const fetchGyms = async (location = null) => {
    try {
      setGymsLoading(true);
      setError('');

      const params = {
        page: 1,
        limit: 50,
        sort: 'distance',
        filter: 'all',
        search: '',
        radius: parseFloat(radius) || 10,
      };

      if (location && location.latitude && location.longitude) {
        params.lat = location.latitude;
        params.lon = location.longitude;
      }

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
        setGyms(formattedGyms);

        if (formattedGyms.length === 0) {
          setError('No gyms found in this radius.');
        } else {
          setError('');
        }
      } else {
        setGyms([]);
        setError(response?.message || 'Failed to load gyms');
      }
    } catch (err) {
      setGyms([]);
      setError(parseApiError(err) || 'Failed to fetch gyms');
    } finally {
      setGymsLoading(false);
    }
  };

  const getCurrentLocation = () => {
    setLoading(true);
    setError('');
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newLocation = { latitude, longitude };
        setUserLocation(newLocation);
        setLocationPermission(true);
        setLoading(false);
        fetchGyms(newLocation);
      },
      (error) => {
        setLocationPermission(false);
        setError('Could not get your location: ' + error.message);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 30000, maximumAge: 60000 }
    );
  };

  const requestLocationPermission = async () => {
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
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setLocationPermission(true);
          getCurrentLocation();
        } else {
          setLocationPermission(false);
          setError('Permission denied by user');
          setLoading(false);
        }
      } catch (err) {
        setLocationPermission(false);
        setError('Permission request failed: ' + err.message);
        setLoading(false);
      }
    } else {
      // iOS fallback
      setLocationPermission(true);
      getCurrentLocation();
    }
  };

  // Radius modal UX helpers
  const confirmRadius = () => {
    setRadiusModalVisible(false);
    fetchGyms(userLocation);
  };

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
        <Text style={{ textAlign: 'center', marginTop: 20, color: '#666' }}>
          No gyms found in the selected radius.
        </Text>
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
          <TouchableOpacity onPress={() => setRadiusModalVisible(true)} style={styles.radiusButton}>
            <Text style={styles.radiusText}>Radius: {radius} km</Text>
            <Icon name="chevron-down" size={20} color="#e74c3c" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={() => fetchGyms(userLocation)}
          >
            <Icon name="refresh" size={24} color="#e74c3c" />
          </TouchableOpacity>
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
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {!loading && !error && (
            <View style={styles.locationInfo}>
              <Text style={styles.locationStatus}>
                Location: {locationPermission ? 'Available' : 'Not Available'}
              </Text>
              {userLocation && (
                <Text style={styles.coordinates}>
                  Lat: {userLocation.latitude.toFixed(4)}, Lon: {userLocation.longitude.toFixed(4)}
                </Text>
              )}
            </View>
          )}

          <Text style={styles.gymListTitle}>
            Gyms Found ({gyms.length})
          </Text>

          {renderGymList()}

        </View>

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
  locationInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  locationStatus: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  coordinates: {
    fontSize: 14,
    color: '#666',
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
  }
};

export default LocationMain;
