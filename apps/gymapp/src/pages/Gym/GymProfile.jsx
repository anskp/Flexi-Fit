// src/pages/Gym/GymProfile.jsx
import React from 'react';

export default function GymProfile() {
  return (
    <div className="w-full animate-fade-in max-w-4xl mx-auto">
      <div className="bg-transparent p-6 rounded-xl border-none">
        <h2 className="text-2xl font-bold text-white">Gym Overview</h2>
        <p className="text-gray-300 mt-1">Public profile visible to members and visitors</p>
      </div>

      <div className="mt-6 space-y-6">
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-8 rounded-xl shadow-xl border border-gray-700">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-white font-bold text-2xl">
              FP
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white">FlexFit Pro Downtown</h1>
              <p className="text-gray-300 mt-2">📍 123 Fitness St, New York, NY 10001</p>
              <p className="text-gray-400 mt-1">⭐ 4.8 (240+ reviews) • Open 5AM–11PM Daily</p>
            </div>
            <button className="bg-teal-600 hover:bg-teal-500 text-white py-3 px-6 rounded-lg font-medium transition transform hover:scale-105 shadow-md">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Members", value: "1,248", color: "text-blue-400" },
            { label: "Trainers", value: "12", color: "text-purple-400" },
            { label: "Classes/Day", value: "18", color: "text-green-400" },
            { label: "Avg. Rating", value: "4.8 ⭐", color: "text-yellow-400" },
          ].map((stat, i) => (
            <div key={i} className="bg-gray-800 p-5 rounded-xl text-center border border-gray-700">
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-3">About Us</h3>
          <p className="text-gray-300 leading-relaxed">
            FlexFit Pro Downtown is more than just a gym — it’s a community. Founded in 2018, we’ve helped over 5,000 members transform their lives through personalized training, group classes, and nutritional guidance. Our 15,000 sq ft facility includes functional training zones, cardio decks, recovery lounges, and dedicated coaching areas.
          </p>
        </div>

        {/* Amenities */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">Amenities</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              "🏋️ Free Weights",
              "🧘 Yoga Studio",
              "💦 Sauna & Steam",
              "🚿 Luxury Showers",
              "☕ Fuel Bar",
              "📶 Free WiFi",
              "🅿️ Parking",
              "👶 Childcare",
              "🕒 24/7 Access",
            ].map((amenity, i) => (
              <div key={i} className="flex items-center gap-2 bg-gray-700 p-3 rounded-lg">
                <span className="text-teal-400">{amenity.split(' ')[0]}</span>
                <span className="text-gray-300 text-sm">{amenity.slice(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}