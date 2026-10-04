import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicNavbar from '../components/common/PublicNavbar';

const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen overflow-x-clip bg-brand-canvas font-sans text-brand-body transition-colors duration-500">
      <PublicNavbar />
      <main className="relative">
        <Outlet />
      </main>
      <footer className="mt-24 border-t border-brand-hairline bg-white/50 py-12 text-center text-brand-muted text-sm backdrop-blur-sm dark:bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-6">
          <p className="font-medium opacity-80">© {new Date().getFullYear()} Weatherly Intelligence Platform prototype.</p>
          <p className="text-[10px] uppercase tracking-widest mt-2 opacity-50">National Weather Awareness Network · India</p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
