// src/pages/Gym/GymTrainers.jsx
import React from 'react';

export default function GymTrainers() {
  const trainers = [
    { name: "Alex Morgan", specialty: "Strength Training", clients: 12, rating: 4.8 },
    { name: "Jamie Lee", specialty: "Yoga & Mobility", clients: 8, rating: 4.9 },
    { name: "Chris Rivera", specialty: "HIIT & Cardio", clients: 15, rating: 4.7 },
    { name: "Taylor Kim", specialty: "Rehab & Recovery", clients: 6, rating: 5.0 },
  ];

  return (
    <div className="w-full animate-fade-in">
      <div className="bg-transparent p-6 rounded-xl border-none">
        <h2 className="text-2xl font-bold text-white">Manage Trainers</h2>
        <p className="text-gray-300 mt-1">View, assign, and manage your trainers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {trainers.map((trainer, index) => (
          <div key={index} className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700 hover:bg-gray-750 transition">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                {trainer.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">{trainer.name}</h3>
                <p className="text-teal-400 text-sm">{trainer.specialty}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Active Clients</span>
                <span className="text-white font-medium">{trainer.clients}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Avg. Rating</span>
                <span className="text-yellow-400 font-medium">{trainer.rating} ⭐</span>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="flex-1 bg-teal-600 hover:bg-teal-500 text-white py-2 px-4 rounded-lg text-sm font-medium transition">
                View
              </button>
              <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}