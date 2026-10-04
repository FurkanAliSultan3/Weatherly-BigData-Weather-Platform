import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { reportApi, createLiveFeedSocket } from '../../api/client';
import PublicTrustMap from '../../maps/PublicTrustMap';
import { LayoutDashboard, ShieldCheck, BrainCircuit, Clock } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { getMockKPIs, normalizeMapReport } from '../../data/mockReports';
import type { MapWeatherReport } from '../../data/mockReports';
import { getOfficerReports, useOfficerStoreVersion } from '../../data/officerStore';

const KPICard = ({ label, value, subValue, icon: Icon }: any) => (
  <div className="bg-brand-off-surface border border-brand-off-hairline p-6 rounded-2xl shadow-inner transition-all hover:border-brand-off-primary/50 group">
    <div className="flex items-center justify-between mb-4">
      <div className="p-2 bg-brand-off-primary/10 text-brand-off-primary rounded-lg group-hover:scale-110 transition-transform">
        <Icon size={20} />
      </div>
      <span className="text-[10px] font-bold text-brand-off-muted uppercase tracking-widest">Real-time</span>
    </div>
    <div className="space-y-1">
      <p className="text-brand-off-body text-xs font-medium uppercase tracking-wide">{label}</p>
      <p className="text-3xl font-bold text-brand-off-ink tracking-tight font-mono">{value}</p>
      <p className="text-xs text-brand-off-primary font-medium">{subValue}</p>
    </div>
  </div>
);

