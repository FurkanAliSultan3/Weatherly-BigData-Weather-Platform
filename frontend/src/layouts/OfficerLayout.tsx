import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Map as MapIcon,
  ShieldCheck,
  TableProperties,
  BarChart3,
  ClipboardList,
  ExternalLink,
  Activity,
  RadioTower,
  Database,
} from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

const OfficerLayout: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { name: 'Overview', path: '/officer/console', icon: LayoutDashboard },
    { name: 'Live Intelligence Map', path: '/officer/map', icon: MapIcon },
    { name: 'Verification Center', path: '/officer/verification', icon: ShieldCheck },
    { name: 'Report Explorer', path: '/officer/explorer', icon: TableProperties },
    { name: 'Analytics & AI Insights', path: '/officer/analytics', icon: BarChart3 },
    { name: 'Data Sources & Ingestion Streams', path: '/officer/sources', icon: Database },
    { name: 'Emergency Broadcast Center', path: '/officer/broadcast', icon: RadioTower },
    { name: 'Audit Log', path: '/officer/audit', icon: ClipboardList },
  ];

  const isActivePath = (path: string) =>
    location.pathname === path
    || (path === '/officer/verification' && location.pathname === '/officer/verify');

  return (
    <div className="theme-officer flex min-h-screen bg-stone-100 text-stone-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      {/* Sidebar */}
      <aside className="sticky top-0 z-50 flex h-screen w-64 flex-col border-r border-stone-200 bg-stone-50 shadow-2xl dark:border-slate-800 dark:bg-slate-900/95">
        <div className="border-b border-stone-200 p-6 dark:border-slate-800">
          <Link to="/" className="flex items-center gap-2 group mb-6">
            <div className="bg-[#3FD9C7] text-[#0A0F16] p-1.5 rounded-lg shadow-[0_0_15px_rgba(63,217,199,0.4)] transition-transform group-hover:scale-110">
              <MapIcon size={20} />
            </div>
            <div className="flex flex-col leading-none">
                <span className="text-lg font-black tracking-tighter text-stone-900 dark:text-slate-100">WEATHERLY</span>
                <span className="text-[#3FD9C7] text-[10px] font-bold uppercase tracking-widest">Intel Console</span>
            </div>
          </Link>

          <div className="flex items-center gap-2 rounded-lg border border-stone-200 bg-stone-100 p-3 text-[10px] uppercase tracking-widest text-stone-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
            <div className="w-1.5 h-1.5 bg-[#3FD9C7] rounded-full animate-pulse" />
            Temporary developer access · authentication disabled
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group ${
                isActivePath(item.path)
                  ? 'bg-[#3FD9C7]/10 text-[#3FD9C7] border border-[#3FD9C7]/20 shadow-[inset_0_0_10px_rgba(63,217,199,0.1)]'
                  : 'text-stone-600 hover:bg-stone-200 hover:text-stone-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
              }`}
            >
              <item.icon size={17} className={`shrink-0 transition-colors ${isActivePath(item.path) ? 'text-[#3FD9C7]' : 'text-[#5B6C80] group-hover:text-white'}`} />
              <span className="font-medium leading-snug">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="space-y-4 border-t border-stone-200 p-4 dark:border-slate-800">
          <Link
            to="/"
            className="group flex items-center gap-2 px-3 py-2 text-xs text-stone-500 transition-colors hover:text-stone-900 dark:text-slate-400 dark:hover:text-white"
          >
            <ExternalLink size={14} className="group-hover:translate-x-0.5 transition-transform" />
            Public Portal
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-stone-200 bg-white px-6 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-4">
              <Activity size={18} className="text-[#3FD9C7] animate-pulse" />
              <h1 className="text-sm font-bold uppercase tracking-[0.2em] text-stone-600 dark:text-slate-300">
                {menuItems.find(i => i.path === location.pathname)?.name || 'Intelligence Console'}
              </h1>
          </div>

          <div className="flex items-center gap-6">
            <ThemeToggle />
            <div className="flex items-center gap-2 rounded-full border border-stone-200 bg-stone-100 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#168f83] dark:border-slate-800 dark:bg-slate-950 dark:text-[#3FD9C7]">
              <div className="w-1.5 h-1.5 bg-[#3FD9C7] rounded-full animate-pulse" />
              Live Sync Active
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-stone-600 dark:text-slate-400">
                <span className="opacity-50">UTC:</span>
                <span className="font-mono text-stone-900 dark:text-slate-100">{new Date().toUTCString().split(' ')[4]}</span>
            </div>
          </div>
        </header>
        <div className="min-h-[calc(100vh-64px)] bg-stone-100 p-8 dark:bg-slate-950">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default OfficerLayout;
