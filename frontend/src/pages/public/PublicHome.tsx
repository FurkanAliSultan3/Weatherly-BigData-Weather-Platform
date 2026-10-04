import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicTrustMap from '../components/PublicTrustMap'; // Adjust path if needed
import { Activity, AlertTriangle, CheckCircle, Clock, FileText, ArrowUpRight, Search, TrendingUp, Shield, Radio, Waves, MapPin, Gauge } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { getMockKPIs } from '../data/mockReports';

const StatCard = ({ label, value, icon: Icon, color, trend }: any) => (
  <div className="p-6 rounded-3xl flex flex-col gap-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
    <div className={`w-10 h-10 rounded-2xl ${color} flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-110`}>
      <Icon size={20} />
    </div>
    <div className="flex flex-col">
      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-bold text-slate-900 dark:text-white font-mono tracking-tight">{value}</p>
        {trend && (
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
            <TrendingUp size={12} /> {trend}
          </span>
        )}
      </div>
    </div>
  </div>
);

const CITIES: Record<string, [number, number]> = {
  Delhi: [28.6139, 77.2090],
  Mumbai: [19.0760, 72.8777],
  Chennai: [13.0827, 80.2707],
  Kolkata: [22.5726, 88.3639],
  Bengaluru: [12.9716, 77.5946],
  Hyderabad: [17.3850, 78.4867],
  Jaipur: [26.9124, 75.7873],
  Kochi: [9.9312, 76.2673],
  Guwahati: [26.1445, 91.7362],
};

