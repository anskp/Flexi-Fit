// src/pages/Gym/GymPayments.jsx
import React from 'react';

export default function GymPayments() {
  const payments = [
    { member: "Sarah K", date: "Apr 10, 2024", amount: 99, method: "Credit Card", status: "Paid" },
    { member: "Mark T", date: "Apr 8, 2024", amount: 49, method: "Cash", status: "Paid" },
    { member: "Jessica L", date: "Apr 5, 2024", amount: 149, method: "PayPal", status: "Refunded" },
    { member: "David R", date: "Apr 1, 2024", amount: 199, method: "Credit Card", status: "Paid" },
  ];

  return (
    <div className="w-full animate-fade-in">
      <div className="bg-transparent p-6 rounded-xl border-none">
        <h2 className="text-2xl font-bold text-white">Payment Records</h2>
        <p className="text-gray-300 mt-1">Track all incoming payments and refunds</p>
      </div>

      <div className="mt-6 space-y-4">
        {payments.map((payment, index) => (
          <div key={index} className="bg-gray-800 p-5 rounded-xl shadow-xl border border-gray-700 hover:bg-gray-750 transition">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                  {payment.member.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-white font-semibold">{payment.member}</h3>
                  <p className="text-gray-400 text-sm">{payment.date} • {payment.method}</p>
                </div>
              </div>
              <div className="flex flex-col sm:items-end gap-2">
                <span className={`text-xl font-bold ${
                  payment.status === "Paid" ? "text-green-400" : "text-red-400"
                }`}>
                  ${payment.amount}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  payment.status === "Paid" ? "bg-green-600 text-green-100" : "bg-red-600 text-red-100"
                }`}>
                  {payment.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}