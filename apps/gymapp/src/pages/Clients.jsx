import { useState, useMemo, useEffect } from "react";
import * as trainerService from "../api/trainerService";
import parseApiError from "../utils/parseApiError";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedClient, setSelectedClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'active', 'inactive'

  const getMockClients = () => [
    {
      id: "m1",
      name: "David Chen",
      avatar: "D",
      email: "david@example.com",
      plan: "Elite",
      joinDate: "2024-01-01",
      status: "active",
      sessionsThisWeek: 2,
      progress: 80,
      lastActive: "2024-09-01",
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
      sessionsThisWeek: 0,
      progress: 40,
      lastActive: "2024-08-15",
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
      sessionsThisWeek: 1,
      progress: 55,
      lastActive: "2024-09-10",
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

  // ✅ FIXED: Attendance bar chart — now renders proper vertical bars with percentage
  const AttendanceChart = ({ data = [] }) => {
    if (!Array.isArray(data) || data.length === 0) {
      return <div className="text-gray-400">No attendance data</div>;
    }

    const totalDays = data.length;
    const attendedDays = data.filter(d => d.value > 0).length;
    const percentage = totalDays > 0 ? Math.round((attendedDays / totalDays) * 100) : 0;

    const values = data.map((d) => (typeof d.value === "number" ? d.value : 0));
    const max = Math.max(...values, 1); // Avoid division by zero

    return (
      <div className="w-full">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-medium text-gray-300">Weekly Attendance</h4>
          <span className="text-sm font-bold text-teal-400">{percentage}%</span>
        </div>
        <div className="w-full flex items-end justify-center gap-3 mt-2" style={{ minHeight: 100 }}>
          {data.map((d, i) => {
            const height = (d.value / max) * 80; // Scale to max 80px
            const color = d.value > 0 ? "#0d9488" : "#374151"; // Green for attended, gray for missed

            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className="rounded-t-md transition-all duration-1000 ease-out"
                  title={`${d.day}: ${d.value ? 'Present' : 'Absent'}`}
                  style={{
                    width: 24,
                    height: `${height}px`,
                    background: color,
                    boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
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

  useEffect(() => {
    let isMounted = true;
    const timeoutMs = 8000;
    let timeoutId = null;

    const fetchClients = async () => {
      try {
        if (!isMounted) return;
        setLoading(true);
        setError("");

        const apiPromise = trainerService.getMySubscribers();
        const timeoutPromise = new Promise((_, reject) => {
          timeoutId = setTimeout(() => reject(new Error("API timeout")), timeoutMs);
        });

        let response;
        try {
          response = await Promise.race([apiPromise, timeoutPromise]);
        } catch (err) {
          throw err;
        }

        let dataArray = null;
        if (Array.isArray(response)) {
          dataArray = response;
        } else if (response && Array.isArray(response.data)) {
          dataArray = response.data;
        } else if (response && Array.isArray(response.subscribers)) {
          dataArray = response.subscribers;
        }

        if (dataArray) {
          const mockSet = getMockClients();
          const formatted = dataArray.map((sub, idx) => {
            const user = sub.user || sub;
            const name =
              user?.memberProfile?.name ||
              user?.name ||
              user?.email ||
              "Unknown";
            const email = user?.email || sub?.email || "";
            const plan =
              (sub.trainerPlan && sub.trainerPlan.name) ||
              sub.plan ||
              "Standard";
            const joinDate =
              sub.startDate || sub.joinDate || new Date().toISOString();
            const status = sub.status || "inactive";

            return {
              id: user?.id || sub?.id || Math.random().toString(36).slice(2, 9),
              name,
              avatar: (name && String(name).charAt(0).toUpperCase()) || "?",
              email,
              plan,
              joinDate,
              status,
              sessionsThisWeek: sub.sessionsThisWeek || 0,
              progress: sub.progress || 0,
              lastActive: sub.lastActive || "N/A",
              attendance:
                sub.attendance && sub.attendance.length > 0
                  ? sub.attendance
                  : mockSet[idx % mockSet.length].attendance,
            };
          });

          if (isMounted) {
            setClients(formatted);
            setSelectedClient(formatted[0] || null);
          }
        } else {
          if (isMounted) {
            const mocks = getMockClients();
            setClients(mocks);
            setSelectedClient(mocks[0]);
          }
        }
      } catch (err) {
        let msg = "Failed to load clients";
        try {
          msg = parseApiError(err);
        } catch (e) {
          msg = err.message || String(err);
        }
        if (isMounted) {
          setError(msg);
          const mocks = getMockClients();
          setClients(mocks);
          setSelectedClient(mocks[0]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchClients();

    const safetyTimer = setTimeout(() => {
      if (isMounted) setLoading(false);
    }, timeoutMs + 1500);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      clearTimeout(safetyTimer);
    };
  }, []);

  const filteredAndSortedClients = useMemo(() => {
    return clients
      .filter(client => {
        // Search filter
        const matchesSearch = 
          client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.email.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Status filter
        if (statusFilter === 'all') return matchesSearch;
        return matchesSearch && client.status === statusFilter;
      });
  }, [clients, searchTerm, statusFilter]);

  if (loading) {
    return (
      <div className="text-center p-8 text-white bg-gray-900 min-h-screen">
        Loading Clients...
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Clients</h1>
        <p className="text-gray-400 mt-2">
          Manage, track, and grow your client relationships
        </p>
      </div>

      {error && (
        <div className="p-4 mb-6 bg-red-600 text-white rounded-lg">{error}</div>
      )}

      {/* Filters Section */}
      <div className="mb-8 p-4 bg-gray-800 rounded-xl border border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-teal-500 focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                statusFilter === "all"
                  ? "bg-teal-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter("active")}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                statusFilter === "active"
                  ? "bg-teal-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setStatusFilter("inactive")}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                statusFilter === "inactive"
                  ? "bg-teal-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Inactive
            </button>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Clients list */}
        <div className="lg:col-span-2 space-y-6">
          {filteredAndSortedClients.length > 0 ? (
            filteredAndSortedClients.map((client) => (
              <div
                key={client.id}
                onClick={() => setSelectedClient(client)}
                className={`bg-gray-800 p-6 rounded-xl shadow-xl border ${
                  selectedClient?.id === client.id
                    ? "border-teal-500"
                    : "border-gray-700"
                } cursor-pointer hover:bg-gray-750 transition-all duration-200`}
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
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        client.status === 'active' 
                          ? 'bg-green-600 text-green-100' 
                          : 'bg-red-600 text-red-100'
                      }`}>
                        {client.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-gray-800 p-6 rounded-xl text-center text-gray-400">
              No clients found matching your criteria.
            </div>
          )}
        </div>

        {/* Right side */}
        <div className="space-y-6">
          {/* Analytics */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">
              Client Analytics
            </h3>
            {selectedClient ? (
              <>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg">
                    {selectedClient.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-lg">
                      {selectedClient.name}
                    </div>
                    <div className="text-sm text-gray-300">
                      {selectedClient.email}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Status: <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedClient.status === 'active' 
                          ? 'bg-green-600 text-green-100' 
                          : 'bg-red-600 text-red-100'
                      }`}>
                        {selectedClient.status}
                      </span>
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
            <h3 className="text-xl font-bold text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 rounded-lg bg-gray-700 hover:bg-gray-650 text-white font-medium transition-all duration-200">
                Send Announcement
              </button>
              <button className="w-full text-left px-4 py-3 rounded-lg bg-gray-700 hover:bg-gray-650 text-white font-medium transition-all duration-200">
                Schedule Session
              </button>
              <button className="w-full text-left px-4 py-3 rounded-lg bg-gray-700 hover:bg-gray-650 text-white font-medium transition-all duration-200">
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}