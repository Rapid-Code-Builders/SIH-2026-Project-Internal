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
    activities: ['swimming', 'surfing', 'fishing'],
    heroImage: '/beachesPictures/baga%20beach/06d29b76-86fd-4e98-9367-ee2e294fb5f7.jpg',
    gallery: [
      '/beachesPictures/baga%20beach/10be8864-dc13-402b-98c7-becfbea1430d.jpg',
      '/beachesPictures/baga%20beach/2bc1f6cb-82aa-452d-bf9d-265a8d71a1d0.webp',
      '/beachesPictures/baga%20beach/319b7deb-b51f-4757-860f-9ac3b1ff792c.jpg',
      '/beachesPictures/baga%20beach/34afea71-f436-416b-a6fe-e6d290603b4e.webp',
      '/beachesPictures/baga%20beach/40db756f-1451-4bed-bd9d-44c2becec926.jpg',
    ],
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
    activities: ['fishing'],
    heroImage: '/beachesPictures/marina%20beach/19c89c1b-b234-48fe-aafa-a696fac56ec6.jpg',
    gallery: [
      '/beachesPictures/marina%20beach/1df0c3b7-e7b3-48dd-8990-385e1fec010f.webp',
      '/beachesPictures/marina%20beach/20734ea5-5750-4c11-bbb1-edc5229e7d19.jpg',
      '/beachesPictures/marina%20beach/29ca8b05-e474-4f21-a68e-cdcb9063c7dd.webp',
      '/beachesPictures/marina%20beach/3af9cfb3-5835-4392-afd4-addd2da18d47.jpg',
    ],
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
    activities: ['swimming', 'diving', 'snorkeling'],
    heroImage: '/beachesPictures/radhanagar%20beach/12a367f6-1ab5-4ec7-80e0-d2cb085b205b.webp',
    gallery: [
      '/beachesPictures/radhanagar%20beach/184df79c-e122-4d90-8171-424aed8b27f5.avif',
      '/beachesPictures/radhanagar%20beach/28be9c7b-dbe8-4396-91d6-78088024f3d4.avif',
      '/beachesPictures/radhanagar%20beach/30cbd038-08c9-46e8-9c96-1fc9bc65e10e.avif',
      '/beachesPictures/radhanagar%20beach/436974c9-94e0-42c7-962c-f93f5c893004.webp',
      '/beachesPictures/radhanagar%20beach/4f1d3b19-50de-471c-9fac-93dccc949db3.avif',
      '/beachesPictures/radhanagar%20beach/52ed0738-f086-4153-8ed8-964916fe7077.jpg',
    ],
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
    activities: ['swimming', 'surfing', 'fishing', 'yoga'],
    heroImage: '/beachesPictures/varkala%20beach/30981ce4-69c9-4753-88e0-039f335c25f4.jpg',
    gallery: [
      '/beachesPictures/varkala%20beach/31ca359c-963f-4ee1-a8d8-192db0501925.jpg',
      '/beachesPictures/varkala%20beach/3f0831ab-f273-46be-a504-7bd0a63f1f71.jpg',
      '/beachesPictures/varkala%20beach/57ed5e0d-d898-45a0-9036-b298a1611178.webp',
      '/beachesPictures/varkala%20beach/594a64e9-f895-4633-8959-43902aeda026.jpg',
    ],
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
    activities: ['swimming', 'kayaking', 'fishing'],
    heroImage: '/beachesPictures/palolem%20beach/0acbbeb1-88dc-4689-a284-eff05218a2de.jpg',
    gallery: [
      '/beachesPictures/palolem%20beach/11754388-ffb3-451d-9180-4b190b3d90b2.webp',
      '/beachesPictures/palolem%20beach/1b87c5ef-ea97-4583-9258-c6d896ed7684.webp',
      '/beachesPictures/palolem%20beach/2849b018-ad49-4d9c-bfbe-d6672ed0ab1a.jpg',
      '/beachesPictures/palolem%20beach/30621320-5f90-494c-a9c2-fdc762406e4c.webp',
      '/beachesPictures/palolem%20beach/39af7296-5d28-4e68-aac7-0e1107fbc9cc.jpg',
    ],
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
    activities: ['fishing', 'walking'],
    heroImage: '/beachesPictures/juhu%20beach/0e92e59d-2855-4cb7-a84d-e76dbcba1393.webp',
    gallery: [
      '/beachesPictures/juhu%20beach/1115fa21-f834-410e-8472-48beb12a515e.webp',
      '/beachesPictures/juhu%20beach/13919f2a-a268-4251-a461-13f51a571c1e.webp',
      '/beachesPictures/juhu%20beach/3cc1ab13-2e97-4a27-b6b2-0ad7d2b23de2.webp',
      '/beachesPictures/juhu%20beach/3e224ea2-b9a8-45c1-84e1-4c0351ad6f69.jpg',
    ],
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
