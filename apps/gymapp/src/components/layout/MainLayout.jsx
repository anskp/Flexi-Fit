// src/components/layout/MainLayout.jsx
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar';

export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* The Sidebar is a permanent part of this layout */}
      <Sidebar />

      {/* The main content area where the routed pages will be rendered */}
      <main className="flex-1 ml-64 p-6 sm:p-8">
        {/* The Outlet component from react-router-dom renders the current child route */}
        <Outlet />
      </main>
    </div>
  );
}