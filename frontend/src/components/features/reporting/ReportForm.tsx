import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { CheckCircle2, LocateFixed, MapPin, Search, Send, ShieldCheck } from 'lucide-react';
import { reportApi } from '../../../api/client';
import { useTheme } from '../../../context/ThemeContext';
import { normalizeReportStatus } from '../../../data/mockReports';
import type { MockReportStatus } from '../../../data/mockReports';
import MapLayoutInvalidation from '../../../maps/MapLayoutInvalidation';
import 'leaflet/dist/leaflet.css';

interface ReportFormData {
  report_type: string;
  description: string;
  latitude: number | null;
  longitude: number | null;
}

interface CitizenReportRecord {
  id: string;
  timestamp: string;
  category: string;
  location: string;
  aiConfidence: number | null;
  status: MockReportStatus;
  demo: boolean;
}

interface GeocodeResult {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
}

const HISTORY_STORAGE_KEY = 'weatherly-citizen-report-history';

const reportPinIcon = divIcon({
  className: 'citizen-report-pin',
  html: '<span style="display:block;width:18px;height:18px;border:4px solid white;border-radius:50%;background:#cc785c;box-shadow:0 2px 8px #0f172a80"></span>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

const readHistory = (): CitizenReportRecord[] => {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(HISTORY_STORAGE_KEY) ?? '[]');
    return Array.isArray(value) ? value as CitizenReportRecord[] : [];
  } catch (error) {
    console.error('Could not read saved citizen report history', error);
    return [];
  }
};

const LocationPicker: React.FC<{
  position: [number, number] | null;
  onLocationSelect: (latitude: number, longitude: number) => void;
}> = ({ position, onLocationSelect }) => {
  useMapEvents({
    click(event) {
      onLocationSelect(event.latlng.lat, event.latlng.lng);
    },
  });
  return position ? <Marker position={position} icon={reportPinIcon} title="Selected incident location" alt="Selected incident location" /> : null;
};

const MapRecenter: React.FC<{ position: [number, number] | null }> = ({ position }) => {
  const map = useMap();
  React.useEffect(() => {
    if (position) map.flyTo(position, 13, { duration: 0.7 });
  }, [map, position]);
  return null;
};

