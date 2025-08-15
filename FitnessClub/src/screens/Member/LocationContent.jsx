import React from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Image, Dimensions, TextInput, Modal, Platform, Animated } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const LocationContent = ({
  gyms,
  selectedGym,
  mapSelectedGym,
  userLocation,
  pulseAnim,
  locationPermission,
  isLoadingLocation,
  searchQuery,
  showSearchModal,
  showFilterModal,
  selectedFilter,
  selectedSort,
  filterOptions,
  sortOptions,
  onGymPress,
  onMapMarkerPress,
  onMyLocation,
  onCameraPress,
  onSearchPress,
  onFilterPress,
  onSearchQueryChange,
  onSearchModalClose,
  onFilterModalClose,
  onFilterChange,
  onSortChange,
  onRequestLocationPermission
}) => {
  const initialRegion = {
    latitude: 28.7041,
    longitude: 77.1025,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <>
      {/* Header with Search and Camera */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={onSearchPress}
        >
          <Icon name="search" size={28} color="#000" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.cameraButton}
          onPress={onCameraPress}
          activeOpacity={0.8}
        >
          <Icon name="camera" size={32} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Location Permission Overlay - Only show if user hasn't granted permission */}
        {!locationPermission && (
          <View style={styles.locationPermissionOverlay}>
            <View style={styles.permissionCard}>
              <Icon name="location" size={48} color="#e74c3c" />
              <Text style={styles.permissionTitle}>Find Gyms Near You</Text>
              <Text style={styles.permissionMessage}>
                Enable location access to discover nearby gyms and get personalized recommendations based on your location.
              </Text>
              <TouchableOpacity 
                style={styles.permissionButton}
                onPress={onRequestLocationPermission}
                activeOpacity={0.8}
              >
                <Text style={styles.permissionButtonText}>Enable Location Access</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.skipButton}
                onPress={() => {
                  // Hide the overlay without requesting permission
                  console.log('User chose to skip location permission');
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.skipButtonText}>Skip for now</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Loading Location Overlay */}
        {isLoadingLocation && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingCard}>
              <Icon name="location" size={32} color="#e74c3c" />
              <Text style={styles.loadingText}>Getting your location...</Text>
            </View>
          </View>
        )}

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
          {/* User Location Marker - Enhanced */}
          <Marker
            coordinate={userLocation}
            title="📍 You are here"
            description="Your current location"
            pinColor="#e74c3c"
          >
            <View style={styles.userLocationMarker}>
              <View style={styles.userLocationDot} />
              <Animated.View 
                style={[
                  styles.userLocationPulse,
                  {
                    transform: [{ scale: pulseAnim }],
                    opacity: pulseAnim.interpolate({
                      inputRange: [1, 1.5],
                      outputRange: [0.3, 0],
                    }),
                  }
                ]} 
              />
            </View>
          </Marker>
          
          {/* Gym Markers */}
          {gyms.map((gym) => (
            <Marker
              key={gym.id}
              coordinate={gym.coordinates}
              title={gym.name}
              description={`${gym.distance} • ${gym.rating}⭐ • ${gym.price}`}
              pinColor={gym.isNearest ? "#e74c3c" : "#27ae60"}
              onPress={() => onMapMarkerPress(gym)}
              opacity={mapSelectedGym?.id === gym.id ? 1 : 0.8}
            >
              {mapSelectedGym?.id === gym.id && (
                <View style={styles.selectedGymCallout}>
                  <Text style={styles.calloutTitle}>{gym.name}</Text>
                  <Text style={styles.calloutSubtitle}>{gym.location}</Text>
                  <Text style={styles.calloutDetails}>{gym.distance} • ⭐{gym.rating} • {gym.price}</Text>
                </View>
              )}
            </Marker>
          ))}
        </MapView>

        {/* My Location Button */}
        <View style={styles.myLocationButtonContainer}>
          <TouchableOpacity 
            style={styles.myLocationButton}
            onPress={onMyLocation}
            activeOpacity={0.8}
          >
            <Icon name="locate" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Filter Button inside Map */}
        <View style={styles.mapFilterContainer}>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={onFilterPress}
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
                style={[
                  styles.gymCard,
                  gym.isNearest && styles.nearestGymCard
                ]}
                onPress={() => onGymPress(gym)}
              >
                <View style={[
                  styles.gymImageContainer,
                  gym.isNearest && styles.nearestGymImageContainer
                ]}>
                  <Image
                    source={{ uri: gym.image }}
                    style={[
                      styles.gymImage,
                      gym.isNearest && styles.nearestGymImage
                    ]}
                    resizeMode="cover"
                  />
                  {gym.isNearest && (
                    <View style={[
                      styles.nearestBadge,
                      styles.nearestGymBadge
                    ]}>
                      <Text style={[
                        styles.nearestText,
                        styles.nearestGymText
                      ]}>Nearest</Text>
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
        onRequestClose={onSearchModalClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.searchModal}>
            <View style={styles.searchModalHeader}>
              <Text style={styles.searchModalTitle}>Search Gyms</Text>
              <TouchableOpacity onPress={onSearchModalClose}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.searchInputContainer}>
              <Icon name="search" size={20} color="#666" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by name, location, or features..."
                value={searchQuery}
                onChangeText={onSearchQueryChange}
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
                      onGymPress(gym);
                      onSearchModalClose();
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
        onRequestClose={onFilterModalClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.filterModal}>
            <View style={styles.filterModalHeader}>
              <Text style={styles.filterModalTitle}>Filter & Sort</Text>
              <TouchableOpacity onPress={onFilterModalClose}>
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
                    onPress={() => onFilterChange(option.value)}
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
                    onPress={() => onSortChange(option.value)}
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
              onPress={onFilterModalClose}
            >
              <Text style={styles.applyFilterButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: 'rgba(255, 255, 255, 0.32)',
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
  mainContent: {
    flex: 1,
  },
  map: {
    height: '40%',
  },
  mapFilterContainer: {
    position: 'absolute',
    right: 20,
    top: 280,
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
  userLocationMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  userLocationDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#e74c3c',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  userLocationPulse: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(231, 76, 60, 0.3)',
    borderWidth: 2,
    borderColor: 'rgba(231, 76, 60, 0.5)',
  },
  myLocationButtonContainer: {
    position: 'absolute',
    right: 20,
    bottom: 320,
    zIndex: 1000,
  },
  myLocationButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#fff',
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
    height: '60%',
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
  nearestGymCard: {
    transform: [{ scale: 1.05 }],
    marginBottom: 20,
    shadowColor: '#e74c3c',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#e74c3c',
  },
  gymImageContainer: {
    position: 'relative',
    height: 120,
  },
  nearestGymImageContainer: {
    height: 150,
  },
  gymImage: {
    width: '100%',
    height: '100%',
  },
  nearestGymImage: {
    height: 150,
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
  nearestGymBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
  },
  nearestGymText: {
    fontSize: 14,
    fontWeight: '700',
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
  selectedGymCallout: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#e74c3c',
    minWidth: 200,
    maxWidth: 250,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  calloutSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  calloutDetails: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 15,
  },
  locationPermissionOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },
  permissionCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    margin: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    marginBottom: 10,
    textAlign: 'center',
  },
  permissionMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 25,
  },
  permissionButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  skipButton: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  skipButtonText: {
    color: '#666',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1500,
  },
  loadingCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
  },
  loadingText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
    fontWeight: '600',
  },
});

export default LocationContent; 