// src/pages/Trainer/TrainerProfile.jsx
import React, { useState } from 'react';

// Mock Data
const MOCK_TRAINER = {
  name: "Alex T",
  avatar: "https://via.placeholder.com/120/4ade80/FFFFFF?text=AT",
  experience: "8 Years",
  specialties: ["Personal Training", "Group Fitness", "Nutrition Coaching"],
  certifications: [
    "CrossFit Level 1",
    "CPSA Certified",
    "Open Water Diver",
    "Certified Strength & Conditioning Specialist",
  ],
  bio: "I’ve been training clients for over 8 years, helping them achieve their fitness goals through science-backed methods and personalized coaching. I specialize in strength, endurance, and mobility, and I love seeing people transform their lives.",
  contact: {
    email: "alex@flexifit.com",
    phone: "+1 (212) 555-1234",
    paymentMethods: true,
  },
};

export default function TrainerProfile() {
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <div className="w-full animate-fade-in max-w-5xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Coach Profile</h1>
        <button
          onClick={() => setShowEditModal(true)}
          className="bg-teal-600 hover:bg-teal-500 text-white py-2 px-5 rounded-lg font-medium transition transform hover:scale-105 shadow-md"
        >
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Profile Card */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
          <div className="flex flex-col items-center mb-6">
            <img
              src={MOCK_TRAINER.avatar}
              alt={MOCK_TRAINER.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-teal-500 mb-4"
            />
            <h2 className="text-xl font-bold text-white">{MOCK_TRAINER.name}</h2>
            <p className="text-gray-400 text-sm">{MOCK_TRAINER.experience} Experience</p>
          </div>

          {/* Specialties */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white mb-3">Specialties</h3>
            <div className="flex flex-wrap gap-2">
              {MOCK_TRAINER.specialties.map((spec, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-gray-700 text-teal-300 rounded-lg text-sm font-medium"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <h3 className="text-lg font-bold text-white mb-3">Certifications</h3>
            <div className="space-y-2">
              {MOCK_TRAINER.certifications.map((cert, i) => (
                <div key={i} className="flex items-center gap-2 text-gray-300 text-sm">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {cert}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Contact & Bio */}
        <div className="space-y-6">
          {/* Contact Information */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1">Email</label>
                <input
                  type="email"
                  value={MOCK_TRAINER.contact.email}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Phone</label>
                <input
                  type="tel"
                  value={MOCK_TRAINER.contact.phone}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  readOnly
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="block text-gray-400 text-sm">Payment Methods</label>
                <button
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    MOCK_TRAINER.contact.paymentMethods
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-600 text-gray-300'
                  }`}
                >
                  {MOCK_TRAINER.contact.paymentMethods ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Bio</h3>
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
              {MOCK_TRAINER.bio}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Modal (Mock) */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto shadow-2xl border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">Edit Profile</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            <p className="text-gray-400 mb-6">This is a mock modal. In real app, you’d see form fields here.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  defaultValue={MOCK_TRAINER.name}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                <textarea
                  rows="4"
                  defaultValue={MOCK_TRAINER.bio}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                ></textarea>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 bg-teal-600 hover:bg-teal-500 text-white py-3 px-4 rounded-lg font-medium transition"
              >
                Save Changes
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-3 px-4 rounded-lg font-medium transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
