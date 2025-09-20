import { useState, useEffect } from 'react';

import { useAuth } from '../context/AuthContext';
import * as dashboardService from '../api/dashboardService';
import parseApiError from '../utils/parseApiError';

// 🎨 Recharts for beautiful bar chart
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// ✅ MOCK DATA — Used if API fails or returns no data
const MOCK_DASHBOARD_DATA = {
  recentClients: [
    {
      name: "Sarah K",
      lastSession: "Yesterday",
      goalAchieved: 90,
    },
    {
      name: "Mark T",
      lastSession: "Mon, Fri",
      goalAchieved: 65,
    },
    {
      name: "Jessica L",
      lastSession: "Today",
      goalAchieved: 78,
    },
  ],
  upcomingSessions: [
    {
      clientName: "Sarah K",
      time: "11:00 AM",
      type: "Personal Training",
    },
    {
      clientName: "Mark T",
      time: "1:30 PM",
      type: "Yoga & Mobility",
    },
    {
      clientName: "Jessica L",
      time: "4:00 PM",
      type: "HIIT Workout",
    },
  ],
  tasksAndReminders: [
    {
      description: "Review Sarah’s progress report",
      dueDate: "Today",
    },
    {
      description: "Schedule monthly check-in with Mark",
      dueDate: "Tomorrow",
    },
    {
      description: "Update workout plan for Jessica",
      dueDate: "Friday",
    },
  ],
  // Chart data
  clientProgress: [
    { name: 'Week 1', progress: 65 },
    { name: 'Week 2', progress: 72 },
    { name: 'Week 3', progress: 85 },
    { name: 'Week 4', progress: 90 },
  ],
};

export default function Dashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 🕒 Live Date/Time
  const now = new Date();
  const formattedDate = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await dashboardService.getDashboardData();
        if (response.success) {
          console.log("Fetched Dashboard Data:", response.data);
          setDashboardData(response.data);
        } else {
          // Fallback to mock data if API returns empty or no success
          console.warn("API returned invalid data; falling back to mock data");
          setDashboardData(MOCK_DASHBOARD_DATA);
        }
      } catch (err) {
        console.error("API Error:", err);
        setError(parseApiError(err));
        // Fallback to mock data on error
        setDashboardData(MOCK_DASHBOARD_DATA);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="text-center p-8 text-gray-300">Loading Dashboard...</div>;
  }

  if (error) {
    return <div className="p-4 bg-red-800 text-red-200 rounded-lg">{error}</div>;
  }
  
  if (!dashboardData) {
    return <div>No dashboard data available. Please ensure your profile is complete.</div>
  }

  // --- Main Render Logic ---
  
  const getDashboardTitle = () => {
      if (dashboardData.userStats) return "Admin Overview";
      if (dashboardData.totalRevenue !== undefined) return "Gym Dashboard";
      if (dashboardData.monthlyEarnings !== undefined) return "Trainer Dashboard";
      // ✅ ADDED: A check for a unique merchant data key
      if (dashboardData.totalOrders !== undefined) return "Merchant Dashboard";
      return "Dashboard";
  }

  const getDashboardWelcomeMessage = () => {
    // Customize welcome message based on role for a better UX
    if (dashboardData.totalOrders !== undefined) return "Here's what's happening in your store. 👋";
    if (dashboardData.totalRevenue !== undefined) return "Here's an overview of your gym's activity. 👋";
    if (dashboardData.monthlyEarnings !== undefined) return "Here's a summary of your coaching business. 👋";
    return `Welcome back, ${user?.email || 'User'} 👋`;
  }

  return (
    <div className="w-full animate-fade-in">
      <Header
        title={getDashboardTitle()}
        subtitle={getDashboardWelcomeMessage()}
      />
      <main className="pt-6 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* --- Render TRAINER stats IF monthlyEarnings exists --- */}
            {dashboardData.monthlyEarnings !== undefined && (
                <>
                    <StatsCard title="Total Subscribers" value={dashboardData.totalSubscribers} icon="👥" />
                    <StatsCard title="Monthly Earnings" value={`$${dashboardData.monthlyEarnings.toFixed(2)}`} icon="💰" />
                    <StatsCard title="Profile Completeness" value={`${dashboardData.profileCompleteness}%`} icon="👤" />
                </>
            )}

            {/* --- Render GYM OWNER stats IF totalRevenue exists --- */}
            {dashboardData.totalRevenue !== undefined && (
                <>
                    <StatsCard title="Total Members" value={dashboardData.totalMembers} icon="👥" color="from-green-500 to-cyan-500"/>
                    <StatsCard title="Total Revenue (Est. Monthly)" value={`$${dashboardData.totalRevenue.toFixed(2)}`} icon="💵" color="from-sky-500 to-blue-600"/>
                    <StatsCard title="Check-ins Today" value={dashboardData.todaysCheckIns} icon="✅" color="from-amber-500 to-orange-500"/>
                    <StatsCard title="Upcoming Renewals" value={dashboardData.upcomingRenewals} icon="🔄" color="from-purple-500 to-indigo-500"/>
                </>
            )}

            {/* ✅ ADDED: Render MERCHANT stats IF totalOrders exists --- */}
            {dashboardData.totalOrders !== undefined && (
                <>
                    <StatsCard title="Total Orders" value={dashboardData.totalOrders} icon="📦" color="from-red-500 to-orange-500"/>
                    <StatsCard title="Total Sales" value={`$${(dashboardData.totalSales || 0).toFixed(2)}`} icon="💳" color="from-rose-500 to-pink-500"/>
                    <StatsCard title="Active Products" value={dashboardData.activeProducts} icon="🏷️" color="from-lime-500 to-green-500"/>
                    <StatsCard title="New Orders Today" value={dashboardData.newOrdersToday} icon="🔔" color="from-violet-500 to-purple-500"/>
                </>
            )}
        </div>

        {/* --- Dynamic content based on user role --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white/90 p-6 rounded-3xl shadow-lg border">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {dashboardData.totalOrders !== undefined ? 'Recent Orders' : 
                     dashboardData.totalRevenue !== undefined ? 'Recent Members' : 'Recent Clients'}
                </h3>
                <p className="text-gray-500">A list of recent activity will appear here.</p>
            </div>
            <div className="bg-white/90 p-6 rounded-3xl shadow-lg border">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {dashboardData.totalOrders !== undefined ? 'Top Selling Products' : 
                     dashboardData.totalRevenue !== undefined ? 'Gym Activity' : 'Upcoming Sessions'}
                </h3>
                <p className="text-gray-500">Relevant analytics and events will be shown here.</p>
            </div>
        </div>
      </main>
    </div>
  );
}