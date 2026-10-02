import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicNavbar from '../components/common/PublicNavbar';

const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <PublicNavbar />
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 py-8 mt-12 text-center text-slate-500 text-sm">
        <p>© {new Date().getFullYear()} Weatherly Intelligence Platform. Official IMD Partner.</p>
      </footer>
    </div>
  );
};

export default PublicLayout;
