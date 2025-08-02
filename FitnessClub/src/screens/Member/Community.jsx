import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, 
  Dimensions, StatusBar, SafeAreaView, TextInput, Modal, Alert
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const { width: screenWidth } = Dimensions.get('window');

const Community = () => {
  const [activeTab, setActiveTab] = useState('trainers');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [showTrainerModal, setShowTrainerModal] = useState(false);

  const tabs = [
    { id: 'trainers', title: 'Personal Trainers', icon: '💪' },
    { id: 'groups', title: 'Fitness Groups', icon: '👥' },
    { id: 'challenges', title: 'Challenges', icon: '🏆' },
  ];

  const trainers = [
    {
      id: 1,
      name: "Sarah Johnson",
      specialty: "Strength & Conditioning",
      rating: 4.8,
      experience: "5 years",
      price: "$60/hour",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
      bio: "Certified personal trainer specializing in strength training and weight loss. I help clients achieve their fitness goals through personalized workout plans.",
      certifications: ["NASM", "ACE", "CrossFit L1"],
      languages: ["English", "Spanish"],
      availability: "Mon-Fri, 6AM-8PM",
      location: "Downtown Fitness Center",
      clients: 45,
      successRate: 92
    },
    {
      id: 2,
      name: "Mike Chen",
      specialty: "Cardio & HIIT",
      rating: 4.9,
      experience: "8 years",
      price: "$75/hour",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
      bio: "HIIT specialist with a passion for helping clients build endurance and burn fat. Former marathon runner with expertise in cardio training.",
      certifications: ["ACSM", "TRX", "Precision Nutrition"],
      languages: ["English", "Mandarin"],
      availability: "Mon-Sun, 5AM-10PM",
      location: "Elite Sports Club",
      clients: 62,
      successRate: 95
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      specialty: "Yoga & Flexibility",
      rating: 4.7,
      experience: "6 years",
      price: "$50/hour",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
      bio: "Yoga instructor and flexibility coach. I focus on improving mobility, reducing stress, and building mind-body connection through yoga and stretching.",
      certifications: ["RYT-200", "Yoga Alliance", "Pilates"],
      languages: ["English", "Spanish"],
      availability: "Mon-Sat, 7AM-9PM",
      location: "Zen Wellness Studio",
      clients: 38,
      successRate: 89
    },
    {
      id: 4,
      name: "David Thompson",
      specialty: "Bodybuilding & Nutrition",
      rating: 4.6,
      experience: "10 years",
      price: "$80/hour",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
      bio: "Bodybuilding coach and nutrition specialist. I help clients build muscle, improve physique, and optimize their nutrition for maximum results.",
      certifications: ["ISSA", "Precision Nutrition", "Sports Nutrition"],
      languages: ["English"],
      availability: "Mon-Fri, 5AM-9PM",
      location: "Powerhouse Gym",
      clients: 55,
      successRate: 91
    }
  ];

  const fitnessGroups = [
    {
      id: 1,
      name: "Morning Runners Club",
      members: 128,
      activity: "Running",
      meetingTime: "6:00 AM Daily",
      location: "Central Park",
      description: "Join our morning running group for daily cardio workouts and social fitness fun!"
    },
    {
      id: 2,
      name: "Weightlifting Warriors",
      members: 89,
      activity: "Strength Training",
      meetingTime: "7:00 PM Mon/Wed/Fri",
      location: "Downtown Fitness",
      description: "Serious lifters supporting each other in strength training goals."
    },
    {
      id: 3,
      name: "Yoga Flow Community",
      members: 156,
      activity: "Yoga",
      meetingTime: "6:30 PM Tue/Thu",
      location: "Zen Studio",
      description: "Mindful yoga sessions for all levels in a supportive environment."
    }
  ];

  const challenges = [
    {
      id: 1,
      name: "30-Day Push-up Challenge",
      participants: 234,
      daysLeft: 15,
      prize: "$500 Gift Card",
      description: "Complete 100 push-ups daily for 30 days"
    },
    {
      id: 2,
      name: "Summer Body Transformation",
      participants: 189,
      daysLeft: 45,
      prize: "Free Gym Membership",
      description: "12-week transformation challenge with nutrition guidance"
    },
    {
      id: 3,
      name: "Marathon Training Group",
      participants: 67,
      daysLeft: 90,
      prize: "Race Entry Fee",
      description: "Train together for the upcoming city marathon"
    }
  ];

  const handleBookTrainer = (trainer) => {
    Alert.alert(
      'Book Session',
      `Book a session with ${trainer.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Book Now', 
          onPress: () => {
            Alert.alert('Success', 'Session booked! Trainer will contact you soon.');
            setShowTrainerModal(false);
          }
        }
      ]
    );
  };

  const renderTrainersTab = () => (
    <View style={styles.tabContent}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search trainers by specialty..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Trainers List */}
      <View style={styles.trainersList}>
        {trainers
          .filter(trainer => 
            trainer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            trainer.specialty.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((trainer) => (
            <TouchableOpacity
              key={trainer.id}
              style={styles.trainerCard}
              onPress={() => {
                setSelectedTrainer(trainer);
                setShowTrainerModal(true);
              }}
            >
              <Image source={{ uri: trainer.image }} style={styles.trainerImage} />
              <View style={styles.trainerInfo}>
                <Text style={styles.trainerName}>{trainer.name}</Text>
                <Text style={styles.trainerSpecialty}>{trainer.specialty}</Text>
                <View style={styles.trainerStats}>
                  <View style={styles.statItem}>
                    <Icon name="star" size={16} color="#FFD700" />
                    <Text style={styles.statText}>{trainer.rating}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Icon name="time" size={16} color="#666" />
                    <Text style={styles.statText}>{trainer.experience}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Icon name="cash" size={16} color="#27AE60" />
                    <Text style={styles.statText}>{trainer.price}</Text>
                  </View>
                </View>
              </View>
              <Icon name="chevron-forward" size={24} color="#ccc" />
            </TouchableOpacity>
          ))}
      </View>
    </View>
  );

  const renderGroupsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.groupsList}>
        {fitnessGroups.map((group) => (
          <TouchableOpacity key={group.id} style={styles.groupCard}>
            <View style={styles.groupHeader}>
              <Text style={styles.groupName}>{group.name}</Text>
              <Text style={styles.groupMembers}>{group.members} members</Text>
            </View>
            <Text style={styles.groupActivity}>{group.activity}</Text>
            <View style={styles.groupDetails}>
              <View style={styles.detailItem}>
                <Icon name="time" size={16} color="#666" />
                <Text style={styles.detailText}>{group.meetingTime}</Text>
              </View>
              <View style={styles.detailItem}>
                <Icon name="location" size={16} color="#666" />
                <Text style={styles.detailText}>{group.location}</Text>
              </View>
            </View>
            <Text style={styles.groupDescription}>{group.description}</Text>
            <TouchableOpacity style={styles.joinButton}>
              <Text style={styles.joinButtonText}>Join Group</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderChallengesTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.challengesList}>
        {challenges.map((challenge) => (
          <TouchableOpacity key={challenge.id} style={styles.challengeCard}>
            <LinearGradient
              colors={['#FF6B6B', '#FF8E8E']}
              style={styles.challengeGradient}
            >
              <Text style={styles.challengeName}>{challenge.name}</Text>
              <Text style={styles.challengePrize}>🏆 {challenge.prize}</Text>
            </LinearGradient>
            <View style={styles.challengeContent}>
              <Text style={styles.challengeDescription}>{challenge.description}</Text>
              <View style={styles.challengeStats}>
                <View style={styles.challengeStat}>
                  <Text style={styles.challengeStatValue}>{challenge.participants}</Text>
                  <Text style={styles.challengeStatLabel}>Participants</Text>
                </View>
                <View style={styles.challengeStat}>
                  <Text style={styles.challengeStatValue}>{challenge.daysLeft}</Text>
                  <Text style={styles.challengeStatLabel}>Days Left</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.joinChallengeButton}>
                <Text style={styles.joinChallengeButtonText}>Join Challenge</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <LinearGradient
        colors={['#FF6B6B', '#FF8E8E']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Community</Text>
        <Text style={styles.headerSubtitle}>Connect with fitness enthusiasts</Text>
      </LinearGradient>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'trainers' && renderTrainersTab()}
        {activeTab === 'groups' && renderGroupsTab()}
        {activeTab === 'challenges' && renderChallengesTab()}
      </ScrollView>

      {/* Trainer Detail Modal */}
      <Modal
        visible={showTrainerModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowTrainerModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.trainerModal}>
            {selectedTrainer && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Trainer Profile</Text>
                  <TouchableOpacity onPress={() => setShowTrainerModal(false)}>
                    <Icon name="close" size={24} color="#333" />
                  </TouchableOpacity>
                </View>
                
                <ScrollView style={styles.modalContent}>
                  <Image source={{ uri: selectedTrainer.image }} style={styles.modalTrainerImage} />
                  <Text style={styles.modalTrainerName}>{selectedTrainer.name}</Text>
                  <Text style={styles.modalTrainerSpecialty}>{selectedTrainer.specialty}</Text>
                  
                  <View style={styles.modalStats}>
                    <View style={styles.modalStat}>
                      <Text style={styles.modalStatValue}>{selectedTrainer.rating}</Text>
                      <Text style={styles.modalStatLabel}>Rating</Text>
                    </View>
                    <View style={styles.modalStat}>
                      <Text style={styles.modalStatValue}>{selectedTrainer.experience}</Text>
                      <Text style={styles.modalStatLabel}>Experience</Text>
                    </View>
                    <View style={styles.modalStat}>
                      <Text style={styles.modalStatValue}>{selectedTrainer.price}</Text>
                      <Text style={styles.modalStatLabel}>Price</Text>
                    </View>
                  </View>

                  <Text style={styles.modalSectionTitle}>About</Text>
                  <Text style={styles.modalBio}>{selectedTrainer.bio}</Text>

                  <Text style={styles.modalSectionTitle}>Certifications</Text>
                  <View style={styles.certificationsList}>
                    {selectedTrainer.certifications.map((cert, index) => (
                      <Text key={index} style={styles.certification}>{cert}</Text>
                    ))}
                  </View>

                  <Text style={styles.modalSectionTitle}>Languages</Text>
                  <View style={styles.languagesList}>
                    {selectedTrainer.languages.map((lang, index) => (
                      <Text key={index} style={styles.language}>{lang}</Text>
                    ))}
                  </View>

                  <Text style={styles.modalSectionTitle}>Availability</Text>
                  <Text style={styles.availability}>{selectedTrainer.availability}</Text>
                  <Text style={styles.location}>{selectedTrainer.location}</Text>
                </ScrollView>

                <TouchableOpacity
                  style={styles.bookButton}
                  onPress={() => handleBookTrainer(selectedTrainer)}
                >
                  <Text style={styles.bookButtonText}>Book Session</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

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
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 5,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#f8f9fa',
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 5,
  },
  tabText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#FF6B6B',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  trainersList: {
    gap: 15,
  },
  trainerCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  trainerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  trainerInfo: {
    flex: 1,
  },
  trainerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  trainerSpecialty: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  trainerStats: {
    flexDirection: 'row',
    gap: 15,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  groupsList: {
    gap: 15,
  },
  groupCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  groupMembers: {
    fontSize: 14,
    color: '#666',
  },
  groupActivity: {
    fontSize: 16,
    color: '#FF6B6B',
    fontWeight: '600',
    marginBottom: 12,
  },
  groupDetails: {
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  groupDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    lineHeight: 20,
  },
  joinButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  joinButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  challengesList: {
    gap: 15,
  },
  challengeCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  challengeGradient: {
    padding: 20,
    alignItems: 'center',
  },
  challengeName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  challengePrize: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  challengeContent: {
    padding: 20,
  },
  challengeDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    lineHeight: 20,
  },
  challengeStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  challengeStat: {
    alignItems: 'center',
  },
  challengeStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  challengeStatLabel: {
    fontSize: 12,
    color: '#666',
  },
  joinChallengeButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  joinChallengeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  trainerModal: {
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    height: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalTrainerImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 15,
  },
  modalTrainerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  modalTrainerSpecialty: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 25,
  },
  modalStat: {
    alignItems: 'center',
  },
  modalStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalStatLabel: {
    fontSize: 12,
    color: '#666',
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    marginTop: 20,
  },
  modalBio: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 15,
  },
  certificationsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 15,
  },
  certification: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    fontSize: 12,
    color: '#333',
  },
  languagesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 15,
  },
  language: {
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    fontSize: 12,
    color: '#27AE60',
  },
  availability: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  location: {
    fontSize: 14,
    color: '#666',
  },
  bookButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 15,
    margin: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Community; 