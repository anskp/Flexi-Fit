// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import StatsCard from '../components/StatsCard';
import { useAuth } from '../context/AuthContext';
import * as dashboardService from '../api/dashboardService';
import parseApiError from '../utils/parseApiError';

export default function Dashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await dashboardService.getDashboardData();
        if (response.success) {
          console.log("Fetched Dashboard Data:", response.data); // For debugging
          setDashboardData(response.data);
        }
      } catch (err) {
        setError(parseApiError(err));
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="text-center p-8">Loading Dashboard...</div>;
  }

  if (error) {
    return <div className="p-4 bg-red-100 text-red-800 rounded-lg">{error}</div>;
  }
  
  // This is a safety net. If the API returns no data, we show a message.
  if (!dashboardData) {
    return <div>No dashboard data available.</div>
  }

  // --- Main Render Logic ---
  
  // Determine the title based on the data received
  const getDashboardTitle = () => {
      if (dashboardData.userStats) return "Admin Overview"; // Check for an admin-specific key
      if (dashboardData.totalRevenue !== undefined) return "Gym Dashboard"; // Check for a gym-specific key
      if (dashboardData.monthlyEarnings !== undefined) return "Trainer Dashboard"; // Check for a trainer-specific key
      return "Dashboard";
  }

  return (
    <div className="w-full animate-fade-in">
      <Header
        title={getDashboardTitle()}
        subtitle={`Welcome back, ${user?.email || 'User'} 👋`}
      />
      <main className="pt-6 space-y-8">
        
        {/* ✅ DEFINITIVE FIX: Conditionally render based on properties in the data object */}
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
        </div>

        {/* --- Placeholder for other dashboard sections --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white/90 p-6 rounded-3xl shadow-lg border">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {dashboardData.totalRevenue !== undefined ? 'Recent Members' : 'Recent Clients'}
                </h3>
                <p className="text-gray-500">A list of recent activity will appear here.</p>
            </div>
            <div className="bg-white/90 p-6 rounded-3xl shadow-lg border">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {dashboardData.totalRevenue !== undefined ? 'Gym Activity' : 'Upcoming Sessions'}
                </h3>
                <p className="text-gray-500">Relevant upcoming events will be shown here.</p>
            </div>
        </div>
      </main>
    </div>
  );
}