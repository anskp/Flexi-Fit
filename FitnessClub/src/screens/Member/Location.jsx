import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Image, Dimensions, TextInput, Modal, SafeAreaView, StatusBar, Platform, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { LinearGradient } from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const Location = () => {
  const [selectedGym, setSelectedGym] = useState(null);
  const [userLocation, setUserLocation] = useState({
    latitude: 28.6139,
    longitude: 77.2090,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedSort, setSelectedSort] = useState('distance');


  // Sample gym data with enhanced information
  const gyms = [
    {
      id: 1,
      name: "Oxygen Gym Almahboula",
      location: "Almahboula, State...",
      distance: "0.5 km",
      rating: 4.5,
      isNearest: true,
      coordinates: {
        latitude: 28.6139,
        longitude: 77.2090,
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
      name: "Platinum Almahboula",
      location: "Almahboula, State : Al Ahma...",
      distance: "1.2 km",
      rating: 4.2,
      isNearest: false,
      coordinates: {
        latitude: 28.6000,
        longitude: 77.2300,
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

  const handleCameraPress = () => {
    // Handle camera functionality - can be used for gym check-in, photo sharing, etc.
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
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      
      {/* Header with Search and Camera */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={() => setShowSearchModal(true)}
        >
          <Icon name="search" size={28} color="#000" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.cameraButton}
          onPress={handleCameraPress}
          activeOpacity={0.8}
        >
          <Icon name="camera" size={32} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
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
            pinColor="#e74c3c"
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

        {/* Filter Button inside Map */}
        <View style={styles.mapFilterContainer}>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setShowFilterModal(true)}
          >
            <Icon name="filter" size={20} color="#333" />
          </TouchableOpacity>
        </View>



        {/* Enhanced Bottom Sheet */}
        <View style={styles.bottomSheet}>
          <View style={styles.bottomSheetHandle} />
          <View style={styles.bottomSheetHeader}>
            <View style={styles.headerInfo}>
              <View style={styles.titleRow}>
                <Text style={styles.gymEmoji}>🏋️</Text>
                <View style={styles.titleContainer}>
                  <Text style={styles.bottomSheetTitle}>Gyms Near You</Text>
                  <Text style={styles.subtitleText}>4 fitness centers found</Text>
                </View>
              </View>
            </View>
            <View style={styles.headerStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>4</Text>
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

      {/* Search Modal */}
      <Modal
        visible={showSearchModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSearchModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.searchModal}>
            <View style={styles.searchModalHeader}>
              <Text style={styles.searchModalTitle}>Search Gyms</Text>
              <TouchableOpacity onPress={() => setShowSearchModal(false)}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.searchInputContainer}>
              <Icon name="search" size={20} color="#666" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by name, location, or features..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus={true}
              />
            </View>
            
            <ScrollView style={styles.searchResults}>
              {gyms
                .filter(gym => 
                  gym.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  gym.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  gym.features.some(feature => 
                    feature.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                )
                .map((gym) => (
                  <TouchableOpacity
                    key={gym.id}
                    style={styles.searchResultItem}
                    onPress={() => {
                      setSelectedGym(gym);
                      setShowSearchModal(false);
                    }}
                  >
                    <Text style={styles.searchResultName}>{gym.name}</Text>
                    <Text style={styles.searchResultLocation}>{gym.location}</Text>
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </View>
        </View>
              </Modal>

        {/* Filter Modal */}
        <Modal
          visible={showFilterModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowFilterModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.filterModal}>
              <View style={styles.filterModalHeader}>
                <Text style={styles.filterModalTitle}>Filter & Sort</Text>
                <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                  <Icon name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Filter by Type</Text>
                <View style={styles.filterOptions}>
                  {filterOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.filterOption,
                        selectedFilter === option.value && styles.filterOptionSelected
                      ]}
                      onPress={() => setSelectedFilter(option.value)}
                    >
                      <Text style={[
                        styles.filterOptionText,
                        selectedFilter === option.value && styles.filterOptionTextSelected
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Sort by</Text>
                <View style={styles.sortOptions}>
                  {sortOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.sortOption,
                        selectedSort === option.value && styles.sortOptionSelected
                      ]}
                      onPress={() => setSelectedSort(option.value)}
                    >
                      <Text style={[
                        styles.sortOptionText,
                        selectedSort === option.value && styles.sortOptionTextSelected
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <TouchableOpacity
                style={styles.applyFilterButton}
                onPress={() => setShowFilterModal(false)}
              >
                <Text style={styles.applyFilterButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

    </SafeAreaView>
  );
};

export default Location;

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  
  // Header Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: Platform.OS === 'ios' ? 80 : 45,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  searchButton: {
    width: 55,
    height: 55,
    borderRadius: 42.5,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  cameraButton: {
    width: 55,
    height: 55,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },

  // Main Content
  mainContent: {
    flex: 1,
  },

  map: {
    height: '60%',
  },
  mapFilterContainer: {
    position: 'absolute',
    right: 20,
    top: 400,
    zIndex: 1000,
  },
  filterButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    height: '40%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gymEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  subtitleText: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  headerInfo: {
    flex: 1,
  },
  bottomSheetTitle: {
    fontSize: 18,
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
    textAlign: 'center',
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



  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  searchModal: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
    padding: 20,
  },
  filterModal: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '70%',
    padding: 20,
  },

  searchModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  filterModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  searchModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  filterModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },

  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  searchResults: {
    flex: 1,
  },
  searchResultItem: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchResultName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  searchResultLocation: {
    fontSize: 14,
    color: '#666',
  },
  filterSection: {
    marginBottom: 25,
  },
  filterSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  filterOption: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterOptionSelected: {
    backgroundColor: '#e74c3c',
    borderColor: '#e74c3c',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#666',
  },
  filterOptionTextSelected: {
    color: 'white',
    fontWeight: '600',
  },
  sortOptions: {
    gap: 10,
  },
  sortOption: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sortOptionSelected: {
    backgroundColor: '#e74c3c',
    borderColor: '#e74c3c',
  },
  sortOptionText: {
    fontSize: 16,
    color: '#666',
  },
  sortOptionTextSelected: {
    color: 'white',
    fontWeight: '600',
  },
  applyFilterButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  applyFilterButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

});