const IntelligenceConsole: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const storeVersion = useOfficerStoreVersion();
  const demoReportList = getOfficerReports().map(normalizeMapReport).filter((report): report is MapWeatherReport => report !== null);
  const [liveReports, setLiveReports] = useState<MapWeatherReport[]>([]);
  const [filter, setFilter] = useState('ALL');
  const kpis = getMockKPIs(getOfficerReports());
  const sampleIds = new Set(demoReportList.map(report => report.id));
  const topReports = [...liveReports.filter(report => !sampleIds.has(report.id)), ...demoReportList];

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 150);
    return () => window.clearTimeout(timeoutId);
  }, [theme]);

  useEffect(() => {
    let active = true;
    const loadReports = async () => {
      try {
        const reportsData = await reportApi.getAdmin();
        if (!Array.isArray(reportsData)) {
          throw new Error('Reports API returned an invalid response.');
        }
        const liveReports = reportsData
          .map(normalizeMapReport)
          .filter((report): report is MapWeatherReport => report !== null);
        if (active) {
          setLiveReports(liveReports);
        }
      } catch (e) {
        console.error("Error loading intelligence data", e);
      }
    };
    loadReports();

    let socket: WebSocket | null = null;
    try {
      socket = createLiveFeedSocket();
      socket.onmessage = (event) => {
        try {
          const message: unknown = JSON.parse(event.data);
          const payload = typeof message === 'object' && message !== null && 'data' in message
            ? (message as { data: unknown }).data
            : message;
          const report = normalizeMapReport(payload);
          if (report) {
            setLiveReports(prev => [report, ...prev.filter(item => item.id !== report.id)]);
          }
        } catch (error) {
          console.error('Could not read live report update', error);
        }
      };
    } catch (error) {
      console.error('Could not connect to live report feed', error);
    }
    return () => {
      active = false;
      socket?.close();
    };
  }, []);
  void storeVersion;

  return (
    <div className="space-y-8">
      {/* Top KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
        <KPICard
          label="Total Ingested Reports"
          value={kpis?.totalReports || 0}
          subValue="National aggregate"
          icon={LayoutDashboard}
        />
        <KPICard
          label="Verified"
          value={kpis?.verifiedReports || 0}
          subValue={`AI trust index: ${kpis?.systemTrustIndex || 0}%`}
          icon={ShieldCheck}
        />
        <KPICard
          label="Likely"
          value={kpis.likelyReports}
          subValue="Requires confirmation"
          icon={BrainCircuit}
        />
        <KPICard
          label="Unverified"
          value={kpis.unverifiedReports}
          subValue="Awaiting analyst review"
          icon={Clock}
        />
        <KPICard
          label="Flagged"
          value={kpis.flaggedReports}
          subValue="Requires analyst review"
          icon={Clock}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Intelligence Map */}
        <div className="xl:col-span-2 relative h-[600px] overflow-hidden rounded-3xl border border-brand-off-hairline bg-brand-off-surface shadow-2xl">
          <div className="absolute left-6 top-6 z-[1000] flex gap-3">
            <div className="bg-brand-off-surface/80 backdrop-blur-md p-3 rounded-xl border border-brand-off-hairline text-xs text-brand-off-ink flex items-center gap-4 shadow-lg">
              <span className="text-brand-off-muted font-bold uppercase tracking-tighter">Filter:</span>
              <select
                className="bg-transparent outline-none text-brand-off-primary font-medium"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option className="bg-brand-off-surface" value="ALL">All statuses</option>
                <option className="bg-brand-off-surface" value="VERIFIED">VERIFIED</option>
                <option className="bg-brand-off-surface" value="LIKELY">LIKELY</option>
                <option className="bg-brand-off-surface" value="UNVERIFIED">UNVERIFIED</option>
                <option className="bg-brand-off-surface" value="FLAGGED">FLAGGED</option>
              </select>
            </div>
          </div>
          <div className="relative z-0 h-full w-full overflow-hidden" style={{ height: '100%', width: '100%', minHeight: '400px' }}>
            <PublicTrustMap isDarkTheme={theme === 'dark'} isOfficer statusFilter={filter} />
          </div>
        </div>

        {/* Right Intelligence Panel */}
        <div className="space-y-6">
          <div className="bg-brand-off-surface border border-brand-off-hairline rounded-3xl p-6 shadow-xl">
            <h3 className="text-xs font-bold text-brand-off-muted uppercase tracking-widest mb-6 flex items-center gap-2">
              <BrainCircuit size={14} className="text-brand-off-primary" />
              Live Ingestion Feed
            </h3>
            <div className="max-h-[540px] space-y-4 overflow-y-auto pr-1">
              {topReports
                .filter(report => filter === 'ALL' || report.status === filter)
                .map(report => (
                <div key={report.id} className="p-4 bg-brand-off-surface-card/30 rounded-2xl border border-brand-off-hairline hover:border-brand-off-primary/50 transition-all group cursor-pointer"
                     onClick={() => navigate(`/officer/verification?id=${report.id}`)}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-brand-off-ink">{report.category.replaceAll('_', ' ')}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      report.status === 'VERIFIED' ? 'bg-emerald-500/20 text-emerald-400' :
                      report.status === 'LIKELY' ? 'bg-amber-500/20 text-amber-400' :
                      report.status === 'UNVERIFIED' ? 'bg-sky-500/20 text-sky-400' :
                      'bg-rose-500/20 text-rose-400'
                    }`}>
                      {report.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-[10px] text-brand-off-body">
                      {[report.city, report.state].filter(Boolean).join(', ')}
                    </span>
                    <span className="text-xs font-bold text-brand-off-primary">{Math.round(report.aiConfidence * 100)}% Confidence</span>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-brand-off-body">{report.description}</p>
                </div>
              ))}
              {topReports.filter(report => filter === 'ALL' || report.status === filter).length === 0 && (
                <p className="py-8 text-center text-xs text-brand-off-muted">No reports match this status.</p>
              )}
            </div>
            <button
              onClick={() => navigate('/officer/explorer')}
              className="w-full mt-6 py-3 bg-brand-off-surface-card/20 hover:bg-brand-off-surface-card/40 text-brand-off-body text-xs font-bold rounded-xl transition-all border border-brand-off-hairline"
            >
              Explore All AI Insights
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntelligenceConsole;
