export type Phenomenon = 'Rain' | 'Flood' | 'Storm' | 'Heatwave' | 'Fog' | 'Wind' | 'Hail' | 'Other';
export type ReportStatus = 'submitted' | 'ai_analysis' | 'under_review' | 'verified' | 'suspicious' | 'flagged';
export type SourceType = 'citizen' | 'official' | 'sensor' | 'satellite';

export interface WeatherReport {
  id: string;
  phenomenon: Phenomenon;
  location: {
    lat: number;
    lng: number;
    address?: string;
    city?: string;
    state?: string;
  };
  description: string;
  timestamp: string;
  status: ReportStatus;
  trustScore: number;
  aiConfidence: number;
  source: SourceType;
  media?: string[];
  verifiedBy?: string;
  verificationDate?: string;
}

export interface IntelligenceKPIs {
  totalReports: number;
  verifiedReports: number;
  underReview: number;
  suspiciousReports: number;
  activeAlerts: number;
  systemTrustIndex: number;
  aiCrossRefRate: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  referenceId: string;
  details: string;
}

export interface DataSource {
  id: string;
  name: string;
  type: string;
  status: 'LIVE' | 'DELAYED' | 'OFFLINE';
  trustScore: number;
  lastUpdated: string;
}
