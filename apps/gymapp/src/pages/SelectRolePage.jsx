// src/pages/SelectRolePage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../api/authService'; // We'll use our authService
import { useAuth } from '../context/AuthContext'; // To update the token if the role changes it

export default function SelectRolePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setAuthData } = useAuth();
  const handleRoleSelection = async (role) => {
    setLoading(true);
    setError('');
    try {
      const response = await authService.selectRole(role);
      if (response.success) {
        // ✅ CRITICAL STEP: Update the global auth state with the new token.
        // The new token contains the user's role.
        if (response.data.token) {
          // We don't get the user object back from this call, so we pass null for now.
          // The user object will be fully populated on the next page load or app refresh.
          setAuthData(response.data.token, null); 
        }
        
        // Navigate to the next step as directed by the backend.
        navigate(response.data.redirectTo);
      } else {
        throw new Error(response.message || 'Failed to select role.');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Who are you?</h2>
          <p className="text-gray-600">Choose your role to complete your profile setup.</p>
          {error && <p className="text-red-500">{error}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            
            <button
              onClick={() => handleRoleSelection('GYM_OWNER')}
              disabled={loading}
              className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition text-left disabled:opacity-50"
            >
              <div className="text-4xl mb-2">🏢</div>
              <h3 className="font-semibold text-lg">Gym Owner</h3>
              <p className="text-gray-500 text-sm">I want to manage my gym</p>
            </button>

            <button
              onClick={() => handleRoleSelection('TRAINER')}
              disabled={loading}
              className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition text-left disabled:opacity-50"
            >
              <div className="text-4xl mb-2">🏋️‍♂️</div>
              <h3 className="font-semibold text-lg">Trainer</h3>
              <p className="text-gray-500 text-sm">I want to train members</p>
            </button>
            
            {/* Add Member and Multi-Gym Member roles here if they need separate onboarding flows */}

          </div>
        </div>
      </div>
    </div>
  );
}