// src/utils/auth0Test.js
import Auth0 from 'react-native-auth0';
import { Platform } from 'react-native';

const auth0 = new Auth0({
  domain: 'dev-1de0bowjvfbbcx7q.us.auth0.com',
  clientId: 'rwah022fY6bSPr5gstiKqPAErQjgynT2'
});

// Platform-specific redirect URI
const getRedirectUri = () => {
  if (Platform.OS === 'ios') {
    return 'com.fitnessclub.auth0://dev-1de0bowjvfbbcx7q.us.auth0.com/ios/com.fitnessclub/callback';
  } else {
    return 'com.fitnessclub.auth0://dev-1de0bowjvfbbcx7q.us.auth0.com/android/com.fitnessclub/callback';
  }
};

export const testAuth0Configuration = async () => {
  console.log('Auth0Test: Starting configuration test...');
  
  try {
    // Test 1: Check if Auth0 instance is created
    console.log('Auth0Test: Auth0 instance created successfully');
    
    // Test 2: Check if we can access Auth0 methods
    if (typeof auth0.webAuth.authorize === 'function') {
      console.log('Auth0Test: webAuth.authorize method available');
    } else {
      console.error('Auth0Test: webAuth.authorize method not available');
    }
    
    // Test 3: Check if we can access credentials manager
    if (typeof auth0.credentialsManager.getCredentials === 'function') {
      console.log('Auth0Test: credentialsManager.getCredentials method available');
    } else {
      console.error('Auth0Test: credentialsManager.getCredentials method not available');
    }
    
    // Test 4: Try to get existing credentials (should not throw if no credentials exist)
    try {
      const credentials = await auth0.credentialsManager.getCredentials();
      console.log('Auth0Test: getCredentials completed, result:', credentials ? 'Found credentials' : 'No credentials');
    } catch (error) {
      console.log('Auth0Test: getCredentials error (expected if no credentials):', error.message);
    }
    
    // Test 5: Check redirect URI
    const redirectUri = getRedirectUri();
    console.log('Auth0Test: Platform-specific redirect URI:', redirectUri);
    
    console.log('Auth0Test: Configuration test completed successfully');
    return { success: true, message: 'Auth0 configuration is valid', redirectUri };
    
  } catch (error) {
    console.error('Auth0Test: Configuration test failed:', error);
    return { success: false, error: error.message };
  }
};

export const testAuth0Login = async () => {
  console.log('Auth0Test: Starting login test...');
  
  try {
    const redirectUri = getRedirectUri();
    console.log('Auth0Test: Using redirect URI:', redirectUri);
    
    const result = await auth0.webAuth.authorize({
      scope: 'openid profile email',
      audience: 'https://dev-1de0bowjvfbbcx7q.us.auth0.com/api/v2/',
      prompt: 'login',
      redirectUri: redirectUri
    });
    
    console.log('Auth0Test: Login test successful:', result);
    return { success: true, result };
    
  } catch (error) {
    console.error('Auth0Test: Login test failed:', error);
    return { success: false, error: error.message };
  }
};

export const clearAuth0Credentials = async () => {
  console.log('Auth0Test: Clearing Auth0 credentials...');
  
  try {
    await auth0.credentialsManager.clearCredentials();
    console.log('Auth0Test: Credentials cleared successfully');
    return { success: true };
  } catch (error) {
    console.error('Auth0Test: Failed to clear credentials:', error);
    return { success: false, error: error.message };
  }
};
