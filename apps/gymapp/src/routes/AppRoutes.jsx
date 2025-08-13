// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Import Layout and Pages
import MainLayout from '../components/layout/MainLayout';
import AuthPage from '../pages/AuthPage';
import SelectRolePage from '../pages/SelectRolePage';
import GymProfileForm from '../pages/GymProfileForm';
import TrainerProfileForm from '../pages/TrainerProfileForm';
import Dashboard from '../pages/Dashboard';
import Clients from '../pages/Clients';
import Schedule from '../pages/Schedule';
import Payments from '../pages/Payments';
import GymProfile from '../pages/GymProfile';
import Profile from '../pages/Profile';
import Members from '../pages/Members';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={!isAuthenticated ? <AuthPage /> : (user && user.role ? <Navigate to="/dashboard" /> : <Navigate to="/select-role" />)}
      />
      
      <Route element={<ProtectedRoute />}>
        {/* Onboarding routes (no main layout) */}
        <Route path="/select-role" element={<SelectRolePage />} />
        <Route path="/create-gym-profile" element={<GymProfileForm />} />
        <Route path="/create-trainer-profile" element={<TrainerProfileForm />} />

        {/* Main app routes (with sidebar layout) */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/gym-profile" element={<GymProfile />} />
          <Route path="/members" element={<Members />} />
        </Route>
      </Route>
      
      <Route path="*" element={<h1>404: Not Found</h1>} />
    </Routes>
  );
};

export default AppRoutes;