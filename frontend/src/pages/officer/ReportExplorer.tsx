import React, { useState, useEffect, useCallback } from 'react';
import { reportApi } from '../../api/client';
import { WeatherReport } from '../../types';
import { mockReports } from '../../data/mockReports';
import { getOfficerReports, useOfficerStoreVersion } from '../../data/officerStore';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  ArrowRight
} from 'lucide-react';

interface FilterState {
  status: string;
  phenomenon: string;
  search: string;
}

const mockToWeatherReport = (report: typeof mockReports[number]): WeatherReport => {
  const phenomena = {
    RAINFALL: 'Rain',
    FLOODING: 'Flood',
    THUNDERSTORM: 'Storm',
    HEATWAVE: 'Heatwave',
    FOG: 'Fog',
    HIGH_WINDS: 'Wind',
    DUST_STORM: 'Other',
  } as const;
  const statuses = {
    VERIFIED: 'VERIFIED',
    LIKELY: 'LIKELY',
    UNVERIFIED: 'UNVERIFIED',
    FLAGGED: 'FLAGGED',
  } as const;
  return {
    id: report.id,
    phenomenon: phenomena[report.category],
    location: { lat: report.lat, lng: report.lng, city: report.city, state: report.state },
    description: report.description,
    timestamp: report.timestamp,
    status: statuses[report.status],
    trustScore: report.ai_confidence,
    aiConfidence: report.ai_confidence * 100,
    source: report.source === 'IMD_TELEMETRY' ? 'official' : 'citizen',
    media: report.media_url ? [report.media_url] : [],
  };
};

