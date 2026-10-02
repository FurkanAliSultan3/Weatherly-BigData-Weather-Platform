import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Map as MapIcon,
  ShieldCheck,
  TableProperties,
  BarChart3,
  BrainCircuit,
  Globe,
  BellRing,
  ClipboardList,
  ExternalLink
} from 'lucide-react';

const OfficerLayout: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { name: 'Overview', path: '/officer/console', icon: LayoutDashboard },
    { name: 'Live Intelligence Map', path: '/officer/map', icon: MapIcon },
    { name: 'Verification Center', path: '/officer/verify', icon: ShieldCheck },
    { name: 'Report Explorer', path: '/officer/explorer', icon: TableProperties },
    { name: 'Analytics', path: '/officer/analytics', icon: BarChart3 },
    { name: 'AI Insights', path: '/officer/ai', icon: BrainCircuit },
    { name: 'Data Sources', path: '/officer/sources', icon: Globe },
    { name: 'Active Alerts', path: '/officer/alerts', icon: BellRing },
    { name: 'Audit Log', path: '/officer/audit', icon: ClipboardList },
  ];

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-300 font-mono">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-slate-800">
          <Link to="/" className="flex items-center gap-2 group mb-6">
            <div className="bg-cyan-500 text-slate-950 p-1.5 rounded-lg">
              <MapIcon size={20} />
            </div>
            <span className="text-lg font-bold tracking-tighter text-white">WEATHERLY <span className="text-cyan-500 text-xs block leading-none">INTEL CONSOLE</span></span>
          </Link>

          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700 text-[10px] uppercase tracking-widest text-slate-500">
            Authorized · IMD Officer
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all ${
                location.pathname === item.path
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:text-white transition-colors"
          >
            <ExternalLink size={14} />
            Public Weatherly
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-40">
          <h1 className="text-sm font-medium text-slate-400 uppercase tracking-widest">
            {menuItems.find(i => i.path === location.pathname)?.name || 'Intelligence Console'}
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-full border border-slate-700 text-xs text-slate-300">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              System Online
            </div>
          </div>
        </header>
        <div className="p-6 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default OfficerLayout;
