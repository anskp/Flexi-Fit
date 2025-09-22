// src/pages/Trainer/TrainerClients.jsx
import React from 'react';

export default function TrainerClients() {
  const clients = [
    { name: "Sarah K", goal: "Weight Loss", progress: 78, lastSession: "Yesterday", nextSession: "Tomorrow, 11 AM" },
    { name: "Mark T", goal: "Muscle Gain", progress: 65, lastSession: "Mon", nextSession: "Fri, 1:30 PM" },
    { name: "Jessica L", goal: "Mobility", progress: 92, lastSession: "Today", nextSession: "Mon, 4 PM" },
  ];

  return (
    <div className="w-full animate-fade-in">
      <div className="bg-transparent p-6 rounded-xl border-none">
        <h2 className="text-2xl font-bold text-white">My Clients</h2>
        <p className="text-gray-300 mt-1">Manage your client roster and progress</p>
      </div>

      <div className="mt-6 space-y-5">
        {clients.map((client, i) => (
          <div key={i} className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700 hover:bg-gray-750 transition">
            <div className="flex flex-col lg:flex-row justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold text-xl">
                  {client.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-white font-bold text-xl">{client.name}</h3>
                  <p className="text-teal-400">{client.goal}</p>
                  <p className="text-gray-400 text-sm">Last: {client.lastSession} • Next: {client.nextSession}</p>
                </div>
              </div>
              <div className="flex flex-col justify-center items-start lg:items-end gap-3">
                <div className="w-40 bg-gray-600 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-teal-400 to-teal-600 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${client.progress}%` }}
                  ></div>
                </div>
                <div className="flex gap-2">
                  <button className="bg-teal-600 hover:bg-teal-500 text-white py-2 px-4 rounded-lg text-sm font-medium transition">
                    View Plan
                  </button>
                  <button className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition">
                    Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}