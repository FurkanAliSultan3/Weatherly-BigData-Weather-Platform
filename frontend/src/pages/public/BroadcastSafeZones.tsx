import React, { useMemo, useState } from 'react';
import { divIcon } from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { AlertTriangle, ArrowUpRight, LocateFixed, MapPin, Navigation, Radio, ShieldCheck } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { mockReports } from '../../data/mockReports';
import MapLayoutInvalidation from '../../maps/MapLayoutInvalidation';
import 'leaflet/dist/leaflet.css';

interface SafeZone {
  id: string;
  name: string;
  kind: string;
  city: string;
  lat: number;
  lng: number;
  open: boolean;
}

const broadcasts = [
  {
    id: 'DEMO-BR-01',
    authority: 'Regional Emergency Operations Centre · Mumbai',
    title: 'Monsoon waterlogging awareness',
    detail: 'Avoid underpasses and low-lying roads during heavy rain. Use designated local relief points if your area becomes inaccessible.',
    time: 'Illustrative notice · not issued by authorities',
    level: 'PRECAUTION',
  },
  {
    id: 'DEMO-BR-02',
    authority: 'Coastal Preparedness Desk · Kochi',
    title: 'Coastal weather readiness',
    detail: 'Keep essential medicines and drinking water ready. Follow verified instructions from district authorities for any movement or evacuation.',
    time: 'Illustrative notice · not issued by authorities',
    level: 'WATCH',
  },
  {
    id: 'DEMO-BR-03',
    authority: 'Heat Health Cell · Jaipur',
    title: 'Hot-weather safety reminder',
    detail: 'Limit strenuous outdoor activity during peak afternoon heat and check on children, older adults and people working outdoors.',
    time: 'Illustrative notice · not issued by authorities',
    level: 'HEALTH',
  },
];

const safeZones: SafeZone[] = [
  { id: 'SZ-MUM-01', name: 'Ward 172 Community Relief Hall', kind: 'Flood relief camp', city: 'Mumbai', lat: 19.0218, lng: 72.8502, open: true },
  { id: 'SZ-MUM-02', name: 'Dadar Civic Assembly Centre', kind: 'High-ground assembly point', city: 'Mumbai', lat: 19.0183, lng: 72.8426, open: true },
  { id: 'SZ-DEL-01', name: 'Civil Lines Community Health Centre', kind: 'Emergency medical station', city: 'Delhi', lat: 28.6801, lng: 77.2250, open: true },
  { id: 'SZ-CHN-01', name: 'Velachery Relief School', kind: 'Flood relief camp', city: 'Chennai', lat: 12.9750, lng: 80.2212, open: true },
  { id: 'SZ-KOL-01', name: 'Howrah Riverside Cyclone Shelter', kind: 'Cyclone shelter', city: 'Kolkata', lat: 22.5892, lng: 88.3103, open: true },
  { id: 'SZ-BLR-01', name: 'Whitefield Emergency Medical Station', kind: 'Emergency medical station', city: 'Bengaluru', lat: 12.9698, lng: 77.7499, open: true },
  { id: 'SZ-HYD-01', name: 'Charminar District Relief Centre', kind: 'High-ground assembly point', city: 'Hyderabad', lat: 17.3616, lng: 78.4747, open: true },
  { id: 'SZ-JAI-01', name: 'Amer Road Community Shelter', kind: 'Heat relief centre', city: 'Jaipur', lat: 26.9584, lng: 75.8468, open: true },
  { id: 'SZ-KOC-01', name: 'Fort Kochi Coastal Shelter', kind: 'Cyclone shelter', city: 'Kochi', lat: 9.9640, lng: 76.2428, open: true },
  { id: 'SZ-GUW-01', name: 'Guwahati Hilltop Relief Point', kind: 'High-ground assembly point', city: 'Guwahati', lat: 26.1748, lng: 91.7422, open: true },
];

const zoneIcon = divIcon({
  className: 'safe-zone-pin',
  html: '<span aria-hidden="true" style="display:grid;place-items:center;width:34px;height:34px;border:2px solid white;border-radius:12px;background:#15803d;box-shadow:0 3px 8px #0f172a66"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z"/><path d="m9 12 2 2 4-4"/></svg></span>',
  iconSize: [34, 34],
  iconAnchor: [17, 17],
});

const distanceKm = (from: [number, number], to: [number, number]) => {
  const radians = (degrees: number) => degrees * Math.PI / 180;
  const [lat1, lng1] = from.map(radians);
  const [lat2, lng2] = to.map(radians);
  const deltaLat = lat2 - lat1;
  const deltaLng = lng2 - lng1;
  const value = Math.sin(deltaLat / 2) ** 2
    + Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
};

const MapFocus: React.FC<{ location: [number, number] | null }> = ({ location }) => {
  const map = useMap();
  React.useEffect(() => {
    if (location) map.flyTo(location, 11, { duration: 0.8 });
  }, [location, map]);
  return null;
};

