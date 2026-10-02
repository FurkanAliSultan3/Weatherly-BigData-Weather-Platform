import { WeatherReport, IntelligenceKPIs, AuditLogEntry, DataSource } from '../types';

const PHENOMENA: any[] = ['Rain', 'Flood', 'Storm', 'Heatwave', 'Fog', 'Wind', 'Hail', 'Other'];
const STATUSES: any[] = ['submitted', 'ai_analysis', 'under_review', 'verified', 'suspicious', 'flagged'];
const SOURCES: any[] = ['citizen', 'official', 'sensor', 'satellite'];

const generateRandomCoord = (minLat: number, maxLat: number, minLng: number, maxLng: number) => ({
  lat: Math.random() * (maxLat - minLat) + minLat,
  lng: Math.random() * (maxLng - minLng) + minLng,
});

// India Bounding Box (approx)
const INDIA_BOUNDS = { minLat: 8, maxLat: 37, minLng: 68, maxLng: 97 };

export const mockReports: WeatherReport[] = Array.from({ length: 120 }).map((_, i) => {
  const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
  return {
    id: `WL-${10000 + i}`,
    phenomenon: PHENOMENA[Math.floor(Math.random() * PHENOMENA.length)],
    location: {
      ...generateRandomCoord(INDIA_BOUNDS.minLat, INDIA_BOUNDS.maxLat, INDIA_BOUNDS.minLng, INDIA_BOUNDS.maxLng),
      city: ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Ahmedabad', 'Pune'][Math.floor(Math.random() * 8)],
      state: ['Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'West Bengal', 'Telangana', 'Gujarat'][Math.floor(Math.random() * 7)],
    },
    description: "Observation of significant weather event in the area.",
    timestamp: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
    status: status,
    trustScore: Math.random(),
    aiConfidence: Math.random() * 100,
    source: SOURCES[Math.floor(Math.random() * SOURCES.length)],
  };
});

export const mockKPIs: IntelligenceKPIs = {
  totalReports: mockReports.length,
  verifiedReports: mockReports.filter(r => r.status === 'verified').length,
  underReview: mockReports.filter(r => r.status === 'under_review').length,
  suspiciousReports: mockReports.filter(r => r.status === 'suspicious' || r.status === 'flagged').length,
  activeAlerts: Math.floor(Math.random() * 50) + 10,
  systemTrustIndex: 74.2,
  aiCrossRefRate: 88.5,
};

export const mockAuditLogs: AuditLogEntry[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `LOG-${i}`,
  timestamp: new Date(Date.now() - i * 3600000).toISOString(),
  actor: i % 3 === 0 ? 'Weatherly AI' : `Officer IMD-0${(i % 5) + 1}`,
  action: i % 3 === 0 ? 'Classified Report' : 'Verified Report',
  referenceId: mockReports[i].id,
  details: `Action performed on report ${mockReports[i].id} based on automated/manual review.`,
}));

export const mockDataSources: DataSource[] = [
  { id: 'src-1', name: 'IMD Observations', type: 'Official', status: 'LIVE', trustScore: 0.98, lastUpdated: new Date().toISOString() },
  { id: 'src-2', name: 'Doppler Radar', type: 'Sensor', status: 'LIVE', trustScore: 0.97, lastUpdated: new Date().toISOString() },
  { id: 'src-3', name: 'Satellite Feeds', type: 'Satellite', status: 'LIVE', trustScore: 0.96, lastUpdated: new Date().toISOString() },
  { id: 'src-4', name: 'Citizen Reports', type: 'Crowdsourced', status: 'LIVE', trustScore: 0.71, lastUpdated: new Date().toISOString() },
  { id: 'src-5', name: 'News Sources', type: 'Web', status: 'DELAYED', trustScore: 0.64, lastUpdated: new Date().toISOString() },
];
