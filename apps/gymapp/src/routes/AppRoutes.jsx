// src/AppRoutes.js
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Import Layout and Pages
import MainLayout from '../components/layout/MainLayout';
import LoginPage from '../pages/LoginPage';
import SelectRolePage from '../pages/SelectRolePage';
import ProtectedRoute from './ProtectedRoute';

// Import Onboarding Forms
import GymProfileForm from '../pages/GymProfileForm';
import TrainerProfileForm from '../pages/TrainerProfileForm';
import MerchantProfileForm from '../pages/MerchantProfileForm';

// Import Main App Pages
import Dashboard from '../pages/Dashboard';
import Clients from '../pages/Clients';
import Members from '../pages/Members';
import Schedule from '../pages/Schedule';
import Payments from '../pages/Payments';
import Profile from '../pages/Profile';
import GymProfile from '../pages/GymProfile';

// ✅ IMPORT THE NEW, FUNCTIONAL MERCHANT PAGES
import MerchantProductsPage from '../pages/MerchantProductsPage';
import MerchantOrdersPage from '../pages/MerchantOrdersPage';


const AppRoutes = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={!isAuthenticated ? <LoginPage /> : (user && user.role ? <Navigate to="/dashboard" /> : <Navigate to="/select-role" />)} />
      <Route path="/app-redirect" element={isAuthenticated ? (user && user.role ? <Navigate to="/dashboard" replace /> : <Navigate to="/select-role" replace />) : <Navigate to="/" replace />} />
      
      <Route element={<ProtectedRoute />}>
        <Route path="/select-role" element={<SelectRolePage />} />
        <Route path="/create-gym-profile" element={<GymProfileForm />} />
        <Route path="/create-trainer-profile" element={<TrainerProfileForm />} />
        <Route path="/create-merchant-profile" element={<MerchantProfileForm />} />

        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          
          <Route path="/clients" element={<Clients />} />
          <Route path="/profile" element={<Profile />} />
          
          <Route path="/members" element={<Members />} />
          <Route path="/gym-profile" element={<GymProfile />} />
          
          {/* ✅ WIRE UP THE REAL MERCHANT ROUTES */}
          <Route path="/merchant/products" element={<MerchantProductsPage />} />
          <Route path="/merchant/orders" element={<MerchantOrdersPage />} />
          
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/payments" element={<Payments />} />
        </Route>
      </Route>
      
      <Route path="*" element={<h1>404: Not Found</h1>} />
    </Routes>
  );
};

export default AppRoutes;