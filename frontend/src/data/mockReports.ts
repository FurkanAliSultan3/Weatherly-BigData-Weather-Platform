export type MockReportStatus = 'VERIFIED' | 'LIKELY' | 'UNVERIFIED' | 'FLAGGED';
export type MockReportCategory =
  | 'RAINFALL'
  | 'FLOODING'
  | 'THUNDERSTORM'
  | 'HEATWAVE'
  | 'FOG'
  | 'HIGH_WINDS'
  | 'DUST_STORM';

export interface MockWeatherReport {
  id: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  category: MockReportCategory;
  description: string;
  status: MockReportStatus;
  ai_confidence: number;
  timestamp: string;
  source: 'CITIZEN' | 'SOCIAL_MEDIA' | 'IMD_TELEMETRY';
  media_url?: string;
}

export interface MapWeatherReport {
  id: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  category: string;
  description: string;
  status: MockReportStatus;
  aiConfidence: number;
  timestamp: string;
  source: string;
  mediaUrl?: string;
}

export const mockReports: MockWeatherReport[] = [
  { id: 'R-101', city: 'Mumbai', state: 'Maharashtra', lat: 19.0176, lng: 72.8562, category: 'FLOODING', description: 'Water has reached the footpath near Hindmata junction after several hours of intense monsoon rain.', status: 'VERIFIED', ai_confidence: 0.94, timestamp: '10 mins ago', source: 'CITIZEN', media_url: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0' },
  { id: 'R-102', city: 'Mumbai', state: 'Maharashtra', lat: 19.1136, lng: 72.8697, category: 'RAINFALL', description: 'A strong rain band is moving across Andheri East; visibility has dropped on the Western Express Highway.', status: 'LIKELY', ai_confidence: 0.78, timestamp: '2 hours ago', source: 'IMD_TELEMETRY', media_url: 'https://images.unsplash.com/photo-1501691223387-dd0500403074' },
  { id: 'R-103', city: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777, category: 'THUNDERSTORM', description: 'Intermittent thunder and lightning reported around Dadar, with brief power flickers in nearby streets.', status: 'UNVERIFIED', ai_confidence: 0.56, timestamp: '8 hours ago', source: 'SOCIAL_MEDIA' },
  { id: 'R-104', city: 'Mumbai', state: 'Maharashtra', lat: 18.9219, lng: 72.8347, category: 'HIGH_WINDS', description: 'A gusty squall near Colaba has brought down small branches along the waterfront promenade.', status: 'FLAGGED', ai_confidence: 0.22, timestamp: '1 day ago', source: 'CITIZEN' },

  { id: 'R-105', city: 'Delhi', state: 'Delhi', lat: 28.6139, lng: 77.2090, category: 'FOG', description: 'Dense early-morning fog has reduced visibility near India Gate and slowed traffic on Rajpath.', status: 'VERIFIED', ai_confidence: 0.91, timestamp: '25 mins ago', source: 'IMD_TELEMETRY', media_url: 'https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227' },
  { id: 'R-106', city: 'Delhi', state: 'Delhi', lat: 28.5562, lng: 77.1000, category: 'FOG', description: 'Low visibility reported on the approach roads to IGI Airport; drivers are using hazard lights.', status: 'LIKELY', ai_confidence: 0.72, timestamp: '4 hours ago', source: 'CITIZEN' },
  { id: 'R-107', city: 'Delhi', state: 'Delhi', lat: 28.7041, lng: 77.1025, category: 'DUST_STORM', description: 'A brief dusty gust has swept through Rohini, depositing dust on parked vehicles and reducing visibility.', status: 'UNVERIFIED', ai_confidence: 0.49, timestamp: '12 hours ago', source: 'SOCIAL_MEDIA', media_url: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35' },
  { id: 'R-108', city: 'Delhi', state: 'Delhi', lat: 28.5355, lng: 77.2486, category: 'HEATWAVE', description: 'Residents near Lajpat Nagar report unusually hot afternoon conditions and warm indoor temperatures.', status: 'FLAGGED', ai_confidence: 0.18, timestamp: '2 days ago', source: 'CITIZEN' },

  { id: 'R-109', city: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707, category: 'RAINFALL', description: 'A persistent downpour is affecting T. Nagar, with slow-moving traffic near Pondy Bazaar.', status: 'VERIFIED', ai_confidence: 0.96, timestamp: '40 mins ago', source: 'CITIZEN', media_url: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0' },
  { id: 'R-110', city: 'Chennai', state: 'Tamil Nadu', lat: 13.0108, lng: 80.2350, category: 'FLOODING', description: 'Water is accumulating at the low-lying junction by Velachery railway station after evening showers.', status: 'LIKELY', ai_confidence: 0.83, timestamp: '3 hours ago', source: 'CITIZEN' },
  { id: 'R-111', city: 'Chennai', state: 'Tamil Nadu', lat: 13.0500, lng: 80.2824, category: 'HIGH_WINDS', description: 'Strong coastal gusts are blowing spray over the Marina Beach promenade; visitors are being asked to move inland.', status: 'UNVERIFIED', ai_confidence: 0.61, timestamp: '1 day ago', source: 'SOCIAL_MEDIA' },
  { id: 'R-112', city: 'Chennai', state: 'Tamil Nadu', lat: 12.9716, lng: 80.2206, category: 'THUNDERSTORM', description: 'Thunderstorm cells are passing over Perungudi with short bursts of rain and occasional lightning.', status: 'FLAGGED', ai_confidence: 0.29, timestamp: '3 days ago', source: 'CITIZEN' },

  { id: 'R-113', city: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639, category: 'THUNDERSTORM', description: 'Lightning and heavy thunder have been reported around Park Street as a pre-monsoon cell moves east.', status: 'VERIFIED', ai_confidence: 0.89, timestamp: '1 hour ago', source: 'IMD_TELEMETRY', media_url: 'https://images.unsplash.com/photo-1500674425229-f692875b0ab7' },
  { id: 'R-114', city: 'Kolkata', state: 'West Bengal', lat: 22.5958, lng: 88.4497, category: 'RAINFALL', description: 'A short, intense shower has flooded sections of the service road near Sector V in Salt Lake.', status: 'LIKELY', ai_confidence: 0.69, timestamp: '6 hours ago', source: 'CITIZEN' },
  { id: 'R-115', city: 'Kolkata', state: 'West Bengal', lat: 22.5850, lng: 88.3426, category: 'FOG', description: 'Patchy morning mist is affecting visibility along the Hooghly riverfront and Howrah approach roads.', status: 'UNVERIFIED', ai_confidence: 0.44, timestamp: '2 days ago', source: 'SOCIAL_MEDIA' },
  { id: 'R-116', city: 'Kolkata', state: 'West Bengal', lat: 22.5448, lng: 88.3426, category: 'FLOODING', description: 'A social post claims knee-deep water near Kalighat metro entrance, but the location and footage are unconfirmed.', status: 'FLAGGED', ai_confidence: 0.14, timestamp: '4 days ago', source: 'SOCIAL_MEDIA' },

  { id: 'R-117', city: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lng: 77.5946, category: 'FLOODING', description: 'Stormwater has spilled onto the road near Indiranagar 100 Feet Road, slowing traffic at the junction.', status: 'VERIFIED', ai_confidence: 0.93, timestamp: '5 mins ago', source: 'CITIZEN', media_url: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0' },
  { id: 'R-118', city: 'Bengaluru', state: 'Karnataka', lat: 12.9698, lng: 77.7500, category: 'RAINFALL', description: 'Steady rain is moving across Whitefield; water is beginning to collect beside the Hope Farm bus stop.', status: 'LIKELY', ai_confidence: 0.81, timestamp: '2 hours ago', source: 'IMD_TELEMETRY' },
  { id: 'R-119', city: 'Bengaluru', state: 'Karnataka', lat: 12.8452, lng: 77.6602, category: 'THUNDERSTORM', description: 'A thunderstorm is approaching Electronic City from the west with gusty winds and isolated lightning.', status: 'UNVERIFIED', ai_confidence: 0.52, timestamp: '18 hours ago', source: 'CITIZEN' },
  { id: 'R-120', city: 'Bengaluru', state: 'Karnataka', lat: 13.0358, lng: 77.5970, category: 'HIGH_WINDS', description: 'A user-submitted clip alleges roof damage near Hebbal, but the footage appears to be from another city.', status: 'FLAGGED', ai_confidence: 0.25, timestamp: '3 days ago', source: 'SOCIAL_MEDIA' },

  { id: 'R-121', city: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867, category: 'HEATWAVE', description: 'Afternoon heat is intense around Charminar; shaded public areas are crowded and water demand is elevated.', status: 'VERIFIED', ai_confidence: 0.97, timestamp: '30 mins ago', source: 'IMD_TELEMETRY' },
  { id: 'R-122', city: 'Hyderabad', state: 'Telangana', lat: 17.4435, lng: 78.3772, category: 'THUNDERSTORM', description: 'Dark storm clouds and distant thunder have been reported over HITEC City, with rain likely within the hour.', status: 'LIKELY', ai_confidence: 0.74, timestamp: '5 hours ago', source: 'CITIZEN' },
  { id: 'R-123', city: 'Hyderabad', state: 'Telangana', lat: 17.4065, lng: 78.4772, category: 'RAINFALL', description: 'A brief shower has left wet roads around Abids; no significant waterlogging has been confirmed.', status: 'UNVERIFIED', ai_confidence: 0.40, timestamp: '1 day ago', source: 'SOCIAL_MEDIA' },
  { id: 'R-124', city: 'Hyderabad', state: 'Telangana', lat: 17.4933, lng: 78.3915, category: 'DUST_STORM', description: 'A forwarded message warns of a severe dust storm in Kukatpally, but no local observations support it yet.', status: 'FLAGGED', ai_confidence: 0.31, timestamp: '5 days ago', source: 'SOCIAL_MEDIA' },

  { id: 'R-125', city: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873, category: 'HEATWAVE', description: 'Prolonged afternoon heat has affected the walled city; outdoor workers are taking frequent shade breaks.', status: 'VERIFIED', ai_confidence: 0.90, timestamp: '1 hour ago', source: 'IMD_TELEMETRY' },
  { id: 'R-126', city: 'Jaipur', state: 'Rajasthan', lat: 26.9855, lng: 75.8513, category: 'DUST_STORM', description: 'A dust plume is approaching from the north-west, reducing visibility around the Amer Road corridor.', status: 'LIKELY', ai_confidence: 0.70, timestamp: '7 hours ago', source: 'CITIZEN', media_url: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35' },
  { id: 'R-127', city: 'Jaipur', state: 'Rajasthan', lat: 26.8543, lng: 75.8103, category: 'HIGH_WINDS', description: 'Gusty winds have scattered dry leaves and dust near the railway station; stronger gusts remain unconfirmed.', status: 'UNVERIFIED', ai_confidence: 0.63, timestamp: '2 days ago', source: 'CITIZEN' },
  { id: 'R-128', city: 'Jaipur', state: 'Rajasthan', lat: 26.8910, lng: 75.8150, category: 'RAINFALL', description: 'An old rain video is being shared as a current event near Hawa Mahal; the submitted timestamp does not match.', status: 'FLAGGED', ai_confidence: 0.20, timestamp: '6 days ago', source: 'SOCIAL_MEDIA' },

  { id: 'R-129', city: 'Kochi', state: 'Kerala', lat: 9.9312, lng: 76.2673, category: 'RAINFALL', description: 'Heavy monsoon showers are crossing Fort Kochi, with spray and pooling water along the ferry approach.', status: 'VERIFIED', ai_confidence: 0.95, timestamp: '20 mins ago', source: 'CITIZEN', media_url: 'https://images.unsplash.com/photo-1501691223387-dd0500403074' },
  { id: 'R-130', city: 'Kochi', state: 'Kerala', lat: 9.9816, lng: 76.2999, category: 'FLOODING', description: 'Water is covering part of the service lane near Edappally junction after a strong evening shower.', status: 'LIKELY', ai_confidence: 0.84, timestamp: '4 hours ago', source: 'CITIZEN' },
  { id: 'R-131', city: 'Kochi', state: 'Kerala', lat: 9.9658, lng: 76.2421, category: 'HIGH_WINDS', description: 'Strong sea breeze and choppy water have been observed near Vypin; ferry operations are being monitored.', status: 'UNVERIFIED', ai_confidence: 0.47, timestamp: '3 days ago', source: 'SOCIAL_MEDIA' },
  { id: 'R-132', city: 'Kochi', state: 'Kerala', lat: 10.0261, lng: 76.3080, category: 'THUNDERSTORM', description: 'A report of damaging lightning near Kalamassery uses a recycled image and is awaiting confirmation.', status: 'FLAGGED', ai_confidence: 0.12, timestamp: '6 days ago', source: 'SOCIAL_MEDIA' },

  { id: 'R-133', city: 'Guwahati', state: 'Assam', lat: 26.1445, lng: 91.7362, category: 'RAINFALL', description: 'Persistent rain is falling over central Guwahati, and runoff is collecting near the GS Road underpass.', status: 'VERIFIED', ai_confidence: 0.88, timestamp: '50 mins ago', source: 'IMD_TELEMETRY', media_url: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0' },
  { id: 'R-134', city: 'Guwahati', state: 'Assam', lat: 26.1860, lng: 91.7500, category: 'FLOODING', description: 'Low-lying lanes near Noonmati are reported waterlogged after overnight rain; residents are moving vehicles uphill.', status: 'LIKELY', ai_confidence: 0.68, timestamp: '9 hours ago', source: 'CITIZEN' },
  { id: 'R-135', city: 'Guwahati', state: 'Assam', lat: 26.1158, lng: 91.7086, category: 'THUNDERSTORM', description: 'Thunder is audible across the Brahmaputra riverfront, though lightning activity has not been independently confirmed.', status: 'UNVERIFIED', ai_confidence: 0.59, timestamp: '4 days ago', source: 'SOCIAL_MEDIA' },
  { id: 'R-136', city: 'Guwahati', state: 'Assam', lat: 26.2006, lng: 91.7700, category: 'HIGH_WINDS', description: 'A forwarded alert claims extreme winds near Chandmari, but the attached video is unrelated and the post is flagged.', status: 'FLAGGED', ai_confidence: 0.27, timestamp: '5 days ago', source: 'SOCIAL_MEDIA' },
];

export const normalizeReportStatus = (value: unknown): MockReportStatus => {
  const status = typeof value === 'string' ? value.toUpperCase() : '';
  if (status === 'VERIFIED') return 'VERIFIED';
  if (status === 'LIKELY' || status === 'LIKELY_GENUINE') return 'LIKELY';
  if (status === 'FLAGGED' || status === 'SUSPICIOUS') return 'FLAGGED';
  return 'UNVERIFIED';
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

export const normalizeMapReport = (value: unknown): MapWeatherReport | null => {
  if (!isRecord(value)) return null;
  const location = isRecord(value.location) ? value.location : value;
  const lat = Number(location.lat);
  const lng = Number(location.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  const confidenceValue = value.ai_confidence ?? value.aiConfidence ?? value.trustScore;
  const rawConfidence = Number(confidenceValue ?? 0);
  const aiConfidence = rawConfidence > 1 ? rawConfidence / 100 : rawConfidence;
  const media = Array.isArray(value.media) ? value.media[0] : undefined;
  const mediaUrl = value.media_url ?? value.mediaUrl ?? media;
  const stringValue = (candidate: unknown, fallback: string) =>
    typeof candidate === 'string' && candidate.length > 0 ? candidate : fallback;

  return {
    id: stringValue(value.id, `LIVE-${lat}-${lng}`),
    city: stringValue(value.city ?? location.city, 'Unknown city'),
    state: stringValue(value.state ?? location.state, ''),
    lat,
    lng,
    category: stringValue(value.category ?? value.phenomenon, 'WEATHER EVENT').toUpperCase(),
    description: stringValue(value.description, 'Weather event reported at this location.'),
    status: normalizeReportStatus(value.status),
    aiConfidence: Number.isFinite(aiConfidence) ? aiConfidence : 0,
    timestamp: stringValue(value.timestamp, 'Just now'),
    source: stringValue(value.source, 'CITIZEN'),
    ...(typeof mediaUrl === 'string' ? { mediaUrl } : {}),
  };
};

export const getMockKPIs = (reports: readonly MockWeatherReport[] = mockReports) => {
  const count = (status: MockReportStatus) => reports.filter(report => report.status === status).length;
  return {
    totalReports: reports.length,
    verifiedReports: count('VERIFIED'),
    likelyReports: count('LIKELY'),
    unverifiedReports: count('UNVERIFIED'),
    flaggedReports: count('FLAGGED'),
    underReview: count('LIKELY') + count('UNVERIFIED'),
    suspiciousReports: count('FLAGGED'),
    activeAlerts: count('FLAGGED'),
    systemTrustIndex: Math.round(
      reports.reduce((total, report) => total + report.ai_confidence, 0) / Math.max(reports.length, 1) * 100,
    ),
  };
};

export const getMockChartData = (sourceReports: readonly MockWeatherReport[] = mockReports) => {
  const reports = [...sourceReports];
  const byPhenomenon = Array.from(new Set(reports.map(report => report.category))).map(name => ({
    name,
    value: reports.filter(report => report.category === name).length,
  }));
  const byStatus = (['VERIFIED', 'LIKELY', 'UNVERIFIED', 'FLAGGED'] as const).map(name => ({
    name,
    value: reports.filter(report => report.status === name).length,
  }));
  const dailyBuckets = new Map<number, MockWeatherReport[]>();

  reports.forEach(report => {
    const age = report.timestamp.match(/(\d+)\s*(min|hour|day)/i);
    if (!age) return;
    const amount = Number(age[1]);
    const unit = age[2].toLowerCase();
    const ageInDays = unit === 'day' ? amount : unit === 'hour' ? amount / 24 : amount / 1440;
    const daysAgo = Math.min(6, Math.floor(ageInDays));
    dailyBuckets.set(daysAgo, [...(dailyBuckets.get(daysAgo) ?? []), report]);
  });
  const timeline = Array.from({ length: 7 }, (_, index) => {
    const daysAgo = 6 - index;
    const reports = dailyBuckets.get(daysAgo) ?? [];
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return {
      day: date.toLocaleDateString('en-IN', { weekday: 'short' }),
      reports: reports.length,
      verified: reports.filter(report => report.status === 'VERIFIED').length,
    };
  });

  return { byPhenomenon, byStatus, timeline };
};
