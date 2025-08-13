// src/pages/TrainerProfileForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../api/authService';
import parseApiError from '../utils/parseApiError';

export default function TrainerProfileForm() {
  // ✅ STATE ALIGNED WITH BACKEND SCHEMA
  const [formData, setFormData] = useState({
    bio: '',
    experience: '',
    gallery: [],
    plans: [{ name: 'Monthly Coaching', price: '', duration: 'monthly' }],
  });

  const navigate = useNavigate();
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
        alert("You can only upload a maximum of 5 photos for your gallery.");
        return;
    }
    setFormData((prev) => ({ ...prev, gallery: files }));
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
      plans: [...prev.plans, { name: '3-Month Package', price: '', duration: 'quarterly' }]
    }));
  };
  
  const removePlan = (index) => {
    const newPlans = formData.plans.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, plans: newPlans }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.bio.trim() || formData.bio.length < 50) newErrors.bio = 'A detailed bio of at least 50 characters is required.';
    if (!formData.experience || parseInt(formData.experience, 10) < 0) newErrors.experience = 'Please enter a valid number of years for your experience.';
    if (formData.gallery.length === 0) newErrors.gallery = 'Upload at least one photo for your gallery.';
    const hasPricedPlan = formData.plans.some(p => p.price && parseFloat(p.price) > 0);
    if (!hasPricedPlan) newErrors.plans = 'You must set a price for at least one coaching plan.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      setErrors({});

      try {
        // Prepare the payload for the backend
        const apiPayload = {
          ...formData,
          experience: parseInt(formData.experience, 10),
          // Simulate photo upload by creating placeholder URLs
          gallery: formData.gallery.map(file => `https://placehold.co/600x400?text=${encodeURIComponent(file.name)}`),
          // Filter out any plans without a price and parse the price to a number
          plans: formData.plans
            .filter(p => p.price && parseFloat(p.price) > 0)
            .map(p => ({ ...p, price: parseFloat(p.price) }))
        };

        console.log("Submitting to backend:", apiPayload);

        const response = await authService.createTrainerProfile(apiPayload);

        if (response.success) {
          alert('✅ Trainer profile submitted successfully!');
          navigate('/dashboard'); 
        }
      } catch (err) {
        setErrors({ submit: parseApiError(err) });
        console.error("Profile creation failed:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl">
        <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white p-8 text-center rounded-t-2xl">
          <h1 className="text-3xl font-bold">Create Your Trainer Profile</h1>
          <p className="text-teal-100 mt-2">Showcase your expertise to attract new clients.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {errors.submit && <div className="p-3 bg-red-100 text-red-800 rounded-lg">{errors.submit}</div>}

          {/* Bio and Experience */}
          <div className="space-y-4">
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Your Bio</label>
              <textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} rows="5" className={`mt-1 w-full border ${errors.bio ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm`} placeholder="Tell potential clients about your training philosophy, specialties, and what makes you a great coach..." required />
              {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio}</p>}
            </div>
            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700">Years of Experience</label>
              <input id="experience" name="experience" type="number" value={formData.experience} onChange={handleChange} className={`mt-1 w-full border ${errors.experience ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm`} placeholder="e.g., 5" required />
              {errors.experience && <p className="text-red-500 text-xs mt-1">{errors.experience}</p>}
            </div>
          </div>
          
          {/* Gallery Photos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Gallery (up to 5 images)</label>
            <input type="file" name="gallery" onChange={handlePhotoChange} multiple accept="image/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"/>
            {errors.gallery && <p className="text-red-500 text-xs mt-1">{errors.gallery}</p>}
            {photoPreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-3 sm:grid-cols-5 gap-3">
                {photoPreviews.map((src, i) => <img key={i} src={src} alt={`Gallery preview ${i+1}`} className="w-full h-24 object-cover rounded-lg"/>)}
              </div>
            )}
          </div>

          {/* Coaching Plans */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Coaching Plans</label>
            <div className="space-y-3">
              {formData.plans.map((plan, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <input type="text" value={plan.name} onChange={e => handlePlanChange(index, 'name', e.target.value)} placeholder="Plan Name (e.g., Monthly)" className="w-1/3 border-gray-300 rounded-lg shadow-sm" />
                  <input type="text" value={plan.duration} onChange={e => handlePlanChange(index, 'duration', e.target.value)} placeholder="Duration (e.g., monthly)" className="w-1/3 border-gray-300 rounded-lg shadow-sm" />
                  <input type="number" value={plan.price} onChange={e => handlePlanChange(index, 'price', e.target.value)} placeholder="Price ($)" className="w-1/3 border-gray-300 rounded-lg shadow-sm" />
                  <button type="button" onClick={() => removePlan(index)} className="text-red-500 hover:text-red-700 font-bold text-xl">&times;</button>
                </div>
              ))}
            </div>
            {errors.plans && <p className="text-red-500 text-xs mt-1">{errors.plans}</p>}
            <button type="button" onClick={addPlan} className="mt-3 px-4 py-2 text-sm font-medium text-teal-600 bg-teal-100 rounded-lg hover:bg-teal-200">+ Add a Plan</button>
          </div>

          {/* Submit Button */}
          <div className="pt-5">
            <button type="submit" disabled={loading} className="w-full bg-teal-500 hover:bg-teal-600 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-colors">
              {loading ? 'Saving Profile...' : 'Publish Trainer Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}