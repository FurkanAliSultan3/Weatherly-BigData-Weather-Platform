import React, { useState, useEffect } from 'react';
import { reportApi } from '../../api/client';
import { useSearchParams } from 'react-router-dom';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  ArrowLeft,
  FileText,
  Zap,
  BrainCircuit
} from 'lucide-react';
import { mockReports } from '../../data/mockReports';
import {
  appendAuditEvent,
  getOfficerReport,
  getOfficerReports,
  updateOfficerReportStatus,
  useOfficerStoreVersion,
} from '../../data/officerStore';
import type { MockReportStatus } from '../../data/mockReports';

const toReviewReport = (mock: typeof mockReports[number]) => ({
  id: mock.id,
  phenomenon: mock.category,
  description: mock.description,
  location: { lat: mock.lat, lng: mock.lng, city: mock.city, state: mock.state },
  status: mock.status,
  aiConfidence: mock.ai_confidence * 100,
  timestamp: mock.timestamp,
  trustScore: mock.ai_confidence,
  source: mock.source,
  media: mock.media_url ? [mock.media_url] : [],
});

const formatTimestamp = (timestamp?: string) => {
  if (!timestamp) return 'Unknown time';
  const date = new Date(timestamp);
  return Number.isNaN(date.getTime()) ? timestamp : date.toLocaleString();
};

const EvidenceItem = ({ title, status, detail }: any) => {
  const statusColors = {
    success: 'text-emerald-400 bg-emerald-500/10',
    warning: 'text-amber-400 bg-amber-500/10',
    info: 'text-brand-off-primary bg-brand-off-primary/10',
    error: 'text-rose-400 bg-rose-500/10',
  };

  const icons = {
    success: <CheckCircle size={14} />,
    warning: <AlertTriangle size={14} />,
    info: <Info size={14} />,
    error: <XCircle size={14} />,
  };

  return (
    <div className="p-4 bg-brand-off-surface-card/30 rounded-2xl border border-brand-off-hairline hover:border-brand-off-primary/50 transition-all group">
      <div className="flex items-center gap-2 mb-2">
        <span className={`p-1 rounded-full ${statusColors[status as keyof typeof statusColors]}`}>
          {icons[status as keyof typeof icons]}
        </span>
        <span className="text-xs font-bold text-brand-off-ink">{title}</span>
      </div>
      <p className="text-xs text-brand-off-body leading-relaxed group-hover:text-brand-off-ink transition-colors">{detail}</p>
    </div>
  );
};

