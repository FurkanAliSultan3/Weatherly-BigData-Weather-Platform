import React, { useState } from 'react';
import { BellRing, MapPin, Megaphone, RadioTower, ShieldCheck, Siren, XCircle } from 'lucide-react';
import {
  deactivateOfficerBroadcast,
  getOfficerBroadcasts,
  publishOfficerBroadcast,
  useOfficerStoreVersion,
} from '../../data/officerStore';

const regions = [
  { name: 'Delhi', city: 'Delhi', lat: 28.6139, lng: 77.2090 },
  { name: 'Mumbai', city: 'Mumbai', lat: 19.0760, lng: 72.8777 },
  { name: 'Odisha Coast', city: 'Puri', lat: 19.8135, lng: 85.8312 },
  { name: 'Chennai', city: 'Chennai', lat: 13.0827, lng: 80.2707 },
  { name: 'Kolkata', city: 'Kolkata', lat: 22.5726, lng: 88.3639 },
  { name: 'Bengaluru', city: 'Bengaluru', lat: 12.9716, lng: 77.5946 },
  { name: 'Hyderabad', city: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
  { name: 'Jaipur', city: 'Jaipur', lat: 26.9124, lng: 75.7873 },
  { name: 'Kochi', city: 'Kochi', lat: 9.9312, lng: 76.2673 },
  { name: 'Guwahati', city: 'Guwahati', lat: 26.1445, lng: 91.7362 },
];

const severityStyles = {
  CRITICAL: 'border-rose-500/40 bg-rose-500/10 text-rose-300',
  WARNING: 'border-orange-500/40 bg-orange-500/10 text-orange-300',
  WATCH: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
};

const BroadcastManagement: React.FC = () => {
  const version = useOfficerStoreVersion();
  const broadcasts = getOfficerBroadcasts();
  void version;
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'FLOOD' | 'CYCLONE' | 'HEATWAVE' | 'HIGH_WIND'>('FLOOD');
  const [severity, setSeverity] = useState<'CRITICAL' | 'WARNING' | 'WATCH'>('WARNING');
  const [regionName, setRegionName] = useState('Mumbai');
  const [radiusKm, setRadiusKm] = useState(10);
  const [shelterName, setShelterName] = useState('');
  const [capacity, setCapacity] = useState(100);
  const [shelterLat, setShelterLat] = useState('19.0218');
  const [shelterLng, setShelterLng] = useState('72.8502');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const publish = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const region = regions.find(item => item.name === regionName);
    const lat = Number(shelterLat);
    const lng = Number(shelterLng);
    if (!title.trim() || !region || !shelterName.trim() || !Number.isFinite(capacity) || capacity < 1 || !Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setError('Enter an advisory title, a shelter name, positive capacity, and valid latitude/longitude coordinates.');
      return;
    }
    const broadcast = publishOfficerBroadcast({
      title: title.trim(),
      category,
      severity,
      region: region.name,
      city: region.city,
      lat: region.lat,
      lng: region.lng,
      radiusKm,
      safeZone: { name: shelterName.trim(), capacity, lat, lng },
    });
    setError('');
    setNotice(`${broadcast.title} published to this browser’s citizen alert views.`);
    setTitle('');
    setShelterName('');
  };

  const activeCount = broadcasts.filter(broadcast => broadcast.active).length;

  return (
    <section className="space-y-7">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-off-muted">Public safety operations · prototype</p>
          <h2 className="mt-1 text-2xl font-bold text-brand-off-ink">Emergency broadcast center</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-brand-off-body">Create local demonstration advisories. Published notices appear on the public Alerts page in this browser; this prototype does not contact emergency services or issue official warnings.</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-amber-300"><RadioTower size={14} /> Local demo broadcast</span>
      </header>

      <div className="grid grid-cols-1 items-start gap-6 2xl:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
        <form onSubmit={publish} className="space-y-5 rounded-3xl border border-brand-off-hairline bg-brand-off-surface p-5 shadow-xl shadow-black/10 sm:p-7">
          <div className="flex items-center gap-3 border-b border-brand-off-hairline pb-4">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-off-primary/10 text-brand-off-primary"><Megaphone size={19} /></span>
            <div><h3 className="text-base font-bold text-brand-off-ink">Create new broadcast</h3><p className="text-xs text-brand-off-muted">Advisory and relief-location details</p></div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="space-y-2 sm:col-span-2"><span className="text-[10px] font-bold uppercase tracking-wider text-brand-off-muted">Advisory title</span><input required maxLength={100} value={title} onChange={event => setTitle(event.target.value)} placeholder="e.g. Coastal flooding preparedness notice" className="w-full rounded-xl border border-brand-off-hairline bg-brand-off-canvas px-4 py-3 text-sm text-brand-off-ink outline-none focus:border-brand-off-primary focus:ring-2 focus:ring-brand-off-primary/20" /></label>
            <label className="space-y-2"><span className="text-[10px] font-bold uppercase tracking-wider text-brand-off-muted">Disaster category</span><select value={category} onChange={event => setCategory(event.target.value as typeof category)} className="w-full rounded-xl border border-brand-off-hairline bg-brand-off-canvas px-4 py-3 text-sm text-brand-off-ink outline-none focus:ring-2 focus:ring-brand-off-primary/20"><option value="FLOOD">Flood</option><option value="CYCLONE">Cyclone</option><option value="HEATWAVE">Heatwave</option><option value="HIGH_WIND">High wind</option></select></label>
            <label className="space-y-2"><span className="text-[10px] font-bold uppercase tracking-wider text-brand-off-muted">Severity level</span><select value={severity} onChange={event => setSeverity(event.target.value as typeof severity)} className={`w-full rounded-xl border bg-brand-off-canvas px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-brand-off-primary/20 ${severityStyles[severity]}`}><option value="CRITICAL">CRITICAL · Red</option><option value="WARNING">WARNING · Orange</option><option value="WATCH">WATCH · Yellow</option></select></label>
            <label className="space-y-2 sm:col-span-2"><span className="text-[10px] font-bold uppercase tracking-wider text-brand-off-muted">Target region / city</span><select value={regionName} onChange={event => { setRegionName(event.target.value); const region = regions.find(item => item.name === event.target.value); if (region) { setShelterLat(String(region.lat)); setShelterLng(String(region.lng)); } }} className="w-full rounded-xl border border-brand-off-hairline bg-brand-off-canvas px-4 py-3 text-sm text-brand-off-ink outline-none focus:ring-2 focus:ring-brand-off-primary/20">{regions.map(region => <option key={region.name} value={region.name}>{region.name}</option>)}</select></label>
            <label className="space-y-2 sm:col-span-2"><span className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-brand-off-muted"><span>Affected radius</span><span className="font-mono text-brand-off-primary">{radiusKm} km</span></span><input type="range" min="1" max="100" value={radiusKm} onChange={event => setRadiusKm(Number(event.target.value))} className="w-full accent-amber-500" /><span className="flex justify-between text-[9px] text-brand-off-muted"><span>1 km</span><span>100 km</span></span></label>
          </div>

          <div className="rounded-2xl border border-brand-off-hairline bg-brand-off-canvas/60 p-4">
            <h4 className="flex items-center gap-2 text-xs font-bold text-brand-off-ink"><ShieldCheck size={15} className="text-emerald-400" /> Safe zone / relief center</h4>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="space-y-1.5 sm:col-span-2"><span className="text-[9px] font-bold uppercase tracking-wider text-brand-off-muted">Shelter name</span><input required value={shelterName} onChange={event => setShelterName(event.target.value)} placeholder="District relief centre" className="w-full rounded-lg border border-brand-off-hairline bg-brand-off-surface px-3 py-2.5 text-xs text-brand-off-ink outline-none focus:ring-2 focus:ring-brand-off-primary/20" /></label>
              <label className="space-y-1.5"><span className="text-[9px] font-bold uppercase tracking-wider text-brand-off-muted">Capacity</span><input type="number" min="1" max="100000" required value={capacity} onChange={event => setCapacity(Number(event.target.value))} className="w-full rounded-lg border border-brand-off-hairline bg-brand-off-surface px-3 py-2.5 text-xs text-brand-off-ink outline-none focus:ring-2 focus:ring-brand-off-primary/20" /></label>
              <label className="space-y-1.5"><span className="text-[9px] font-bold uppercase tracking-wider text-brand-off-muted">Shelter latitude</span><input type="number" step="any" required value={shelterLat} onChange={event => setShelterLat(event.target.value)} className="w-full rounded-lg border border-brand-off-hairline bg-brand-off-surface px-3 py-2.5 text-xs text-brand-off-ink outline-none focus:ring-2 focus:ring-brand-off-primary/20" /></label>
              <label className="space-y-1.5 sm:col-span-2"><span className="text-[9px] font-bold uppercase tracking-wider text-brand-off-muted">Shelter longitude</span><input type="number" step="any" required value={shelterLng} onChange={event => setShelterLng(event.target.value)} className="w-full rounded-lg border border-brand-off-hairline bg-brand-off-surface px-3 py-2.5 text-xs text-brand-off-ink outline-none focus:ring-2 focus:ring-brand-off-primary/20" /></label>
            </div>
          </div>

          {error && <p role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-200">{error}</p>}
          {notice && <p role="status" className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-200">{notice}</p>}
          <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-off-primary px-5 py-3.5 text-xs font-black text-brand-off-canvas transition hover:brightness-110 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-brand-off-primary focus:ring-offset-2 focus:ring-offset-brand-off-surface"><Siren size={16} /> Publish demonstration alert</button>
        </form>

        <section className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <div><h3 className="text-base font-bold text-brand-off-ink">Active broadcasts</h3><p className="mt-1 text-xs text-brand-off-muted">Public Alerts page · current browser</p></div>
            <span className="font-mono text-xs font-bold text-brand-off-primary">{activeCount} ACTIVE</span>
          </div>
          {activeCount === 0 && <div className="rounded-2xl border border-dashed border-brand-off-hairline p-8 text-center text-xs text-brand-off-muted">No active broadcasts. Publish an advisory to add a local demo notice.</div>}
          {broadcasts.map(broadcast => (
            <article key={broadcast.id} className={`rounded-2xl border bg-brand-off-surface p-5 ${broadcast.active ? 'border-brand-off-hairline' : 'border-brand-off-hairline opacity-60'}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg ${broadcast.severity === 'CRITICAL' ? 'bg-rose-500/10 text-rose-400' : broadcast.severity === 'WARNING' ? 'bg-orange-500/10 text-orange-400' : 'bg-amber-500/10 text-amber-300'}`}><BellRing size={17} /></span>
                  <div><span className={`rounded-md border px-2 py-1 text-[8px] font-black tracking-widest ${severityStyles[broadcast.severity]}`}>{broadcast.severity}</span><h4 className="mt-2 text-sm font-bold text-brand-off-ink">{broadcast.title}</h4><p className="mt-1 text-[10px] text-brand-off-body">{broadcast.category.replaceAll('_', ' ')} · {broadcast.region} · {broadcast.radiusKm} km</p></div>
                </div>
                {broadcast.active ? <button type="button" onClick={() => deactivateOfficerBroadcast(broadcast.id)} className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/30 px-3 py-2 text-[10px] font-bold text-rose-300 transition hover:bg-rose-500/10 focus:outline-none focus:ring-2 focus:ring-rose-500"><XCircle size={14} /> Deactivate alert</button> : <span className="text-[9px] font-bold uppercase tracking-widest text-brand-off-muted">Terminated</span>}
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-brand-off-hairline pt-3 text-[10px] text-brand-off-body">
                <span className="inline-flex items-center gap-1.5"><MapPin size={12} /> {broadcast.safeZone.name} · capacity {broadcast.safeZone.capacity}</span>
                <span className="font-mono">{new Date(broadcast.createdAt).toLocaleString()}</span>
              </div>
            </article>
          ))}
        </section>
      </div>
    </section>
  );
};

export default BroadcastManagement;
