// src/pages/Trainer/TrainerProfile.jsx
import React from 'react';

export default function TrainerProfile() {
  return (
    <div className="w-full animate-fade-in max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-8 rounded-xl shadow-xl border border-gray-700 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
          {/* Avatar */}
          <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-white font-bold text-3xl shadow-lg">
            AM
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-white">Alex Morgan</h1>
            <p className="text-teal-400 text-xl mt-2">Strength & Conditioning Coach</p>
            <p className="text-gray-300 mt-3 max-w-2xl leading-relaxed">
              Certified trainer with 8+ years experience helping clients build strength, confidence, and sustainable habits.
            </p>

            <div className="flex flex-wrap gap-4 mt-6">
              <div className="bg-gray-700 px-4 py-2 rounded-lg">
                <div className="text-green-400 font-bold text-lg">4.9 ⭐</div>
                <div className="text-gray-400 text-xs">Avg. Rating</div>
              </div>
              <div className="bg-gray-700 px-4 py-2 rounded-lg">
                <div className="text-blue-400 font-bold text-lg">120+</div>
                <div className="text-gray-400 text-xs">Clients Trained</div>
              </div>
              <div className="bg-gray-700 px-4 py-2 rounded-lg">
                <div className="text-purple-400 font-bold text-lg">92%</div>
                <div className="text-gray-400 text-xs">Goal Success Rate</div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-6 md:mt-0">
            <button className="bg-teal-600 hover:bg-teal-500 text-white py-3 px-6 rounded-lg font-medium transition transform hover:scale-105 shadow-md">
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <div className="bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-700 mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">About Me</h2>
        <p className="text-gray-300 leading-relaxed text-lg">
          I believe fitness should be fun, functional, and personalized. Whether you’re just starting out or looking to break through a plateau, I’ll create a plan that fits your lifestyle and goals.
        </p>
        <p className="text-gray-300 leading-relaxed text-lg mt-4">
          My approach combines science-backed training with real-world flexibility — because life happens, and your fitness should adapt with it.
        </p>
      </div>

      {/* Specialties */}
      <div className="bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-700 mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">My Specialties</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Strength Training",
              desc: "Build lean muscle and functional power",
              icon: "🏋️",
            },
            {
              title: "Fat Loss Coaching",
              desc: "Sustainable nutrition + training for lasting results",
              icon: "🔥",
            },
            {
              title: "Mobility & Recovery",
              desc: "Move better, feel better, prevent injury",
              icon: "🧘",
            },
            {
              title: "Beginner Programs",
              desc: "Start strong with confidence and clarity",
              icon: "🆕",
            },
            {
              title: "Online Coaching",
              desc: "Train from anywhere with personalized support",
              icon: "💻",
            },
            {
              title: "Accountability Plans",
              desc: "Weekly check-ins and progress tracking",
              icon: "📅",
            },
          ].map((spec, i) => (
            <div key={i} className="bg-gray-700 p-6 rounded-xl hover:bg-gray-650 transition">
              <div className="text-4xl mb-3">{spec.icon}</div>
              <h3 className="text-white font-bold text-lg mb-2">{spec.title}</h3>
              <p className="text-gray-400 text-sm">{spec.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-6">Contact & Availability</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-bold text-white mb-3">📞 Contact Info</h3>
            <div className="space-y-3 text-gray-300">
              <div>
                <span className="text-teal-400 font-medium">Email:</span> alex@flexfit.com
              </div>
              <div>
                <span className="text-teal-400 font-medium">Phone:</span> (555) 123-4567
              </div>
              <div>
                <span className="text-teal-400 font-medium">Location:</span> FlexFit Pro Downtown
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-3">🕒 Typical Availability</h3>
            <div className="space-y-2 text-gray-300">
              <div>Mon, Wed, Fri: 7AM – 12PM, 4PM – 8PM</div>
              <div>Sat: 9AM – 2PM</div>
              <div>Sun: Off</div>
            </div>
            <p className="text-sm text-gray-400 mt-4 italic">
              *Subject to change — check schedule for real-time openings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}