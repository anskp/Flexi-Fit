// src/pages/GymProfileForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../api/authService';
import parseApiError from '../utils/parseApiError';

export default function GymProfileForm() {
  const [formData, setFormData] = useState({
    name: '', // Maps to backend `name`
    address: '', // Maps to backend `address`
    latitude: '', // Maps to backend `latitude`
    longitude: '', // Maps to backend `longitude`
    photos: [], // Maps to backend `photos` (URLs)
    facilities: [], // Maps to backend `facilities`
    plans: [{ name: 'Monthly', price: '', duration: 'monthly' }], // Maps to backend `plans`
  });

  const navigate = useNavigate();
  const [photoPreviews, setPhotoPreviews] = useState([]); // For local UI previews
  const [errors, setErrors] = useState({}); // For form validation errors
  const [submitError, setSubmitError] = useState(''); // For API submission errors
  const [loading, setLoading] = useState(false);

  // Consolidated options for facilities (your original code had amenities too, combining them for backend)
  const facilitiesOptions = ['Free Weights', 'Cardio Machines', 'Functional Training Area', 'Swimming Pool', 'Sauna & Steam Room', 'Locker Rooms', 'Parking', 'Wi-Fi'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      facilities: checked
        ? [...prev.facilities, value]
        : prev.facilities.filter(f => f !== value)
    }));
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    // Limit to 5 photos as per UI/backend expectation
    if (files.length > 5) {
        alert("You can only upload a maximum of 5 photos.");
        return;
    }
    setFormData((prev) => ({ ...prev, photos: files }));
    // Create local URL previews for display
    const previews = files.map(file => URL.createObjectURL(file));
    setPhotoPreviews(previews);
  };

  const handlePlanChange = (index, field, value) => {
    const newPlans = [...formData.plans];
    newPlans[index][field] = value;
    setFormData((prev) => ({ ...prev, plans: newPlans }));
  };

  const addPlan = () => {
    setFormData((prev) => ({
      ...prev,
      plans: [...prev.plans, { name: '', price: '', duration: '' }] // Allow custom plans
    }));
  };
  
  const removePlan = (index) => {
    const newPlans = formData.plans.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, plans: newPlans }));
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      setLoading(true); // Show loading while fetching location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }));
          setLoading(false);
          setSubmitError(''); // Clear any location errors
        },
        (error) => {
          console.error("Geolocation error:", error);
          setSubmitError("Could not get location. Please enter it manually or check browser permissions.");
          setLoading(false);
        }
      );
    } else {
      setSubmitError("Geolocation is not supported by this browser.");
    }
  };

  // ✅ --- ENHANCED FORM VALIDATION ---
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Gym name is required.';
    if (!formData.address.trim()) newErrors.address = 'Address is required.';
    if (formData.latitude === '' || formData.longitude === '' || isNaN(formData.latitude) || isNaN(formData.longitude)) {
      newErrors.location = 'Valid Latitude and Longitude are required.';
    }
    if (formData.photos.length === 0) newErrors.photos = 'Upload at least one photo of your gym.';
    if (formData.facilities.length === 0) newErrors.facilities = 'Select at least one facility/amenity.';
    
    // Validate plans
    const hasValidPlan = formData.plans.some(plan => 
        plan.name.trim() && plan.duration.trim() && plan.price && parseFloat(plan.price) > 0
    );
    if (formData.plans.length === 0 || !hasValidPlan) {
        newErrors.plans = 'You must add at least one valid membership plan with a name, duration, and price.';
    } else {
        // Check individual plan validity
        formData.plans.forEach((plan, index) => {
            if (!plan.name.trim()) newErrors[`planName-${index}`] = 'Plan name is required.';
            if (!plan.duration.trim()) newErrors[`planDuration-${index}`] = 'Plan duration is required.';
            if (!plan.price || parseFloat(plan.price) <= 0) newErrors[`planPrice-${index}`] = 'Plan price must be positive.';
        });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(''); // Clear previous API submission errors

    if (!validateForm()) { // Run frontend validation
      return; // Stop if validation fails
    }

    setLoading(true);

    try {
      // ✅ --- DATA TRANSFORMATION FOR BACKEND ---
      // photos: map File objects to placeholder URLs (in a real app, upload first)
      // plans: ensure prices are numbers and filter out incomplete ones
      const apiPayload = {
        name: formData.name,
        address: formData.address,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        photos: formData.photos.map(file => `https://placehold.co/600x400?text=${encodeURIComponent(file.name || 'Image')}`), // Ensure name for placeholder
        facilities: formData.facilities,
        plans: formData.plans
          .filter(plan => plan.name.trim() && plan.duration.trim() && plan.price && parseFloat(plan.price) > 0)
          .map(plan => ({
            name: plan.name,
            price: parseFloat(plan.price),
            duration: plan.duration
          }))
      };
        
      console.log("Submitting Gym Profile to backend:", apiPayload);

      const response = await authService.createGymProfile(apiPayload);

      if (response.success) {
        alert('✅ Gym profile submitted successfully! It is now pending review by our team.');
        navigate('/dashboard'); 
      } else {
        throw new Error(response.message || "An unknown error occurred during profile submission.");
      }

    } catch (err) {
      setSubmitError(parseApiError(err)); // Use the API error parser
      console.error("Gym profile creation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 py-12 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 text-center rounded-t-2xl">
          <div className="text-4xl mb-2">🏢</div>
          <h1 className="text-2xl font-bold">Complete Your Gym Profile</h1>
          <p className="text-indigo-100">Attract members with a professional gym listing</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {submitError && <div className="p-3 bg-red-100 text-red-800 rounded-lg text-sm">{submitError}</div>}

          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Gym Name</label>
              <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} className={`mt-1 w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`} placeholder="Elite Fitness Center" required />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
              <input id="address" name="address" type="text" value={formData.address} onChange={handleChange} className={`mt-1 w-full border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`} placeholder="e.g., 123 Fitness St, New York, NY 10001" required />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>
          </div>
          
          {/* Location */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Location Coordinates (Latitude & Longitude)</label>
            <div className="flex items-center gap-4">
                <input name="latitude" type="number" step="any" value={formData.latitude} onChange={handleChange} placeholder="Latitude" className={`w-full border ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`} required />
                <input name="longitude" type="number" step="any" value={formData.longitude} onChange={handleChange} placeholder="Longitude" className={`w-full border ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`} required />
            </div>
            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
            <button type="button" onClick={handleGetLocation} disabled={loading} className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-lg hover:bg-indigo-200">
                📍 Get My Current Location
            </button>
            <p className="text-xs text-gray-500">Click to auto-fill coordinates. Members will use this to find your gym on the map.</p>
          </div>

          {/* Facilities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Facilities & Amenities</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {facilitiesOptions.map((facility) => (
                <label key={facility} className="flex items-center">
                  <input type="checkbox" value={facility} checked={formData.facilities.includes(facility)} onChange={handleCheckboxChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                  <span className="ml-2 text-sm text-gray-700">{facility}</span>
                </label>
              ))}
            </div>
            {errors.facilities && <p className="text-red-500 text-xs mt-1">{errors.facilities}</p>}
          </div>

          {/* Membership Plans */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Membership Plans</label>
            <div className="space-y-3">
              {formData.plans.map((plan, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <input type="text" value={plan.name} onChange={e => handlePlanChange(index, 'name', e.target.value)} placeholder="Plan Name (e.g., Monthly)" className={`w-1/3 border ${errors[`planName-${index}`] ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm`} required />
                  <input type="text" value={plan.duration} onChange={e => handlePlanChange(index, 'duration', e.target.value)} placeholder="Duration (e.g., monthly)" className={`w-1/3 border ${errors[`planDuration-${index}`] ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm`} required />
                  <input type="number" value={plan.price} onChange={e => handlePlanChange(index, 'price', e.target.value)} placeholder="Price ($)" className={`w-1/3 border ${errors[`planPrice-${index}`] ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm`} required />
                  <button type="button" onClick={() => removePlan(index)} className="text-red-500 hover:text-red-700 font-bold text-xl">&times;</button>
                </div>
              ))}
            </div>
            {errors.plans && <p className="text-red-500 text-xs mt-1">{errors.plans}</p>}
            <button type="button" onClick={addPlan} className="mt-3 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-lg hover:bg-indigo-200">+ Add Plan</button>
          </div>

          {/* Photos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gym Photos (up to 5)</label>
            <input type="file" name="photos" onChange={handlePhotoChange} multiple accept="image/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
            {errors.photos && <p className="text-red-500 text-xs mt-1">{errors.photos}</p>}
            {photoPreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-3 sm:grid-cols-5 gap-3">
                {photoPreviews.map((src, i) => <img key={i} src={src} alt="" className="w-full h-24 object-cover rounded-lg"/>)}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-5">
            <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-colors">
              {loading ? 'Submitting...' : 'Create Gym Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}