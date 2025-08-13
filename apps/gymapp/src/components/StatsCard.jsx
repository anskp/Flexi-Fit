// src/components/StatsCard.jsx
export default function StatsCard({ title, value, icon, change, positive = true, color = "from-gray-500 to-gray-600" }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
          <p className={`text-xs mt-1 ${positive ? 'text-green-600' : 'text-red-600'}`}>
            {change}
          </p>
        </div>
        <div
          className={`text-4xl w-14 h-14 rounded-full bg-gradient-to-br ${color} text-white flex items-center justify-center shadow-lg`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}