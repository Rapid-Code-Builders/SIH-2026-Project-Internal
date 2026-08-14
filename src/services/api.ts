// =============================================================================
// TideSense API Service Layer
// =============================================================================
// This file centralizes ALL API calls in one place.
//
// MOCK MODE TOGGLE:
// If VITE_USE_MOCK=true in your .env file, this file returns mock data.
// If VITE_USE_MOCK=false, this file makes REAL fetch() calls to the backend.
// =============================================================================

import type {
  AuthResponse,
  Beach,
  DashboardResponse,
  Alert,
  Report,
  Profile,
} from '../types';

import {
  mockBeaches,
  mockAlerts,
  mockDashboard,
  mockUser,
  mockProfile,
  mockReports,
} from './mockData';

// Get environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

// Simulated network delay for mock mode
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// -----------------------------------------------------------------------------
// Real Fetch Helpers
// -----------------------------------------------------------------------------
function getToken(): string | null {
  return localStorage.getItem('token');
}

function authHeaders(): HeadersInit {
  const token = getToken();
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

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

export async function login(email: string, password: string): Promise<AuthResponse> {
  if (USE_MOCK) {
    await delay(800);
    // Return AUTHORITY role for authority demo account
    const isAuthority = email.toLowerCase().includes('authority');
    const user = isAuthority
      ? { ...mockUser, email, role: 'AUTHORITY' as const, name: 'Authority Officer' }
      : { ...mockUser, email };
    return { access_token: 'mock-jwt-token-123', token_type: 'bearer', user };
  }
  
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse<AuthResponse>(response);
}

export async function register(name: string, email: string, password: string): Promise<AuthResponse> {
  if (USE_MOCK) {
    await delay(800);
    return { access_token: 'mock-jwt-token-123', token_type: 'bearer', user: { ...mockUser, name, email } };
  }

  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  return handleResponse<AuthResponse>(response);
}

export async function getCurrentUser(): Promise<{ user: { id: number; name: string; email: string; role: string } }> {
  if (USE_MOCK) {
    await delay(300);
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token');
    // Restore stored user data (role included) if available
    const storedUser = localStorage.getItem('mock_user');
    if (storedUser) return { user: JSON.parse(storedUser) };
    return { user: mockUser as any };
  }

  const response = await fetch(`${API_URL}/api/auth/me`, {
    headers: authHeaders(),
  });
  return handleResponse(response);
}

// =============================================================================
// BEACH ENDPOINTS (Public)
// =============================================================================

export async function getBeaches(): Promise<Beach[]> {
  if (USE_MOCK) {
    await delay(600);
    return mockBeaches;
  }

  const response = await fetch(`${API_URL}/api/beaches`, {
    headers: { 'Content-Type': 'application/json' },
  });
  return handleResponse<Beach[]>(response);
}

export async function getBeachDashboard(beachId: number, activity: string = 'swimming'): Promise<DashboardResponse> {
  if (USE_MOCK) {
    await delay(600);
    return mockDashboard(beachId, activity);
  }

  const response = await fetch(`${API_URL}/api/beaches/${beachId}/dashboard?activity=${activity}`, { 
    headers: { 'Content-Type': 'application/json' } 
  });
  return handleResponse<DashboardResponse>(response);
}

// =============================================================================
// ALERT ENDPOINTS (Public read, Authority write)
// =============================================================================

export async function getAlerts(): Promise<Alert[]> {
  if (USE_MOCK) {
    await delay(400);
    return mockAlerts;
  }

  const response = await fetch(`${API_URL}/api/alerts`, {
    headers: { 'Content-Type': 'application/json' },
  });
  return handleResponse<Alert[]>(response);
}

export async function getAlertById(alertId: number): Promise<Alert> {
  if (USE_MOCK) {
    await delay(400);
    const alert = mockAlerts.find(a => a.id === alertId);
    if (!alert) throw new Error('Alert not found');
    return alert;
  }

  const response = await fetch(`${API_URL}/api/alerts/${alertId}`, {
    headers: { 'Content-Type': 'application/json' },
  });
  return handleResponse<Alert>(response);
}

export async function createAlert(alertData: any): Promise<Alert> {
  if (USE_MOCK) {
    await delay(800);
    const newAlert = { ...alertData, id: Math.floor(Math.random() * 1000), status: 'ACTIVE', created_at: new Date().toISOString() };
    mockAlerts.push(newAlert);
    return newAlert;
  }

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

export async function submitReport(reportData: any): Promise<Report> {
  if (USE_MOCK) {
    await delay(800);
    const newReport = { ...reportData, id: Math.floor(Math.random() * 1000), status: 'PENDING', created_at: new Date().toISOString() };
    mockReports.push(newReport);
    return newReport;
  }

  const response = await fetch(`${API_URL}/api/reports`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(reportData),
  });
  return handleResponse<Report>(response);
}

export async function getReports(): Promise<Report[]> {
  if (USE_MOCK) {
    await delay(500);
    return mockReports;
  }

  const response = await fetch(`${API_URL}/api/reports`, {
    headers: authHeaders(),
  });
  return handleResponse<Report[]>(response);
}

export async function updateReportStatus(reportId: number, status: 'VERIFIED' | 'REJECTED'): Promise<Report> {
  if (USE_MOCK) {
    await delay(500);
    const report = mockReports.find(r => r.id === reportId);
    if (!report) throw new Error('Report not found');
    report.status = status;
    return report;
  }

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

export async function getProfile(): Promise<Profile> {
  if (USE_MOCK) {
    await delay(500);
    return mockProfile;
  }

  const response = await fetch(`${API_URL}/api/users/me`, {
    headers: authHeaders(),
  });
  return handleResponse<Profile>(response);
}

export async function updateProfile(profileData: Partial<Profile>): Promise<Profile> {
  if (USE_MOCK) {
    await delay(800);
    Object.assign(mockProfile, profileData);
    return mockProfile;
  }

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

export async function refreshData(): Promise<{ message: string }> {
  if (USE_MOCK) {
    await delay(1500);
    return { message: 'Data successfully synced from INCOIS and Open-Meteo.' };
  }

  const response = await fetch(`${API_URL}/api/admin/sync/all`, {
    method: 'POST',
    headers: authHeaders(),
  });
  return handleResponse<{ message: string }>(response);
}
