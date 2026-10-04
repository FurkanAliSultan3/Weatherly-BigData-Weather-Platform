import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Map, AlertTriangle, FileText, Info, LayoutDashboard, ShieldCheck } from 'lucide-react';
import ThemeToggle from '../ThemeToggle';

const PublicNavbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Live Map', path: '/', icon: Map },
    { name: 'Alerts', path: '/alerts', icon: AlertTriangle },
    { name: 'Report Weather', path: '/report', icon: FileText },
    { name: 'Safe zones', path: '/safe-zones', icon: ShieldCheck },
    { name: 'About', path: '/about', icon: Info },
  ];

  return (
    <nav className="w-full bg-stone-50 dark:bg-slate-900 border-b border-stone-200 dark:border-slate-800 text-stone-900 dark:text-slate-100 transition-colors duration-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-brand-primary text-white p-2 rounded-xl shadow-lg shadow-brand-primary/30 group-hover:scale-110 transition-transform">
            <Map size={22} />
          </div>
          <span className="text-2xl font-bold tracking-tighter text-stone-900 dark:text-white">WEATHERLY</span>
        </Link>

        <div className="hidden lg:flex items-center gap-7">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 text-sm font-bold transition-all duration-300 ${
                location.pathname === item.path
                  ? 'text-brand-primary scale-105'
                  : 'text-stone-700 dark:text-slate-300 hover:text-stone-900 dark:hover:text-white opacity-60 hover:opacity-100'
              }`}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button
            onClick={() => navigate('/officer/console')}
            className="px-4 py-2 rounded-full border border-stone-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800 text-stone-900 dark:text-slate-100 hover:bg-stone-100 dark:hover:bg-slate-700 transition-all cursor-pointer z-10 flex items-center gap-2 text-xs font-black uppercase tracking-widest"
          >
            <LayoutDashboard size={16} />
            Officer Console
          </button>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;
