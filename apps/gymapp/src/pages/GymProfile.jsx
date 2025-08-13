// src/pages/GymProfile.jsx
import { useState, useEffect } from 'react';
import * as gymService from '../api/gymService';
import * as userService from '../api/userService';
import parseApiError from '../utils/parseApiError';

export default function GymProfile() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchGymProfile = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await gymService.getMyGymProfile();
        if (response.success) {
          setProfileData(response.data);
          // Pre-fill form data for the edit modal
          setFormData({
              name: response.data.name || '',
              address: response.data.address || '',
              facilities: response.data.facilities || [],
          });
        }
      } catch (err) {
        setError(parseApiError(err));
      } finally {
        setLoading(false);
      }
    };
    fetchGymProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
        // NOTE: The update route is on the user service, as it's a generic "update my profile"
        const response = await userService.updateMyProfile(formData);
        if (response.success) {
            setProfileData(response.data);
            setIsEditing(false);
            alert('Profile updated successfully!');
        }
    } catch (err) {
        setError(parseApiError(err));
    } finally {
        setSaving(false);
    }
  };

  const handleChange = (e) => {
      setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (loading) return <div className="text-center p-8">Loading Gym Profile...</div>;
  if (error && !isEditing) return <div className="p-4 bg-red-100 text-red-800 rounded-lg">{error}</div>;
  if (!profileData) return <div>Could not load gym profile data.</div>;

  return (
    <div className="animate-fade-in">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">🏢 Gym Profile</h1>
          <p className="text-gray-600 mt-2">View and manage your gym's public listing.</p>
        </div>
        <button onClick={() => setIsEditing(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold">
            Edit Profile
        </button>
      </div>
      
      <div className="bg-white/90 p-8 rounded-3xl shadow-lg border space-y-6">
        <div>
            <h2 className="text-2xl font-semibold text-gray-800">{profileData.name}</h2>
            <p className="text-gray-500">{profileData.address}</p>
        </div>
        <div className="pt-4 border-t">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Status</h3>
            <p className="font-mono px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full inline-block text-sm">{profileData.status}</p>
        </div>
        <div className="pt-4 border-t">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Facilities</h3>
            <div className="flex flex-wrap gap-2">
                {profileData.facilities.map(facility => (
                    <span key={facility} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">{facility}</span>
                ))}
            </div>
        </div>
        <div className="pt-4 border-t">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Membership Plans</h3>
            <ul className="list-disc list-inside space-y-1">
                {profileData.plans.map(plan => (
                    <li key={plan.id}><span className="font-medium">{plan.name}</span> ({plan.duration}) - ${plan.price}</li>
                ))}
            </ul>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Edit Gym Profile</h3>
            <form onSubmit={handleSave} className="space-y-4">
              {error && <div className="p-3 bg-red-100 text-red-800 rounded-lg text-sm">{error}</div>}
              <div>
                <label className="block text-sm font-medium text-gray-700">Gym Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full mt-1 border border-gray-300 rounded-xl px-4 py-2"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full mt-1 border border-gray-300 rounded-xl px-4 py-2"/>
              </div>
              {/* Add more fields here like facilities */}
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsEditing(false)} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-xl font-semibold">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold disabled:opacity-70">
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}