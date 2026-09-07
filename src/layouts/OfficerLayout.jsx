import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { GovTopBar } from '../components/navigation/GovTopBar';
import { GovHeader } from '../components/navigation/GovHeader';
import { OfficerSidebar } from '../components/navigation/OfficerSidebar';
import { Footer } from '../components/navigation/Footer';
import { ToastContainer } from '../components/notifications/NotificationBell';
import { useAuth } from '../context/AuthContext';
import { Menu, X } from 'lucide-react';

export const OfficerLayout = () => {
  const { user, isOfficer, isAuthenticated } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isOfficer) {
    return <Navigate to="/student/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100">
      <GovTopBar />
      <GovHeader />

      {/* Main Officer Workspace with dark theme */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
        {/* Desktop Sidebar */}
        <OfficerSidebar className="hidden lg:flex rounded-xl shadow-md self-start sticky top-28" />

        {/* Mobile Sidebar Modal */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-slate-900 z-10">
              <div className="p-4 flex items-center justify-between border-b border-slate-800">
                <span className="font-bold text-xs text-white">Officer Navigation</span>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto" onClick={() => setMobileSidebarOpen(false)}>
                <OfficerSidebar className="w-full border-none" />
              </div>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 min-w-0">
          {/* Mobile Sidebar Open Button */}
          <div className="lg:hidden mb-4 flex items-center justify-between bg-slate-800 p-3 rounded-lg border border-slate-700 shadow-xs">
            <span className="text-xs font-bold text-amber-400">Officer Verification Desk</span>
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md bg-slate-700 text-white border border-slate-600"
            >
              <Menu className="w-4 h-4" />
              <span>Menu</span>
            </button>
          </div>

          <Outlet />
        </main>
      </div>

      <Footer />
      <ToastContainer />
    </div>
  );
};
