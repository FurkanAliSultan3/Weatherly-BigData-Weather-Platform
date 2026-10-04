import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicTrustMap from '../../maps/PublicTrustMap';
import { Activity, AlertTriangle, CheckCircle, Clock, FileText, ArrowUpRight, Search, TrendingUp, Shield, Radio, Waves, MapPin, Gauge } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { getMockKPIs } from '../../data/mockReports';

const StatCard = ({ label, value, icon: Icon, color, trend }: any) => (
  <div className="glass-card p-8 rounded-3xl flex flex-col gap-4 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group border border-white/40 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md">
    <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3`}>
      <Icon size={24} />
    </div>
    <div className="flex flex-col">
      <p className="text-xs font-bold text-brand-off-muted dark:text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-4xl font-bold text-brand-ink dark:text-white font-mono tracking-tighter">{value}</p>
        {trend && (
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
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
    <div className="bg-brand-canvas dark:bg-slate-900 min-h-screen pb-24 transition-colors duration-300">
      <section className="relative pt-20 pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] bg-brand-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10 relative z-10">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-brand-hairline dark:border-slate-700 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
              </span>
              <span className="text-xs font-bold text-brand-body dark:text-slate-300 uppercase tracking-[0.2em]">National Intelligence Portal</span>
            </div>

            <h1 className="text-7xl md:text-9xl font-normal text-brand-ink dark:text-white leading-[0.9] tracking-tighter">
              Weather <br />
              <span className="italic text-brand-primary">Intelligence.</span>
            </h1>

            <p className="text-xl text-brand-body dark:text-slate-300 max-w-xl leading-relaxed font-light opacity-80">
              Combining official IMD telemetry with real-time citizen observations to build India's most trusted weather awareness network.
            </p>

            <div className="flex flex-wrap gap-6">
              <button
                onClick={() => navigate('/report')}
                className="btn-primary px-8 py-4 rounded-2xl flex items-center gap-3 group text-lg shadow-xl shadow-brand-primary/20"
              >
                Report Event <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/alerts')}
                className="btn-secondary px-8 py-4 rounded-2xl text-lg dark:text-slate-200"
              >
                Explore Alerts
              </button>
            </div>
          </div>

          <div className="relative mt-12 lg:mt-0">
            <div className="relative z-10 bg-white/85 dark:bg-slate-800/90 border border-stone-200 dark:border-slate-700/80 shadow-2xl shadow-brand-primary/10 rounded-[2rem] p-5 transition-colors duration-200">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-muted dark:text-slate-400">India · live intelligence</p>
                  <p className="mt-1 text-sm font-semibold text-brand-ink dark:text-white">Weather network overview</p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" /> Demo stream
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <article className="min-h-40 rounded-2xl border border-brand-hairline bg-brand-canvas/80 p-4 dark:border-slate-700 dark:bg-slate-900/70">
                  <div className="flex items-center justify-between">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-primary/10 text-brand-primary"><Activity size={18} /></span>
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">+12% pace</span>
                  </div>
                  <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-brand-muted dark:text-slate-400">Real-time ingestion</p>
                  <p className="mt-1 font-mono text-2xl font-bold tabular-nums text-brand-ink dark:text-white">1,248</p>
                  <p className="text-[10px] text-brand-muted dark:text-slate-500">reports in this demo window</p>
                </article>
                <article className="min-h-40 rounded-2xl border border-brand-hairline bg-brand-canvas/80 p-4 dark:border-slate-700 dark:bg-slate-900/70">
                  <div className="flex items-center justify-between">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"><Gauge size={18} /></span>
                    <span className="text-[10px] font-bold text-brand-muted dark:text-slate-400">MODEL INDEX</span>
                  </div>
                  <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-brand-muted dark:text-slate-400">AI trust score</p>
                  <p className="mt-1 font-mono text-2xl font-bold tabular-nums text-brand-ink dark:text-white">94.2%</p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-stone-200 dark:bg-slate-700">
                    <div className="h-full w-[94.2%] rounded-full bg-emerald-500" />
                  </div>
                </article>
                <article className="min-h-40 rounded-2xl border border-brand-hairline bg-brand-canvas/80 p-4 dark:border-slate-700 dark:bg-slate-900/70">
                  <div className="flex items-center justify-between">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-rose-500/10 text-rose-700 dark:text-rose-400"><AlertTriangle size={18} /></span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">3 watch areas</span>
                  </div>
                  <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-brand-muted dark:text-slate-400">Regional hazards</p>
                  <ul className="mt-2 space-y-1.5 text-[11px] font-semibold text-brand-ink dark:text-slate-200">
                    <li className="flex items-center gap-2"><MapPin size={12} className="text-rose-500" /> Flooding · Mumbai</li>
                    <li className="flex items-center gap-2"><MapPin size={12} className="text-amber-500" /> Heat · Jaipur</li>
                    <li className="flex items-center gap-2"><MapPin size={12} className="text-amber-500" /> High winds · Kochi</li>
                  </ul>
                </article>
                <article className="min-h-40 rounded-2xl border border-brand-hairline bg-brand-canvas/80 p-4 dark:border-slate-700 dark:bg-slate-900/70">
                  <div className="flex items-center justify-between">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-sky-500/10 text-sky-700 dark:text-sky-400"><Radio size={18} /></span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> CONNECTED</span>
                  </div>
                  <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-brand-muted dark:text-slate-400">Official telemetry sync</p>
                  <p className="mt-2 flex items-center gap-2 text-xs font-semibold leading-relaxed text-brand-ink dark:text-slate-200"><Waves size={14} className="shrink-0 text-sky-600 dark:text-sky-400" /> IMD Doppler radar &amp; satellite stream</p>
                  <p className="mt-1 text-[10px] text-brand-muted dark:text-slate-500">Demonstration status</p>
                </article>
              </div>
              <div className="ml-auto mt-4 w-fit rounded-2xl border border-white/10 bg-brand-ink p-4 shadow-2xl dark:bg-slate-950">
                  <div className="flex items-center gap-4">
                      <div className="p-3 bg-brand-primary/20 text-brand-primary rounded-xl">
                          <Shield size={24} />
                      </div>
                      <div className="font-mono">
                          <p className="text-[10px] text-brand-body dark:text-slate-400 uppercase font-bold opacity-80">System Status · Demo</p>
                          <p className="text-xs font-bold text-white">
                            System Status: All Nodes Operational 🟢
                          </p>
                      </div>
                  </div>
               </div>
            </div>
            <div className="absolute inset-0 border-2 border-brand-primary/20 rounded-full scale-110 blur-sm animate-pulse" />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-3 h-[750px] rounded-[3rem] overflow-hidden border-[12px] border-white dark:border-slate-800 shadow-2xl relative group transition-all hover:shadow-brand-primary/10">
            <PublicTrustMap selectedCityCoords={selectedCity} isDarkTheme={theme === 'dark'} />
            <div className="absolute bottom-10 left-10 z-[1000] bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl p-8 rounded-[2rem] border border-white dark:border-slate-700 shadow-2xl max-w-xs transition-all duration-500 group-hover:translate-x-2 group-hover:-translate-y-2">
              <h3 className="text-xs font-black text-brand-muted dark:text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-brand-primary rounded-full" />
                  Map Intelligence
              </h3>
              <div className="space-y-4">
                {[
                  { color: 'bg-emerald-500', label: 'Verified', desc: 'Marked verified by an analyst' },
                  { color: 'bg-amber-500', label: 'Likely', desc: 'Needs further review' },
                  { color: 'bg-sky-500', label: 'Unverified', desc: 'Awaiting analyst review' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 group/item cursor-default">
                    <div className={`w-3 h-3 rounded-full ${item.color} ring-4 ring-white dark:ring-slate-800 shadow-sm transition-transform group-hover/item:scale-150`} />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-brand-ink dark:text-white">{item.label}</span>
                      <span className="text-[10px] text-brand-body dark:text-slate-400">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-brand-primary rounded-[2.5rem] p-8 text-white shadow-2xl shadow-brand-primary/30 relative overflow-hidden group transition-all hover:bg-brand-primary-active">
              <div className="absolute -right-12 -top-12 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                <AlertTriangle size={200} />
              </div>
              <div className="relative z-10">
                  <div className="p-3 bg-white/20 w-fit rounded-2xl mb-6 backdrop-blur-md">
                      <AlertTriangle size={24} className="text-white" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4 leading-tight tracking-tight">Active Alerts</h3>
                  <p className="text-white/80 text-sm mb-8 leading-relaxed font-light">
                      {kpis?.activeAlerts > 0
                        ? `${kpis.activeAlerts} active alerts across India.`
                        : 'Official alert data is not connected yet.'}
                  </p>
                  <button
                    onClick={() => navigate('/alerts')}
                    className="w-full py-4 bg-white text-brand-primary rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all active:scale-95 shadow-xl"
                  >
                      View Detailed Alerts
                  </button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 border border-brand-hairline dark:border-slate-700 shadow-xl space-y-6">
              <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-brand-muted dark:text-slate-400 uppercase tracking-widest">Quick Search</h3>
                  <Search size={18} className="text-brand-muted dark:text-slate-400" />
              </div>
              <div className="relative group">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search city, state or region..."
                  className="w-full px-6 py-4 bg-brand-canvas/50 dark:bg-slate-900/50 border border-brand-hairline dark:border-slate-700 rounded-2xl text-sm focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all group-hover:bg-white dark:group-hover:bg-slate-700"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {visibleCities.map(([city, coords]) => (
                  <button
                      key={city}
                      onClick={() => setSelectedCity(coords)}
                      className="px-4 py-2 bg-brand-canvas dark:bg-slate-900 text-brand-body dark:text-slate-300 rounded-xl text-xs font-medium hover:bg-brand-primary hover:text-white transition-all duration-300 border border-brand-hairline dark:border-slate-700"
                  >
                    {city}
                  </button>
                ))}
                {visibleCities.length === 0 && <span className="text-xs text-brand-muted">No matching cities.</span>}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-5">
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
