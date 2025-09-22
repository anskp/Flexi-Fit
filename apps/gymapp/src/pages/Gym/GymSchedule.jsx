import React, { useState, useRef, useEffect } from "react";

export default function GymSchedule() {
  const [schedule, setSchedule] = useState([
    { time: "07:00 AM", activity: "Morning Yoga", trainer: "Jamie Lee", capacity: 20, booked: 12 },
    { time: "09:00 AM", activity: "Strength Training", trainer: "Alex Morgan", capacity: 15, booked: 8 },
    { time: "11:00 AM", activity: "HIIT Bootcamp", trainer: "Chris Rivera", capacity: 20, booked: 20 },
    { time: "02:00 PM", activity: "Mobility & Stretch", trainer: "Taylor Kim", capacity: 10, booked: 5 },
    { time: "05:00 PM", activity: "Powerlifting", trainer: "Alex Morgan", capacity: 12, booked: 10 },
    { time: "07:00 PM", activity: "Core & Abs", trainer: "Jamie Lee", capacity: 15, booked: 15 },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState({ time: "", activity: "", trainer: "", capacity: "" });
  const inputRef = useRef(null);

  useEffect(() => {
    if (showModal && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showModal]);

  const handleOpenModal = (index = null) => {
    if (index !== null) {
      setEditIndex(index);
      setFormData(schedule[index]);
    } else {
      setEditIndex(null);
      setFormData({ time: "", activity: "", trainer: "", capacity: "" });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    const { time, activity, trainer, capacity } = formData;
    if (!time || !activity || !trainer || !capacity) {
      alert("Please fill in all fields.");
      return;
    }

    if (editIndex !== null) {
      const updated = [...schedule];
      updated[editIndex] = { ...formData, booked: schedule[editIndex].booked || 0 };
      setSchedule(updated);
    } else {
      setSchedule([...schedule, { ...formData, booked: 0 }]);
    }

    setShowModal(false);
    setFormData({ time: "", activity: "", trainer: "", capacity: "" });
    setEditIndex(null);
  };

  const handleDelete = (index) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this session?");
    if (confirmDelete) {
      setSchedule(schedule.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white">Gym Schedule</h2>
          <p className="text-gray-300 mt-1">Manage all gym classes and sessions</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-teal-500 hover:bg-teal-400 text-white py-2 px-5 rounded-lg font-medium transition shadow-md"
        >
          + Add Schedule
        </button>
      </div>

      {/* Schedule Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-700 rounded-lg overflow-hidden">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-white font-semibold">Time</th>
              <th className="px-6 py-3 text-left text-white font-semibold">Activity</th>
              <th className="px-6 py-3 text-left text-white font-semibold">Trainer</th>
              <th className="px-6 py-3 text-left text-white font-semibold">Capacity</th>
              <th className="px-6 py-3 text-left text-white font-semibold">Booked</th>
              <th className="px-6 py-3 text-left text-white font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((s, index) => (
              <tr key={index} className="border-b border-gray-700 hover:bg-gray-800 transition">
                <td className="px-6 py-4 text-teal-400 font-semibold">{s.time}</td>
                <td className="px-6 py-4 text-white">{s.activity}</td>
                <td className="px-6 py-4 text-gray-300">{s.trainer}</td>
                <td className="px-6 py-4 text-gray-300">{s.capacity}</td>
                <td className={`px-6 py-4 font-semibold ${s.booked >= s.capacity ? "text-red-500" : "text-green-400"}`}>
                  {s.booked}
                </td>
                <td className="px-6 py-4 flex gap-2">
                  <button
                    onClick={() => handleOpenModal(index)}
                    className="bg-teal-600 hover:bg-teal-500 text-white py-1 px-3 rounded-lg text-sm font-medium transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="bg-gray-600 hover:bg-gray-500 text-white py-1 px-3 rounded-lg text-sm font-medium transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">{editIndex !== null ? "Edit Session" : "Add Session"}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white text-2xl">×</button>
            </div>
            <div className="space-y-4">
              <input
                ref={inputRef}
                type="text"
                placeholder="Time (e.g., 07:00 AM)"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <input
                type="text"
                placeholder="Activity"
                value={formData.activity}
                onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <input
                type="text"
                placeholder="Trainer"
                value={formData.trainer}
                onChange={(e) => setFormData({ ...formData, trainer: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <input
                type="number"
                placeholder="Capacity"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button onClick={handleSave} className="flex-1 bg-teal-600 hover:bg-teal-500 text-white py-2 px-4 rounded-lg font-medium transition">
                Save
              </button>
              <button onClick={() => setShowModal(false)} className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-lg font-medium transition">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
