// src/pages/Gym/GymMembers.jsx
import React from 'react';

export default function GymMembers() {
  const members = [
    { name: "Sarah K", plan: "Premium", joined: "Jan 15, 2024", status: "Active", visits: 24 },
    { name: "Mark T", plan: "Basic", joined: "Feb 3, 2024", status: "Active", visits: 18 },
    { name: "Jessica L", plan: "Premium", joined: "Dec 10, 2023", status: "Expiring Soon", visits: 41 },
    { name: "David R", plan: "Family", joined: "Mar 1, 2024", status: "Active", visits: 9 },
  ];

  return (
    <div className="w-full animate-fade-in">
      <div className="bg-transparent p-6 rounded-xl border-none">
        <h2 className="text-2xl font-bold text-white">All Members</h2>
        <p className="text-gray-300 mt-1">Manage memberships, renewals, and activity</p>
      </div>

      <div className="mt-6 space-y-4">
        {members.map((member, index) => (
          <div key={index} className="bg-gray-800 p-5 rounded-xl shadow-xl border border-gray-700 hover:bg-gray-750 transition">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">{member.name}</h3>
                  <p className="text-gray-400 text-sm">Joined: {member.joined}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <div>
                  <span className="text-gray-400">Plan:</span>
                  <span className="text-teal-400 ml-1 font-medium">{member.plan}</span>
                </div>
                <div>
                  <span className="text-gray-400">Visits:</span>
                  <span className="text-purple-400 ml-1 font-medium">{member.visits}</span>
                </div>
                <div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    member.status === "Active" ? "bg-green-600 text-green-100" :
                    member.status === "Expiring Soon" ? "bg-orange-600 text-orange-100" : "bg-gray-600 text-gray-200"
                  }`}>
                    {member.status}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 sm:mt-0 mt-3">
                <button className="bg-teal-600 hover:bg-teal-500 text-white py-2 px-4 rounded-lg text-sm font-medium transition">
                  View
                </button>
                <button className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition">
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}