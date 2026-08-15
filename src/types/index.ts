// =============================================================================
// TideSense Type Definitions
// =============================================================================
// Think of these like database models or API response schemas in your backend.
// In TypeScript, 'interface' defines the shape of data — similar to how you'd
// define a Pydantic model in FastAPI or a dataclass in Python.
// These types ensure the frontend and backend agree on data structure.
// =============================================================================

/**
 * Represents a user account.
 * Maps to: GET /api/auth/me response
 */
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'AUTHORITY';  // Union type — like an Enum in Python
}

/**
 * Extended user profile with preferences.
 * Maps to: GET /api/users/me and PUT /api/users/me
 */
export interface Profile {
  id: number;
  name: string;
  email: string;
  location?: string;            // '?' means optional — the field may not exist
  preferred_activity?: string;
  emergency_contact?: string;
}

/**
 * A beach entity as returned by the beaches list endpoint.
 * Maps to: GET /api/beaches (each item in the array)
 */
export interface Beach {
  id: number;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  status: 'SAFE' | 'CAUTION' | 'UNSAFE';
  safety_score: number;
  wave_height?: number;
  water_quality?: string;
  crowd_level?: string;
  /** Hero photo URL shown in BeachDetail header. Supply actual beach photo URL here. */
  heroImage?: string;
  /** Array of photo URLs for the Pinterest bento gallery on the detail page. */
  gallery?: string[];
  /** List of activities available at the beach (e.g. swimming, surfing, fishing). */
  activities?: string[];
}

/**
 * Individual condition data (weather, ocean, water quality, crowd).
 * Used inside the BeachDashboard response.
 */
export interface BeachCondition {
  category: string;          // e.g., 'weather', 'ocean', 'water_quality', 'crowd'
  score: number;
  status: string;
  details: Record<string, any>;  // Like a Python dict — flexible key-value pairs
  source?: string;           // e.g., 'Open-Meteo', 'INCOIS', 'CPCB'
  last_updated?: string;     // ISO timestamp
}

/**
 * The Beach Safety Index (BSI) — the hero metric of the app.
 * This comes from the backend's weighted calculation.
 */
export interface SafetyIndex {
  score: number;             // 0-100
  status: 'SAFE' | 'CAUTION' | 'UNSAFE';
  activity: string;          // The activity these weights were computed for
}

/**
 * Full dashboard response for a single beach.
 * Maps to: GET /api/beaches/{id}/dashboard?activity=swimming
 */
export interface DashboardResponse {
  beach: Beach;
  safety_index: SafetyIndex;
  conditions: BeachCondition[];
  alerts: Alert[];
}

/**
 * A safety alert (rip current warning, water quality advisory, etc.).
 * Maps to: GET /api/alerts and GET /api/alerts/{id}
 */
export interface Alert {
  id: number;
  beach_id: number;
  beach_name?: string;
  title: string;
  alert_type: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  message: string;
  instruction?: string;      // "What should you do" — for CRITICAL alerts
  status: 'ACTIVE' | 'EXPIRED' | 'RESOLVED';
  created_at: string;
  expires_at?: string;
  source?: string;
}

/**
 * A user-submitted report (e.g., rip current spotted, pollution).
 * Maps to: POST /api/reports and GET /api/reports
 */
export interface Report {
  id: number;
  beach_id: number;
  beach_name?: string;
  user_id?: number;
  issue_type: string;
  description: string;
  latitude?: number;
  longitude?: number;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  created_at: string;
}

/**
 * Auth response from login/register endpoints.
 * Maps to: POST /api/auth/login and POST /api/auth/register
 */
export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}
