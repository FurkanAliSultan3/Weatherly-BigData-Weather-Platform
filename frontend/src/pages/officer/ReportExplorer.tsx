import React, { useState } from 'react';
import { mockReports, WeatherReport } from '../../services/mockData';
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  ChevronDown,
  ArrowRight
} from 'lucide-react';

interface FilterState {
  status: string;
  phenomenon: string;
  search: string;
}

const ReportExplorer: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    status: 'all',
    phenomenon: 'all',
    search: '',
  });

  const filteredReports = mockReports.filter(report => {
    const matchesStatus = filters.status === 'all' || report.status === filters.status;
    const matchesPhenomenon = filters.phenomenon === 'all' || report.phenomenon === filters.phenomenon;
    const matchesSearch = report.id.toLowerCase().includes(filters.search.toLowerCase()) ||
                         report.location.city?.toLowerCase().includes(filters.search.toLowerCase());
    return matchesStatus && matchesPhenomenon && matchesSearch;
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
              <option value="verified">Verified</option>
              <option value="under_review">Under Review</option>
              <option value="suspicious">Suspicious</option>
              <option value="flagged">Flagged</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <select
              className="bg-slate-800 border border-slate-700 text-slate-300 text-xs py-2 px-3 rounded-lg outline-none focus:ring-1 focus:ring-cyan-500"
              value={filters.phenomenon}
              onChange={(e) => setFilters({...filters, phenomenon: e.target.value})}
            >
              <option value="all">All Phenomena</option>
              <option value="Rain">Heavy Rain</option>
              <option value="Flood">Flooding</option>
              <option value="Storm">Storm</option>
              <option value="Heatwave">Heatwave</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing {filteredReports.length} of {mockReports.length} reports
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
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
                    {report.location.city}, {report.location.state}
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
                      report.status === 'verified' ? 'bg-green-500/10 text-green-400' :
                      report.status === 'under_review' ? 'bg-blue-500/10 text-blue-400' :
                      'bg-rose-500/10 text-rose-400'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-500 hover:text-cyan-400 transition-colors">
                      <ArrowRight size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredReports.length === 0 && (
          <div className="py-20 text-center text-slate-500">
            <Search size={40} className="mx-auto mb-4 opacity-20" />
            <p className="text-sm">No reports found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportExplorer;
