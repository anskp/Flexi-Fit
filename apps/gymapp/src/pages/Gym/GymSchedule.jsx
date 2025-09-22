// src/pages/Gym/GymSchedule.jsx
import React from 'react';

export default function GymSchedule() {
  const schedule = [
    { time: "07:00 AM", activity: "Morning Yoga", trainer: "Jamie Lee", capacity: "12/20" },
    { time: "09:00 AM", activity: "Strength Training", trainer: "Alex Morgan", capacity: "8/15" },
    { time: "11:00 AM", activity: "HIIT Bootcamp", trainer: "Chris Rivera", capacity: "20/20" },
    { time: "02:00 PM", activity: "Mobility & Stretch", trainer: "Taylor Kim", capacity: "5/10" },
    { time: "05:00 PM", activity: "Powerlifting", trainer: "Alex Morgan", capacity: "10/12" },
    { time: "07:00 PM", activity: "Core & Abs", trainer: "Jamie Lee", capacity: "15/15" },
  ];

  return (
    <div className="w-full animate-fade-in">
      <div className="bg-transparent p-6 rounded-xl border-none">
        <h2 className="text-2xl font-bold text-white">Class Schedule</h2>
        <p className="text-gray-300 mt-1">Manage and view all gym class sessions</p>
      </div>

      <div className="mt-6 space-y-4">
        {schedule.map((session, index) => (
          <div key={index} className="bg-gray-800 p-5 rounded-xl shadow-xl border border-gray-700 hover:bg-gray-750 transition">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="text-2xl font-bold text-teal-400">{session.time}</div>
                <h3 className="text-white font-semibold mt-1">{session.activity}</h3>
                <p className="text-gray-400 text-sm">Trainer: {session.trainer}</p>
              </div>
              <div className="flex flex-col sm:items-end gap-2">
                <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                  session.capacity.includes("20/20") || session.capacity.includes("15/15")
                    ? "bg-red-600 text-red-100"
                    : "bg-green-600 text-green-100"
                }`}>
                  {session.capacity}
                </span>
                <div className="flex gap-2">
                  <button className="bg-teal-600 hover:bg-teal-500 text-white py-2 px-4 rounded-lg text-sm font-medium transition">
                    Edit
                  </button>
                  <button className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition">
                    Cancel
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