import React from 'react';
import { Activity, Bot, Camera, CloudRain, Database, Globe, MessageCircle, RadioTower, Smartphone } from 'lucide-react';
import { getOfficerReports, useOfficerStoreVersion } from '../../data/officerStore';

const streams = [
  { name: 'Citizen Mobile Portal', detail: 'Direct API · structured reports and location pins', icon: Smartphone },
  { name: 'X / Twitter stream', detail: 'Keyword watch · #IndiaRain · #FloodAlert', icon: Globe },
  { name: 'Instagram / Facebook vision', detail: 'Image OCR · perceptual hash duplicate checks', icon: Camera },
  { name: 'WhatsApp disaster helpline', detail: 'Message intake · automated location parsing', icon: MessageCircle },
  { name: 'Official IMD telemetry', detail: 'Weather station observations · Doppler radar', icon: RadioTower },
];

const pipeline = [
  'Raw social post',
  'Spatial NLP & geocoding',
  'EXIF & photo-hash checks',
  'IMD station cross-reference',
  'Confidence score',
  'Status assignment',
];

const DataSources: React.FC = () => {
  const storeVersion = useOfficerStoreVersion();
  const reports = getOfficerReports();
  void storeVersion;

  return (
   <section className="space-y-7">
    <header>
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-off-muted">Ingestion control · prototype view</p>
      <h2 className="mt-1 text-2xl font-bold text-brand-off-ink">Data sources &amp; ingestion streams</h2>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-brand-off-body">Connector cards and pipeline stages illustrate the platform workflow. These integrations are demonstration states, not live third-party connections.</p>
    </header>

    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
      {streams.map((stream, index) => (
        <article key={stream.name} className="relative overflow-hidden rounded-2xl border border-brand-off-hairline bg-brand-off-surface p-5 transition hover:border-brand-off-primary/50">
          <div className="absolute inset-y-0 left-0 w-1 bg-emerald-500/80" />
          <div className="flex items-start justify-between gap-4">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-off-primary/10 text-brand-off-primary"><stream.icon size={20} /></span>
            <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2 py-1 text-[9px] font-black tracking-widest text-emerald-400"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> ACTIVE · DEMO</span>
          </div>
          <h3 className="mt-4 text-sm font-bold text-brand-off-ink">{stream.name}</h3>
          <p className="mt-1 min-h-9 text-xs leading-relaxed text-brand-off-body">{stream.detail}</p>
          <div className="mt-4 flex items-center justify-between border-t border-brand-off-hairline pt-3 text-[9px] font-bold uppercase tracking-wider text-brand-off-muted">
            <span>{index < 1 ? 'Sample channel' : 'Simulated connector'}</span>
            <span className="inline-flex items-center gap-1"><Activity size={12} /> Ready</span>
          </div>
        </article>
      ))}
    </div>

    <article className="overflow-hidden rounded-3xl border border-brand-off-hairline bg-brand-off-surface">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-brand-off-hairline p-5">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-bold text-brand-off-ink"><Bot size={17} className="text-brand-off-primary" /> AI processing pipeline</h3>
          <p className="mt-1 text-xs text-brand-off-body">Illustrative report processing sequence</p>
        </div>
        <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wider text-amber-300">Workflow simulation</span>
      </div>
      <ol className="grid grid-cols-1 gap-2 p-5 sm:grid-cols-2 xl:grid-cols-6">
        {pipeline.map((step, index) => (
          <li key={step} className="relative flex min-h-24 flex-col justify-between rounded-xl border border-brand-off-hairline bg-brand-off-canvas/70 p-3">
            <span className="font-mono text-[9px] font-bold text-brand-off-primary">STAGE 0{index + 1}</span>
            <span className="mt-3 text-xs font-semibold leading-relaxed text-brand-off-ink">{step}</span>
            {index < pipeline.length - 1 && <span aria-hidden="true" className="absolute -right-2 top-1/2 z-10 hidden h-4 w-4 -translate-y-1/2 rotate-45 border-r border-t border-brand-off-primary/60 bg-brand-off-surface xl:block" />}
          </li>
        ))}
      </ol>
    </article>

    <article className="overflow-hidden rounded-3xl border border-brand-off-hairline bg-brand-off-surface">
      <div className="flex items-center justify-between border-b border-brand-off-hairline p-5">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-bold text-brand-off-ink"><Database size={17} className="text-brand-off-primary" /> Ingestion telemetry</h3>
          <p className="mt-1 text-xs text-brand-off-body">Latest stored reports · {reports.length} local records</p>
        </div>
        <CloudRain size={19} className="text-brand-off-muted" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left">
          <thead className="bg-brand-off-canvas/80 text-[9px] font-bold uppercase tracking-widest text-brand-off-muted">
            <tr>
              <th className="px-5 py-3">Reference</th><th className="px-5 py-3">Raw report</th><th className="px-5 py-3">Source</th><th className="px-5 py-3">Region</th><th className="px-5 py-3">Confidence</th><th className="px-5 py-3">Assigned status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-off-hairline">
            {reports.slice(0, 12).map(report => (
              <tr key={report.id} className="text-xs text-brand-off-body hover:bg-brand-off-canvas/40">
                <td className="whitespace-nowrap px-5 py-3 font-mono font-bold text-brand-off-ink">{report.id}</td>
                <td className="max-w-sm px-5 py-3"><span className="font-semibold text-brand-off-ink">{report.category.replaceAll('_', ' ')}</span><span className="ml-2 text-[10px]">{report.description}</span></td>
                <td className="whitespace-nowrap px-5 py-3">{report.source === 'SOCIAL_MEDIA' ? <Globe size={14} /> : report.source === 'IMD_TELEMETRY' ? <RadioTower size={14} /> : <Smartphone size={14} />}</td>
                <td className="whitespace-nowrap px-5 py-3">{report.city}</td>
                <td className="whitespace-nowrap px-5 py-3 font-mono tabular-nums">{Math.round(report.ai_confidence * 100)}%</td>
                <td className="whitespace-nowrap px-5 py-3"><span className="rounded-md bg-brand-off-primary/10 px-2 py-1 text-[9px] font-bold text-brand-off-primary">{report.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-brand-off-hairline px-5 py-3 text-[10px] text-brand-off-muted"><Globe size={12} className="mr-1 inline" />Connector availability and telemetry values are illustrative; no social-platform feed is connected.</div>
    </article>
   </section>
  );
};

export default DataSources;
