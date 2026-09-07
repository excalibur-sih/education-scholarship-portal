import React from 'react';
import { Outlet } from 'react-router-dom';
import { GovTopBar } from '../components/navigation/GovTopBar';
import { GovHeader } from '../components/navigation/GovHeader';
import { Footer } from '../components/navigation/Footer';
import { ToastContainer } from '../components/notifications/NotificationBell';

export const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <GovTopBar />
      <GovHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
};
