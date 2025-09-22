// src/pages/Gym/GymTrainers.jsx
import React, { useState } from 'react';

// Mock Data
const MOCK_TRAINERS = [
  {
    id: 1,
    name: "Alex Morgan",
    specialty: "Strength Training",
    clients: 12,
    rating: 4.8,
    sessionsThisWeek: 24,
    status: "Active",
    image: "https://via.placeholder.com/80/8b5cf6/FFFFFF?text=AM",
  },
  {
    id: 2,
    name: "Jamie Lee",
    specialty: "Yoga & Mobility",
    clients: 8,
    rating: 4.9,
    sessionsThisWeek: 18,
    status: "Active",
    image: "https://via.placeholder.com/80/06b6d4/FFFFFF?text=JL",
  },
  {
    id: 3,
    name: "Chris Rivera",
    specialty: "HIIT & Cardio",
    clients: 15,
    rating: 4.7,
    sessionsThisWeek: 32,
    status: "Active",
    image: "https://via.placeholder.com/80/f59e0b/FFFFFF?text=CR",
  },
  {
    id: 4,
    name: "Taylor Kim",
    specialty: "Rehab & Recovery",
    clients: 6,
    rating: 5.0,
    sessionsThisWeek: 12,
    status: "On Leave",
    image: "https://via.placeholder.com/80/10b981/FFFFFF?text=TK",
  },
];

const MOCK_MEMBERS = [
  { id: 101, name: "Sarah K", plan: "Premium", assignedTrainer: null },
  { id: 102, name: "Mark T", plan: "Basic", assignedTrainer: 1 },
  { id: 103, name: "Jessica L", plan: "Premium", assignedTrainer: 2 },
  { id: 104, name: "David R", plan: "Annual", assignedTrainer: 3 },
];

const MOCK_SESSIONS = [
  { id: 1, trainerId: 1, memberId: 102, date: "2024-04-22", type: "Upper Body", duration: 60, status: "Completed" },
  { id: 2, trainerId: 2, memberId: 103, date: "2024-04-23", type: "Yoga Flow", duration: 45, status: "Completed" },
  { id: 3, trainerId: 3, memberId: 104, date: "2024-04-24", type: "HIIT Circuit", duration: 30, status: "Scheduled" },
  { id: 4, trainerId: 1, memberId: 101, date: "2024-04-25", type: "Lower Body", duration: 60, status: "Scheduled" },
];

