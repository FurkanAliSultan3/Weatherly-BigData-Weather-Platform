import React, { useEffect, useMemo, useState } from 'react';
import { Circle, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { AlertTriangle, ArrowUpRight, BellRing, LocateFixed, MapPin, ShieldCheck, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { normalizeMapReport } from '../../data/mockReports';
import type { MapWeatherReport } from '../../data/mockReports';
import { getOfficerBroadcasts, getOfficerReports, useOfficerStoreVersion } from '../../data/officerStore';
import type { SafeZoneDetails } from '../../data/officerStore';
import MapLayoutInvalidation from '../../maps/MapLayoutInvalidation';
import 'leaflet/dist/leaflet.css';

type AlertSeverity = 'CRITICAL' | 'SEVERE' | 'MODERATE';

interface AlertDetails {
  report: MapWeatherReport;
  severity: AlertSeverity;
  radius: number;
  title: string;
  safeZone?: SafeZoneDetails;
}

const getAlertDetails = (report: MapWeatherReport): AlertDetails => {
  if (report.category === 'FLOODING') {
    return { report, severity: 'CRITICAL', radius: 10_000, title: 'Severe flooding' };
  }
  if (report.category === 'HIGH_WINDS' || report.category === 'THUNDERSTORM') {
    return { report, severity: 'SEVERE', radius: report.category === 'HIGH_WINDS' ? 25_000 : 10_000, title: report.category === 'HIGH_WINDS' ? 'High winds' : 'Severe thunderstorm' };
  }
  return {
    report,
    severity: 'MODERATE',
    radius: report.category === 'HEATWAVE' ? 15_000 : 10_000,
    title: report.category === 'HEATWAVE' ? 'Extreme heat' : report.category.replaceAll('_', ' ').toLowerCase(),
  };
};

const severityClasses: Record<AlertSeverity, string> = {
  CRITICAL: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300',
  SEVERE: 'bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300',
  MODERATE: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
};

const severityColor: Record<AlertSeverity, string> = {
  CRITICAL: '#e11d48',
  SEVERE: '#f97316',
  MODERATE: '#eab308',
};

const getAlertIcon = (severity: AlertSeverity) => divIcon({
  className: 'weather-alert-pin',
  html: `<span style="display:grid;place-items:center;width:24px;height:24px;border:3px solid white;border-radius:50%;background:${severityColor[severity]};color:white;font-size:12px;font-weight:900;box-shadow:0 2px 8px #0f172a80">!</span>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

const safeZoneIcon = divIcon({
  className: 'safe-zone-pin',
  html: '<span style="display:grid;place-items:center;width:27px;height:27px;border:2px solid white;border-radius:50%;background:#15803d;color:white;font-size:15px;font-weight:900;box-shadow:0 2px 8px #0f172a80">+</span>',
  iconSize: [27, 27],
  iconAnchor: [13, 13],
  popupAnchor: [0, -12],
});

const FocusAlert: React.FC<{ selected: AlertDetails | null }> = ({ selected }) => {
  const map = useMap();
  React.useEffect(() => {
    if (selected) map.flyTo([selected.report.lat, selected.report.lng], 9, { duration: 0.8 });
  }, [map, selected]);
  return null;
};

const AlertsPage: React.FC = () => {
  const { theme } = useTheme();
  const storeVersion = useOfficerStoreVersion();
  const alerts = (() => {
    const verified = getOfficerReports()
      .filter(report => report.status === 'VERIFIED')
      .map(normalizeMapReport)
      .filter((report): report is MapWeatherReport => report !== null)
      .map(getAlertDetails);
    const broadcasts = getOfficerBroadcasts()
      .filter(broadcast => broadcast.active)
      .map(broadcast => {
        const report: MapWeatherReport = {
          id: broadcast.id,
          city: broadcast.city,
          state: broadcast.region,
          lat: broadcast.lat,
          lng: broadcast.lng,
          category: broadcast.category === 'FLOOD' ? 'FLOODING' : broadcast.category === 'HIGH_WIND' ? 'HIGH_WINDS' : broadcast.category,
          description: `Officer demonstration advisory: ${broadcast.title}. Nearby safe zone: ${broadcast.safeZone.name} (capacity ${broadcast.safeZone.capacity}).`,
          status: 'VERIFIED',
          aiConfidence: 1,
          timestamp: new Date(broadcast.createdAt).toLocaleString(),
          source: 'OFFICER_BROADCAST',
        };
        const severity: AlertSeverity = broadcast.severity === 'CRITICAL' ? 'CRITICAL' : broadcast.severity === 'WARNING' ? 'SEVERE' : 'MODERATE';
        return { report, severity, radius: broadcast.radiusKm * 1000, title: broadcast.title, safeZone: broadcast.safeZone };
      });
    return [...broadcasts, ...verified];
  })();
  void storeVersion;
  const [selected, setSelected] = useState<AlertDetails | null>(null);
  const [mapFocus, setMapFocus] = useState<AlertDetails | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locationError, setLocationError] = useState('');
  const mapCenter: [number, number] = mapFocus
    ? [mapFocus.report.lat, mapFocus.report.lng]
    : [20.5937, 78.9629];

  const alertsBySeverity = useMemo(() => ({
    CRITICAL: alerts.filter(alert => alert.severity === 'CRITICAL').length,
    SEVERE: alerts.filter(alert => alert.severity === 'SEVERE').length,
    MODERATE: alerts.filter(alert => alert.severity === 'MODERATE').length,
  }), [alerts]);

  useEffect(() => {
    if (!selected) return undefined;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelected(null);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [selected]);

  const focusAlert = (alert: AlertDetails) => {
    setMapFocus(alert);
    setSelected(alert);
  };

  const locateMe = () => {
    if (!navigator.geolocation) {
      setLocationError('Location access is not supported in this browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setUserLocation([coords.latitude, coords.longitude]);
        setLocationError('');
      },
      () => setLocationError('Could not access your location. You can still browse alerts on the map.'),
      { enableHighAccuracy: true, timeout: 10_000 },
    );
  };

  return (
    <section className="mx-auto max-w-[1600px] space-y-6 px-4 py-8 text-brand-ink dark:text-white sm:px-6 lg:px-8">
      <header className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-brand-muted dark:text-slate-400">Weatherly · public advisories</p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Alerts across India</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-brand-body dark:text-slate-300">
            Mapped events and advisories are illustrative. Check local authority channels for current emergency instructions.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(['CRITICAL', 'SEVERE', 'MODERATE'] as const).map(severity => (
            <span key={severity} className={`rounded-lg px-3 py-2 text-[10px] font-bold tracking-wider ${severityClasses[severity]}`}>
              {alertsBySeverity[severity]} {severity}
            </span>
          ))}
        </div>
      </header>

      <div className="grid min-h-[720px] grid-cols-1 gap-5 xl:h-[760px] xl:grid-cols-[minmax(340px,0.82fr)_minmax(0,1.65fr)]">
        <aside className="flex min-h-0 flex-col overflow-hidden rounded-3xl border border-brand-hairline bg-white/70 dark:border-slate-700 dark:bg-slate-900/75">
          <div className="flex items-center justify-between border-b border-brand-hairline px-5 py-4 dark:border-slate-700">
            <div>
              <h2 className="font-semibold">Weather events &amp; emergency broadcasts</h2>
              <p className="mt-1 text-xs text-brand-muted dark:text-slate-400">{alerts.length} mapped alerts</p>
            </div>
            <button
              type="button"
              onClick={locateMe}
              className="inline-flex items-center gap-2 rounded-xl border border-brand-hairline px-3 py-2 text-xs font-semibold transition hover:border-brand-primary hover:text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary dark:border-slate-700"
            >
              <LocateFixed size={15} /> My location
            </button>
          </div>
          {locationError && <p role="alert" className="mx-4 mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:bg-amber-950/60 dark:text-amber-200">{locationError}</p>}
          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
            {alerts.map(alert => (
              <button
                key={alert.report.id}
                type="button"
                onClick={() => focusAlert(alert)}
                className={`w-full rounded-2xl border p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-brand-primary/50 focus:outline-none focus:ring-2 focus:ring-brand-primary ${
                  mapFocus?.report.id === alert.report.id
                    ? 'border-brand-primary bg-brand-primary/5 dark:bg-brand-primary/10'
                    : 'border-brand-hairline bg-brand-canvas/70 dark:border-slate-700 dark:bg-slate-800/70'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className={`rounded-md px-2 py-1 text-[9px] font-black tracking-widest ${severityClasses[alert.severity]}`}>{alert.severity}</span>
                  <span className="text-[10px] text-brand-muted dark:text-slate-400">{alert.report.timestamp}</span>
                </div>
                <h3 className="mt-3 text-base font-semibold">{alert.title} · {alert.report.city}</h3>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-brand-body dark:text-slate-300">{alert.report.description}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-semibold text-brand-muted dark:text-slate-400">
                  <MapPin size={12} /> {alert.report.city}, {alert.report.state} · {(alert.radius / 1000).toFixed(0)} km impact estimate
                </span>
              </button>
            ))}
          </div>
          <p className="border-t border-brand-hairline px-5 py-3 text-[10px] leading-relaxed text-brand-muted dark:border-slate-700 dark:text-slate-400">
            Impact circles are illustrative, not official warning boundaries. Verify evacuation guidance with local authorities.
          </p>
        </aside>

        <div className="relative min-h-[520px] overflow-hidden rounded-3xl border border-brand-hairline bg-brand-surface-card dark:border-slate-700">
          <div className="absolute left-4 top-4 z-[500] rounded-xl border border-white/70 bg-white/90 px-4 py-3 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/90">
            <p className="text-xs font-bold">Alert impact map</p>
            <p className="mt-1 text-[10px] text-brand-muted dark:text-slate-400">Circles visualize estimated impact radius</p>
          </div>
          <MapContainer center={mapCenter} zoom={5} className="h-full min-h-[520px] w-full" scrollWheelZoom>
            <FocusAlert selected={mapFocus} />
            <MapLayoutInvalidation theme={theme} />
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {alerts.map(alert => (
              <React.Fragment key={alert.report.id}>
                <Circle
                  center={[alert.report.lat, alert.report.lng]}
                  radius={alert.radius}
                  pathOptions={{ color: severityColor[alert.severity], fillColor: severityColor[alert.severity], fillOpacity: 0.16, weight: 2, className: 'alert-radius-pulse' }}
                  eventHandlers={{ click: () => focusAlert(alert) }}
                />
                <Circle
                  center={[alert.report.lat, alert.report.lng]}
                  radius={alert.radius * 0.72}
                  pathOptions={{ color: severityColor[alert.severity], fillColor: severityColor[alert.severity], fillOpacity: 0.07, weight: 1, dashArray: '5 7' }}
                />
                <Marker position={[alert.report.lat, alert.report.lng]} icon={getAlertIcon(alert.severity)} title={`${alert.severity} ${alert.title} in ${alert.report.city}`} alt={`${alert.severity} alert marker`}>
                  <Popup>
                    <strong>{alert.title} · {alert.report.city}</strong>
                    <br />{alert.severity} · {(alert.radius / 1000).toFixed(0)} km radius
                    <br /><button type="button" onClick={() => focusAlert(alert)}>View safety advisory</button>
                  </Popup>
                </Marker>
                {alert.safeZone && (
                  <Marker position={[alert.safeZone.lat, alert.safeZone.lng]} icon={safeZoneIcon} title={`Safe zone: ${alert.safeZone.name}`} alt="Safe zone marker">
                    <Popup>
                      <strong>{alert.safeZone.name}</strong>
                      <br />Relief capacity: {alert.safeZone.capacity}
                      <br /><a href={`https://www.google.com/maps/dir/?api=1&destination=${alert.safeZone.lat},${alert.safeZone.lng}`} target="_blank" rel="noreferrer">Get directions</a>
                    </Popup>
                  </Marker>
                )}
              </React.Fragment>
            ))}
            {userLocation && (
              <Marker position={userLocation}>
                <Popup>Your location</Popup>
              </Marker>
            )}
          </MapContainer>
          <div className="absolute bottom-4 left-4 z-[500] flex flex-wrap gap-2 rounded-xl border border-white/70 bg-white/90 p-3 text-[10px] font-bold shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/90">
            {(['CRITICAL', 'SEVERE', 'MODERATE'] as const).map(severity => (
              <span key={severity} className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: severityColor[severity] }} />{severity}
              </span>
            ))}
          </div>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-[1100] grid place-items-center bg-slate-950/60 p-4 backdrop-blur-sm" onMouseDown={event => {
          if (event.target === event.currentTarget) setSelected(null);
        }}>
          <section role="dialog" aria-modal="true" aria-labelledby="alert-modal-title" className="w-full max-w-lg rounded-3xl border border-brand-hairline bg-brand-canvas p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[9px] font-black tracking-widest ${severityClasses[selected.severity]}`}><AlertTriangle size={12} /> {selected.severity} · DEMO ADVISORY</span>
                <h2 id="alert-modal-title" className="mt-3 text-2xl font-semibold text-brand-ink dark:text-white">{selected.title} · {selected.report.city}</h2>
              </div>
              <button type="button" onClick={() => setSelected(null)} aria-label="Close alert advisory" className="rounded-lg p-2 text-brand-muted hover:bg-brand-hairline focus:outline-none focus:ring-2 focus:ring-brand-primary dark:hover:bg-slate-800"><X size={18} /></button>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-brand-body dark:text-slate-300">{selected.report.description}</p>
            <div className="mt-5 rounded-2xl bg-brand-surface-card p-4 dark:bg-slate-800">
              <h3 className="flex items-center gap-2 text-sm font-bold"><ShieldCheck size={16} className="text-brand-primary" /> Safety guidance</h3>
              <ul className="mt-3 space-y-2 text-xs leading-relaxed text-brand-body dark:text-slate-300">
                <li>• Follow instructions from local emergency services and district authorities.</li>
                <li>• Avoid the marked impact area where possible; never walk or drive through floodwater.</li>
                <li>• Keep essential medicines, drinking water and a charged phone accessible.</li>
                <li>• This demonstration does not replace an official evacuation or weather warning.</li>
              </ul>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/safe-zones" className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-4 py-3 text-xs font-bold text-white transition hover:bg-brand-primary-active focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2">
                Find safe zones <ArrowUpRight size={15} />
              </Link>
              <button type="button" onClick={() => setSelected(null)} className="rounded-xl border border-brand-hairline px-4 py-3 text-xs font-semibold transition hover:bg-brand-surface-card focus:outline-none focus:ring-2 focus:ring-brand-primary dark:border-slate-700">Close advisory</button>
            </div>
          </section>
        </div>
      )}
      <div className="flex justify-end">
        <Link to="/safe-zones" className="inline-flex items-center gap-2 text-xs font-bold text-brand-primary hover:underline"><BellRing size={14} /> Broadcasts &amp; safe zones <ArrowUpRight size={14} /></Link>
      </div>
    </section>
  );
};

export default AlertsPage;
