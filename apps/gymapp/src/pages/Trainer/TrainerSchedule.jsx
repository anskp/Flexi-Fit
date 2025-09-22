// src/pages/Trainer/TrainerSchedule.jsx
import React from 'react';

export default function TrainerSchedule() {
  const week = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const schedule = {
    Mon: [
      { time: "07:00 AM", client: "Sarah K", type: "Fat Loss" },
      { time: "04:00 PM", client: "Jessica L", type: "Mobility" },
    ],
    Wed: [
      { time: "09:00 AM", client: "Mark T", type: "Strength" },
      { time: "06:00 PM", client: "Sarah K", type: "Cardio" },
    ],
    Fri: [
      { time: "01:30 PM", client: "Mark T", type: "Hypertrophy" },
      { time: "07:00 PM", client: "Jessica L", type: "Recovery" },
    ],
  };

  return (
    <div className="w-full animate-fade-in">
      <div className="bg-transparent p-6 rounded-xl border-none">
        <h2 className="text-2xl font-bold text-white">Weekly Schedule</h2>
        <p className="text-gray-300 mt-1">View and manage your training sessions</p>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {week.map((day, i) => (
          <div key={i} className="bg-gray-800 p-5 rounded-xl shadow-xl border border-gray-700">
            <h3 className={`text-lg font-bold mb-4 ${
              schedule[day] ? "text-white" : "text-gray-500"
            }`}>
              {day}
            </h3>
            {schedule[day] ? (
              <div className="space-y-4">
                {schedule[day].map((session, j) => (
                  <div key={j} className="bg-gray-700 p-4 rounded-lg">
                    <div className="text-teal-400 font-bold text-sm">{session.time}</div>
                    <div className="text-white font-medium mt-1">{session.client}</div>
                    <div className="text-gray-400 text-xs">{session.type}</div>
                    <div className="flex gap-2 mt-3">
                      <button className="text-xs bg-teal-600 hover:bg-teal-500 text-white py-1 px-3 rounded transition">
                        Edit
                      </button>
                      <button className="text-xs bg-gray-600 hover:bg-gray-500 text-white py-1 px-3 rounded transition">
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm italic">No sessions</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}