const ReportExplorer: React.FC = () => {
  const navigate = useNavigate();
  const storeVersion = useOfficerStoreVersion();
  const [reports, setReports] = useState<WeatherReport[]>(getOfficerReports().map(mockToWeatherReport));
  const [filters, setFilters] = useState<FilterState>({
    status: 'all',
    phenomenon: 'all',
    search: '',
  });
  const [loading, setLoading] = useState(false);

  const fetchReports = useCallback(async () => {
    try {
      // Pass filters to the backend for server-side filtering
      const params: Record<string, string> = {};
      if (filters.status !== 'all') params.status = filters.status;
      if (filters.phenomenon !== 'all') params.phenomenon = filters.phenomenon;

      const data = await reportApi.getAdmin(params);
      if (!Array.isArray(data)) {
        throw new Error('Reports API returned an invalid response.');
      }
      if (data.length > 0) {
        const demoReports = getOfficerReports().map(mockToWeatherReport);
        const demoById = new Map(demoReports.map(report => [String(report.id), report]));
        const merged = data.map((report: WeatherReport) => demoById.get(String(report.id)) ?? report);
        const liveIds = new Set(merged.map((report: WeatherReport) => String(report.id)));
        setReports([...merged, ...demoReports.filter(report => !liveIds.has(String(report.id)))]);
      } else {
        setReports(getOfficerReports().map(mockToWeatherReport));
      }
    } catch (e) {
      console.error("Error fetching admin reports", e);
      setReports(getOfficerReports().map(mockToWeatherReport));
    } finally {
      setLoading(false);
    }
  }, [filters.status, filters.phenomenon]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const sampleReports = getOfficerReports().map(mockToWeatherReport);
  const sampleById = new Map(sampleReports.map(report => [String(report.id), report]));
  const mergedReports = reports.map(report => sampleById.get(String(report.id)) ?? report);
  const mergedIds = new Set(mergedReports.map(report => String(report.id)));
  const displayedReports = [...mergedReports, ...sampleReports.filter(report => !mergedIds.has(String(report.id)))];
  void storeVersion;

  // Keep all filters responsive when the fallback data is in use.
  const filteredReports = displayedReports.filter(report => {
    const query = filters.search.toLowerCase().trim();
    const matchesSearch = !query || [
      report.id,
      report.phenomenon,
      report.location.city,
      report.location.state,
      `${report.location.lat}, ${report.location.lng}`,
    ].some(value => value?.toLowerCase().includes(query));
    const matchesStatus = filters.status === 'all' || report.status.toUpperCase() === filters.status.toUpperCase();
    const matchesPhenomenon = filters.phenomenon === 'all'
      || report.phenomenon.toLowerCase().includes(filters.phenomenon);
    return matchesSearch && matchesStatus && matchesPhenomenon;
  });

  return (
    <div className="space-y-6">
      {/* Filters Header */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input
              type="text"
              placeholder="Search ID or City..."
              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs pl-9 pr-4 py-2 rounded-lg outline-none focus:ring-1 focus:ring-cyan-500 transition-all w-64"
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={16} className="text-slate-500" />
            <select
              className="bg-slate-800 border border-slate-700 text-slate-300 text-xs py-2 px-3 rounded-lg outline-none focus:ring-1 focus:ring-cyan-500"
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
            >
              <option value="all">All Statuses</option>
              <option value="VERIFIED">VERIFIED</option>
              <option value="LIKELY">LIKELY</option>
              <option value="UNVERIFIED">UNVERIFIED</option>
              <option value="FLAGGED">FLAGGED</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <select
              className="bg-slate-800 border border-slate-700 text-slate-300 text-xs py-2 px-3 rounded-lg outline-none focus:ring-1 focus:ring-cyan-500"
              value={filters.phenomenon}
              onChange={(e) => setFilters({...filters, phenomenon: e.target.value})}
            >
              <option value="all">All Phenomena</option>
              <option value="rain">Heavy Rain</option>
              <option value="flood">Flooding</option>
              <option value="storm">Storm</option>
              <option value="heatwave">Heatwave</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing {filteredReports.length} of {displayedReports.length} reports
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 text-center text-slate-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto mb-4"></div>
            <p className="text-sm">Querying intelligence database...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/50 text-slate-400 text-[10px] uppercase tracking-widest font-bold">
                  <th className="px-6 py-4 border-b border-slate-800">Report ID</th>
                  <th className="px-6 py-4 border-b border-slate-800">Event</th>
                  <th className="px-6 py-4 border-b border-slate-800">Location</th>
                  <th className="px-6 py-4 border-b border-slate-800">Source</th>
                  <th className="px-6 py-4 border-b border-slate-800">AI Confidence</th>
                  <th className="px-6 py-4 border-b border-slate-800">Status</th>
                  <th className="px-6 py-4 border-b border-slate-800 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4 text-xs font-bold text-white">{report.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-300">{report.phenomenon}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {[report.location.city, report.location.state].filter(Boolean).join(', ') || `${report.location.lat.toFixed(3)}, ${report.location.lng.toFixed(3)}`}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 capitalize">
                        {report.source}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-cyan-500"
                            style={{ width: `${report.aiConfidence}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-400">{Math.floor(report.aiConfidence)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        report.status.toUpperCase() === 'VERIFIED' ? 'bg-emerald-500/10 text-emerald-400' :
                        ['LIKELY', 'LIKELY_GENUINE', 'UNDER_REVIEW'].includes(report.status.toUpperCase()) ? 'bg-amber-500/10 text-amber-400' :
                        ['UNVERIFIED', 'SUBMITTED', 'AI_ANALYSIS'].includes(report.status.toUpperCase()) ? 'bg-sky-500/10 text-sky-400' :
                        'bg-rose-500/10 text-rose-400'
                      }`}>
                        {report.status.toUpperCase() === 'LIKELY_GENUINE' ? 'LIKELY' : report.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => navigate(`/officer/verification?id=${report.id}`)}
                        aria-label={`Review report ${report.id}`}
                        className="p-2 text-slate-500 hover:text-cyan-400 transition-colors"
                      >
                        <ArrowRight size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {reports.length === 0 && !loading && (
          <div className="py-20 text-center text-slate-500">
            <Search size={40} className="mx-auto mb-4 opacity-20" />
            <p className="text-sm">No reports found in the intelligence database.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportExplorer;
