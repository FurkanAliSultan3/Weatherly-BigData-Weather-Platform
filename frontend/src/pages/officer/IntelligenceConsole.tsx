import React from 'react';
import { mockKPIs, mockReports } from '../../services/mockData';
import PublicTrustMap from '../../maps/PublicTrustMap';
import { LayoutDashboard, ShieldCheck, BrainCircuit, Globe } from 'lucide-react';

const KPICard = ({ label, value, subValue, icon: Icon }: any) => (
  <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-inner">
    <div className="flex items-center justify-between mb-4">
      <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg">
        <Icon size={20} />
      </div>
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Real-time</span>
    </div>
    <div className="space-y-1">
      <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">{label}</p>
      <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
      <p className="text-xs text-cyan-500 font-medium">{subValue}</p>
    </div>
  </div>
);

const IntelligenceConsole: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Top KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          label="Total Reports"
          value={mockKPIs.totalReports}
          subValue={`+${Math.floor(Math.random() * 20)} new today`}
          icon={LayoutDashboard}
        />
        <KPICard
          label="Verified"
          value={mockKPIs.verifiedReports}
          subValue={`Trust Index: ${mockKPIs.systemTrustIndex}%`}
          icon={ShieldCheck}
        />
        <KPICard
          label="AI Insights"
          value="12 Clusters"
          subValue="87% Confidence"
          icon={BrainCircuit}
        />
        <KPICard
          label="Global Sources"
          value="5 Active"
          subValue="All systems nominal"
          icon={Globe}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Intelligence Map */}
        <div className="xl:col-span-2 h-[600px] bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden relative shadow-2xl">
          <div className="absolute top-6 left-6 z-[1000] flex gap-3">
            <div className="bg-slate-900/80 backdrop-blur-md p-3 rounded-xl border border-slate-700 text-xs text-white flex items-center gap-4 shadow-lg">
              <span className="text-slate-500 font-bold uppercase tracking-tighter">Filter:</span>
              <select className="bg-transparent outline-none text-cyan-400 font-medium">
                <option className="bg-slate-900">All Reports</option>
                <option className="bg-slate-900">Verified Only</option>
                <option className="bg-slate-900">Suspicious</option>
              </select>
            </div>
          </div>
          <PublicTrustMap isDarkTheme={true} /> {/* Now supports dark theme! */}
        </div>

        {/* Right Intelligence Panel */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <BrainCircuit size={14} className="text-cyan-400" />
              AI Verification Intelligence
            </h3>
            <div className="space-y-4">
              {mockReports.slice(0, 3).map((report, i) => (
                <div key={i} className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700 hover:border-cyan-500/50 transition-all group cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-white">{report.phenomenon}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      report.status === 'verified' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {report.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-[10px] text-slate-500">{report.location.city}, {report.location.state}</span>
                    <span className="text-xs font-bold text-cyan-400">{Math.floor(report.aiConfidence)}% Confidence</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all border border-slate-700">
              Explore All AI Insights
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntelligenceConsole;
