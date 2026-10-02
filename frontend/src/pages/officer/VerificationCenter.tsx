import React, { useState } from 'react';
import { mockReports, WeatherReport } from '../../services/mockData';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Search,
  ArrowLeft,
  FileText,
  Zap
} from 'lucide-react';

const VerificationCenter: React.FC = () => {
  const [selectedReportId, setSelectedReportId] = useState<string | null>(mockReports[0].id);

  const report = mockReports.find(r => r.id === selectedReportId);

  if (!report) return <div className="text-white">Report not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-white">Verification Center</h1>
          <p className="text-xs text-slate-500 uppercase tracking-widest">Case ID: {report.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Report Details Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <FileText size={14} />
              Submission Details
            </h3>
            <div className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 uppercase font-bold">Phenomenon</label>
                <p className="text-white font-medium">{report.phenomenon}</p>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 uppercase font-bold">Location</label>
                <p className="text-white font-medium">{report.location.city}, {report.location.state}</p>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 uppercase font-bold">Citizen Observation</label>
                <p className="text-slate-300 text-sm italic leading-relaxed">"{report.description}"</p>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 uppercase font-bold">Timestamp</label>
                <p className="text-slate-300 text-xs font-mono">{new Date(report.timestamp).toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Zap size={14} className="text-cyan-400" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <button className="flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-all">
                <CheckCircle size={16} />
                Verify Report
              </button>
              <button className="flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all border border-slate-700">
                <AlertTriangle size={16} />
                Flag Suspicious
              </button>
              <button className="flex items-center justify-center gap-2 py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-xs font-bold rounded-xl transition-all border border-rose-500/20">
                <XCircle size={16} />
                Discard Case
              </button>
            </div>
          </div>
        </div>

        {/* AI Verification Intelligence Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6">
              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">AI Confidence</span>
                <span className="text-4xl font-black text-cyan-400 tracking-tighter">{Math.floor(report.aiConfidence)}%</span>
              </div>
            </div>

            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-8 flex items-center gap-2">
              <BrainCircuit size={14} className="text-cyan-400" />
              Verification Intelligence Evidence
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <EvidenceItem
                  title="Meteorological Correlation"
                  status="success"
                  detail="Matches IMD rainfall data for East Delhi sector 4."
                />
                <EvidenceItem
                  title="Source Reliability"
                  status="warning"
                  detail="Citizen report history: 3 verified, 1 flagged."
                />
                <EvidenceItem
                  title="Location Consistency"
                  status="success"
                  detail="GPS coordinates match submitted address."
                />
              </div>
              <div className="space-y-4">
                <EvidenceItem
                  title="Satellite Imagery"
                  status="success"
                  detail="Cloud-top temperature consistent with storm cell."
                />
                <EvidenceItem
                  title="Duplicate Detection"
                  status="info"
                  detail="4 other reports in 2km radius. Clustering confirmed."
                />
                <EvidenceItem
                  title="Historical Patterns"
                  status="success"
                  detail="Typical monsoon pattern for this region in October."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EvidenceItem = ({ title, status, detail }: any) => {
  const statusColors = {
    success: 'text-emerald-400 bg-emerald-500/10',
    warning: 'text-amber-400 bg-amber-500/10',
    info: 'text-cyan-400 bg-cyan-500/10',
    error: 'text-rose-400 bg-rose-500/10',
  };

  const icons = {
    success: <CheckCircle size={14} />,
    warning: <AlertTriangle size={14} />,
    info: <Info size={14} />,
    error: <XCircle size={14} />,
  };

  return (
    <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700 hover:border-slate-600 transition-all">
      <div className="flex items-center gap-2 mb-2">
        <span className={`p-1 rounded-full ${statusColors[status as keyof typeof statusColors]}`}>
          {icons[status as keyof typeof icons]}
        </span>
        <span className="text-xs font-bold text-white">{title}</span>
      </div>
      <p className="text-xs text-slate-400 leading-relaxed">{detail}</p>
    </div>
  );
};

import { BrainCircuit } from 'lucide-react'; // Fixed import
