import { useSyncExternalStore } from 'react';
import { mockReports, normalizeReportStatus } from './mockReports';
import type { MockReportStatus, MockWeatherReport } from './mockReports';

export interface OfficerAuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  referenceId: string;
  details: string;
}

export interface SafeZoneDetails {
  name: string;
  capacity: number;
  lat: number;
  lng: number;
}

export interface OfficerBroadcast {
  id: string;
  title: string;
  category: 'FLOOD' | 'CYCLONE' | 'HEATWAVE' | 'HIGH_WIND';
  severity: 'CRITICAL' | 'WARNING' | 'WATCH';
  region: string;
  city: string;
  lat: number;
  lng: number;
  radiusKm: number;
  safeZone: SafeZoneDetails;
  active: boolean;
  createdAt: string;
  actor: string;
}

const REPORT_OVERRIDES_KEY = 'weatherly-officer-report-overrides';
const AUDIT_EVENTS_KEY = 'weatherly-officer-audit-events';
const BROADCASTS_KEY = 'weatherly-officer-broadcasts';
const CHANGE_EVENT = 'weatherly-officer-store-change';

const initialAuditEvents: OfficerAuditEvent[] = [
  {
    id: 'AUD-001',
    timestamp: '2026-10-04T18:35:00.000Z',
    actor: 'Officer Priya',
    action: 'Verified Report',
    referenceId: 'R-102',
    details: 'Officer Priya marked Report #R-102 (Mumbai Flood) as VERIFIED. AI Confidence: 94%.',
  },
  {
    id: 'AUD-002',
    timestamp: '2026-10-04T16:20:00.000Z',
    actor: 'Weatherly AI',
    action: 'Flagged Report',
    referenceId: 'R-108',
    details: 'System Auto-Engine flagged Report #R-108 as FLAGGED (Duplicate Media Detected).',
  },
  {
    id: 'AUD-003',
    timestamp: '2026-10-03T09:10:00.000Z',
    actor: 'Officer Admin',
    action: 'Published Broadcast',
    referenceId: 'BR-OD-001',
    details: 'Officer Admin published Emergency Cyclone Advisory for Odisha Coast.',
  },
];

const readJson = <T,>(key: string, fallback: T): T => {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) ?? 'null');
    return value === null ? fallback : value as T;
  } catch (error) {
    console.error(`Could not read prototype data from ${key}`, error);
    return fallback;
  }
};

const emitChange = () => {
  window.dispatchEvent(new Event(CHANGE_EVENT));
};

export const subscribeOfficerStore = (listener: () => void) => {
  window.addEventListener(CHANGE_EVENT, listener);
  window.addEventListener('storage', listener);
  return () => {
    window.removeEventListener(CHANGE_EVENT, listener);
    window.removeEventListener('storage', listener);
  };
};

export const useOfficerStoreVersion = () =>
  useSyncExternalStore(subscribeOfficerStore, () => {
    return [
      localStorage.getItem(REPORT_OVERRIDES_KEY) ?? '',
      localStorage.getItem(AUDIT_EVENTS_KEY) ?? '',
      localStorage.getItem(BROADCASTS_KEY) ?? '',
    ].join('|');
  }, () => '');

export const getOfficerReports = (): MockWeatherReport[] => {
  const overrides = readJson<Record<string, Partial<MockWeatherReport>>>(REPORT_OVERRIDES_KEY, {});
  return mockReports.map(report => {
    const override = overrides[report.id];
    return override ? { ...report, ...override } : report;
  });
};

export const getOfficerReport = (id: string) => getOfficerReports().find(report => report.id === id) ?? null;

export const updateOfficerReportStatus = (id: string, status: MockReportStatus) => {
  const report = getOfficerReport(id);
  if (!report) return null;
  const overrides = readJson<Record<string, Partial<MockWeatherReport>>>(REPORT_OVERRIDES_KEY, {});
  const updatedReport = { ...report, status: normalizeReportStatus(status) };
  overrides[id] = { ...overrides[id], status: updatedReport.status };
  localStorage.setItem(REPORT_OVERRIDES_KEY, JSON.stringify(overrides));
  emitChange();
  return updatedReport;
};

export const getAuditEvents = (): OfficerAuditEvent[] => {
  const events = readJson<OfficerAuditEvent[]>(AUDIT_EVENTS_KEY, initialAuditEvents);
  return [...events].sort((left, right) => right.timestamp.localeCompare(left.timestamp));
};

export const appendAuditEvent = (event: Omit<OfficerAuditEvent, 'id' | 'timestamp'>) => {
  const events = readJson<OfficerAuditEvent[]>(AUDIT_EVENTS_KEY, initialAuditEvents);
  const nextEvent: OfficerAuditEvent = {
    ...event,
    id: `AUD-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toISOString(),
  };
  localStorage.setItem(AUDIT_EVENTS_KEY, JSON.stringify([nextEvent, ...events]));
  emitChange();
  return nextEvent;
};

export const getOfficerBroadcasts = (): OfficerBroadcast[] =>
  readJson<OfficerBroadcast[]>(BROADCASTS_KEY, []);

export const publishOfficerBroadcast = (
  broadcast: Omit<OfficerBroadcast, 'id' | 'active' | 'createdAt' | 'actor'>,
) => {
  const broadcasts = getOfficerBroadcasts();
  const nextBroadcast: OfficerBroadcast = {
    ...broadcast,
    id: `BR-${Date.now().toString(36).toUpperCase()}`,
    active: true,
    createdAt: new Date().toISOString(),
    actor: 'Officer Admin',
  };
  localStorage.setItem(BROADCASTS_KEY, JSON.stringify([nextBroadcast, ...broadcasts]));
  appendAuditEvent({
    actor: nextBroadcast.actor,
    action: 'Published Broadcast',
    referenceId: nextBroadcast.id,
    details: `${nextBroadcast.actor} published ${nextBroadcast.severity} ${nextBroadcast.category.replaceAll('_', ' ')} advisory for ${nextBroadcast.region}.`,
  });
  emitChange();
  return nextBroadcast;
};

export const deactivateOfficerBroadcast = (id: string) => {
  const broadcasts = getOfficerBroadcasts();
  const target = broadcasts.find(broadcast => broadcast.id === id);
  if (!target) return null;
  const updated = broadcasts.map(broadcast => broadcast.id === id ? { ...broadcast, active: false } : broadcast);
  localStorage.setItem(BROADCASTS_KEY, JSON.stringify(updated));
  appendAuditEvent({
    actor: 'Officer Admin',
    action: 'Deactivated Broadcast',
    referenceId: id,
    details: `Officer Admin deactivated ${target.title} for ${target.region}.`,
  });
  emitChange();
  return updated.find(broadcast => broadcast.id === id) ?? null;
};
