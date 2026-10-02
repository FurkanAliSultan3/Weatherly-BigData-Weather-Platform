import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Map, AlertTriangle, FileText, Info, LogIn } from 'lucide-react';

const PublicNavbar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Live Map', path: '/', icon: Map },
    { name: 'Alerts', path: '/alerts', icon: AlertTriangle },
    { name: 'Report Weather', path: '/report', icon: FileText },
    { name: 'About', path: '/about', icon: Info },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-blue-600 text-white p-1.5 rounded-lg group-hover:bg-blue-700 transition-colors">
            <Map size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">WEATHERLY</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? 'text-blue-600'
                  : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              <item.icon size={16} />
              {item.name}
            </Link>
          ))}
        </div>

        <Link
          to="/officer/console"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
        >
          <LogIn size={16} />
          Authorized Login
        </Link>
      </div>
    </nav>
  );
};

export default PublicNavbar;
