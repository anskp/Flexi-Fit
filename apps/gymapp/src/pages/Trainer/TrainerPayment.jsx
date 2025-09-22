// src/pages/Trainer/TrainerPayments.jsx
import React from 'react';

export default function TrainerPayments() {
  const payments = [
    { client: "Sarah K", date: "Apr 10", amount: 120, method: "Credit Card", status: "Paid" },
    { client: "Mark T", date: "Apr 8", amount: 120, method: "PayPal", status: "Paid" },
    { client: "Jessica L", date: "Apr 5", amount: 180, method: "Bank Transfer", status: "Pending" },
    { client: "David R", date: "Apr 1", amount: 120, method: "Cash", status: "Paid" },
  ];

  return (
    <div className="w-full animate-fade-in">
      <div className="bg-transparent p-6 rounded-xl border-none">
        <h2 className="text-2xl font-bold text-white">Payment History</h2>
        <p className="text-gray-300 mt-1">Track your earnings and payment status</p>
      </div>

      <div className="mt-6 space-y-4">
        {payments.map((payment, i) => (
          <div key={i} className="bg-gray-800 p-5 rounded-xl shadow-xl border border-gray-700 hover:bg-gray-750 transition">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                  {payment.client.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-white font-semibold">{payment.client}</h3>
                  <p className="text-gray-400 text-sm">{payment.date} • {payment.method}</p>
                </div>
              </div>
              <div className="flex flex-col sm:items-end gap-2">
                <span className={`text-xl font-bold ${
                  payment.status === "Paid" ? "text-green-400" : "text-orange-400"
                }`}>
                  ${payment.amount}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  payment.status === "Paid" ? "bg-green-600 text-green-100" : "bg-orange-600 text-orange-100"
                }`}>
                  {payment.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-white font-bold text-lg">Monthly Earnings</h3>
            <p className="text-gray-400">April 2024</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-green-400">$1,420</div>
            <div className="text-sm text-gray-400">+12% from last month</div>
          </div>
        </div>
      </div>
    </div>
  );
}