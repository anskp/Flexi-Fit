// src/components/Sidebar.jsx
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const userRole = user?.role === 'GYM_OWNER' ? 'gym' : 'trainer';
  
  const menuItems = userRole === 'gym'
    ? [
        { name: 'Dashboard', icon: '📊', path: '/dashboard' },
        { name: 'Members', icon: '👥', path: '/members' }, // Changed from Clients
        { name: 'Trainers', icon: '🏋️‍♂️', path: '/trainers' },
        { name: 'Schedule', icon: '📅', path: '/schedule' },
        { name: 'Payments', icon: '💰', path: '/payments' },
        { name: 'Profile', icon: '👤', path: '/gym-profile' }, // Gym Profile
      ]
    : [
        { name: 'Dashboard', icon: '📊', path: '/dashboard' },
        { name: 'Clients', icon: '👥', path: '/clients' },
        { name: 'Schedule', icon: '📅', path: '/schedule' },
        { name: 'Payments', icon: '💰', path: '/payments' },
        { name: 'Profile', icon: '👤', path: '/profile' }, // Trainer Profile
      ];

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-xl font-bold text-indigo-600">FitFlex Pro</h1>
        <p className="text-sm text-gray-600 capitalize">{userRole} Portal</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium text-sm ${
                isActive
                  ? 'bg-indigo-100 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100 mt-auto">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex-shrink-0 flex items-center justify-center font-bold">
                    {user?.email ? user.email.charAt(0).toUpperCase() : '?'}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user?.email || 'User'}</p>
                </div>
            </div>
            <button onClick={logout} title="Logout" className="text-gray-500 hover:text-red-500 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </button>
        </div>
      </div>
    </div>
  );
}