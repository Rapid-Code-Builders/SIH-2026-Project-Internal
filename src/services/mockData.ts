import type { Beach, Alert, DashboardResponse, Profile, User, Report } from '../types';

export const mockBeaches: Beach[] = [
  {
    id: 1,
    name: 'Baga Beach',
    location: 'North Goa, India',
    latitude: 15.5553,
    longitude: 73.7517,
    status: 'CAUTION',
    safety_score: 65,
    wave_height: 1.5,
    water_quality: 'Moderate',
    crowd_level: 'High',
  },
  {
    id: 2,
    name: 'Marina Beach',
    location: 'Chennai, Tamil Nadu',
    latitude: 13.0475,
    longitude: 80.2824,
    status: 'UNSAFE',
    safety_score: 30,
    wave_height: 2.5,
    water_quality: 'Poor',
    crowd_level: 'High',
  },
  {
    id: 3,
    name: 'Radhanagar Beach',
    location: 'Havelock Island, Andaman',
    latitude: 11.9839,
    longitude: 92.9506,
    status: 'SAFE',
    safety_score: 95,
    wave_height: 0.5,
    water_quality: 'Excellent',
    crowd_level: 'Low',
  },
  {
    id: 4,
    name: 'Varkala Beach',
    location: 'Kerala, India',
    latitude: 8.7356,
    longitude: 76.7032,
    status: 'SAFE',
    safety_score: 85,
    wave_height: 0.8,
    water_quality: 'Good',
    crowd_level: 'Moderate',
  },
  {
    id: 5,
    name: 'Palolem Beach',
    location: 'South Goa, India',
    latitude: 15.0100,
    longitude: 74.0232,
    status: 'SAFE',
    safety_score: 88,
    wave_height: 0.6,
    water_quality: 'Good',
    crowd_level: 'Moderate',
  },
  {
    id: 6,
    name: 'Juhu Beach',
    location: 'Mumbai, Maharashtra',
    latitude: 19.0988,
    longitude: 72.8267,
    status: 'CAUTION',
    safety_score: 55,
    wave_height: 1.8,
    water_quality: 'Moderate',
    crowd_level: 'High',
  },
];

export const mockAlerts: Alert[] = [
  {
    id: 1,
    beach_id: 2,
    beach_name: 'Marina Beach',
    title: 'High Tide Warning',
    alert_type: 'OCEAN',
    severity: 'CRITICAL',
    message: 'Extremely high tides and strong rip currents expected. Swimming is strictly prohibited.',
    instruction: 'Stay away from the water. Obey lifeguard instructions.',
    status: 'ACTIVE',
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 min ago
    source: 'INCOIS',
  },
  {
    id: 2,
    beach_id: 1,
    beach_name: 'Baga Beach',
    title: 'Jellyfish Sighting',
    alert_type: 'MARINE_LIFE',
    severity: 'WARNING',
    message: 'Multiple reports of jellyfish stings in the shallow waters near the northern end.',
    instruction: 'Avoid wading in shallow water. Wear protective footwear.',
    status: 'ACTIVE',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hrs ago
    source: 'Local Authority',
  },
  {
    id: 3,
    beach_id: 6,
    beach_name: 'Juhu Beach',
    title: 'Water Quality Advisory',
    alert_type: 'WATER_QUALITY',
    severity: 'INFO',
    message: 'Elevated bacterial levels detected after recent rainfall. Water quality is being monitored.',
    status: 'ACTIVE',
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hrs ago
    source: 'CPCB',
  },
];

export const mockDashboard = (beachId: number, activity: string): DashboardResponse => {
  const beach = mockBeaches.find(b => b.id === beachId) || mockBeaches[0];
  
  // Activity-based score modifier (simulates backend weighting)
  let modifier = 0;
  if (activity === 'surfing') modifier = -10;
  if (activity === 'fishing') modifier = +5;
  if (activity === 'diving') modifier = -15;

  const finalScore = Math.max(0, Math.min(100, beach.safety_score + modifier));
  
  let finalStatus: 'SAFE' | 'CAUTION' | 'UNSAFE' = 'CAUTION';
  if (finalScore >= 80) finalStatus = 'SAFE';
  else if (finalScore >= 50) finalStatus = 'CAUTION';
  else finalStatus = 'UNSAFE';
  
  return {
    beach,
    safety_index: {
      score: finalScore,
      status: finalStatus,
      activity: activity,
    },
    conditions: [
      {
        category: 'weather',
        score: 85,
        status: 'SAFE',
        details: { temperature: '28°C', wind_speed: '12 km/h', humidity: '72%', uv_index: '6 (High)' },
        source: 'Open-Meteo',
        last_updated: new Date().toISOString(),
      },
      {
        category: 'ocean',
        score: beach.status === 'UNSAFE' ? 30 : 70,
        status: beach.status === 'UNSAFE' ? 'UNSAFE' : 'CAUTION',
        details: { wave_height: beach.wave_height + 'm', rip_current_risk: beach.status === 'UNSAFE' ? 'High' : 'Low', tide: 'Rising', swell_period: '8s' },
        source: 'INCOIS',
        last_updated: new Date().toISOString(),
      },
      {
        category: 'water_quality',
        score: beach.water_quality === 'Excellent' ? 95 : beach.water_quality === 'Good' ? 80 : 50,
        status: beach.water_quality === 'Poor' ? 'UNSAFE' : 'SAFE',
        details: { ph_level: '7.8', dissolved_oxygen: '6.2 mg/L', coliform_count: beach.water_quality === 'Poor' ? '520 CFU/100ml' : '85 CFU/100ml' },
        source: 'CPCB',
        last_updated: new Date().toISOString(),
      },
      {
        category: 'crowd',
        score: beach.crowd_level === 'Low' ? 95 : beach.crowd_level === 'Moderate' ? 70 : 40,
        status: beach.crowd_level === 'High' ? 'CAUTION' : 'SAFE',
        details: { estimated_visitors: beach.crowd_level === 'High' ? '~1,200' : '~350', lifeguards_on_duty: '3', congestion_zone: beach.crowd_level === 'High' ? 'Northern shore' : 'None' },
        source: 'Crowd Sensor',
        last_updated: new Date().toISOString(),
      },
    ],
    alerts: mockAlerts.filter(a => a.beach_id === beachId && a.status === 'ACTIVE')
  };
};

export const mockUser: User = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  role: 'USER',
};

export const mockProfile: Profile = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  location: 'Mumbai, India',
  preferred_activity: 'swimming',
  emergency_contact: '+91 98765 43210',
};

export const mockReports: Report[] = [
  {
    id: 101,
    beach_id: 1,
    beach_name: 'Baga Beach',
    user_id: 1,
    issue_type: 'rip_current',
    description: 'Strong rip current spotted near the red flag zone on the northern end. Multiple swimmers were pulled out by lifeguards.',
    status: 'PENDING',
    created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: 102,
    beach_id: 6,
    beach_name: 'Juhu Beach',
    user_id: 2,
    issue_type: 'pollution',
    description: 'Large amount of plastic debris and sewage smell near the southern walkway after the high tide.',
    status: 'PENDING',
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
];
