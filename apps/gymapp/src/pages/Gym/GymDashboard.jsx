import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { getDashboardData } from '../../api/dashboardService';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Helper to get user initials
const getInitials = (name = '') => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
};

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Dashboard: useEffect triggered');
    const fetchDashboardData = async () => {
      try {
        console.log('Dashboard: Starting to fetch dashboard data...');
        setIsLoading(true);
        setError(null);
        
        // Check if token exists
        const token = localStorage.getItem('authToken');
        console.log('Dashboard: Auth token exists:', !!token);
        
        if (!token) {
          throw new Error('Authentication token not found. Please log in again.');
        }
        
        // Check if token is expired
        try {
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          if (decoded.exp < currentTime) {
            console.log('Token expired');
            localStorage.removeItem('authToken');
            throw new Error('Your session has expired. Please log in again.');
          }
          console.log('Token is valid for user:', decoded.email || decoded.sub);
        } catch (decodeError) {
          console.error('Token decode error:', decodeError);
          localStorage.removeItem('authToken');
          throw new Error('Invalid authentication token. Please log in again.');
        }
        
        const data = await getDashboardData();
        console.log('Dashboard: Data received', data);
        
        // Check if data has the expected structure
        if (data && data.user && data.dashboard) {
          setUser(data.user);
          setDashboardData(data.dashboard);
        } else {
          console.error('Dashboard: Invalid data structure', data);
          throw new Error('Invalid data structure received');
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Dashboard: Fetch error', err);
        setError(err.message || 'Failed to fetch dashboard data');
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Add manual refresh function
  const handleManualRefresh = () => {
    console.log('Dashboard: Manual refresh triggered');
    setIsLoading(true);
    setError(null);
    
    const fetchDashboardData = async () => {
      try {
        const data = await getDashboardData();
        
        if (data && data.user && data.dashboard) {
          setUser(data.user);
          setDashboardData(data.dashboard);
        } else {
          throw new Error('Invalid data structure received');
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Dashboard: Manual refresh error', err);
        setError(err.message || 'Failed to fetch dashboard data');
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto"></div>
          <p className="text-white mt-4">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center p-6 bg-gray-800 rounded-lg max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-white mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={handleManualRefresh} 
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
            >
              Try Again
            </button>
            <button 
              onClick={() => {
                localStorage.removeItem('authToken');
                window.location.href = '/login';
              }} 
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Login Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render based on user role
  const renderDashboard = () => {
    if (!user || !dashboardData) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl mb-4">📊</div>
            <h2 className="text-xl font-bold text-white mb-2">Dashboard Data Not Available</h2>
            <p className="text-gray-300">Please try refreshing the page</p>
          </div>
        </div>
      );
    }

    switch (user.role) {
      case 'GYM_OWNER':
        return renderGymOwnerDashboard();
      case 'MEMBER':
        return renderMemberDashboard();
      case 'TRAINER':
        return renderTrainerDashboard();
      case 'ADMIN':
        return renderAdminDashboard();
      case 'MERCHANT':
        return renderMerchantDashboard();
      default:
        return (
          <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl mb-4">🔒</div>
              <h2 className="text-xl font-bold text-white mb-2">Unauthorized Access</h2>
              <p className="text-gray-300">You don't have permission to view this dashboard</p>
            </div>
          </div>
        );
    }
  };

  const renderGymOwnerDashboard = () => (
    <div className="w-full animate-fade-in">
      <main className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-transparent p-6 rounded-xl border-none">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Welcome back, {user?.email?.split('@')[0] || 'Owner'}!
              </h2>
              <p className="text-gray-300 text-sm mt-1">Here's your gym's performance overview.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-teal-500 shadow-md">
                {dashboardData.checkInsToday || 0} Check-ins Today
              </div>
              <div className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-emerald-500 shadow-md">
                {dashboardData.totalMembers || 0} Members
              </div>
            </div>
          </div>
        </div>

        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {/* Revenue Overview */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-2">Monthly Revenue</h3>
            <p className="text-2xl font-bold text-green-400">
              ${dashboardData.revenueOverview?.monthlyRevenue || 0}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              +{dashboardData.revenueOverview?.growthRate || 0}% vs last month
            </p>
          </div>

          {/* Check-ins Today */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-2">Check-ins Today</h3>
            <p className="text-2xl font-bold text-blue-400">
              {dashboardData.checkInsToday || 0}
            </p>
            <p className="text-sm text-gray-400 mt-1">Active members today</p>
          </div>

          {/* Total Members */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-2">Total Members</h3>
            <p className="text-2xl font-bold text-purple-400">
              {dashboardData.totalMembers || 0}
            </p>
            <p className="text-sm text-gray-400 mt-1">Current active subscriptions</p>
          </div>
        </div>

        {/* Two-Column Layout for Charts & Clients */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Recent Clients */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Recent Clients</h3>
            <div className="space-y-4">
              {(dashboardData.recentClients || []).map((client, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-700 p-4 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg">
                      {getInitials(client.name)}
                    </div>
                    <div>
                      <p className="font-semibold text-white text-lg">{client.name}</p>
                      <p className="text-gray-300 text-sm">Last: {client.lastSession}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-20 bg-gray-600 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-teal-400 to-teal-600 h-full rounded-full"
                        style={{ width: `${client.goalAchieved || 0}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-white min-w-[40px] text-right">
                      {client.goalAchieved || 0}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Client Progress Chart */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Client Progress</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dashboardData.clientProgress || []}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="name" stroke="#999" />
                  <YAxis stroke="#999" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111827',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="progress" fill="#0d9488" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );

  const renderMemberDashboard = () => (
    <div className="w-full animate-fade-in">
      <main className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-transparent p-6 rounded-xl border-none">
          <h2 className="text-2xl font-bold text-white">
            Welcome back, {user?.firstName || 'Member'}!
          </h2>
          <p className="text-gray-300 text-sm mt-1">Here's your fitness overview.</p>
        </div>

        {/* Activity Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-2">Today's Steps</h3>
            <p className="text-2xl font-bold text-blue-400">
              {dashboardData.activity?.todaySteps?.toLocaleString() || 0}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Goal: {dashboardData.activity?.weeklyGoal?.toLocaleString() || 10000}
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-2">Workouts This Week</h3>
            <p className="text-2xl font-bold text-green-400">
              {dashboardData.activity?.workoutsThisWeek || 0}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Year to date: {dashboardData.activity?.yearToDate || 0}
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-2">Active Minutes</h3>
            <p className="text-2xl font-bold text-purple-400">
              {dashboardData.activity?.activeMinutes || 0}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Calories burned: {dashboardData.activity?.caloriesBurned || 0}
            </p>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {(dashboardData.activity?.recentActivities || []).map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-700 p-4 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl">{activity.type}</div>
                  <div>
                    <p className="font-semibold text-white">{activity.name}</p>
                    <p className="text-gray-300 text-sm">{activity.time} • {activity.duration}</p>
                  </div>
                </div>
                <div className="text-sm font-bold text-white">
                  {activity.calories} cal
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Diet Overview */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">Today's Nutrition</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-300 text-sm">Calories</p>
              <p className="text-xl font-bold text-white">
                {dashboardData.diet?.todayCalories || 0} / {dashboardData.diet?.dailyGoal || 2200}
              </p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-300 text-sm">Protein</p>
              <p className="text-xl font-bold text-white">
                {dashboardData.diet?.protein || 0}g
              </p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-300 text-sm">Carbs</p>
              <p className="text-xl font-bold text-white">
                {dashboardData.diet?.carbs || 0}g
              </p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-300 text-sm">Fats</p>
              <p className="text-xl font-bold text-white">
                {dashboardData.diet?.fats || 0}g
              </p>
            </div>
          </div>
        </div>

        {/* Training Overview */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">Training Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">Workout Types</h4>
              <div className="space-y-2">
                {(dashboardData.training?.workoutTypes || []).map((type, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: type.color }}
                      ></div>
                      <span className="text-white">{type.name}</span>
                    </div>
                    <span className="text-white font-semibold">{type.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">Current Plan</h4>
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-white font-semibold mb-2">{dashboardData.training?.currentPlan || "Strength Training"}</p>
                <p className="text-gray-300 text-sm mb-4">Weekly Progress: {dashboardData.training?.weeklyProgress || 0}%</p>
                <div className="w-full bg-gray-600 rounded-full h-2.5">
                  <div 
                    className="bg-green-500 h-2.5 rounded-full" 
                    style={{ width: `${dashboardData.training?.weeklyProgress || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );

  const renderTrainerDashboard = () => (
    <div className="w-full animate-fade-in">
      <main className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-transparent p-6 rounded-xl border-none">
          <h2 className="text-2xl font-bold text-white">
            Welcome back, {user?.firstName || 'Trainer'}!
          </h2>
          <p className="text-gray-300 text-sm mt-1">Here's your training overview.</p>
        </div>

        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-2">Total Clients</h3>
            <p className="text-2xl font-bold text-blue-400">
              {dashboardData.totalClients || 0}
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-2">Monthly Earnings</h3>
            <p className="text-2xl font-bold text-green-400">
              ${dashboardData.monthlyEarnings || 0}
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-2">Sessions This Month</h3>
            <p className="text-2xl font-bold text-purple-400">
              {dashboardData.sessionsThisMonth || 0}
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-2">Upcoming Sessions</h3>
            <p className="text-2xl font-bold text-yellow-400">
              {dashboardData.upcomingSessions?.length || 0}
            </p>
          </div>
        </div>

        {/* Clients List */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">Your Clients</h3>
          <div className="space-y-4">
            {(dashboardData.clients || []).map((client, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-700 p-4 rounded-lg"
              >
                <div>
                  <p className="font-semibold text-white">{client.name}</p>
                  <p className="text-gray-300 text-sm">Last session: {client.lastSession}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-20 bg-gray-600 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-green-400 to-green-600 h-full rounded-full"
                      style={{ width: `${client.progress || 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-white min-w-[40px] text-right">
                    {client.progress || 0}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">Upcoming Sessions</h3>
          <div className="space-y-4">
            {(dashboardData.upcomingSessions || []).map((session, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-700 p-4 rounded-lg"
              >
                <div>
                  <p className="font-semibold text-white">{session.title}</p>
                  <p className="text-gray-300 text-sm">
                    {new Date(session.date).toLocaleDateString()} • {session.duration} min
                  </p>
                </div>
                <div className="text-sm font-semibold text-white">
                  {session.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );

  const renderAdminDashboard = () => (
    <div className="w-full animate-fade-in">
      <main className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-transparent p-6 rounded-xl border-none">
          <h2 className="text-2xl font-bold text-white">
            Welcome back, {user?.firstName || 'Admin'}!
          </h2>
          <p className="text-gray-300 text-sm mt-1">Here's your system overview.</p>
        </div>

        {/* System Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-2">Total Users</h3>
            <p className="text-2xl font-bold text-blue-400">
              {dashboardData.systemStats?.totalUsers || 0}
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-2">Total Gyms</h3>
            <p className="text-2xl font-bold text-green-400">
              {dashboardData.systemStats?.totalGyms || 0}
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-2">Total Trainers</h3>
            <p className="text-2xl font-bold text-purple-400">
              {dashboardData.systemStats?.totalTrainers || 0}
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-2">Monthly Revenue</h3>
            <p className="text-2xl font-bold text-yellow-400">
              ${dashboardData.systemStats?.monthlyRevenue || 0}
            </p>
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">Recent Users</h3>
          <div className="space-y-4">
            {(dashboardData.recentUsers || []).map((user, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-700 p-4 rounded-lg"
              >
                <div>
                  <p className="font-semibold text-white">{user.firstName} {user.lastName}</p>
                  <p className="text-gray-300 text-sm">{user.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-gray-600 text-white text-xs rounded-full">
                    {user.role}
                  </span>
                  <span className="text-gray-400 text-sm">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">Recent System Activity</h3>
          <div className="space-y-4">
            {(dashboardData.recentActivity || []).length > 0 ? (
              dashboardData.recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-700 p-4 rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-white">{activity.action}</p>
                    <p className="text-gray-300 text-sm">{activity.details}</p>
                  </div>
                  <span className="text-gray-400 text-sm">
                    {new Date(activity.timestamp).toLocaleString()}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 py-8">
                No recent activity
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );

  const renderMerchantDashboard = () => (
    <div className="w-full animate-fade-in">
      <main className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-transparent p-6 rounded-xl border-none">
          <h2 className="text-2xl font-bold text-white">
            Welcome back, {user?.firstName || 'Merchant'}!
          </h2>
          <p className="text-gray-300 text-sm mt-1">Here's your store overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-2">Total Products</h3>
            <p className="text-2xl font-bold text-blue-400">
              {dashboardData.totalProducts || 0}
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-2">Monthly Revenue</h3>
            <p className="text-2xl font-bold text-green-400">
              ${dashboardData.monthlyRevenue || 0}
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-2">Pending Orders</h3>
            <p className="text-2xl font-bold text-yellow-400">
              {dashboardData.pendingOrders || 0}
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-2">Total Orders</h3>
            <p className="text-2xl font-bold text-purple-400">
              {dashboardData.orders?.length || 0}
            </p>
          </div>
        </div>

        {/* Products List */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">Your Products</h3>
          <div className="space-y-4">
            {(dashboardData.products || []).map((product, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-700 p-4 rounded-lg"
              >
                <div>
                  <p className="font-semibold text-white">{product.name}</p>
                  <p className="text-gray-300 text-sm">{product.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">${product.price}</p>
                  <p className="text-gray-400 text-sm">Stock: {product.stock}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">Recent Orders</h3>
          <div className="space-y-4">
            {(dashboardData.orders || []).map((order, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-700 p-4 rounded-lg"
              >
                <div>
                  <p className="font-semibold text-white">Order #{order.id}</p>
                  <p className="text-gray-300 text-sm">
                    {order.items?.length || 0} items • {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    order.status === 'COMPLETED' ? 'bg-green-600' : 
                    order.status === 'PENDING' ? 'bg-yellow-600' : 
                    'bg-red-600'
                  } text-white`}>
                    {order.status}
                  </span>
                  <span className="text-white font-semibold">
                    ${order.total}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {renderDashboard()}
    </div>
  );
}