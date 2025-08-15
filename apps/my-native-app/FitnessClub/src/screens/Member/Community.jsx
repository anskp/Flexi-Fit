import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  Dimensions, StatusBar, SafeAreaView
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const { width: screenWidth } = Dimensions.get('window');

const Community = () => {
  const [activeTab, setActiveTab] = useState('groups');

  const tabs = [
    { id: 'groups', title: 'Fitness Groups', icon: '👥' },
    { id: 'challenges', title: 'Challenges', icon: '🏆' },
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
        {activeTab === 'groups' && renderGroupsTab()}
        {activeTab === 'challenges' && renderChallengesTab()}
      </ScrollView>
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
});

export default Community; 