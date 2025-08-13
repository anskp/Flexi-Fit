import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Sidebar } from './components/dashboard/sidebar'
import { TopNavbar } from './components/dashboard/top-navbar'
import { DashboardOverview } from './components/dashboard/dashboard-overview'
import { UserManagement } from './components/dashboard/user-management' // Combined: members, trainers, gym approvals
import { Schedules } from './components/dashboard/schedules'
import { PaymentsPlans } from './components/dashboard/payments-plans' // Combined: payments, plans
import { Reports } from './components/dashboard/reports'
import { GymApprovals } from './components/dashboard/gym-approvals'
import { ChallengesManagement } from './components/dashboard/challenges-management'
import { BadgeManager } from './components/dashboard/badge-manager'
import { MemberNotifications } from './components/dashboard/member-notifications'
import { AccessLogs } from './components/dashboard/access-logs'
import { SettingsPage } from './components/dashboard/settings-page'
import './App.css'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [token, setToken] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('token') : null))
  const [darkMode, setDarkMode] = useState(() => {
    // Check system preference or stored preference
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme) {
        return storedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false; // Default to light if window is not defined
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleLogin = async (e) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const email = form.get('email')
    const password = form.get('password')
    try {
      const { token: t } = await import('./lib/api.js').then(({ login }) => login({ email, password }))
      localStorage.setItem('token', t)
      setToken(t)
    } catch (err) {
      alert('Login failed')
    }
  }

  if (!token) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'dark' : ''}`}>
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4 bg-background p-6 rounded-lg border border-border">
          <h1 className="text-2xl font-semibold text-foreground">Admin Login</h1>
          <input name="email" type="email" placeholder="Email" className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground" required />
          <input name="password" type="password" placeholder="Password" className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground" required />
          <button type="submit" className="w-full py-2 rounded-md bg-gradient-to-r from-green-500 to-blue-500 text-white">Login</button>
        </form>
      </div>
    )
  }

  return (
    <Router>
      <div className={`flex h-screen bg-background ${darkMode ? 'dark' : ''}`}>
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <TopNavbar 
            onMenuClick={() => setSidebarOpen(true)} 
            darkMode={darkMode}
            onThemeToggle={() => setDarkMode(!darkMode)}
          />

          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto">
              <Routes>
                <Route path="/" element={<DashboardOverview />} />
                <Route path="/user-management" element={<UserManagement />} />
                <Route path="/schedules" element={<Schedules />} />
                <Route path="/payments-plans" element={<PaymentsPlans />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/gym-approvals" element={<GymApprovals />} />
                <Route path="/challenges" element={<ChallengesManagement />} />
                <Route path="/badges" element={<BadgeManager />} />
                <Route path="/notifications" element={<MemberNotifications />} />
                <Route path="/access-logs" element={<AccessLogs />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  )
}

export default App
