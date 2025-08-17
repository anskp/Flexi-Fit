import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Image, Switch } from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/authContext';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const navigation = useNavigation();
  const { logout } = useAuth();

  const tabs = [
    { id: 'profile', title: 'Profile', icon: '👤' },
    { id: 'community', title: 'Community', icon: '👥' },
    { id: 'notifications', title: 'Notifications', icon: '🔔' },
  ];

  const userProfile = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 98765 43210",
    membership: "Premium",
    memberSince: "January 2024",
    avatar: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
    stats: {
      workouts: 45,
      streak: 12,
      points: 1250,
      level: "Gold"
    }
  };

  const communityPosts = [
    {
      id: 1,
      user: "Sarah Wilson",
      avatar: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
      content: "Just completed my 30-day fitness challenge! 💪 Feeling amazing and stronger than ever. Who's up for the next challenge?",
      likes: 24,
      comments: 8,
      time: "2 hours ago",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400"
    },
    {
      id: 2,
      user: "Mike Johnson",
      avatar: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
      content: "New personal record on deadlifts today! 225 lbs for 5 reps. Progress feels great! 🏋️‍♂️",
      likes: 18,
      comments: 5,
      time: "5 hours ago"
    },
    {
      id: 3,
      user: "Emma Davis",
      avatar: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
      content: "Morning yoga session complete! 🧘‍♀️ Perfect way to start the day. Anyone else love sunrise workouts?",
      likes: 31,
      comments: 12,
      time: "1 day ago"
    }
  ];

  const notifications = [
    {
      id: 1,
      type: "workout",
      title: "Workout Reminder",
      message: "Time for your scheduled workout! Don't break your streak.",
      time: "5 minutes ago",
      read: false,
      icon: "💪"
    },
    {
      id: 2,
      type: "achievement",
      title: "Achievement Unlocked!",
      message: "Congratulations! You've completed 10 workouts this month.",
      time: "1 hour ago",
      read: false,
      icon: "🏆"
    },
    {
      id: 3,
      type: "community",
      title: "New Community Post",
      message: "Sarah Wilson posted about her fitness challenge completion.",
      time: "2 hours ago",
      read: true,
      icon: "👥"
    },
    {
      id: 4,
      type: "event",
      title: "Event Reminder",
      message: "Yoga workshop starts in 30 minutes at Zen Fitness Studio.",
      time: "3 hours ago",
      read: true,
      icon: "🧘‍♀️"
    }
  ];

  const renderProfileTab = () => (
    <View style={styles.tabContent}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: userProfile.avatar }}
          style={styles.profileAvatar}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{userProfile.name}</Text>
          <Text style={styles.profileMembership}>{userProfile.membership} Member</Text>
          <Text style={styles.profileSince}>Member since {userProfile.memberSince}</Text>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{userProfile.stats.workouts}</Text>
          <Text style={styles.statLabel}>Workouts</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{userProfile.stats.streak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{userProfile.stats.points}</Text>
          <Text style={styles.statLabel}>Points</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{userProfile.stats.level}</Text>
          <Text style={styles.statLabel}>Level</Text>
        </View>
      </View>

      {/* Profile Details */}
      <View style={styles.detailsCard}>
        <Text style={styles.detailsTitle}>Personal Information</Text>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Email</Text>
          <Text style={styles.detailValue}>{userProfile.email}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Phone</Text>
          <Text style={styles.detailValue}>{userProfile.phone}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Membership</Text>
          <Text style={styles.detailValue}>{userProfile.membership}</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsCard}>
        <Text style={styles.actionsTitle}>Quick Actions</Text>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>⚙️</Text>
          <Text style={styles.actionText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>🔒</Text>
          <Text style={styles.actionText}>Privacy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>❓</Text>
          <Text style={styles.actionText}>Help & Support</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>📱</Text>
          <Text style={styles.actionText}>About App</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.signupButton]} 
          onPress={() => {
            // Logout functionality
            logout();
            // Navigate to login screen
            navigation.navigate('LoginScreen');
          }}
        >
          <Text style={styles.actionIcon}>🚪</Text>
          <Text style={styles.actionText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCommunityTab = () => (
    <View style={styles.tabContent}>
      {/* Create Post */}
      <View style={styles.createPostCard}>
        <TouchableOpacity style={styles.createPostButton}>
          <Text style={styles.createPostIcon}>✏️</Text>
          <Text style={styles.createPostText}>Share your fitness journey...</Text>
        </TouchableOpacity>
      </View>

      {/* Community Posts */}
      <View style={styles.postsContainer}>
        {communityPosts.map((post) => (
          <View key={post.id} style={styles.postCard}>
            <View style={styles.postHeader}>
              <Image source={{ uri: post.avatar }} style={styles.postAvatar} />
              <View style={styles.postUserInfo}>
                <Text style={styles.postUserName}>{post.user}</Text>
                <Text style={styles.postTime}>{post.time}</Text>
              </View>
            </View>
            
            <Text style={styles.postContent}>{post.content}</Text>
            
            {post.image && (
              <Image source={{ uri: post.image }} style={styles.postImage} />
            )}
            
            <View style={styles.postActions}>
              <TouchableOpacity style={styles.postAction}>
                <Text style={styles.postActionIcon}>❤️</Text>
                <Text style={styles.postActionText}>{post.likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.postAction}>
                <Text style={styles.postActionIcon}>💬</Text>
                <Text style={styles.postActionText}>{post.comments}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.postAction}>
                <Text style={styles.postActionIcon}>📤</Text>
                <Text style={styles.postActionText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderNotificationsTab = () => (
    <View style={styles.tabContent}>
      {/* Notification Settings */}
      <View style={styles.settingsCard}>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingIcon}>🔔</Text>
            <Text style={styles.settingText}>Push Notifications</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#767577', true: '#e74c3c' }}
            thumbColor={notificationsEnabled ? '#fff' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Notifications List */}
      <View style={styles.notificationsContainer}>
        {notifications.map((notification) => (
          <TouchableOpacity
            key={notification.id}
            style={[
              styles.notificationCard,
              !notification.read && styles.unreadNotification
            ]}
          >
            <View style={styles.notificationIcon}>
              <Text style={styles.notificationIconText}>{notification.icon}</Text>
            </View>
            <View style={styles.notificationContent}>
              <Text style={styles.notificationTitle}>{notification.title}</Text>
              <Text style={styles.notificationMessage}>{notification.message}</Text>
              <Text style={styles.notificationTime}>{notification.time}</Text>
            </View>
            {!notification.read && <View style={styles.unreadDot} />}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#e74c3c', '#c0392b']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Profile</Text>
          <Text style={styles.headerSubtitle}>Manage your account</Text>
        </View>
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
        {activeTab === 'profile' && renderProfileTab()}
        {activeTab === 'community' && renderCommunityTab()}
        {activeTab === 'notifications' && renderNotificationsTab()}
      </ScrollView>
    </View>
  );
};

export default Profile;

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
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#e74c3c',
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
    color: 'white',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  tabContent: {
    paddingTop: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  profileMembership: {
    fontSize: 14,
    color: '#e74c3c',
    fontWeight: '600',
    marginBottom: 2,
  },
  profileSince: {
    fontSize: 12,
    color: '#666',
  },
  editButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  detailsCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  actionsCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  actionIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  actionText: {
    fontSize: 16,
    color: '#333',
  },
  createPostCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  createPostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
  },
  createPostIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  createPostText: {
    fontSize: 16,
    color: '#666',
  },
  postsContainer: {
    gap: 15,
  },
  postCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  postUserInfo: {
    flex: 1,
  },
  postUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  postTime: {
    fontSize: 12,
    color: '#666',
  },
  postContent: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 10,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
  },
  postAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postActionIcon: {
    fontSize: 16,
    marginRight: 5,
  },
  postActionText: {
    fontSize: 14,
    color: '#666',
  },
  settingsCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  settingText: {
    fontSize: 16,
    color: '#333',
  },
  notificationsContainer: {
    gap: 10,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  unreadNotification: {
    backgroundColor: '#f8f9fa',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  notificationIconText: {
    fontSize: 18,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e74c3c',
    alignSelf: 'center',
  },
  signupButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    marginTop: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
}); 