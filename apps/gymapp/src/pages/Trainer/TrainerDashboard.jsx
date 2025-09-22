// src/pages/Trainer/TrainerDashboard.jsx
import React from 'react';

export default function TrainerDashboard() {
  return (
    <div className="w-full animate-fade-in">
      <div className="bg-transparent p-6 rounded-xl border-none">
        <h2 className="text-2xl font-bold text-white">Welcome Back, Coach!</h2>
        <p className="text-gray-300 mt-1">Here’s your daily overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-2">Active Clients</h3>
          <p className="text-3xl font-bold text-blue-400">12</p>
          <p className="text-sm text-gray-400">+2 this month</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-2">Today’s Sessions</h3>
          <p className="text-3xl font-bold text-green-400">3</p>
          <p className="text-sm text-gray-400">Next at 11:00 AM</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-2">Avg. Rating</h3>
          <p className="text-3xl font-bold text-yellow-400">4.9 ⭐</p>
          <p className="text-sm text-gray-400">From 86 reviews</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-2">Revenue</h3>
          <p className="text-3xl font-bold text-purple-400">$2,850</p>
          <p className="text-sm text-gray-400">This month</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">Today’s Schedule</h3>
          <div className="space-y-4">
            {[
              { client: "Sarah K", time: "11:00 AM", type: "Upper Body" },
              { client: "Mark T", time: "01:30 PM", type: "Cardio & Core" },
              { client: "Jessica L", time: "04:00 PM", type: "Mobility" },
            ].map((session, i) => (
              <div key={i} className="flex justify-between items-center p-4 bg-gray-700 rounded-lg">
                <div>
                  <p className="font-semibold text-white">{session.client}</p>
                  <p className="text-gray-400 text-sm">{session.type}</p>
                </div>
                <span className="text-teal-400 font-bold">{session.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">Recent Feedback</h3>
          <div className="space-y-4">
            {[
              { client: "Sarah K", rating: 5, comment: "Best trainer ever!" },
              { client: "Mark T", rating: 4, comment: "Great progress, could use more stretching." },
            ].map((fb, i) => (
              <div key={i} className="p-4 bg-gray-700 rounded-lg">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-white">{fb.client}</h4>
                  <div className="flex text-yellow-400">{"⭐".repeat(fb.rating)}</div>
                </div>
                <p className="text-gray-300 text-sm mt-2">“{fb.comment}”</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}