export default function GymTrainers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrainers, setSelectedTrainers] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showSessionsModal, setShowSessionsModal] = useState(false);
  const [selectedTrainerId, setSelectedTrainerId] = useState(null);
  const [activeTab, setActiveTab] = useState('trainers');

  const filteredTrainers = MOCK_TRAINERS.filter(trainer =>
    trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trainer.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelectTrainer = (id) => {
    setSelectedTrainers(prev =>
      prev.includes(id)
        ? prev.filter(tid => tid !== id)
        : [...prev, id]
    );
  };

  const handleAssignTrainer = (trainerId) => {
    setSelectedTrainerId(trainerId);
    setShowAssignModal(true);
  };

  const handleViewSessions = (trainerId) => {
    setSelectedTrainerId(trainerId);
    setShowSessionsModal(true);
  };

  const handleSaveAssignment = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const memberId = formData.get('memberId');
    const startDate = formData.get('startDate');
    console.log(`Assigning Trainer ID ${selectedTrainerId} to Member ID ${memberId} starting ${startDate}`);
    // In real app: API call to assign trainer
    setShowAssignModal(false);
    setSelectedTrainerId(null);
  };

  const getTrainerSessions = (trainerId) => {
    return MOCK_SESSIONS.filter(session => session.trainerId === trainerId);
  };

  const getMemberName = (memberId) => {
    const member = MOCK_MEMBERS.find(m => m.id === memberId);
    return member ? member.name : "Unknown Member";
  };

  return (
    <div className="w-full animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-transparent p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Trainer Management</h1>
            <p className="text-gray-300">Assign trainers to members and track sessions</p>
          </div>
          <div className="flex gap-3">
            {selectedTrainers.length > 0 && (
              <button className="bg-gray-600 hover:bg-gray-500 text-white text-sm py-2 px-4 rounded-lg font-medium transition transform hover:scale-105 shadow-md">
                Bulk Actions
              </button>
            )}
            <button className="bg-teal-600 hover:bg-teal-500 text-white text-sm py-2 px-4 rounded-lg font-medium transition transform hover:scale-105 shadow-md">
              + Add Trainer
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-700 mb-6">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('trainers')}
              className={`pb-3 font-medium text-sm border-b-2 transition ${
                activeTab === 'trainers'
                  ? 'border-teal-500 text-teal-400'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Trainers
            </button>
            <button
              onClick={() => setActiveTab('sessions')}
              className={`pb-3 font-medium text-sm border-b-2 transition ${
                activeTab === 'sessions'
                  ? 'border-teal-500 text-teal-400'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Session Tracker
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        {activeTab === 'trainers' && (
          <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search trainers by name or specialty..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <select className="bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 min-w-40">
                <option>All Status</option>
                <option>Active</option>
                <option>On Leave</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Tab Content */}
      <div className="px-6 pb-24">
        {activeTab === 'trainers' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTrainers.map((trainer) => (
              <div
                key={trainer.id}
                className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700 hover:bg-gray-750 transition transform hover:scale-105 group"
              >
                {/* Trainer Header */}
                <div className="flex justify-between items-start mb-4">
                  <input
                    type="checkbox"
                    checked={selectedTrainers.includes(trainer.id)}
                    onChange={() => toggleSelectTrainer(trainer.id)}
                    className="rounded text-teal-600 focus:ring-teal-500"
                  />
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    trainer.status === "Active" ? "bg-green-600 text-green-100" :
                    trainer.status === "On Leave" ? "bg-yellow-600 text-yellow-100" :
                    "bg-gray-600 text-gray-100"
                  }`}>
                    {trainer.status}
                  </span>
                </div>

                {/* Trainer Avatar & Name */}
                <div className="flex flex-col items-center mb-4">
                  <img
                    src={trainer.image}
                    alt={trainer.name}
                    className="w-20 h-20 rounded-full object-cover mb-3 border-2 border-gray-600"
                  />
                  <h3 className="text-white font-bold text-lg text-center">{trainer.name}</h3>
                  <p className="text-teal-400 text-sm">{trainer.specialty}</p>
                </div>

                {/* Trainer Stats */}
                <div className="space-y-3 mb-5">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Active Clients</span>
                    <span className="text-white font-medium">{trainer.clients}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Avg. Rating</span>
                    <span className="text-yellow-400 font-medium">{trainer.rating} ⭐</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Sessions This Week</span>
                    <span className="text-blue-400 font-medium">{trainer.sessionsThisWeek}</span>
                  </div>
                </div>

                {/* ✅ ACTION BUTTONS — PERFECTLY THEME-MATCHED */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewSessions(trainer.id)}
                    className="flex-1 bg-teal-600 hover:bg-teal-500 text-white py-2 px-3 rounded-lg text-xs font-medium transition transform hover:scale-105 shadow-md"
                  >
                    Track Sessions
                  </button>
                  <button
                    onClick={() => handleAssignTrainer(trainer.id)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded-lg text-xs font-medium transition transform hover:scale-105 shadow-md"
                  >
                    Assign Member
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-6">All Trainer Sessions</h2>
            <div className="space-y-4">
              {MOCK_SESSIONS.map((session) => {
                const trainer = MOCK_TRAINERS.find(t => t.id === session.trainerId);
                return (
                  <div
                    key={session.id}
                    className="bg-gray-700 p-5 rounded-lg hover:bg-gray-650 transition group"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                          {trainer?.name.split(' ').map(n => n[0]).join('') || '?'}
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">{trainer?.name || 'Unknown Trainer'}</h3>
                          <p className="text-gray-400 text-sm">
                            with {getMemberName(session.memberId)} • {session.type}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:items-end gap-2">
                        <span className="text-gray-300 text-sm">{session.date}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          session.status === "Completed" ? "bg-green-600 text-green-100" :
                          session.status === "Scheduled" ? "bg-blue-600 text-blue-100" :
                          "bg-gray-600 text-gray-100"
                        }`}>
                          {session.status}
                        </span>
                        <span className="text-gray-400 text-xs">{session.duration} min</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Assign Trainer Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">Assign Trainer to Member</h3>
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedTrainerId(null);
                }}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSaveAssignment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Select Member</label>
                <select
                  name="memberId"
                  required
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Choose a member...</option>
                  {MOCK_MEMBERS.filter(member => member.assignedTrainer !== selectedTrainerId).map(member => (
                    <option key={member.id} value={member.id}>
                      {member.name} ({member.plan})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  required
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="pt-2 border-t border-gray-700">
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-teal-600 hover:bg-teal-500 text-white py-2 px-4 rounded-lg font-medium transition transform hover:scale-105 shadow-md"
                  >
                    Assign Trainer
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAssignModal(false);
                      setSelectedTrainerId(null);
                    }}
                    className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-lg font-medium transition transform hover:scale-105 shadow-md"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Session Tracker Modal */}
      {showSessionsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto shadow-2xl border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">
                Sessions for {MOCK_TRAINERS.find(t => t.id === selectedTrainerId)?.name || 'Trainer'}
              </h3>
              <button
                onClick={() => {
                  setShowSessionsModal(false);
                  setSelectedTrainerId(null);
                }}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              {getTrainerSessions(selectedTrainerId).map((session) => (
                <div
                  key={session.id}
                  className="bg-gray-700 p-4 rounded-lg hover:bg-gray-650 transition"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-white font-medium">{getMemberName(session.memberId)}</h4>
                      <p className="text-gray-400 text-sm">{session.type} • {session.duration} min</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-300 text-sm">{session.date}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        session.status === "Completed" ? "bg-green-600 text-green-100" :
                        session.status === "Scheduled" ? "bg-blue-600 text-blue-100" :
                        "bg-gray-600 text-gray-100"
                      }`}>
                        {session.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-gray-700 mt-4">
              <button
                onClick={() => {
                  setShowSessionsModal(false);
                  setSelectedTrainerId(null);
                }}
                className="w-full bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-lg font-medium transition transform hover:scale-105 shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}