const BroadcastSafeZones: React.FC = () => {
  const { theme } = useTheme();
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [activeAlert, setActiveAlert] = useState<[number, number] | null>(null);
  const [selectedZone, setSelectedZone] = useState<SafeZone | null>(null);
  const [locationError, setLocationError] = useState('');

  const referencePoint = location ?? activeAlert;
  const nearestZone = useMemo(() => {
    if (!referencePoint) return null;
    return safeZones
      .map(zone => ({ zone, distance: distanceKm(referencePoint, [zone.lat, zone.lng]) }))
      .sort((left, right) => left.distance - right.distance)[0];
  }, [referencePoint]);

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Location access is not supported in this browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocation([coords.latitude, coords.longitude]);
        setActiveAlert(null);
        setLocationError('');
      },
      () => setLocationError('Could not access your location. Choose a nearby alert area instead.'),
      { enableHighAccuracy: true, timeout: 10_000 },
    );
  };

  const useNearestAlert = () => {
    const report = mockReports.find(item => item.status === 'VERIFIED' && item.category === 'FLOODING') ?? mockReports[0];
    setActiveAlert([report.lat, report.lng]);
    setLocation(null);
    setLocationError('');
  };

  const directionsUrl = (zone: SafeZone) => {
    const origin = location ? `&origin=${location[0]},${location[1]}` : '';
    return `https://www.google.com/maps/dir/?api=1${origin}&destination=${zone.lat},${zone.lng}`;
  };

  return (
    <main className="mx-auto max-w-[1440px] space-y-8 px-4 py-10 text-brand-ink dark:text-white sm:px-6 lg:px-8">
      <header className="relative overflow-hidden rounded-[2rem] border border-brand-hairline bg-white/80 p-7 dark:border-slate-700 dark:bg-slate-900/80 sm:p-10">
        <div className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400"><ShieldCheck size={15} /> Preparedness network</span>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Safe zones &amp; emergency broadcasts</h1>
            <p className="mt-3 text-sm leading-relaxed text-brand-body dark:text-slate-300">Find a nearby demonstration relief point and review sample safety notices. Confirm shelter availability and instructions with local authorities before travelling.</p>
          </div>
          <span className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-amber-900 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200">Prototype · sample directory</span>
        </div>
      </header>

      <section aria-labelledby="broadcast-heading">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-muted dark:text-slate-400">Authority notices · sample feed</p>
            <h2 id="broadcast-heading" className="mt-1 text-2xl font-semibold">Emergency broadcasts</h2>
          </div>
          <span className="inline-flex items-center gap-2 text-[10px] font-bold text-emerald-700 dark:text-emerald-400"><Radio size={14} /> DEMO FEED</span>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {broadcasts.map((broadcast, index) => (
            <article key={broadcast.id} className="rounded-2xl border border-brand-hairline bg-white/70 p-5 dark:border-slate-700 dark:bg-slate-900/70">
              <div className="flex items-start justify-between gap-3">
                <span className="rounded-md bg-brand-surface-card px-2 py-1 text-[9px] font-black tracking-widest text-brand-muted dark:bg-slate-800 dark:text-slate-300">{broadcast.level}</span>
                <span className="text-[9px] font-semibold text-brand-muted dark:text-slate-400">{broadcast.time}</span>
              </div>
              <h3 className="mt-4 text-base font-semibold">{broadcast.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-brand-body dark:text-slate-300">{broadcast.detail}</p>
              <p className="mt-4 border-t border-brand-hairline pt-3 text-[10px] font-semibold text-brand-muted dark:border-slate-700 dark:text-slate-400">{broadcast.authority}</p>
              {index === 0 && <p className="mt-3 flex items-center gap-1.5 text-[10px] font-bold text-rose-700 dark:text-rose-400"><AlertTriangle size={12} /> Sample message only, not a live alert</p>}
            </article>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(300px,0.78fr)_minmax(0,1.6fr)]">
        <aside className="space-y-4">
          <div className="rounded-3xl border border-brand-hairline bg-white/75 p-5 dark:border-slate-700 dark:bg-slate-900/75">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-muted dark:text-slate-400">Safe zone finder</p>
            <h2 className="mt-1 text-2xl font-semibold">Find nearby help</h2>
            <p className="mt-2 text-xs leading-relaxed text-brand-body dark:text-slate-300">Calculate distance from your current location or use a demonstration flood-alert location.</p>
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
              <button type="button" onClick={useMyLocation} className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-primary px-4 py-3 text-xs font-bold text-white transition hover:bg-brand-primary-active focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2">
                <LocateFixed size={15} /> Use my location
              </button>
              <button type="button" onClick={useNearestAlert} className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand-hairline px-4 py-3 text-xs font-bold transition hover:border-brand-primary hover:text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary dark:border-slate-700">
                <MapPin size={15} /> Use demo alert
              </button>
            </div>
            {locationError && <p role="alert" className="mt-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-900 dark:bg-amber-950/50 dark:text-amber-200">{locationError}</p>}
            {nearestZone && (
              <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/40">
                <p className="text-[9px] font-black uppercase tracking-widest text-emerald-800 dark:text-emerald-300">Nearest listed site</p>
                <h3 className="mt-2 text-sm font-bold text-emerald-950 dark:text-emerald-100">{nearestZone.zone.name}</h3>
                <p className="mt-1 text-xs text-emerald-900/80 dark:text-emerald-200/80">{nearestZone.zone.kind} · {nearestZone.zone.city}</p>
                <p className="mt-3 font-mono text-2xl font-bold tabular-nums text-emerald-900 dark:text-emerald-200">{nearestZone.distance.toFixed(1)} km</p>
                <a href={directionsUrl(nearestZone.zone)} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2">
                  <Navigation size={14} /> Navigate / Get directions <ArrowUpRight size={13} />
                </a>
                <p className="mt-3 text-[9px] leading-relaxed text-emerald-900/70 dark:text-emerald-200/70">Directory entries are for interface demonstration; confirm that a site is open before travelling.</p>
              </div>
            )}
          </div>

          <div className="max-h-[440px] space-y-2 overflow-y-auto rounded-3xl border border-brand-hairline bg-white/65 p-4 dark:border-slate-700 dark:bg-slate-900/65">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold">Relief centres &amp; shelters</h3>
              <span className="text-[10px] text-brand-muted dark:text-slate-400">{safeZones.length} sample sites</span>
            </div>
            {safeZones.map(zone => {
              const distance = referencePoint ? distanceKm(referencePoint, [zone.lat, zone.lng]) : null;
              return (
                <button key={zone.id} type="button" onClick={() => setSelectedZone(zone)} className={`w-full rounded-xl border p-3 text-left transition hover:border-emerald-500/60 focus:outline-none focus:ring-2 focus:ring-emerald-600 ${selectedZone?.id === zone.id ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30' : 'border-brand-hairline bg-brand-canvas/60 dark:border-slate-700 dark:bg-slate-800/60'}`}>
                  <span className="flex items-start justify-between gap-3">
                    <span className="flex items-start gap-2.5">
                      <ShieldCheck size={17} className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <span><span className="block text-xs font-semibold">{zone.name}</span><span className="mt-1 block text-[10px] text-brand-muted dark:text-slate-400">{zone.kind} · {zone.city}</span></span>
                    </span>
                    <span className="shrink-0 text-[9px] font-bold text-emerald-700 dark:text-emerald-400">{zone.open ? 'LISTED' : 'CHECK'}</span>
                  </span>
                  {distance !== null && <span className="mt-2 block pl-7 font-mono text-[10px] tabular-nums text-brand-muted dark:text-slate-400">{distance.toFixed(1)} km from selected point</span>}
                </button>
              );
            })}
          </div>
        </aside>

        <div className="relative min-h-[620px] overflow-hidden rounded-3xl border border-brand-hairline dark:border-slate-700">
          <div className="absolute left-4 top-4 z-[500] rounded-xl border border-white/70 bg-white/90 p-3 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/90">
            <p className="text-xs font-bold">Safe-zone map</p>
            <p className="mt-1 text-[10px] text-brand-muted dark:text-slate-400">Green markers · illustrative relief locations</p>
          </div>
          <MapContainer center={[20.5937, 78.9629]} zoom={5} className="h-full min-h-[620px] w-full">
            <MapFocus location={selectedZone ? [selectedZone.lat, selectedZone.lng] : referencePoint} />
            <MapLayoutInvalidation theme={theme} />
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {safeZones.map(zone => (
              <Marker key={zone.id} position={[zone.lat, zone.lng]} icon={zoneIcon} title={`${zone.kind}: ${zone.name}`} alt={`${zone.kind} in ${zone.city}`}>
                <Popup>
                  <strong>{zone.name}</strong><br />{zone.kind} · {zone.city}
                  <br /><a href={directionsUrl(zone)} target="_blank" rel="noreferrer">Get directions</a>
                </Popup>
              </Marker>
            ))}
            {location && <Marker position={location}><Popup>Your location</Popup></Marker>}
            {activeAlert && <Marker position={activeAlert}><Popup>Demonstration alert reference</Popup></Marker>}
          </MapContainer>
        </div>
      </section>
      <p className="flex items-start gap-2 text-[10px] leading-relaxed text-brand-muted dark:text-slate-400"><AlertTriangle size={13} className="mt-0.5 shrink-0" /> This prototype does not receive live authority broadcasts or verify shelter operations. In an emergency, contact local emergency services and follow official instructions.</p>
    </main>
  );
};

export default BroadcastSafeZones;
