// src/pages/Trainer/Clients.jsx
import { useState } from "react";

export default function TrainerClients() {
  const [selectedClient, setSelectedClient] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  // ✅ Static Mock Clients
  const clients = [
    {
      id: "m1",
      name: "David Chen",
      avatar: "D",
      email: "david@example.com",
      plan: "Elite",
      joinDate: "2024-01-01",
      status: "active",
      attendance: [
        { day: "Mon", value: 1 },
        { day: "Tue", value: 0 },
        { day: "Wed", value: 1 },
        { day: "Thu", value: 1 },
        { day: "Fri", value: 0 },
        { day: "Sat", value: 1 },
        { day: "Sun", value: 0 },
      ],
    },
    {
      id: "m2",
      name: "Sofia Martinez",
      avatar: "S",
      email: "sofia@example.com",
      plan: "Premium",
      joinDate: "2024-02-10",
      status: "inactive",
      attendance: [
        { day: "Mon", value: 1 },
        { day: "Tue", value: 1 },
        { day: "Wed", value: 1 },
        { day: "Thu", value: 0 },
        { day: "Fri", value: 1 },
        { day: "Sat", value: 0 },
        { day: "Sun", value: 1 },
      ],
    },
    {
      id: "m3",
      name: "Omar Khan",
      avatar: "O",
      email: "omar@example.com",
      plan: "Standard",
      joinDate: "2024-03-15",
      status: "active",
      attendance: [
        { day: "Mon", value: 0 },
        { day: "Tue", value: 0 },
        { day: "Wed", value: 1 },
        { day: "Thu", value: 1 },
        { day: "Fri", value: 1 },
        { day: "Sat", value: 1 },
        { day: "Sun", value: 0 },
      ],
    },
  ];

  // ✅ Attendance Chart Component
  const AttendanceChart = ({ data = [] }) => {
    const totalDays = data.length;
    const attendedDays = data.filter(d => d.value > 0).length;
    const percentage = totalDays > 0 ? Math.round((attendedDays / totalDays) * 100) : 0;

    const values = data.map((d) => d.value);
    const max = Math.max(...values, 1);

    return (
      <div className="w-full">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-medium text-gray-300">Weekly Attendance</h4>
          <span className="text-sm font-bold text-teal-400">{percentage}%</span>
        </div>
        <div className="w-full flex items-end justify-center gap-3 mt-2" style={{ minHeight: 100 }}>
          {data.map((d, i) => {
            const height = (d.value / max) * 80;
            const color = d.value > 0 ? "#0d9488" : "#374151";
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className="rounded-t-md"
                  style={{
                    width: 24,
                    height: `${height}px`,
                    background: color,
                  }}
                />
                <div className="text-xs text-gray-300">{d.day}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ✅ Filtered Clients (static filter by status only)
  const filteredClients =
    statusFilter === "all"
      ? clients
      : clients.filter((client) => client.status === statusFilter);

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Clients</h1>
        <p className="text-gray-400 mt-2">
          Manage, track, and grow your client relationships
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 p-4 bg-gray-800 rounded-xl border border-gray-700 flex gap-2">
        <button
          onClick={() => setStatusFilter("all")}
          className={`px-4 py-2 rounded-lg font-medium ${
            statusFilter === "all"
              ? "bg-teal-600"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setStatusFilter("active")}
          className={`px-4 py-2 rounded-lg font-medium ${
            statusFilter === "active"
              ? "bg-teal-600"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setStatusFilter("inactive")}
          className={`px-4 py-2 rounded-lg font-medium ${
            statusFilter === "inactive"
              ? "bg-teal-600"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          Inactive
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Clients List */}
        <div className="lg:col-span-2 space-y-6">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              onClick={() => setSelectedClient(client)}
              className={`bg-gray-800 p-6 rounded-xl shadow-xl border cursor-pointer ${
                selectedClient?.id === client.id
                  ? "border-teal-500"
                  : "border-gray-700"
              } hover:bg-gray-750 transition`}
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg">
                  {client.avatar}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{client.name}</h3>
                  <p className="text-sm text-gray-300">{client.email}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <p className="text-xs text-gray-400">
                      Plan: {client.plan} • Joined{" "}
                      {new Date(client.joinDate).toLocaleDateString()}
                    </p>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        client.status === "active"
                          ? "bg-green-600 text-green-100"
                          : "bg-red-600 text-red-100"
                      }`}
                    >
                      {client.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Analytics + Actions */}
        <div className="space-y-6">
          {/* Analytics */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
            <h3 className="text-xl font-bold mb-4">Client Analytics</h3>
            {selectedClient ? (
              <>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg">
                    {selectedClient.avatar}
                  </div>
                  <div>
                    <div className="font-bold">{selectedClient.name}</div>
                    <div className="text-sm text-gray-300">
                      {selectedClient.email}
                    </div>
                  </div>
                </div>
                <AttendanceChart data={selectedClient.attendance} />
              </>
            ) : (
              <p className="text-gray-400">Select a client to view analytics</p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
            <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 rounded-lg bg-gray-700 hover:bg-gray-600">
                Send Announcement
              </button>
              <button className="w-full text-left px-4 py-3 rounded-lg bg-gray-700 hover:bg-gray-600">
                Schedule Session
              </button>
              <button className="w-full text-left px-4 py-3 rounded-lg bg-gray-700 hover:bg-gray-600">
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
