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
    created_at: new Date().toISOString(),
    source: 'INCOIS',
  },
  {
    id: 2,
    beach_id: 1,
    beach_name: 'Baga Beach',
    title: 'Jellyfish Sighting',
    alert_type: 'MARINE_LIFE',
    severity: 'WARNING',
    message: 'Multiple reports of jellyfish stings in the shallow waters.',
    status: 'ACTIVE',
    created_at: new Date().toISOString(),
  }
];

export const mockDashboard = (beachId: number, activity: string): DashboardResponse => {
  const beach = mockBeaches.find(b => b.id === beachId) || mockBeaches[0];
  
  // Create a slight variation in score so you can see the UI update!
  // In reality, the backend's heavy Python weighting algorithm will calculate this.
  let modifier = 0;
  if (activity === 'surfing') modifier = -10;
  if (activity === 'fishing') modifier = +5;
  if (activity === 'diving') modifier = -15;

  // Ensure score stays between 0 and 100
  const finalScore = Math.max(0, Math.min(100, beach.safety_score + modifier));
  
  // Adjust status based on new score
  let finalStatus = beach.status;
  if (finalScore >= 80) finalStatus = 'SAFE';
  else if (finalScore >= 50) finalStatus = 'CAUTION';
  else finalStatus = 'UNSAFE';
  
  return {
    beach,
    safety_index: {
      score: finalScore,
      status: finalStatus as 'SAFE' | 'CAUTION' | 'UNSAFE',
      activity: activity,
    },
    conditions: [
      {
        category: 'weather',
        score: 85,
        status: 'SAFE',
        details: { temperature: '28°C', wind_speed: '12 km/h' },
        source: 'Open-Meteo',
      },
      {
        category: 'ocean',
        score: beach.status === 'UNSAFE' ? 30 : 70,
        status: beach.status,
        details: { wave_height: beach.wave_height + 'm', rip_current_risk: beach.status === 'UNSAFE' ? 'High' : 'Low' },
        source: 'INCOIS',
      }
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
};

export const mockReports: Report[] = [];