const PublicHome: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const kpis = getMockKPIs();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<[number, number] | null>(null);
  
  const visibleCities = Object.entries(CITIES)
    .filter(([city]) => city.toLowerCase().includes(searchQuery.trim().toLowerCase()));

  return (
    <div className="bg-stone-50 dark:bg-slate-950 min-h-screen pb-20 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Title & Main CTAs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 text-xs font-bold tracking-wider uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              National Intelligence Portal
            </div>

            <h1 className="text-5xl sm:text-6xl xl:text-7xl font-extrabold text-slate-900 dark:text-white leading-[1.05] tracking-tight">
              Weather <br />
              <span className="italic text-orange-600 dark:text-orange-500">Intelligence.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-md">
              Combining official IMD telemetry with real-time citizen observations to build India's most trusted weather awareness network.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => navigate('/report')}
                className="px-6 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold transition-all shadow-lg shadow-orange-600/25 flex items-center gap-2 active:scale-95"
              >
                Report Event <ArrowUpRight size={18} />
              </button>
              <button
                onClick={() => navigate('/alerts')}
                className="px-6 py-3.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-200 font-semibold transition-all border border-stone-200 dark:border-slate-800 shadow-sm active:scale-95"
              >
                Explore Alerts
              </button>
            </div>
          </div>

          {/* Right Column: Live Intelligence Bento Grid */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-slate-800">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">India · Live Intelligence</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Weather Network Overview</p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/60 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                  Live Stream Active 🟢
                </span>
              </div>

              {/* 4 Intelligence Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Card 1 */}
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-slate-800/50 border border-stone-200 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="p-2 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400"><Activity size={18} /></span>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">+12% pace</span>
                  </div>
                  <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Real-Time Ingestion</p>
                  <p className="mt-1 font-mono text-2xl font-bold text-slate-900 dark:text-white">1,248</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">reports in active window</p>
                </div>

                {/* Card 2 */}
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-slate-800/50 border border-stone-200 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"><Gauge size={18} /></span>
                    <span className="text-[10px] font-bold text-slate-400">MODEL INDEX</span>
                  </div>
                  <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">AI Trust Score</p>
                  <p className="mt-1 font-mono text-2xl font-bold text-slate-900 dark:text-white">94.2%</p>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-stone-200 dark:bg-slate-700 overflow-hidden">
                    <div className="h-full w-[94.2%] rounded-full bg-emerald-500" />
                  </div>
                </div>

                {/* Card 3 */}
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-slate-800/50 border border-stone-200 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400"><AlertTriangle size={18} /></span>
                    <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase">3 Watch Areas</span>
                  </div>
                  <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Regional Hazards</p>
                  <ul className="mt-1.5 space-y-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                    <li className="flex items-center gap-1.5"><MapPin size={12} className="text-rose-500" /> Flooding · Mumbai</li>
                    <li className="flex items-center gap-1.5"><MapPin size={12} className="text-amber-500" /> Heatwave · Jaipur</li>
                    <li className="flex items-center gap-1.5"><MapPin size={12} className="text-amber-500" /> High Winds · Kochi</li>
                  </ul>
                </div>

                {/* Card 4 */}
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-slate-800/50 border border-stone-200 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="p-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400"><Radio size={18} /></span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> CONNECTED
                    </span>
                  </div>
                  <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Official Telemetry Sync</p>
                  <p className="mt-1 text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Waves size={14} className="text-sky-500 shrink-0" /> IMD Radar &amp; Satellite Stream
                  </p>
                </div>

              </div>

              {/* Status Toast Badge */}
              <div className="p-3 bg-slate-900 dark:bg-slate-950 text-white rounded-2xl flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-emerald-400" />
                  <span>System Status: All Nodes Operational 🟢</span>
                </div>
                <span className="text-[10px] text-slate-400 uppercase font-sans">IMD Network</span>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* MAP & QUICK CONTROLS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main GIS Map Component (8 Columns) */}
          <div className="lg:col-span-8 h-[600px] rounded-3xl overflow-hidden border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg relative">
            <PublicTrustMap selectedCityCoords={selectedCity} isDarkTheme={theme === 'dark'} />
            
            {/* Map Legend Overlay */}
            <div className="absolute bottom-6 left-6 z-[1000] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-stone-200 dark:border-slate-800 shadow-xl max-w-xs">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <div className="w-1 h-4 bg-orange-500 rounded-full" />
                Map Intelligence
              </h3>
              <div className="space-y-2">
                {[
                  { color: 'bg-emerald-500', label: 'Verified', desc: 'Analyst / IMD confirmed' },
                  { color: 'bg-amber-500', label: 'Likely', desc: 'High AI cross-reference' },
                  { color: 'bg-sky-500', label: 'Unverified', desc: 'Pending citizen report' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${item.color} ring-2 ring-white dark:ring-slate-800 shadow-sm`} />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-900 dark:text-white leading-none">{item.label}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar Controls (4 Columns) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Active Alerts CTA */}
            <div className="bg-orange-600 rounded-3xl p-6 text-white shadow-lg shadow-orange-600/20 relative overflow-hidden">
              <div className="relative z-10 space-y-4">
                <div className="p-2.5 bg-white/20 w-fit rounded-xl backdrop-blur-md">
                  <AlertTriangle size={22} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight">Active Alerts</h3>
                <p className="text-white/90 text-xs leading-relaxed">
                  {kpis?.activeAlerts > 0
                    ? `${kpis.activeAlerts} verified severe weather warnings active across India.`
                    : 'Monitoring regional weather advisories in real-time.'}
                </p>
                <button
                  onClick={() => navigate('/alerts')}
                  className="w-full py-3 bg-white text-orange-600 rounded-xl font-bold text-xs hover:bg-slate-50 transition-all active:scale-95 shadow-md"
                >
                  View Detailed Alerts
                </button>
              </div>
            </div>

            {/* Quick City Search */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-stone-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quick Search</h3>
                <Search size={16} className="text-slate-400" />
              </div>
              
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search city or region..."
                className="w-full px-4 py-3 bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              />

              <div className="flex flex-wrap gap-1.5">
                {visibleCities.map(([city, coords]) => (
                  <button
                    key={city}
                    onClick={() => setSelectedCity(coords)}
                    className="px-3 py-1.5 bg-stone-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium hover:bg-orange-600 hover:text-white transition-all border border-stone-200/60 dark:border-slate-700"
                  >
                    {city}
                  </button>
                ))}
                {visibleCities.length === 0 && <span className="text-xs text-slate-400">No matching cities found.</span>}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* KPI METRICS BENTO GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            label="Total Reports"
            value={kpis.totalReports}
            icon={FileText}
            color="bg-indigo-500"
          />
          <StatCard
            label="Verified Events"
            value={kpis.verifiedReports}
            icon={CheckCircle}
            color="bg-emerald-500"
          />
          <StatCard
            label="Likely"
            value={kpis.likelyReports}
            icon={TrendingUp}
            color="bg-amber-500"
          />
          <StatCard
            label="Unverified"
            value={kpis.unverifiedReports}
            icon={Clock}
            color="bg-sky-500"
          />
          <StatCard
            label="Flagged"
            value={kpis.flaggedReports}
            icon={AlertTriangle}
            color="bg-rose-500"
          />
        </div>
      </section>

    </div>
  );
};

export default PublicHome;