const ReportForm: React.FC = () => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState<ReportFormData>({
    report_type: 'rain',
    description: '',
    latitude: null,
    longitude: null,
  });
  const [submittedReports, setSubmittedReports] = useState<CitizenReportRecord[]>(readHistory);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);
  const [addressQuery, setAddressQuery] = useState('');
  const [selectedAddress, setSelectedAddress] = useState('');
  const [suggestions, setSuggestions] = useState<GeocodeResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

  const selectedPosition: [number, number] | null = formData.latitude !== null && formData.longitude !== null
    ? [formData.latitude, formData.longitude]
    : null;

  useEffect(() => {
    const query = addressQuery.trim();
    if (query.length < 3 || query === selectedAddress) return undefined;

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const params = new URLSearchParams({ format: 'jsonv2', addressdetails: '1', limit: '5', countrycodes: 'in', 'accept-language': 'en', q: query });
        const response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, { signal: controller.signal });
        if (!response.ok) throw new Error(`Address search returned HTTP ${response.status}.`);
        const results = await response.json() as GeocodeResult[];
        setSuggestions(results);
        setSearchError(results.length ? '' : 'No matching addresses. Try a nearby landmark or PIN code.');
      } catch (requestError) {
        if (!controller.signal.aborted) {
          console.error('Address search failed', requestError);
          setSuggestions([]);
          setSearchError('Address search is unavailable. You can still choose a point on the map.');
        }
      } finally {
        if (!controller.signal.aborted) setSearchLoading(false);
      }
    }, 1_000);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [addressQuery, selectedAddress]);

  const selectLocation = (latitude: number, longitude: number, address = '') => {
    setFormData(previous => ({ ...previous, latitude, longitude }));
    setSelectedAddress(address);
    setAddressQuery(address);
    setSuggestions([]);
    setSearchError('');
    setSearchLoading(false);
    setError('');
  };

  const chooseAddress = (result: GeocodeResult) => {
    const latitude = Number(result.lat);
    const longitude = Number(result.lon);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      setSearchError('The address result did not include valid coordinates.');
      return;
    }
    selectLocation(latitude, longitude, result.display_name);
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Location access is not supported by this browser.');
      return;
    }
    setError('');
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        selectLocation(coords.latitude, coords.longitude, 'Current GPS location');
        setLocationLoading(false);
      },
      () => {
        setError('Could not access your location. Search for an address or choose a point on the map.');
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10_000 },
    );
  };

  const reportTypes = [
    { id: 'rain', label: 'Heavy Rain', glyph: '🌧️' },
    { id: 'flood', label: 'Flood / Waterlogging', glyph: '🌊' },
    { id: 'storm', label: 'Storm / Cyclone', glyph: '🌀' },
    { id: 'heatwave', label: 'Heatwave', glyph: '☀️' },
    { id: 'fog', label: 'Dense Fog / Visibility', glyph: '🌫️' },
    { id: 'dust', label: 'Dust Storm', glyph: '🌪️' },
    { id: 'wind', label: 'High Winds', glyph: '💨' },
    { id: 'hail', label: 'Hailstorm', glyph: '❄️' },
  ];

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formData.latitude === null || formData.longitude === null) {
      setError('Select the incident location using address search, the map, or GPS.');
      return;
    }
    setError('');
    setNotice('');
    setLoading(true);

    let demo = false;
    let reportId = `DEMO-${Date.now().toString().slice(-8)}`;
    let status: MockReportStatus = 'UNVERIFIED';
    let aiConfidence: number | null = null;
    try {
      const phenomenon = formData.report_type === 'hail' ? 'other' : formData.report_type;
      const response = await reportApi.submit({
        phenomenon,
        description: formData.description,
        location: { lat: formData.latitude, lng: formData.longitude },
      });
      if (typeof response?.report_id === 'string' || typeof response?.report_id === 'number') {
        reportId = String(response.report_id);
      }
      if (response?.initial_status) status = normalizeReportStatus(response.initial_status);
      aiConfidence = typeof response?.aiConfidence === 'number' ? response.aiConfidence : null;
    } catch (requestError) {
      console.error('Report submission failed; saving it to this browser for the prototype', requestError);
      demo = true;
      aiConfidence = 0.52;
    }

    const record: CitizenReportRecord = {
      id: reportId,
      timestamp: new Date().toISOString(),
      category: reportTypes.find(type => type.id === formData.report_type)?.label ?? formData.report_type,
      location: selectedAddress || `${formData.latitude.toFixed(4)}, ${formData.longitude.toFixed(4)}`,
      aiConfidence,
      status,
      demo,
    };
    const nextHistory = [record, ...submittedReports];
    setSubmittedReports(nextHistory);
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(nextHistory));
    } catch (storageError) {
      console.error('Could not persist citizen report history in this browser', storageError);
      setNotice(demo
        ? `Demo report ${reportId} was added for this session only; the API was unavailable and browser storage failed.`
        : `Report ${reportId} was submitted, but this browser could not save the local history.`);
      setLoading(false);
      return;
    }
    setNotice(demo
      ? `Demo report ${reportId} is saved in this browser only; it was not sent to emergency services.`
      : `Report ${reportId} submitted. Its status will update after review.`);
    setFormData(previous => ({ ...previous, description: '' }));
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(440px,1.05fr)]">
        <form onSubmit={handleSubmit} className="rounded-3xl border border-brand-hairline bg-white/80 p-5 shadow-xl shadow-brand-primary/5 dark:border-slate-700 dark:bg-slate-900/80 sm:p-7">
          <div className="flex items-center gap-4">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-primary/10 text-brand-primary"><Send size={21} /></span>
            <div>
              <h2 className="text-2xl font-semibold text-brand-ink dark:text-white">Submit an observation</h2>
              <p className="mt-1 text-xs text-brand-muted dark:text-slate-400">Share what you observed and where it happened.</p>
            </div>
          </div>

          <div className="mt-7 space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted dark:text-slate-400">Weather type</label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {reportTypes.map(type => (
                <button
                  key={type.id}
                  type="button"
                  aria-pressed={formData.report_type === type.id}
                  onClick={() => setFormData(previous => ({ ...previous, report_type: type.id }))}
                  className={`flex min-h-12 items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-brand-primary ${
                    formData.report_type === type.id
                      ? 'border-brand-primary bg-brand-primary/10 text-brand-primary dark:bg-brand-primary/15'
                      : 'border-brand-hairline bg-brand-canvas/60 text-brand-body hover:border-brand-primary/50 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200'
                  }`}
                >
                  <span className="text-lg" aria-hidden="true">{type.glyph}</span>{type.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <label htmlFor="report-description" className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted dark:text-slate-400">What did you observe?</label>
            <textarea
              id="report-description"
              className="min-h-32 w-full resize-y rounded-2xl border border-brand-hairline bg-brand-canvas/60 p-4 text-sm text-brand-ink outline-none transition placeholder:text-brand-muted/70 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 dark:border-slate-700 dark:bg-slate-800/60 dark:text-white dark:placeholder:text-slate-500"
              placeholder="Describe intensity, timing, nearby landmarks or visible impact…"
              value={formData.description}
              onChange={event => setFormData(previous => ({ ...previous, description: event.target.value }))}
              minLength={8}
              maxLength={1200}
              required
            />
            <p className="text-right text-[10px] text-brand-muted dark:text-slate-500">{formData.description.length}/1200</p>
          </div>

          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-brand-hairline bg-brand-canvas/60 p-4 dark:border-slate-700 dark:bg-slate-800/50">
            <MapPin size={17} className="mt-0.5 shrink-0 text-brand-primary" />
            <div className="min-w-0">
              <p className="text-xs font-bold text-brand-ink dark:text-white">{selectedPosition ? 'Location selected' : 'Location needed'}</p>
              <p className="mt-1 break-words text-[10px] leading-relaxed text-brand-muted dark:text-slate-400">
                {selectedPosition
                  ? `${selectedAddress ? `${selectedAddress} · ` : ''}${selectedPosition[0].toFixed(4)}, ${selectedPosition[1].toFixed(4)}`
                  : 'Search for an address or select a point on the map.'}
              </p>
            </div>
          </div>

          {error && <p role="alert" className="mt-4 rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-900 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-200">{error}</p>}
          {notice && <p role="status" className="mt-4 flex items-start gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-xs font-medium leading-relaxed text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200"><CheckCircle2 size={15} className="mt-0.5 shrink-0" />{notice}</p>}
          <button
            type="submit"
            disabled={loading}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-primary px-5 py-4 text-sm font-bold text-white transition hover:bg-brand-primary-active active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 disabled:cursor-wait disabled:opacity-60"
          >
            {loading ? 'Submitting report…' : <><Send size={17} /> Submit weather report</>}
          </button>
          <p className="mt-3 text-center text-[10px] leading-relaxed text-brand-muted dark:text-slate-500">For immediate danger, contact local emergency services. Citizen reports are not emergency dispatch requests.</p>
        </form>

        <aside className="overflow-hidden rounded-3xl border border-brand-hairline bg-white/80 shadow-xl shadow-brand-primary/5 dark:border-slate-700 dark:bg-slate-900/80">
          <div className="space-y-4 p-5 sm:p-6">
            <div>
              <h2 className="text-xl font-semibold text-brand-ink dark:text-white">Pin the event location</h2>
              <p className="mt-1 text-xs text-brand-muted dark:text-slate-400">Search an address, use GPS, or click directly on the map.</p>
            </div>
            <div className="relative">
              <label htmlFor="report-address" className="sr-only">Enter street address, city or pincode</label>
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
              <input
                id="report-address"
                type="search"
                value={addressQuery}
                onChange={event => {
                  setAddressQuery(event.target.value);
                  setSelectedAddress('');
                  setSuggestions([]);
                  setSearchError('');
                  setSearchLoading(event.target.value.trim().length >= 3);
                }}
                placeholder="Enter Street Address, City or Pincode"
                autoComplete="off"
                className="w-full rounded-xl border border-brand-hairline bg-brand-canvas/60 py-3 pl-10 pr-4 text-xs text-brand-ink outline-none transition placeholder:text-brand-muted/70 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 dark:border-slate-700 dark:bg-slate-800/60 dark:text-white dark:placeholder:text-slate-500"
              />
              {searchLoading && <span className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-brand-hairline border-t-brand-primary" />}
              {suggestions.length > 0 && (
                <ul className="absolute inset-x-0 top-full z-[1000] mt-1 max-h-60 overflow-y-auto rounded-xl border border-brand-hairline bg-white p-1 shadow-xl dark:border-slate-700 dark:bg-slate-900">
                  {suggestions.map(result => (
                    <li key={result.place_id}>
                      <button type="button" onClick={() => chooseAddress(result)} className="w-full rounded-lg px-3 py-2.5 text-left text-xs leading-relaxed text-brand-body transition hover:bg-brand-surface-card focus:outline-none focus:ring-2 focus:ring-brand-primary dark:text-slate-200 dark:hover:bg-slate-800">{result.display_name}</button>
                    </li>
                  ))}
                </ul>
              )}
              {searchError && <p role="status" className="mt-2 text-[10px] text-amber-800 dark:text-amber-300">{searchError}</p>}
            </div>
            <button type="button" onClick={useCurrentLocation} disabled={locationLoading} className="inline-flex items-center gap-2 rounded-lg border border-brand-hairline px-3 py-2 text-xs font-semibold text-brand-body transition hover:border-brand-primary hover:text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:opacity-50 dark:border-slate-700 dark:text-slate-200">
              <LocateFixed size={15} /> {locationLoading ? 'Getting location…' : 'Use GPS location'}
            </button>
          </div>
          <div className="relative h-[420px] border-t border-brand-hairline dark:border-slate-700 sm:h-[560px]">
            <div className="absolute left-4 top-4 z-[500] rounded-lg border border-white/70 bg-white/90 px-3 py-2 text-[10px] font-bold text-brand-ink shadow backdrop-blur dark:border-slate-700 dark:bg-slate-900/90 dark:text-white">MAP CLICK TO PIN</div>
            <MapContainer center={[20.5937, 78.9629]} zoom={5} className="h-full min-h-[400px] w-full" scrollWheelZoom>
              <MapLayoutInvalidation theme={theme} />
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <MapRecenter position={selectedPosition} />
              <LocationPicker position={selectedPosition} onLocationSelect={(latitude, longitude) => selectLocation(latitude, longitude)} />
            </MapContainer>
          </div>
          <p className="flex items-center gap-2 px-5 py-3 text-[10px] text-brand-muted dark:text-slate-400"><MapPin size={13} /> Address lookup uses OpenStreetMap Nominatim.</p>
        </aside>
      </div>

      <section aria-labelledby="submitted-reports-heading" className="overflow-hidden rounded-3xl border border-brand-hairline bg-white/80 dark:border-slate-700 dark:bg-slate-900/80">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-hairline px-5 py-5 dark:border-slate-700 sm:px-7">
          <div>
            <h2 id="submitted-reports-heading" className="text-xl font-semibold text-brand-ink dark:text-white">My submitted reports</h2>
            <p className="mt-1 text-xs text-brand-muted dark:text-slate-400">Saved in this browser; no sign-in is enabled in this prototype.</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-brand-surface-card px-3 py-2 text-[10px] font-bold text-brand-body dark:bg-slate-800 dark:text-slate-300"><ShieldCheck size={13} /> {submittedReports.length} records</span>
        </div>
        {submittedReports.length === 0 ? (
          <div className="px-5 py-12 text-center sm:px-7">
            <p className="text-sm font-semibold text-brand-ink dark:text-white">No reports saved on this device yet</p>
            <p className="mt-2 text-xs text-brand-muted dark:text-slate-400">Submitted observations will appear here with their review status.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left">
              <thead>
                <tr className="bg-brand-canvas/70 text-[9px] font-bold uppercase tracking-widest text-brand-muted dark:bg-slate-800/70 dark:text-slate-400">
                  <th className="px-5 py-3">Reference ID</th>
                  <th className="px-5 py-3">Date &amp; time</th>
                  <th className="px-5 py-3">Weather category</th>
                  <th className="px-5 py-3">Location</th>
                  <th className="px-5 py-3">AI confidence</th>
                  <th className="px-5 py-3">Current status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-hairline dark:divide-slate-800">
                {submittedReports.map(record => (
                  <tr key={record.id} className="text-xs text-brand-body dark:text-slate-300">
                    <td className="px-5 py-4 font-mono font-bold text-brand-ink dark:text-white">{record.id}{record.demo && <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-[8px] font-bold text-amber-900 dark:bg-amber-950 dark:text-amber-200">LOCAL</span>}</td>
                    <td className="px-5 py-4">{new Date(record.timestamp).toLocaleString()}</td>
                    <td className="px-5 py-4">{record.category}</td>
                    <td className="max-w-xs truncate px-5 py-4" title={record.location}>{record.location}</td>
                    <td className="px-5 py-4 font-mono tabular-nums">{record.aiConfidence === null ? 'Pending' : `${(record.aiConfidence * 100).toFixed(0)}%${record.demo ? ' · demo' : ''}`}</td>
                    <td className="px-5 py-4"><span className={`rounded-md px-2 py-1 text-[9px] font-black tracking-wide ${
                      record.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : record.status === 'LIKELY' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : record.status === 'UNVERIFIED' ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}>{record.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default ReportForm;
