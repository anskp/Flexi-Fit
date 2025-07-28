import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';


const { width, height } = Dimensions.get('window');

const OpenPage = () => {

  const navigation = useNavigation();

 

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        <View style={styles.content}>
          {/* Dumbbell Icon */}
          <View style={styles.iconContainer}>
            <Icon name="fitness-center" size={50} color="#FF4444" />
          </View>

          {/* Title */}
          <Text style={styles.title}>FITNESS CLUB</Text>

          {/* Welcome Back Text */}
          <Text style={styles.welcomeText}>Welcome Back</Text>

          {/* Buttons Container */}
          <View style={styles.buttonsContainer}>
            {/* Sign In Button */}
            <TouchableOpacity
              style={styles.signInButton}
             onPress={() => {navigation.navigate('MyGym')}}
              activeOpacity={0.8}
            >
              <Text style={styles.signInButtonText}>SIGN IN</Text>
            </TouchableOpacity>

            {/* Sign Up Button */}
            <TouchableOpacity
              style={styles.signUpButton}
               onPress={() => {navigation.navigate('SignIn')}}
              
              activeOpacity={0.8}
            >
              <Text style={styles.signUpButtonText}>SIGN UP</Text>
            </TouchableOpacity>
          </View>

          {/* Social Sign Up Section */}
          <View style={styles.socialContainer}>
            <Text style={styles.socialText}>sign up with others</Text>
            
            <View style={styles.socialButtonsContainer}>
              {/* Google Button */}
              <TouchableOpacity
                style={styles.socialButton}
               
                activeOpacity={0.8}
              >
                <FontAwesome name="google" size={24} color="#DB4437" />
              </TouchableOpacity>

              {/* Facebook Button */}
              <TouchableOpacity
                style={styles.socialButton}
                
                activeOpacity={0.8}
              >
                <FontAwesome name="facebook" size={24} color="#4267B2" />
              </TouchableOpacity>

              {/* Twitter Button */}
              <TouchableOpacity
                style={styles.socialButton}
                
                activeOpacity={0.8}
              >
                <FontAwesome name="twitter" size={24} color="#1DA1F2" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '300',
    color: '#333333',
    letterSpacing: 2,
    marginBottom: 60,
    textAlign: 'center',
    fontFamily: 'System',
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 80,
    textAlign: 'center',
    fontFamily: 'System',
    letterSpacing: 0.5,
  },
  buttonsContainer: {
    width: '100%',
    marginBottom: 60,
  },
  signInButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FF4444',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
    marginBottom: 20,
    width: '100%',
  },
  signInButtonText: {
    color: '#FF4444',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 1,
    fontFamily: 'System',
  },
  signUpButton: {
    backgroundColor: '#FF4444',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
    width: '100%',
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 1,
    fontFamily: 'System',
  },
  socialContainer: {
    alignItems: 'center',
    width: '100%',
  },
  socialText: {
    color: '#666666',
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 20,
    opacity: 0.8,
    fontFamily: 'System',
    fontWeight: '400',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  socialButton: {
    backgroundColor: '#F5F5F5',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default OpenPage;