const VerificationCenter: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const storeVersion = useOfficerStoreVersion();
  const selectedReportId = searchParams.get('id');
  const [report, setReport] = useState<any | null>(null);
  const [loadedReportId, setLoadedReportId] = useState<string | null>(null);
  const loading = selectedReportId !== null && loadedReportId !== selectedReportId;
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!selectedReportId) {
      const reports = getOfficerReports();
      const nextReport = reports.find(item => item.status === 'UNVERIFIED')
        ?? reports.find(item => item.status === 'LIKELY');
      if (nextReport) setSearchParams({ id: nextReport.id }, { replace: true });
      return;
    }

    const sample = getOfficerReport(selectedReportId);
    if (sample) {
      setReport(toReviewReport(sample));
      setError('');
      setLoadedReportId(selectedReportId);
      return;
    }

    let active = true;
    reportApi.getAdmin()
      .then((allReports: any[]) => {
        const found = Array.isArray(allReports) ? allReports.find(item => item.id === selectedReportId) : null;
        if (active) {
          setReport(found ?? null);
          setError(found ? '' : 'This report was not found.');
          setLoadedReportId(selectedReportId);
        }
      })
      .catch(requestError => {
        console.error('Could not load selected report', requestError);
        if (active) {
          setReport(null);
          setError('This report was not found.');
          setLoadedReportId(selectedReportId);
        }
      });
    return () => { active = false; };
  }, [selectedReportId, setSearchParams, storeVersion]);

  const handleVerify = async (status: MockReportStatus) => {
    if (!report) return;
    setActionLoading(true);
    setError('');
    const localReport = updateOfficerReportStatus(String(report.id), status);
    if (localReport) {
      const confidence = typeof report.aiConfidence === 'number'
        ? Math.round(report.aiConfidence)
        : Math.round(localReport.ai_confidence * 100);
      appendAuditEvent({
        actor: 'Officer Priya',
        action: status === 'VERIFIED' ? 'Verified Report' : status === 'FLAGGED' ? 'Flagged Report' : 'Marked Likely',
        referenceId: String(report.id),
        details: `Report #${report.id} ${status === 'VERIFIED' ? 'verified' : status === 'FLAGGED' ? 'flagged as suspicious' : 'marked as likely'} by Officer Priya. AI Confidence: ${confidence}%.`,
      });
      setReport(toReviewReport(localReport));
      setActionLoading(false);
      return;
    }
    try {
      await reportApi.verify(report.id, status, 'Reviewed by Officer Priya via Intelligence Console');
      const allReports = await reportApi.getAdmin();
      const updated = Array.isArray(allReports) ? allReports.find((item: any) => item.id === report.id) : null;
      if (updated) setReport(updated);
      appendAuditEvent({
        actor: 'Officer Priya',
        action: status === 'VERIFIED' ? 'Verified Report' : status === 'FLAGGED' ? 'Flagged Report' : 'Marked Likely',
        referenceId: String(report.id),
        details: `Report #${report.id} status updated to ${status} by Officer Priya.`,
      });
      setError('');
    } catch (e) {
      console.error('Verification failed', e);
      setError('The review action failed. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  if (error && !report && !loading) {
    return <p role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</p>;
  }

  if (loading || !report) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-off-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSearchParams({})}
          className="p-2 bg-brand-off-surface border border-brand-off-hairline rounded-xl text-brand-off-body hover:text-brand-off-ink transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-brand-off-ink tracking-tight">Verification Center</h1>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <p className="text-xs text-brand-off-muted uppercase tracking-widest font-mono">Case ID: {report.id}</p>
            <span className={`rounded-md px-2 py-1 text-[9px] font-black uppercase tracking-wider ${
              String(report.status).toUpperCase() === 'VERIFIED' ? 'bg-emerald-500/10 text-emerald-400'
              : String(report.status).toUpperCase() === 'LIKELY' ? 'bg-amber-500/10 text-amber-300'
              : String(report.status).toUpperCase() === 'UNVERIFIED' ? 'bg-sky-500/10 text-sky-300'
              : 'bg-rose-500/10 text-rose-300'
            }`}>{String(report.status).replaceAll('_', ' ')}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {error && <p role="alert" className="lg:col-span-3 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</p>}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-brand-off-surface border border-brand-off-hairline rounded-3xl p-6 shadow-xl transition-all hover:border-brand-off-primary/30">
            <h3 className="text-xs font-bold text-brand-off-muted uppercase tracking-widest mb-6 flex items-center gap-2">
              <FileText size={14} className="text-brand-off-primary" />
              Submission Details
            </h3>
            <div className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] text-brand-off-muted uppercase font-bold">Phenomenon</label>
                <p className="text-brand-off-ink font-medium">{report.phenomenon}</p>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-brand-off-muted uppercase font-bold">Location</label>
                <p className="text-brand-off-ink font-medium">
                  {[report.location?.city, report.location?.state].filter(Boolean).join(', ') || `${report.location?.lat.toFixed(4)}, ${report.location?.lng.toFixed(4)}`}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-brand-off-muted uppercase font-bold">Citizen Observation</label>
                <p className="text-brand-off-body text-sm italic leading-relaxed">"{report.description}"</p>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-brand-off-muted uppercase font-bold">Timestamp</label>
                <p className="text-brand-off-body text-xs font-mono">{formatTimestamp(report.timestamp)}</p>
              </div>
            </div>
          </div>

          <div className="bg-brand-off-surface border border-brand-off-hairline rounded-3xl p-6 shadow-xl transition-all hover:border-brand-off-primary/30">
            <h3 className="text-xs font-bold text-brand-off-muted uppercase tracking-widest mb-6 flex items-center gap-2">
              <Zap size={14} className="text-brand-off-primary" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => handleVerify('VERIFIED')}
                disabled={actionLoading}
                className="flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20"
              >
                <CheckCircle size={16} />
                Verify Report
              </button>
              <button
                onClick={() => handleVerify('LIKELY')}
                disabled={actionLoading}
                className="flex items-center justify-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 py-3 text-xs font-bold text-amber-300 transition-all hover:bg-amber-500/20 disabled:opacity-50"
              >
                <ShieldCheck size={16} />
                Mark as Likely
              </button>
              <button
                onClick={() => handleVerify('FLAGGED')}
                disabled={actionLoading}
                className="flex items-center justify-center gap-2 py-3 bg-brand-off-surface-card/20 hover:bg-brand-off-surface-card/40 disabled:opacity-50 text-brand-off-body text-xs font-bold rounded-xl transition-all border border-brand-off-hairline"
              >
                <AlertTriangle size={16} />
                Flag as Suspicious
              </button>
              <button
                onClick={() => handleVerify('FLAGGED')}
                disabled={actionLoading}
                className="flex items-center justify-center gap-2 py-3 bg-rose-500/10 hover:bg-rose-500/20 disabled:opacity-50 text-rose-500 text-xs font-bold rounded-xl transition-all border border-rose-500/20"
              >
                <XCircle size={16} />
                Discard Case
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-brand-off-surface border border-brand-off-hairline rounded-3xl p-8 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6">
              <div className="text-right">
                <span className="text-[10px] text-brand-off-muted uppercase font-bold block mb-1">Current trust score</span>
                <span className="text-4xl font-black text-brand-off-primary tracking-tighter font-mono">{Math.floor(report.aiConfidence || 0)}%</span>
              </div>
            </div>

            <h3 className="text-xs font-bold text-brand-off-muted uppercase tracking-widest mb-8 flex items-center gap-2">
              <BrainCircuit size={14} className="text-brand-off-primary" />
              Verification Intelligence Evidence
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <EvidenceItem
                  title="Meteorological correlation"
                  status="info"
                  detail="Official station data is not connected. Check against approved sources before verifying."
                />
                <EvidenceItem
                  title="Source reliability"
                  status="warning"
                  detail="Lacks a history of reliable reporting; anonymous citizen source."
                />
                <EvidenceItem
                  title="Location consistency"
                  status="info"
                  detail="Coordinates are stored, but no address is available for cross-checking."
                />
              </div>
              <div className="space-y-4">
                <EvidenceItem
                  title="Satellite imagery"
                  status="info"
                  detail="A satellite imagery feed is not connected."
                />
                <EvidenceItem
                  title="Duplicate detection"
                  status="info"
                  detail="Spatial duplicate clustering is not implemented yet."
                />
                <EvidenceItem
                  title="Historical patterns"
                  status="info"
                  detail="Historical weather observations are not connected."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationCenter;
