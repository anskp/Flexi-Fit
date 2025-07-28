import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Linking,
  StatusBar,
  LinearGradient,
  Image,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

// Simple tab navigation without external dependencies
const MyGym = () => {
  const [activeTab, setActiveTab] = useState('Home');

  // Mock data
  const userData = {
    name: 'John Doe',
    membership: 'Premium',
    status: 'Active',
    expires: '2024-12-31',
    checkedIn: false,
    trainer: { name: 'Sarah Johnson', phone: '+1-555-0123', image: require('../../assets/women.jpg') },
    profileImage: require('../../assets/men.jpg'),
  };

  const facilities = [
    { 
      name: 'Cardio Equipment', 
      available: true, 
      count: 25, 
      icon: '🏃‍♂️',
      image: require('../../assets/front-view-fit-woman-exercise-bike.jpg'),
      description: 'Treadmills, ellipticals, stationary bikes, rowing machines',
      capacity: '85%'
    },
    { 
      name: 'Weight Training', 
      available: true, 
      count: 50, 
      icon: '🏋️‍♀️',
      image: require('../../assets/men.jpg'),
      description: 'Free weights, machines, power racks, cable stations',
      capacity: '60%'
    },
    { 
      name: 'Swimming Pool', 
      available: false, 
      icon: '🏊‍♂️',
      image: require('../../assets/full-shot-athlete-swimming.jpg'),
      description: 'Olympic-size pool with lanes and temperature control',
      capacity: 'Closed'
    },

    { 
      name: 'Yoga Studio', 
      available: true, 
      count: 3, 
      icon: '🧘‍♀️',
      image: require('../../assets/yoga-group-classes-inside-gym.jpg'),
      description: 'Dedicated yoga and meditation spaces',
      capacity: '40%'
    },
    { 
      name: 'Basketball Court', 
      available: true, 
      count: 1, 
      icon: '🏀',
      image: require('../../assets/empty-basketball-field.jpg'),
      description: 'Full-size indoor basketball court',
      capacity: '75%'
    },
  ];

  const gymInfo = {
    name: 'Elite Fitness Center',
    phone: '+1-555-MY-GYM',
    email: 'info@elitefitness.com',
    address: '123 Fitness Street, Health City',
    hours: '24/7',
    rating: 4.8,
    members: 2500,
    image: require('../../assets/trainer-helping-beginner-gym.jpg'),
  };

  const recentActivities = [
    { type: 'Workout', time: '2 hours ago', duration: '45 min', calories: 320 },
    { type: 'Class', time: 'Yesterday', duration: '60 min', calories: 450 },
    { type: 'Swimming', time: '3 days ago', duration: '30 min', calories: 280 },
  ];

  const [user, setUser] = useState(userData);

  // Helper functions
  const handleCheckIn = () => {
    const action = user.checkedIn ? 'out' : 'in';
    setUser(prev => ({ ...prev, checkedIn: !prev.checkedIn }));
    Alert.alert(`Checked ${action}`, `Successfully checked ${action}!`);
  };

  const handleCall = (phone) => {
    Linking.openURL(`tel:${phone}`).catch(() => {
      Alert.alert('Error', 'Unable to make call');
    });
  };

  const handleEmail = (email) => {
    Linking.openURL(`mailto:${email}`).catch(() => {
      Alert.alert('Error', 'Unable to open email client');
    });
  };

  const handleDirections = (address) => {
    const url = `https://maps.google.com/maps?q=${encodeURIComponent(address)}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Unable to open maps');
    });
  };

  // Home Screen Component
  const HomeScreen = () => (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* User Profile Section */}
      <View style={styles.userProfileSection}>
        <Image source={user.profileImage} style={styles.userProfileImage} />
        <View style={styles.userInfo}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userName}>{user.name}!</Text>
          <View style={styles.userStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Workouts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>8.5k</Text>
              <Text style={styles.statLabel}>Calories</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>24</Text>
              <Text style={styles.statLabel}>Hours</Text>
            </View>
          </View>
        </View>
      </View>
      
      {/* Subscription Card */}
      <View style={styles.premiumCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>💎 Premium Membership</Text>
        </View>
        <View style={styles.membershipInfo}>
          <View>
            <Text style={styles.membershipType}>{user.membership}</Text>
            <Text style={styles.membershipSubtext}>Active until {user.expires}</Text>
            <Text style={styles.membershipBenefits}>• All facilities access • Personal trainer</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: user.status === 'Active' ? '#00E676' : '#FF5252' }]}>
            <Text style={styles.statusBadgeText}>{user.status}</Text>
          </View>
        </View>
      </View>

      {/* Check In/Out */}
      <View style={styles.checkInCard}>
        <Text style={styles.cardTitle}>🏢 Gym Access</Text>
        <View style={styles.checkInStatus}>
          <View>
            <Text style={styles.checkInText}>
              {user.checkedIn ? '✅ Currently in gym' : '📍 Not checked in'}
            </Text>
            <Text style={styles.checkInSubtext}>
              {user.checkedIn ? 'Enjoy your workout!' : 'Ready for your session?'}
            </Text>
            {user.checkedIn && (
              <Text style={styles.checkInTime}>Checked in at 9:30 AM</Text>
            )}
          </View>
          <TouchableOpacity
            style={[styles.checkInButton, { 
              backgroundColor: user.checkedIn ? '#FF5252' : '#00E676',
              shadowColor: user.checkedIn ? '#FF5252' : '#00E676',
            }]}
            onPress={handleCheckIn}
          >
            <Text style={styles.checkInButtonText}>
              {user.checkedIn ? 'Check Out' : 'Check In'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Trainer */}
      <View style={styles.trainerCard}>
        <Text style={styles.cardTitle}>👩‍🏫 Your Personal Trainer</Text>
        <View style={styles.trainerInfo}>
          <Image source={user.trainer.image} style={styles.trainerAvatar} />
          <View style={styles.trainerDetails}>
            <Text style={styles.trainerName}>{user.trainer.name}</Text>
            <Text style={styles.trainerSubtext}>Certified Professional Trainer</Text>
            <Text style={styles.trainerSpecialty}>Specializes in Strength & Conditioning</Text>
          </View>
          <TouchableOpacity
            style={styles.callButton}
            onPress={() => handleCall(user.trainer.phone)}
          >
            <Text style={styles.callButtonText}>📞 Call</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Activities */}
      <View style={styles.activitiesCard}>
        <Text style={styles.cardTitle}>📊 Recent Activities</Text>
        {recentActivities.map((activity, index) => (
          <View key={index} style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Text style={styles.activityIconText}>
                {activity.type === 'Workout' ? '💪' : activity.type === 'Class' ? '🧘‍♀️' : '🏊‍♂️'}
              </Text>
            </View>
            <View style={styles.activityDetails}>
              <Text style={styles.activityType}>{activity.type}</Text>
              <Text style={styles.activityTime}>{activity.time}</Text>
            </View>
            <View style={styles.activityStats}>
              <Text style={styles.activityDuration}>{activity.duration}</Text>
              <Text style={styles.activityCalories}>{activity.calories} cal</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  // Features Screen Component
  const FeaturesScreen = () => (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Gym Facilities</Text>
      <Text style={styles.sectionSubtitle}>State-of-the-art equipment and amenities</Text>
      
      {facilities.map((item, index) => (
        <View key={index} style={styles.facilityCard}>
          <Image source={item.image} style={styles.facilityImage} />
          <View style={styles.facilityContent}>
            <View style={styles.facilityHeader}>
              <View style={styles.facilityIcon}>
                <Text style={styles.facilityIconText}>{item.icon}</Text>
              </View>
              <View style={styles.facilityInfo}>
                <Text style={styles.facilityName}>{item.name}</Text>
                <Text style={styles.facilityDescription}>{item.description}</Text>
                {item.count && <Text style={styles.facilityCount}>{item.count} equipment available</Text>}
              </View>
              <View style={[styles.facilityStatus, { 
                backgroundColor: item.available ? '#E8F5E8' : '#FFEBEE' 
              }]}>
                <Text style={[styles.facilityStatusText, { 
                  color: item.available ? '#2E7D32' : '#C62828' 
                }]}>
                  {item.available ? 'Open' : 'Closed'}
                </Text>
              </View>
            </View>
            <View style={styles.facilityCapacity}>
              <Text style={styles.capacityLabel}>Current Capacity:</Text>
              <Text style={[styles.capacityValue, { 
                color: item.capacity === 'Closed' ? '#C62828' : 
                       item.capacity.includes('85') ? '#FF9800' : 
                       item.capacity.includes('75') ? '#FF5722' : '#4CAF50'
              }]}>
                {item.capacity}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  // Contact Screen Component
  const ContactScreen = () => (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Get in Touch</Text>
      <Text style={styles.sectionSubtitle}>We're here to help you achieve your fitness goals</Text>
      
      <View style={styles.contactCard}>
        <Image source={gymInfo.image} style={styles.gymImage} />
        <Text style={styles.gymName}>{gymInfo.name}</Text>
        <Text style={styles.gymAddress}>{gymInfo.address}</Text>
        
        <View style={styles.gymStats}>
          <View style={styles.gymStat}>
            <Text style={styles.gymStatNumber}>{gymInfo.rating}</Text>
            <Text style={styles.gymStatLabel}>Rating</Text>
          </View>
          <View style={styles.gymStat}>
            <Text style={styles.gymStatNumber}>{gymInfo.members}</Text>
            <Text style={styles.gymStatLabel}>Members</Text>
          </View>
          <View style={styles.gymStat}>
            <Text style={styles.gymStatNumber}>{gymInfo.hours}</Text>
            <Text style={styles.gymStatLabel}>Hours</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.contactOption}
          onPress={() => handleCall(gymInfo.phone)}
        >
          <View style={styles.contactIconContainer}>
            <Text style={styles.contactIcon}>📞</Text>
          </View>
          <View style={styles.contactDetails}>
            <Text style={styles.contactLabel}>Phone</Text>
            <Text style={styles.contactValue}>{gymInfo.phone}</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.contactOption}
          onPress={() => handleEmail(gymInfo.email)}
        >
          <View style={styles.contactIconContainer}>
            <Text style={styles.contactIcon}>✉️</Text>
          </View>
          <View style={styles.contactDetails}>
            <Text style={styles.contactLabel}>Email</Text>
            <Text style={styles.contactValue}>{gymInfo.email}</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.contactOption}
          onPress={() => handleDirections(gymInfo.address)}
        >
          <View style={styles.contactIconContainer}>
            <Text style={styles.contactIcon}>📍</Text>
          </View>
          <View style={styles.contactDetails}>
            <Text style={styles.contactLabel}>Directions</Text>
            <Text style={styles.contactValue}>Get directions to gym</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  // Render current screen based on active tab
  const renderScreen = () => {
    switch (activeTab) {
      case 'Home':
        return <HomeScreen />;
      case 'Features':
        return <FeaturesScreen />;
      case 'Contact':
        return <ContactScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      
      {/* Full Page Gradient Background */}
      <View style={styles.gradientBackground}>
        <View style={styles.gradientOverlay} />
      
        {/* Header */}
        <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {activeTab === 'Home' ? 'MyGym' : 
           activeTab === 'Features' ? 'Facilities' : 'Contact'}
        </Text>
        <Text style={styles.headerSubtitle}>
          {activeTab === 'Home' ? 'Your fitness journey starts here' : 
           activeTab === 'Features' ? 'State-of-the-art equipment' : 'We\'re here to help'}
        </Text>
      </View>

      {/* Screen Content */}
      <View style={styles.screenContainer}>
        {renderScreen()}
      </View>

        {/* Bottom Tab Navigation */}
        <View style={styles.tabBar}>
          {[
            { key: 'Home', label: 'Home', icon: '🏠' },
            { key: 'Features', label: 'Features', icon: '🏋️‍♀️' },
            { key: 'Contact', label: 'Contact', icon: '📞' }
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tabButton,
                activeTab === tab.key && styles.activeTabButton
              ]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text style={[
                styles.tabIcon,
                activeTab === tab.key && styles.activeTabIcon
              ]}>
                {tab.icon}
              </Text>
              <Text style={[
                styles.tabText,
                activeTab === tab.key && styles.activeTabText
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: 'transparent',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderBottomWidth: 0,
  },
  headerTitle: {
    color: '#333333',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
    fontFamily: 'System',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    color: '#666666',
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'System',
  },
  screenContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'transparent',
  },
  
  // Background
  gradientBackground: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ffffff',
  },
  
  // User Profile Section
  userProfileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  userProfileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    color: '#757575',
    fontWeight: '400',
    fontFamily: 'System',
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 4,
    marginBottom: 12,
    fontFamily: 'System',
    letterSpacing: 0.5,
  },
  userStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#255f99',
    fontFamily: 'System',
  },
  statLabel: {
    fontSize: 12,
    color: '#757575',
    marginTop: 2,
    fontFamily: 'System',
    fontWeight: '400',
  },
  
  // Section Titles
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'System',
    letterSpacing: 0.5,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },

  // Premium Card
  premiumCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#6C63FF',
    backdropFilter: 'blur(10px)',
  },
  cardHeader: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  membershipInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  membershipType: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  membershipSubtext: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
  },
  membershipBenefits: {
    fontSize: 12,
    color: '#757575',
    marginTop: 8,
    lineHeight: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Check In Card
  checkInCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    backdropFilter: 'blur(10px)',
  },
  checkInStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  checkInText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  checkInSubtext: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
  },
  checkInTime: {
    fontSize: 12,
    color: '#255f99',
    marginTop: 4,
    fontWeight: '600',
  },
  checkInButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  checkInButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },

  // Trainer Card
  trainerCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    backdropFilter: 'blur(10px)',
  },
  trainerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  trainerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  trainerDetails: {
    flex: 1,
    marginLeft: 16,
  },
  trainerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  trainerSubtext: {
    fontSize: 14,
    color: '#757575',
    marginTop: 2,
  },
  trainerSpecialty: {
    fontSize: 12,
    color: '#255f99',
    marginTop: 2,
    fontWeight: '500',
  },
  callButton: {
    backgroundColor: '#00E676',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  callButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },

  // Facility Cards
  facilityCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  facilityImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  facilityContent: {
    padding: 16,
  },
  facilityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  facilityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  facilityIconText: {
    fontSize: 20,
  },
  facilityInfo: {
    flex: 1,
  },
  facilityName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  facilityCount: {
    fontSize: 14,
    color: '#757575',
    marginTop: 2,
  },
  facilityDescription: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
    lineHeight: 16,
  },
  facilityCapacity: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  capacityLabel: {
    fontSize: 12,
    color: '#757575',
    fontWeight: '500',
  },
  capacityValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  facilityStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  facilityStatusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Contact Card
  contactCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  gymImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
    resizeMode: 'contain',
  },
  gymName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 8,
  },
  gymAddress: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 22,
  },
  gymStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
    paddingVertical: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  gymStat: {
    alignItems: 'center',
  },
  gymStatNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#255f99',
  },
  gymStatLabel: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
  },
  contactOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  contactIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactIcon: {
    fontSize: 20,
  },
  contactDetails: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 14,
    color: '#757575',
    fontWeight: '500',
  },
  contactValue: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '600',
    marginTop: 2,
  },

  // Tab Bar
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(224, 224, 224, 0.5)',
    paddingVertical: 8,
    paddingHorizontal: 4,
    backdropFilter: 'blur(10px)',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 2,
    borderRadius: 8,
    marginHorizontal: 0,
  },
  activeTabButton: {
    backgroundColor: '#F5F5F5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginLeft: -8,
    marginRight: 8,
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  activeTabIcon: {
    fontSize: 22,
  },
  tabText: {
    color: '#757575',
    fontSize: 12,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#333333',
    fontWeight: 'bold',
  },

  // Activities Card
  activitiesCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityIconText: {
    fontSize: 16,
  },
  activityDetails: {
    flex: 1,
  },
  activityType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  activityTime: {
    fontSize: 12,
    color: '#757575',
    marginTop: 2,
  },
  activityStats: {
    alignItems: 'flex-end',
  },
  activityDuration: {
    fontSize: 14,
    fontWeight: '600',
    color: '#255f99',
  },
  activityCalories: {
    fontSize: 12,
    color: '#757575',
    marginTop: 2,
  },
});

export default MyGym;