import React, { useState, useEffect } from 'react';
import { MapContainer, Marker, TileLayer, Popup } from 'react-leaflet';
import { divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { normalizeMapReport } from '../data/mockReports';
import type { MapWeatherReport, MockReportStatus } from '../data/mockReports';
import { getOfficerReports, useOfficerStoreVersion } from '../data/officerStore';
import { createLiveFeedSocket, reportApi } from '../api/client';
import MapLayoutInvalidation from './MapLayoutInvalidation';

const asMapReports = () => getOfficerReports()
  .map(normalizeMapReport)
  .filter((report): report is MapWeatherReport => report !== null);

interface PublicTrustMapProps {
  isDarkTheme?: boolean;
  onCitySelect?: (coords: [number, number]) => void;
  selectedCityCoords?: [number, number];
  isOfficer?: boolean;
  statusFilter?: string;
}

const PublicTrustMap: React.FC<PublicTrustMapProps> = ({
  isDarkTheme = false,
  selectedCityCoords,
  isOfficer = false,
  statusFilter = 'ALL',
}) => {
  useOfficerStoreVersion();
  const demoReports = asMapReports();
  const [liveReports, setLiveReports] = useState<MapWeatherReport[]>([]);
  const mapRef = React.useRef<any>(null);
  const liveIds = new Set(liveReports.map(report => report.id));
  const reports = [...liveReports, ...demoReports.filter(report => !liveIds.has(report.id))];

  useEffect(() => {
    if (mapRef.current && selectedCityCoords) {
      mapRef.current.flyTo(selectedCityCoords, 11);
    }
  }, [selectedCityCoords]);

  useEffect(() => {
    let active = true;
    const loadReports = async () => {
      try {
        const data = isOfficer ? await reportApi.getAdmin() : await reportApi.getPublic();
        if (!Array.isArray(data)) {
          throw new Error('Reports API returned an invalid response.');
        }
        const liveReports = data
          .map(normalizeMapReport)
          .filter((report): report is MapWeatherReport => report !== null);
        if (active) {
          setLiveReports(liveReports);
        }
      } catch (e) {
        console.error("Failed to load reports", e);
        if (active) {
          setLiveReports([]);
        }
      }
    };
    loadReports();

    let socket: WebSocket | null = null;
    try {
      socket = createLiveFeedSocket();
      socket.onmessage = (event) => {
        try {
          const message: unknown = JSON.parse(event.data);
          const newReport = typeof message === 'object' && message !== null && 'data' in message
            ? (message as { data: unknown }).data
            : message;
          const normalized = normalizeMapReport(newReport);
          if (normalized) {
            setLiveReports(prev => [normalized, ...prev.filter(report => report.id !== normalized.id)]);
          }
        } catch (error) {
          console.error('Could not read live report update', error);
        }
      };
    } catch (error) {
      console.error('Could not connect to live report feed', error);
    }

    return () => {
      active = false;
      socket?.close();
    };
  }, [isOfficer]);

  const getColor = (status: MockReportStatus | string) => {
    switch(status?.toUpperCase()) {
      case 'VERIFIED': return '#22c55e';
      case 'LIKELY': return '#eab308';
      case 'UNVERIFIED': return '#3b82f6';
      case 'FLAGGED': return '#ef4444';
      default: return '#94a3b8';
    }
  };

  return (
    <div className="relative z-0 h-full min-h-[400px] w-full overflow-hidden" style={{ height: '100%', width: '100%', minHeight: '400px' }}>
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        style={{ height: '100%', width: '100%', minHeight: '400px' }}
        zoomControl={false}
        ref={mapRef}
      >
        <MapLayoutInvalidation theme={isDarkTheme ? 'dark' : 'light'} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {reports
          .filter(report => {
            const status = report.status?.toUpperCase();
            if (!isOfficer && status === 'FLAGGED') return false;
            if (statusFilter.toUpperCase() === 'ALL') return true;
            return status === statusFilter.toUpperCase();
          })
          .map(report => {
            const color = getColor(report.status);
            const icon = divIcon({
              className: 'weather-report-pin',
              html: `<span style="display:block;width:16px;height:16px;border:3px solid white;border-radius:50% 50% 50% 0;background:${color};transform:rotate(-45deg);box-shadow:0 2px 6px #0f172a80"></span>`,
              iconSize: [18, 18],
              iconAnchor: [9, 16],
              popupAnchor: [0, -14],
            });
            return (
          <Marker key={report.id} position={[report.lat, report.lng]} icon={icon}>
            <Popup>
              <div className="p-1 min-w-[190px] max-w-[260px]">
                <div className="flex justify-between items-start gap-2 mb-1">
                  <span className="font-bold text-slate-900 text-sm">{report.category}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">{report.id}</span>
                </div>
                <div className="text-xs font-semibold text-slate-700 mb-2">{report.city}{report.state ? `, ${report.state}` : ''}</div>
                <div className="text-xs text-slate-600 mb-2">{report.description}</div>
                {report.mediaUrl && (
                  <img src={report.mediaUrl} alt={`${report.category.toLowerCase()} report near ${report.city}`} className="w-full h-24 object-cover rounded mb-2" />
                )}
                <div className="flex items-center justify-between gap-2 text-[11px] font-bold" style={{ color }}>
                  <span>{report.status}</span>
                  <span>AI trust: {Math.round(report.aiConfidence * 100)}%</span>
                </div>
              </div>
            </Popup>
          </Marker>
            );
          })}
      </MapContainer>
    </div>
  );
};

export default PublicTrustMap;
