// src/pages/MerchantProfileForm.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../api/authService';
import parseApiError from '../utils/parseApiError';
import { useAuth } from '../context/AuthContext';

const MerchantProfileForm = () => {
  const { user, setAuthData } = useAuth(); // ✅ Get setAuthData from context
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    storeName: '',
    description: '',
    address: '',
    phone: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.storeName) {
        setError('Store name is required.');
        return;
    }
    setLoading(true);
    setError('');

    try {
      const response = await authService.createMerchantProfile(formData);

      // ✅ --- THE FIX ---
      // 1. Check for `response.status === 'success'` instead of `response.success`.
      if (response && response.status === 'success') {
        
        // 2. Update the Auth Context with the fresh user and token from the API response.
        // This ensures the user object now contains the new merchantProfile.
        setAuthData(response.data.token, response.data.user);

        alert('✅ Merchant profile created! You will now be redirected.');

        // 3. Navigate to the dashboard.
        navigate('/dashboard');

      } else {
        setError("An unexpected server response was received. Please try again.");
      }
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  };

  // This effect correctly redirects users who already have a profile.
  useEffect(() => {
    if (user && user.merchantProfile) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-8 text-center rounded-t-2xl">
          <div className="text-4xl mb-2">🛍️</div>
          <h1 className="text-2xl font-bold">Set Up Your Store</h1>
          <p className="text-orange-100">Complete your merchant profile to start selling.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && <div className="p-3 bg-red-100 text-red-800 rounded-lg">{error}</div>}

          <div>
            <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">Store Name</label>
            <input id="storeName" name="storeName" type="text" value={formData.storeName} onChange={handleChange} className="mt-1 w-full border-gray-300 rounded-lg shadow-sm" required />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Store Description (Optional)</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="3" className="mt-1 w-full border-gray-300 rounded-lg shadow-sm" placeholder="Tell customers about your store..." />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Business Address (Optional)</label>
            <input id="address" name="address" type="text" value={formData.address} onChange={handleChange} className="mt-1 w-full border-gray-300 rounded-lg shadow-sm" />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Contact Phone (Optional)</label>
            <input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} className="mt-1 w-full border-gray-300 rounded-lg shadow-sm" />
          </div>
          
          <div className="pt-5">
            <button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-colors">
              {loading ? 'Saving Profile...' : 'Complete Setup'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MerchantProfileForm;