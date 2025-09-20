
// src/context/AuthContext.js
import { createContext, useState, useEffect, useContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import apiClient from '../api/apiClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const {
    isAuthenticated: isAuth0Authenticated,
    user: auth0User,
    getAccessTokenSilently,
    loginWithRedirect,
    logout: auth0Logout,
    isLoading: isAuth0Loading,
  } = useAuth0();

  const [internalToken, setInternalToken] = useState(localStorage.getItem('authToken'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const exchangeToken = async () => {
      if (isAuth0Authenticated) {
        try {
          const auth0Token = await getAccessTokenSilently();
          
          // Exchange Auth0 token for our internal JWT
          const response = await apiClient.post('/auth/verify-user', {
            token: auth0Token, // Sending in body as a fallback
          }, {
            headers: { Authorization: `Bearer ${auth0Token}` }
          });

          const { token, user: backendUser } = response.data.data;

          // Store our internal token and user
          localStorage.setItem('authToken', token);
          setInternalToken(token);
          setUser(backendUser);
          
          // Update apiClient to use our internal token for subsequent requests
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        } catch (error) {
          console.error('Error during token exchange:', error);
          // If exchange fails, log out the user completely
          logout();
        }
      }
      setLoading(false);
    };

    exchangeToken();
  }, [isAuth0Authenticated, getAccessTokenSilently]);

  const logout = () => {
    // Clear our internal auth state
    localStorage.removeItem('authToken');
    setInternalToken(null);
    setUser(null);
    delete apiClient.defaults.headers.common['Authorization'];

    // Log out from Auth0
    auth0Logout({ returnTo: window.location.origin });
  };

  const value = {
    user,
    isAuthenticated: !!internalToken && !!user,
    isLoading: loading || isAuth0Loading,
    login: loginWithRedirect,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!value.isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
