import React from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext'; // Assuming you will create this file

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-1de0bowjvfbbcx7q.us.auth0.com"
      clientId="rwah022fY6bSPr5gstiKqPAErQjgynT2" // Using the same client ID for now
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: 'https://api.fitnessclub.com',
      }}
    >
      <AuthProvider>
        <App />
      </AuthProvider>
    </Auth0Provider>
  </React.StrictMode>,
);