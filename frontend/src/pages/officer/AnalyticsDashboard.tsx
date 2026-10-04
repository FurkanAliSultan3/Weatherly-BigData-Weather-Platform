import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { Activity, MapPin, PieChart as PieChartIcon, ShieldCheck, Download } from 'lucide-react';
import { getMockChartData, getMockKPIs } from '../../data/mockReports';
import { getOfficerReports, useOfficerStoreVersion } from '../../data/officerStore';

const AnalyticsDashboard: React.FC = () => {
  const storeVersion = useOfficerStoreVersion();
  const reports = getOfficerReports();
  const chartData = getMockChartData(reports);
  void storeVersion;
  const kpis = getMockKPIs(reports);

  const phenomenonData = chartData.byPhenomenon;
  const statusData = chartData.byStatus;
  const timeSeriesData = chartData.timeline;

  const COLORS = ['#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'];

  const exportCsv = () => {
    const rows = [
      ['section', 'name', 'value'],
      ...phenomenonData.map(item => ['phenomenon', item.name, item.value]),
      ...statusData.map(item => ['status', item.name, item.value]),
      ...timeSeriesData.map(item => ['day', item.day, item.reports]),
    ];
    const csv = rows.map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\r\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    link.download = 'weatherly-analytics.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Intelligence Analytics</h1>
          <p className="text-slate-400 text-sm">National weather event distribution and system performance.</p>
        </div>
        <div className="text-xs text-slate-400">
          <span>Latest 7 days</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: 'Total ingested', value: kpis.totalReports },
          { label: 'Verified', value: kpis.verifiedReports },
          { label: 'Likely', value: kpis.likelyReports },
          { label: 'Unverified', value: kpis.unverifiedReports },
          { label: 'Flagged', value: kpis.flaggedReports },
        ].map(metric => (
          <div key={metric.label} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{metric.label}</p>
            <p className="mt-2 font-mono text-3xl font-bold text-white">{metric.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Report Volume Trend */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-cyan-400" />
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest">Report Volume Trend</h3>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#22d3ee' }}
                />
                <Legend verticalAlign="top" align="right" height={36} />
                <Line type="monotone" dataKey="reports" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4, fill: '#06b6d4' }} activeDot={{ r: 6 }} name="Total Reports" />
                <Line type="monotone" dataKey="verified" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} name="Verified" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribution by Phenomenon */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-6">
            <PieChartIcon size={18} className="text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest">Event Distribution</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={phenomenonData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {phenomenonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {phenomenonData.slice(0, 4).map((item, i) => (
              <div key={item.name} className="flex items-center gap-2 text-[10px] text-slate-400">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                {item.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Verification Status Analysis */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-6">
            <ShieldCheck size={18} className="text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest">Verification Funnel</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#fff' }}
                />
                <Bar dataKey="value" fill="#06b6d4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Verification totals */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-6">
            <MapPin size={18} className="text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest">Reports by status</h3>
          </div>
          <div className="space-y-4">
            {statusData.map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium capitalize">{item.name.replaceAll('_', ' ')}</span>
                  <span className="text-slate-500">{item.value} reports</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 rounded-full"
                    style={{ width: `${Math.max(...statusData.map(status => status.value), 1) ? item.value / Math.max(...statusData.map(status => status.value), 1) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
            <div className="pt-6 flex items-center justify-between text-xs text-slate-500 italic">
              <span>Aggregated from stored reports</span>
              <button onClick={exportCsv} className="inline-flex items-center gap-1 text-cyan-400 hover:underline">
                <Download size={14} /> Export CSV
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
