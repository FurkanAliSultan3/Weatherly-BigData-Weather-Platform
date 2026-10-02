import React from 'react';
import PublicTrustMap from '../../maps/PublicTrustMap';
import { mockKPIs } from '../../services/mockData';
import { Map, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
    <div className={`p-3 rounded-xl ${color}`}>
      <Icon size={24} className="text-white" />
    </div>
    <div>
      <p className="text-sm text-slate-500 font-medium">{label}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  </div>
);

const PublicHome: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-3 py-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          Understand India's Weather. <span className="text-blue-600">Stay Ahead.</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          The national intelligence platform combining official IMD data with real-time citizen observations for unparalleled weather awareness.
        </p>
      </div>

      {/* Main Map Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 h-[600px] rounded-3xl overflow-hidden border-4 border-white shadow-xl relative">
          <PublicTrustMap />
          <div className="absolute bottom-6 left-6 z-[1000] bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-slate-200 shadow-lg">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Live Map Legend</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                <div className="w-3 h-3 rounded-full bg-green-500" /> Verified Event
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                <div className="w-3 h-3 rounded-full bg-amber-500" /> Likely Genuine
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                <div className="w-3 h-3 rounded-full bg-slate-400" /> Unverified
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                <div className="w-3 h-3 rounded-full bg-rose-500" /> Suspicious/Flagged
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-lg shadow-blue-200 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 opacity-10 group-hover:rotate-12 transition-transform">
              <AlertTriangle size={120} />
            </div>
            <h3 className="text-lg font-bold mb-2">Active Weather Alerts</h3>
            <p className="text-blue-100 text-sm mb-6">37 active critical alerts across 5 states. Please check your local region.</p>
            <button className="w-full py-3 bg-white text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors">
              View All Alerts
            </button>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Quick Search</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Search city or state..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {['Delhi', 'Mumbai', 'Chennai', 'Kolkata'].map(city => (
                <button key={city} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs hover:bg-blue-100 hover:text-blue-600 transition-colors">
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Public Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Citizen Reports" value={mockKPIs.totalReports} icon={FileText} color="bg-blue-500" />
        <StatCard label="Verified Events" value={mockKPIs.verifiedReports} icon={CheckCircle} color="bg-green-500" />
        <StatCard label="Under Review" value={mockKPIs.underReview} icon={Clock} color="bg-amber-500" />
        <StatCard label="Active Alerts" value={mockKPIs.activeAlerts} icon={AlertTriangle} color="bg-rose-500" />
      </div>
    </div>
  );
};

export default PublicHome;
