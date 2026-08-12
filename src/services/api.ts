// =============================================================================
// TideSense API Service Layer
// =============================================================================
// This file centralizes ALL API calls in one place.
// Think of it like a "repository" or "service" layer in backend architecture:
//   - Controller (React component) -> Service (this file) -> External API (FastAPI)
//
// WHY centralize?
//   1. If the API URL changes, you update ONE file, not 20 components.
//   2. All error handling, auth headers, and response parsing live here.
//   3. Components stay clean — they just call functions and render data.
//
// IMPORTANT: We use plain fetch() — no Redux, no Zustand, no TanStack Query.
// For a one-day hackathon build, fetch() is perfectly sufficient.
// =============================================================================

import type {
  AuthResponse,
  Beach,
  DashboardResponse,
  Alert,
  Report,
  Profile,
} from '../types';

// Read the API base URL from environment variables.
// In Vite, env vars prefixed with VITE_ are exposed to the client.
// This is set in the .env file: VITE_API_URL=http://localhost:8000
// NEVER hardcode URLs — this makes switching between dev/staging/prod trivial.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// -----------------------------------------------------------------------------
// Helper: Get the stored JWT token from localStorage
// -----------------------------------------------------------------------------
// localStorage is like a simple key-value store in the browser.
// Think of it as a tiny database that persists across page refreshes.
// We store the JWT here after login so every subsequent request can include it.
// NOTE: In production, you'd use httpOnly cookies for security. localStorage
// is fine for a hackathon prototype.
// -----------------------------------------------------------------------------
function getToken(): string | null {
  return localStorage.getItem('token');
}

// -----------------------------------------------------------------------------
// Helper: Build request headers
// -----------------------------------------------------------------------------
// Similar to how your FastAPI middleware reads the Authorization header,
// we attach the JWT token to every authenticated request.
// -----------------------------------------------------------------------------
function authHeaders(): HeadersInit {
  const token = getToken();
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// -----------------------------------------------------------------------------
// Helper: Handle API responses
// -----------------------------------------------------------------------------
// This is like a middleware that checks the HTTP status code before
// passing the response body to the calling function.
// If the status is not OK (2xx), we throw an error that the component can catch.
// -----------------------------------------------------------------------------
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `API Error: ${response.status}`);
  }
  return response.json();
}

// =============================================================================
// AUTH ENDPOINTS
// =============================================================================

/** POST /api/auth/login — Authenticate user and receive JWT */
export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse<AuthResponse>(response);
}

/** POST /api/auth/register — Create a new user account */
export async function register(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  return handleResponse<AuthResponse>(response);
}

/** GET /api/auth/me — Verify current token and get user info */
export async function getCurrentUser(): Promise<{ user: { id: number; name: string; email: string; role: string } }> {
  const response = await fetch(`${API_URL}/api/auth/me`, {
    headers: authHeaders(),
  });
  return handleResponse(response);
}

// =============================================================================
// BEACH ENDPOINTS (Public)
// =============================================================================

/** GET /api/beaches — Fetch all beaches with basic safety info */
export async function getBeaches(): Promise<Beach[]> {
  const response = await fetch(`${API_URL}/api/beaches`, {
    headers: { 'Content-Type': 'application/json' },
  });
  return handleResponse<Beach[]>(response);
}

/** GET /api/beaches/{id}/dashboard?activity={activity} — Full beach dashboard */
export async function getBeachDashboard(
  beachId: number,
  activity: string = 'swimming'
): Promise<DashboardResponse> {
  const response = await fetch(
    `${API_URL}/api/beaches/${beachId}/dashboard?activity=${activity}`,
    { headers: { 'Content-Type': 'application/json' } }
  );
  return handleResponse<DashboardResponse>(response);
}

// =============================================================================
// ALERT ENDPOINTS (Public read, Authority write)
// =============================================================================

/** GET /api/alerts — Fetch all active alerts */
export async function getAlerts(): Promise<Alert[]> {
  const response = await fetch(`${API_URL}/api/alerts`, {
    headers: { 'Content-Type': 'application/json' },
  });
  return handleResponse<Alert[]>(response);
}

/** GET /api/alerts/{id} — Fetch a single alert by ID */
export async function getAlertById(alertId: number): Promise<Alert> {
  const response = await fetch(`${API_URL}/api/alerts/${alertId}`, {
    headers: { 'Content-Type': 'application/json' },
  });
  return handleResponse<Alert>(response);
}

/** POST /api/alerts — Create a new alert (Authority only) */
export async function createAlert(alertData: {
  beach_id: number;
  alert_type: string;
  severity: string;
  title: string;
  message: string;
  expires_at?: string;
}): Promise<Alert> {
  const response = await fetch(`${API_URL}/api/alerts`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(alertData),
  });
  return handleResponse<Alert>(response);
}

// =============================================================================
// REPORT ENDPOINTS
// =============================================================================

/** POST /api/reports — Submit a new report (authenticated users) */
export async function submitReport(reportData: {
  beach_id: number;
  issue_type: string;
  description: string;
  latitude?: number;
  longitude?: number;
}): Promise<Report> {
  const response = await fetch(`${API_URL}/api/reports`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(reportData),
  });
  return handleResponse<Report>(response);
}

/** GET /api/reports — Fetch all reports (Authority) */
export async function getReports(): Promise<Report[]> {
  const response = await fetch(`${API_URL}/api/reports`, {
    headers: authHeaders(),
  });
  return handleResponse<Report[]>(response);
}

/** PUT /api/reports/{id} — Update report status (Authority verify/reject) */
export async function updateReportStatus(
  reportId: number,
  status: 'VERIFIED' | 'REJECTED'
): Promise<Report> {
  const response = await fetch(`${API_URL}/api/reports/${reportId}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ status }),
  });
  return handleResponse<Report>(response);
}

// =============================================================================
// PROFILE ENDPOINTS
// =============================================================================

/** GET /api/users/me — Get current user's profile */
export async function getProfile(): Promise<Profile> {
  const response = await fetch(`${API_URL}/api/users/me`, {
    headers: authHeaders(),
  });
  return handleResponse<Profile>(response);
}

/** PUT /api/users/me — Update current user's profile */
export async function updateProfile(profileData: Partial<Profile>): Promise<Profile> {
  const response = await fetch(`${API_URL}/api/users/me`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(profileData),
  });
  return handleResponse<Profile>(response);
}

// =============================================================================
// ADMIN ENDPOINTS (Authority only)
// =============================================================================

/** POST /api/admin/sync/all — Trigger data refresh from all external sources */
export async function refreshData(): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/api/admin/sync/all`, {
    method: 'POST',
    headers: authHeaders(),
  });
  return handleResponse<{ message: string }>(response);
}
