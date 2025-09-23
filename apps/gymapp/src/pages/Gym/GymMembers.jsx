// src/pages/Gym/GymMembers.jsx
import React, { useState } from "react";

const INITIAL_MEMBERS = [
  {
    id: 1,
    name: "Sarah K",
    plan: "Premium",
    joined: "Jan 15, 2025",
    status: "Active",
    visits: 24,
    lastCheckIn: "2024-04-22T08:15:00",
    lastCheckOut: "2024-04-22T09:45:00",
    paymentStatus: "Paid",
  },
  {
    id: 2,
    name: "Mark T",
    plan: "Basic",
    joined: "Feb 3, 2025",
    status: "Active",
    visits: 18,
    lastCheckIn: "2024-04-22T17:30:00",
    lastCheckOut: null,
    paymentStatus: "Pending",
  },
  {
    id: 3,
    name: "Jessica L",
    plan: "Premium",
    joined: "Dec 10, 2025",
    status: "Expiring Soon",
    visits: 41,
    lastCheckIn: "2024-04-21T10:00:00",
    lastCheckOut: "2024-04-21T11:30:00",
    paymentStatus: "Paid",
  },
  {
    id: 4,
    name: "David R",
    plan: "Family",
    joined: "Mar 1, 2025",
    status: "Active",
    visits: 9,
    lastCheckIn: "2024-04-20T19:00:00",
    lastCheckOut: "2024-04-20T20:15:00",
    paymentStatus: "Overdue",
  },
];

export default function GymMembers() {
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDateTime = (isoString) => {
    if (!isoString) return "—";
    const date = new Date(isoString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const badgeColor = (status, type = "membership") => {
    if (type === "payment") {
      switch (status) {
        case "Paid":
          return "bg-green-600/20 text-green-400 border border-green-600/40";
        case "Pending":
          return "bg-yellow-600/20 text-yellow-400 border border-yellow-600/40";
        case "Overdue":
          return "bg-red-600/20 text-red-400 border border-red-600/40";
        default:
          return "bg-gray-700 text-gray-300";
      }
    }
    switch (status) {
      case "Active":
        return "bg-green-600/20 text-green-400 border border-green-600/40";
      case "Expiring Soon":
        return "bg-orange-600/20 text-orange-400 border border-orange-600/40";
      default:
        return "bg-gray-700 text-gray-300";
    }
  };

  // 🔹 Button Handlers
  const handleAddMember = () => {
    const newId = members.length + 1;
    const newMember = {
      id: newId,
      name: `New Member ${newId}`,
      plan: "Basic",
      joined: new Date().toDateString(),
      status: "Active",
      visits: 0,
      lastCheckIn: null,
      lastCheckOut: null,
      paymentStatus: "Pending",
    };
    setMembers([...members, newMember]);
    alert("New member added!");
  };

  const handleView = (member) => {
    alert(`Viewing ${member.name}'s details:\nPlan: ${member.plan}\nVisits: ${member.visits}\nStatus: ${member.status}\nPayment: ${member.paymentStatus}`);
  };

  const handleEdit = (memberId) => {
    setMembers(
      members.map((m) =>
        m.id === memberId ? { ...m, plan: "Premium", status: "Active" } : m
      )
    );
    alert("Member updated to Premium & Active!");
  };

  const handleDelete = (memberId) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      setMembers(members.filter((m) => m.id !== memberId));
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Member Management</h1>
          <p className="text-gray-400">Track activity, payments, and status</p>
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button
            onClick={handleAddMember}
            className="bg-teal-600 hover:bg-teal-500 text-white text-sm px-4 py-2 rounded-lg shadow-md transition"
          >
            + Add Member
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto px-6 pb-20">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-gray-900 text-gray-300 text-xs uppercase tracking-wider">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Visits</th>
              <th className="px-4 py-3">Check-in</th>
              <th className="px-4 py-3">Check-out</th>
              <th className="px-4 py-3">Membership</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map((member, index) => (
              <tr
                key={member.id}
                className={`${
                  index % 2 === 0 ? "bg-gray-800" : "bg-gray-750"
                } hover:bg-gray-700 transition`}
              >
                <td className="px-4 py-3 text-white font-medium">
                  {member.name}
                </td>
                <td className="px-4 py-3 text-teal-400">{member.plan}</td>
                <td className="px-4 py-3 text-gray-400">{member.joined}</td>
                <td className="px-4 py-3 text-purple-400">{member.visits}</td>
                <td className="px-4 py-3 text-gray-300">
                  {formatDateTime(member.lastCheckIn)}
                </td>
                <td className="px-4 py-3 text-gray-300">
                  {formatDateTime(member.lastCheckOut)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${badgeColor(
                      member.status
                    )}`}
                  >
                    {member.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${badgeColor(
                      member.paymentStatus,
                      "payment"
                    )}`}
                  >
                    {member.paymentStatus}
                  </span>
                </td>
                <td className="px-4 py-3 flex justify-center gap-2">
                  <button
                    onClick={() => handleView(member)}
                    className="bg-teal-600 hover:bg-teal-500 text-white text-xs px-3 py-1 rounded-md transition"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleEdit(member.id)}
                    className="bg-gray-700 hover:bg-gray-600 text-white text-xs px-3 py-1 rounded-md transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="bg-red-600 hover:bg-red-500 text-white text-xs px-3 py-1 rounded-md transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredMembers.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center py-10 text-gray-400">
                  No members found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
