import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { ShieldCheck, AlertTriangle, Info } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { mockReports, WeatherReport } from '../services/mockData';

interface PublicTrustMapProps {
  isDarkTheme?: boolean;
}

const PublicTrustMap: React.FC<PublicTrustMapProps> = ({ isDarkTheme = false }) => {
  const [reports, setReports] = useState<WeatherReport[]>([]);

  useEffect(() => {
    // Initially using mock data for Phase 1
    setReports(mockReports);
  }, []);

  const getColor = (status: string) => {
    switch(status) {
      case 'verified': return '#22c55e'; // Green
      case 'likely_genuine': return '#eab308'; // Yellow
      case 'under_review': return '#3b82f6'; // Blue
      case 'suspicious':
      case 'flagged': return '#ef4444'; // Red
      default: return '#94a3b8';
    }
  };

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          url={isDarkTheme
            ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {reports.map(report => (
          <CircleMarker
            key={report.id}
            center={[report.location.lat, report.location.lng]}
            radius={6}
            pathOptions={{
              color: getColor(report.status),
              fillColor: getColor(report.status),
              fillOpacity: 0.7,
              weight: 2,
              fillOpacity: 0.6
            }}
          >
            <Popup>
              <div className="p-1 min-w-[150px]">
                <div className="flex justify-between items-start gap-2 mb-1">
                  <span className="font-bold text-slate-900 text-sm">{report.phenomenon}</span>
                  <div className="flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                    {report.id}
                  </div>
                </div>
                <div className="text-xs text-slate-600 mb-2">{report.description}</div>
                <div className="flex items-center gap-2 text-[11px] font-bold" style={{ color: getColor(report.status) }}>
                  {report.status === 'verified' && <ShieldCheck className="w-3 h-3" />}
                  {report.status === 'suspicious' && <AlertTriangle className="w-3 h-3" />}
                  {report.status === 'under_review' && <Info className="w-3 h-3" />}
                  {report.status.toUpperCase()} • Score: {report.trustScore.toFixed(2)}
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
};

export default PublicTrustMap;
