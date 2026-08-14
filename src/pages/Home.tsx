import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import {
  Search,
  ShieldCheck,
  AlertTriangle,
  ShieldAlert,
  Bell,
  MapPin,
  Waves,
  Droplets,
  RefreshCw,
  Wind,
  ArrowUpRight,
  X,
  Maximize2,
  Minimize2,
  ChevronRight,
  ArrowRight,
  Info,
  Activity,
} from 'lucide-react';
import L from 'leaflet';

import { getBeaches, getAlerts } from '../services/api';
import type { Beach, Alert } from '../types';
import { getStatusColor, getStatusBgColor, getGreeting, timeAgo } from '../utils/helpers';



// =============================================================================
// LEAFLET MAP CENTER CONTROLLER
// =============================================================================
function MapController({ target }: { target: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) {
      map.flyTo(target, 8, { duration: 1.2 });
    }
  }, [target, map]);
  return null;
}

// =============================================================================
// CUSTOM MARKER ICONS — light coastal palette
// =============================================================================
const createCustomIcon = (status: string, active = false) => {
  const colorMap: Record<string, string> = {
    SAFE:    '#7C9986',
    CAUTION: '#6E93A6',
    UNSAFE:  '#597D8A',
    INFO:    '#A67C5A',
  };
  const color = colorMap[status?.toUpperCase()] ?? '#A08070';
  const size = active ? 28 : 20;
  const ring = active ? `<circle cx="14" cy="14" r="13" fill="none" stroke="${color}" stroke-width="2" opacity="0.4"/>` : '';

  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="${size}" height="${size}">
      ${ring}
      <circle cx="14" cy="14" r="9" fill="${color}" stroke="#F3E8D9" stroke-width="2"/>
    </svg>
  `;

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: svgIcon,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2) - 4],
  });
};

// =============================================================================
// STATUS CONFIG — light coastal palette
// =============================================================================
const STATUS_CONFIG = {
  SAFE: {
    icon: ShieldCheck,
    color: '#3D8B6E',
    bg: 'rgba(61,139,110,0.10)',
    border: '#3D8B6E',
    bar: '#3D8B6E',
    label: 'Safe',
    unit: 'Beaches',
    activeTab: { background: '#3D8B6E', color: '#FFFFFF', border: '1px solid #3D8B6E' },
  },
  CAUTION: {
    icon: AlertTriangle,
    color: '#C08A2A',
    bg: 'rgba(192,138,42,0.10)',
    border: '#C08A2A',
    bar: '#C08A2A',
    label: 'Caution',
    unit: 'Beaches',
    activeTab: { background: '#C08A2A', color: '#FFFFFF', border: '1px solid #C08A2A' },
  },
  UNSAFE: {
    icon: ShieldAlert,
    color: '#C74B3F',
    bg: 'rgba(199,75,63,0.10)',
    border: '#C74B3F',
    bar: '#C74B3F',
    label: 'Unsafe',
    unit: 'Beach',
    activeTab: { background: '#C74B3F', color: '#FFFFFF', border: '1px solid #C74B3F' },
  },
  ALERTS: {
    icon: Bell,
    color: '#A67C5A',
    bg: 'rgba(166,124,90,0.10)',
    border: '#A67C5A',
    bar: '#A67C5A',
    label: 'Alerts',
    unit: 'Active',
    activeTab: { background: '#A67C5A', color: '#FFFFFF', border: '1px solid #A67C5A' },
  },
};

const ALERT_SEVERITY_CONFIG: Record<string, { color: string; icon: any }> = {
  CRITICAL: { color: '#597D8A', icon: ShieldAlert },
  WARNING:  { color: '#6E93A6', icon: AlertTriangle },
  INFO:     { color: '#A67C5A', icon: Info },
};

// =============================================================================
// NOTIFICATION PANEL
// =============================================================================
const NotificationPanel = ({ alerts, onClose }: { alerts: Alert[]; onClose: () => void }) => (
  <div
    className="absolute right-0 top-full mt-2 w-80 rounded-2xl shadow-xl z-50 overflow-hidden"
    style={{ background: '#FFFFFF', border: '1px solid #DCC9B2', boxShadow: '0 8px 32px rgba(58,42,32,0.12)' }}
  >
    <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #DCC9B2', background: 'linear-gradient(135deg, #FBF6EE 0%, #F2E8D8 100%)' }}>
      <span className="text-sm font-bold" style={{ color: '#3A2A20' }}>Notifications</span>
      <button onClick={onClose} className="p-1 rounded-lg transition-colors" style={{ color: '#A08070' }}>
        <X className="w-4 h-4" />
      </button>
    </div>
    <div className="max-h-72 overflow-y-auto">
      {alerts.slice(0, 4).map(a => {
        const cfg = ALERT_SEVERITY_CONFIG[a.severity] || ALERT_SEVERITY_CONFIG.INFO;
        const Icon = cfg.icon;
        return (
          <Link key={a.id} to={`/alerts/${a.id}`} className="block px-5 py-3.5 flex items-start gap-3 cursor-pointer transition-colors"
            style={{ borderBottom: '1px solid rgba(220,201,178,0.5)' }}
            onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background = '#FBF6EE'}
            onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background = ''}
          >
            <Icon className="w-4 h-4 mt-0.5 shrink-0" style={{ color: cfg.color }} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color: '#3A2A20' }}>{a.beach_name}</p>
              <p className="text-xs truncate" style={{ color: '#6B4F3E' }}>{a.title}</p>
              <p className="text-[10px] mt-0.5" style={{ color: '#A08070' }}>{timeAgo(a.created_at)}</p>
            </div>
          </Link>
        );
      })}
    </div>
    <div className="px-5 py-3">
      <Link to="/alerts" className="text-xs font-medium transition-colors flex items-center gap-1" style={{ color: '#A67C5A' }}>
        View all notifications <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
  </div>
);

// =============================================================================
// MAIN HOME COMPONENT
// =============================================================================
export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  const [beaches, setBeaches] = useState<Beach[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [preferredLocation, setPreferredLocation] = useState('');
  const [preferredActivity, setPreferredActivity] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SAFE' | 'CAUTION' | 'UNSAFE'>('ALL');
  const [showExploreGrid, setShowExploreGrid] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeAlertId, setActiveAlertId] = useState<string | null>(null);
  const [mapTarget, setMapTarget] = useState<[number, number] | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAllAlerts, setShowAllAlerts] = useState(false);
  const [alertFilter, setAlertFilter] = useState<'ALL' | 'CRITICAL' | 'WARNING' | 'INFO'>('ALL');
  const notifRef = useRef<HTMLDivElement>(null);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const [beachesData, alertsData] = await Promise.all([getBeaches(), getAlerts()]);
      setBeaches(beachesData);
      setAlerts(alertsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadDashboardData(); }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const uniqueLocations = useMemo(() => {
    return Array.from(new Set(beaches.map(b => b.location))).sort();
  }, [beaches]);

  const filteredBeaches = useMemo(() => {
    return beaches.filter((b) => {
      const q = searchQuery.toLowerCase().trim();
      const locQ = preferredLocation.toLowerCase().trim();
      const actQ = preferredActivity.toLowerCase().trim();
      const matchesSearch = !q || b.name.toLowerCase().includes(q) || b.location.toLowerCase().includes(q);
      const matchesLocation = !locQ || b.location.toLowerCase().includes(locQ);
      const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
      // Activity filter — if beach has no activities array (e.g. live API), show it permissively
      const beachActivities = (b as any).activities as string[] | undefined;
      const matchesActivity = !actQ || !beachActivities || beachActivities.some(a => a.toLowerCase().includes(actQ));
      return matchesSearch && matchesLocation && matchesStatus && matchesActivity;
    });
  }, [beaches, searchQuery, preferredLocation, preferredActivity, statusFilter]);

  const stats = useMemo(() => ({
    safe: beaches.filter(b => b.status === 'SAFE').length,
    caution: beaches.filter(b => b.status === 'CAUTION').length,
    unsafe: beaches.filter(b => b.status === 'UNSAFE').length,
    activeAlerts: alerts.filter(a => a.status === 'ACTIVE').length,
  }), [beaches, alerts]);

  const handleAlertClick = useCallback((alert: Alert) => {
    setActiveAlertId(alert.id.toString());
    const beach = beaches.find(b => b.id === alert.beach_id);
    if (beach) {
      setMapTarget([beach.latitude, beach.longitude]);
    }
  }, [beaches]);

  const filteredAlerts = useMemo(() => {
    return alertFilter === 'ALL' ? alerts : alerts.filter(a => a.severity === alertFilter);
  }, [alerts, alertFilter]);

  if (isLoading) {
    return (
      <div className="space-y-5 animate-pulse">
        <div className="flex justify-between gap-6">
          <div className="h-16 w-96 rounded-2xl" style={{ background: '#DCC9B2' }} />
          <div className="h-12 w-80 rounded-full" style={{ background: '#DCC9B2' }} />
        </div>
        <div className="grid grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-24 rounded-2xl" style={{ background: '#DCC9B2' }} />)}
        </div>
        <div className="grid grid-cols-[1fr_300px] gap-4">
          <div className="h-[420px] rounded-2xl" style={{ background: '#DCC9B2' }} />
          <div className="h-[420px] rounded-2xl" style={{ background: '#DCC9B2' }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 rounded-2xl text-center" style={{ background: 'rgba(89,125,138,0.08)', border: '1px solid rgba(89,125,138,0.3)' }}>
        <AlertTriangle className="w-10 h-10 mx-auto mb-4" style={{ color: '#597D8A' }} />
        <h2 className="text-xl font-semibold mb-2" style={{ color: '#597D8A' }}>Error Loading Dashboard</h2>
        <p className="mb-6" style={{ color: '#597D8A', opacity: 0.8 }}>{error}</p>
        <button onClick={loadDashboardData} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
          style={{ background: 'rgba(89,125,138,0.15)', color: '#597D8A' }}>
          <RefreshCw className="w-4 h-4" /> Retry
        </button>
      </div>
    );
  }

  const totalBeaches = Math.max(beaches.length, 6);

  return (
    <div className="w-full flex flex-col gap-8 animate-fade-in pb-16 max-w-[1280px] mx-auto">

      {/* ==================== HEADER ROW ==================== */}
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium mb-0.5 tracking-wide" style={{ color: '#A08070' }}>{getGreeting()},</p>
          <h1
            className="text-4xl lg:text-5xl font-bold leading-[1.1]"
            style={{ fontFamily: "'Playfair Display', serif", color: '#3A2A20' }}
          >
            Check the safety of{' '}
            <span style={{ color: '#A67C5A' }} className="italic">India's beaches.</span>{' '}
            <span className="text-3xl" style={{ color: '#6E93A6' }}>〜</span>
          </h1>
          <p className="text-sm mt-2" style={{ color: '#6B4F3E' }}>Live monitoring and safety alerts for coastal regions.</p>

          {/* Personal Preferences */}
          {!isDashboard && (
            <div className="mt-8 flex items-stretch gap-4 max-w-3xl">
              <div className="flex-1 rounded-2xl p-4 flex flex-col justify-center" style={{ background: '#FFFFFF', border: '1px solid #DCC9B2' }}>
                <label htmlFor="pref-location" className="block text-[10px] font-bold mb-2 tracking-widest uppercase" style={{ color: '#A08070' }}>
                  Preferred Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#A67C5A' }} />
                  <select
                    id="pref-location"
                    value={preferredLocation}
                    onChange={(e) => setPreferredLocation(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl transition-all text-sm font-medium appearance-none"
                    style={{ background: '#FBF6EE', border: '1px solid #DCC9B2', color: '#3A2A20', outline: 'none' }}
                    onFocus={e => { e.currentTarget.style.borderColor = '#A67C5A'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(166,124,90,0.12)'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = '#DCC9B2'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <option value="">Select your location</option>
                    {uniqueLocations.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex-1 rounded-2xl p-4 flex flex-col justify-center" style={{ background: '#FFFFFF', border: '1px solid #DCC9B2' }}>
                <label htmlFor="pref-activity" className="block text-[10px] font-bold mb-2 tracking-widest uppercase" style={{ color: '#A08070' }}>
                  Preferred Activity
                </label>
                <div className="relative">
                  <Activity className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#A67C5A' }} />
                  <select
                    id="pref-activity"
                    value={preferredActivity}
                    onChange={(e) => setPreferredActivity(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl transition-all text-sm font-medium appearance-none"
                    style={{ background: '#FBF6EE', border: '1px solid #DCC9B2', color: '#3A2A20', outline: 'none' }}
                    onFocus={e => { e.currentTarget.style.borderColor = '#A67C5A'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(166,124,90,0.12)'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = '#DCC9B2'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <option value="">All Activities</option>
                    <option value="swimming">Swimming</option>
                    <option value="surfing">Surfing</option>
                    <option value="fishing">Fishing</option>
                    <option value="diving">Diving</option>
                    <option value="snorkeling">Snorkeling</option>
                    <option value="kayaking">Kayaking</option>
                    <option value="walking">Walking</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col justify-center gap-2 shrink-0">
                <button 
                  onClick={() => setShowExploreGrid(true)}
                  className="w-full px-6 py-3 rounded-xl font-bold text-white transition-all shadow-sm"
                  style={{ background: '#A67C5A' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#8C6647'}
                  onMouseLeave={e => e.currentTarget.style.background = '#A67C5A'}
                >
                  Go
                </button>
                <button 
                  onClick={() => {
                    setPreferredLocation('');
                    setPreferredActivity('');
                    setSearchQuery('');
                    setStatusFilter('ALL');
                    setShowExploreGrid(true);
                  }}
                  className="w-full px-6 py-2 rounded-xl text-xs font-bold transition-colors"
                  style={{ color: '#6B4F3E', background: '#FBF6EE', border: '1px solid #DCC9B2' }}
                >
                  Show All
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Search + Notification */}
        <div className="flex items-center gap-3 shrink-0 pt-1">
          {isDashboard && (
            <div className="relative w-[380px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#A08070' }} />
              <input
                type="text"
                placeholder="Search beaches by name or location..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-full text-sm transition-all"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #DCC9B2',
                  color: '#3A2A20',
                  outline: 'none',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = '#A67C5A'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(166,124,90,0.1)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = '#DCC9B2'; e.currentTarget.style.boxShadow = 'none'; }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2">
                  <X className="w-3.5 h-3.5" style={{ color: '#A08070' }} />
                </button>
              )}
            </div>
          )}

          {/* Notification Bell */}
          <div ref={notifRef} className="relative">
            <div className="tooltip-wrap">
              <button
                onClick={() => setShowNotifications(v => !v)}
                className="relative w-11 h-11 flex items-center justify-center rounded-full transition-all"
                style={{ background: '#FFFFFF', border: '1px solid #DCC9B2' }}
                aria-label="Notifications"
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#A67C5A'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#DCC9B2'; }}
              >
                <Bell className="w-4 h-4" style={{ color: '#6B4F3E' }} />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{ background: '#A67C5A' }} />
              </button>
              <span className="tooltip-text">Alerts &amp; Notifications</span>
            </div>
            {showNotifications && (
              <NotificationPanel alerts={alerts} onClose={() => setShowNotifications(false)} />
            )}
          </div>
        </div>
      </div>

      {/* ==================== DASHBOARD SPECIFIC SECTIONS ==================== */}
      {isDashboard && (
        <div className="flex flex-col gap-8 mt-2">
          {/* ==================== STATUS SUMMARY CARDS ==================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { key: 'SAFE', value: stats.safe },
          { key: 'CAUTION', value: stats.caution },
          { key: 'UNSAFE', value: stats.unsafe },
          { key: 'ALERTS', value: stats.activeAlerts },
        ].map(({ key, value }) => {
          const cfg = STATUS_CONFIG[key as keyof typeof STATUS_CONFIG];
          const Icon = cfg.icon;
          const pct = key === 'ALERTS' ? Math.min(100, (value / 10) * 100) : Math.min(100, (value / totalBeaches) * 100);
          
          const creativePalettes: Record<string, { bgGrad: string; textMain: string; textMuted: string; iconBg: string; shadow: string; barBg: string; barFill: string }> = {
            SAFE: { bgGrad: 'linear-gradient(135deg, #EBF5F0 0%, #D4EDE2 100%)', textMain: '#276B52', textMuted: '#4C8B6F', iconBg: '#FFFFFF', shadow: '0 16px 40px rgba(61,139,110,0.2)', barBg: 'rgba(39,107,82,0.15)', barFill: '#3D8B6E' },
            CAUTION: { bgGrad: 'linear-gradient(135deg, #FDF3E0 0%, #FBE5C0 100%)', textMain: '#8A6010', textMuted: '#C08A2A', iconBg: '#FFFFFF', shadow: '0 16px 40px rgba(192,138,42,0.2)', barBg: 'rgba(138,96,16,0.15)', barFill: '#C08A2A' },
            UNSAFE: { bgGrad: 'linear-gradient(135deg, #FDECEA 0%, #FAD2CE 100%)', textMain: '#9B2A20', textMuted: '#C74B3F', iconBg: '#FFFFFF', shadow: '0 16px 40px rgba(199,75,63,0.2)', barBg: 'rgba(155,42,32,0.15)', barFill: '#C74B3F' },
            ALERTS: { bgGrad: 'linear-gradient(135deg, #F8EFE6 0%, #EAD4C0 100%)', textMain: '#5A3E2E', textMuted: '#A67C5A', iconBg: '#FFFFFF', shadow: '0 16px 40px rgba(166,124,90,0.2)', barBg: 'rgba(90,62,46,0.15)', barFill: '#A67C5A' },
          };
          const p = creativePalettes[key] || creativePalettes.SAFE;

          return (
            <div
              key={key}
              className="group relative rounded-[32px] p-6 overflow-hidden transition-all duration-500 hover:-translate-y-2 cursor-default flex flex-col justify-between"
              style={{ background: p.bgGrad, boxShadow: p.shadow, minHeight: '170px' }}
            >
              {/* Giant decorative background number */}
              <div 
                className="absolute right-0 -bottom-6 pointer-events-none transition-transform duration-700 group-hover:scale-110 select-none" 
                style={{ fontSize: '130px', lineHeight: 0.8, color: p.textMain, opacity: 0.05, fontFamily: "'Playfair Display', serif" }}
              >
                {value}
              </div>

              {/* Top Row: Label and Icon */}
              <div className="relative z-10 flex items-center justify-between mb-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: p.textMuted }}>{cfg.label}</p>
                <div 
                  className="p-3.5 rounded-[20px] shadow-sm transition-transform duration-500 group-hover:rotate-12" 
                  style={{ background: p.iconBg, color: p.textMain }}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              {/* Bottom Row: Actual Number, Unit, and Bar */}
              <div className="relative z-10 mt-auto">
                <div className="flex items-baseline gap-2.5 mb-4">
                  <span className="text-5xl font-bold leading-none" style={{ color: p.textMain, fontFamily: "'Playfair Display', serif" }}>
                    {value}
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: p.textMuted }}>
                    {cfg.unit}
                  </span>
                </div>
                
                {/* Soft pill progress bar */}
                <div className="h-1.5 rounded-full overflow-hidden w-full" style={{ background: p.barBg }}>
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${pct}%`, background: p.barFill }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ==================== MAP + ALERTS SPLIT ==================== */}
      <div className={`grid gap-4 ${isFullscreen ? 'grid-cols-1' : 'grid-cols-[1fr_296px]'}`}>

        {/* MAP PANEL */}
        <div className="rounded-2xl overflow-hidden flex flex-col shadow-sm" style={{ background: '#FFFFFF', border: '1px solid #DCC9B2' }}>
          {/* Map header */}
          <div className="px-5 py-4 flex items-center justify-between shrink-0" style={{ borderBottom: '1px solid #DCC9B2', background: 'linear-gradient(135deg, #FBF6EE 0%, #F2E8D8 100%)' }}>
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4" style={{ color: '#A67C5A' }} />
              <h2 className="text-sm font-bold tracking-wide" style={{ color: '#3A2A20' }}>Live Coastal Map</h2>
            </div>
            <div className="flex items-center gap-3">
              {/* LIVE pill */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: 'rgba(124,153,134,0.1)', border: '1px solid rgba(124,153,134,0.3)' }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#7C9986' }} />
                <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: '#7C9986' }}>Live</span>
              </div>
              <div className="tooltip-wrap">
                <button
                  onClick={() => setIsFullscreen(v => !v)}
                  className="p-1.5 rounded-lg transition-colors"
                  style={{ background: '#FBF6EE', border: '1px solid #DCC9B2' }}
                  aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                  onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.borderColor = '#A67C5A'}
                  onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.borderColor = '#DCC9B2'}
                >
                  {isFullscreen
                    ? <Minimize2 className="w-3.5 h-3.5" style={{ color: '#6B4F3E' }} />
                    : <Maximize2 className="w-3.5 h-3.5" style={{ color: '#6B4F3E' }} />
                  }
                </button>
                <span className="tooltip-text">{isFullscreen ? 'Collapse map' : 'Expand map'}</span>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="relative flex-1 min-h-[400px]">
            <MapContainer
              center={[15.2993, 78.0]}
              zoom={5}
              scrollWheelZoom={true}
              className="w-full h-full"
              zoomControl={true}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              />
              <MapController target={mapTarget} />

              {/* Live API beach markers */}
              {beaches.map(beach => (
                <Marker
                  key={beach.id}
                  position={[beach.latitude, beach.longitude]}
                  icon={createCustomIcon(beach.status)}
                >
                  <Popup className="custom-popup">
                    <div className="p-1 min-w-[180px]">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-sm" style={{ color: '#3A2A20' }}>{beach.name}</h3>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBgColor(beach.status)}`}>
                          {beach.status}
                        </span>
                      </div>
                      <div className="space-y-1 text-xs mb-3">
                        {beach.wave_height !== undefined && (
                          <div className="flex items-center justify-between" style={{ color: '#6B4F3E' }}>
                            <span>Wave height</span>
                            <span className="font-medium" style={{ color: '#3A2A20' }}>{beach.wave_height} m</span>
                          </div>
                        )}
                        {beach.water_quality && (
                          <div className="flex items-center justify-between" style={{ color: '#6B4F3E' }}>
                            <span>Water quality</span>
                            <span className="font-medium capitalize" style={{ color: '#3A2A20' }}>{beach.water_quality}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between" style={{ color: '#6B4F3E' }}>
                          <span>BSI Score</span>
                          <span className={`font-bold ${getStatusColor(beach.status)}`}>{beach.safety_score}/100</span>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/beaches/${beach.id}`)}
                        className="block w-full text-center text-xs py-2 rounded-lg font-semibold transition-colors cursor-pointer"
                        style={{ background: 'rgba(166,124,90,0.1)', color: '#A67C5A', border: '1px solid rgba(166,124,90,0.25)' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(166,124,90,0.22)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(166,124,90,0.1)'; }}
                      >
                        View Full Dashboard →
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}

            </MapContainer>
          </div>
        </div>

        {/* RECENT ALERTS PANEL */}
        {!isFullscreen && (
          <div className="rounded-2xl flex flex-col overflow-hidden shadow-sm" style={{ background: '#FFFFFF', border: '1px solid #DCC9B2' }}>
            {/* Alerts header */}
            <div className="px-4 py-4 flex items-center justify-between shrink-0" style={{ borderBottom: '1px solid #DCC9B2', background: 'linear-gradient(135deg, #3A2A20 0%, #5A3E2E 100%)' }}>
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4" style={{ color: '#F2DEC0' }} />
                <h2 className="text-sm font-bold tracking-wide" style={{ color: '#FDFAF6' }}>Recent Alerts</h2>
              </div>
              <button
                onClick={() => setShowAllAlerts(v => !v)}
                className="flex items-center gap-1 text-xs font-semibold transition-colors"
                style={{ color: 'rgba(253,250,246,0.7)' }}
              >
                View all <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Alert items */}
            <div className="flex-1 overflow-y-auto">
              {alerts.slice(0, 5).map(alert => {
                const cfg = ALERT_SEVERITY_CONFIG[alert.severity] || ALERT_SEVERITY_CONFIG.INFO;
                const Icon = cfg.icon;
                const isActive = activeAlertId === alert.id.toString();
                return (
                  <button
                    key={alert.id}
                    onClick={() => handleAlertClick(alert)}
                    className="w-full text-left px-4 py-4 flex items-start gap-3 transition-all border-l-2"
                    style={{
                      borderBottom: '1px solid rgba(220,201,178,0.5)',
                      borderLeftColor: isActive ? cfg.color : 'transparent',
                      background: isActive ? `${cfg.color}0E` : 'transparent',
                    }}
                    onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = '#FBF6EE'; }}
                    onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                  >
                    <div className="p-1.5 rounded-lg shrink-0 mt-0.5" style={{ background: cfg.color + '18' }}>
                      <Icon className="w-3.5 h-3.5" style={{ color: cfg.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1 mb-0.5">
                        <p className="text-xs font-bold leading-tight" style={{ color: '#3A2A20' }}>{alert.beach_name}</p>
                        <span
                          className="text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0"
                          style={{ color: cfg.color, background: cfg.color + '18' }}
                        >
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-[11px] truncate" style={{ color: '#6B4F3E' }}>{alert.title}</p>
                      <p className="text-[10px] mt-1" style={{ color: '#A08070' }}>{timeAgo(alert.created_at)}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* View All CTA */}
            <div className="px-4 py-3 shrink-0" style={{ borderTop: '1px solid #DCC9B2' }}>
              <Link
                to="/alerts"
                className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-xl transition-colors"
                style={{ background: 'rgba(166,124,90,0.08)', border: '1px solid rgba(166,124,90,0.25)', color: '#A67C5A' }}
                onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(166,124,90,0.15)'}
                onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(166,124,90,0.08)'}
              >
                View All Alerts <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* ==================== FILTERS + COASTAL CONDITIONS ==================== */}
      <div className="flex flex-wrap items-center justify-between gap-6 mt-2">
        <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium mr-1 tracking-wide" style={{ color: '#A08070' }}>Filter by Status:</span>
          {[
            { key: 'ALL', label: 'All Beaches', icon: null },
            { key: 'SAFE', label: 'Safe', icon: ShieldCheck },
            { key: 'CAUTION', label: 'Caution', icon: AlertTriangle },
            { key: 'UNSAFE', label: 'Unsafe', icon: ShieldAlert },
          ].map(({ key, label, icon: Icon }) => {
            const active = statusFilter === key;
            const cfg = key !== 'ALL' ? STATUS_CONFIG[key as keyof typeof STATUS_CONFIG] : null;
            const activeStyle = cfg ? cfg.activeTab : { background: '#3A2A20', color: '#FFFFFF', border: '1px solid #3A2A20' };
            return (
              <button
                key={key}
                onClick={() => { setStatusFilter(key as any); setShowExploreGrid(true); }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all border"
                style={active ? { ...activeStyle, fontWeight: 700 } : {
                  background: '#FFFFFF',
                  color: '#6B4F3E',
                  border: '1px solid #DCC9B2',
                }}
                onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLButtonElement).style.borderColor = '#A67C5A'; (e.currentTarget as HTMLButtonElement).style.color = '#3A2A20'; } }}
                onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLButtonElement).style.borderColor = '#DCC9B2'; (e.currentTarget as HTMLButtonElement).style.color = '#6B4F3E'; } }}
              >
                {Icon && <Icon className="w-3 h-3" style={active ? {} : { color: cfg?.color }} />}
                {label}
              </button>
            );
          })}
        </div>

        {/* Coastal Conditions strip */}
        <div className="rounded-2xl px-5 py-3 flex items-center gap-6" style={{ background: '#FFFFFF', border: '1px solid #DCC9B2' }}>
          <div className="flex items-center gap-2">
            <Waves className="w-4 h-4" style={{ color: '#6E93A6' }} />
            <div>
              <p className="text-[9px] uppercase tracking-widest font-semibold" style={{ color: '#A08070' }}>Coastal Conditions</p>
            </div>
          </div>
          <div className="w-px h-6" style={{ background: '#DCC9B2' }} />
          <div className="flex items-center gap-5">
            <div className="text-center">
              <div className="flex items-center gap-1 mb-0.5">
                <Wind className="w-3 h-3" style={{ color: '#A67C5A' }} />
                <p className="text-[9px] uppercase tracking-widest" style={{ color: '#A08070' }}>Wind Speed</p>
              </div>
              <p className="text-sm font-bold" style={{ color: '#3A2A20' }}>18 km/h</p>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1 mb-0.5">
                <Waves className="w-3 h-3" style={{ color: '#A67C5A' }} />
                <p className="text-[9px] uppercase tracking-widest" style={{ color: '#A08070' }}>Wave Height</p>
              </div>
              <p className="text-sm font-bold" style={{ color: '#3A2A20' }}>1.2 m</p>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1 mb-0.5">
                <ArrowUpRight className="w-3 h-3" style={{ color: '#A67C5A' }} />
                <p className="text-[9px] uppercase tracking-widest" style={{ color: '#A08070' }}>Tide Status</p>
              </div>
              <p className="text-sm font-bold" style={{ color: '#3A2A20' }}>Rising</p>
            </div>
          </div>
          <div className="w-px h-6" style={{ background: '#DCC9B2' }} />
          <button className="flex items-center gap-1 text-xs font-medium transition-colors whitespace-nowrap" style={{ color: '#A67C5A' }}>
            View Details <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        </div>
        </div>
      )}

      {/* ==================== ALL ALERTS DRAWER ==================== */}
      {showAllAlerts && (
        <div className="rounded-2xl overflow-hidden shadow-sm" style={{ background: '#FFFFFF', border: '1px solid #DCC9B2' }}>
          <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #DCC9B2', background: 'linear-gradient(135deg, #FBF6EE 0%, #F2E8D8 100%)' }}>
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4" style={{ color: '#A67C5A' }} />
              <h2 className="text-sm font-bold" style={{ color: '#3A2A20' }}>All Alerts</h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                {(['ALL', 'CRITICAL', 'WARNING', 'INFO'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setAlertFilter(f)}
                    className="px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all"
                    style={{
                      background: alertFilter === f ? '#A67C5A' : '#FBF6EE',
                      color: alertFilter === f ? '#FFFFFF' : '#6B4F3E',
                      border: alertFilter === f ? '1px solid #A67C5A' : '1px solid #DCC9B2',
                    }}
                  >
                    {f === 'ALL' ? 'All' : f}
                  </button>
                ))}
              </div>
              <button onClick={() => setShowAllAlerts(false)} className="p-1 rounded-lg transition-colors" style={{ color: '#A08070' }}>
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="divide-y" style={{ borderColor: 'rgba(220,201,178,0.4)' }}>
            {filteredAlerts.map(alert => {
              const cfg = ALERT_SEVERITY_CONFIG[alert.severity] || ALERT_SEVERITY_CONFIG.INFO;
              const Icon = cfg.icon;
              return (
                <div
                  key={alert.id}
                  className="px-6 py-4 flex items-center gap-4 cursor-pointer border-l-2 transition-colors"
                  style={{ borderLeftColor: cfg.color }}
                  onClick={() => { handleAlertClick(alert); setShowAllAlerts(false); }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = '#FBF6EE'}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = ''}
                >
                  <div className="p-2 rounded-xl" style={{ background: cfg.color + '18' }}>
                    <Icon className="w-4 h-4" style={{ color: cfg.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-bold" style={{ color: '#3A2A20' }}>{alert.beach_name}</p>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ color: cfg.color, background: cfg.color + '18' }}>
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: '#6B4F3E' }}>{alert.title}</p>
                  </div>
                  <span className="text-xs whitespace-nowrap" style={{ color: '#A08070' }}>{timeAgo(alert.created_at)}</span>
                  <ChevronRight className="w-4 h-4" style={{ color: '#A08070' }} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================== BEACH CARDS GRID ==================== */}
      <style>{`
        @keyframes cardFadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scorePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(61,139,110,0); }
          50%       { box-shadow: 0 0 0 6px rgba(61,139,110,0.12); }
        }
        .beach-card {
          animation: cardFadeUp 0.45s ease both;
          transition: transform 0.28s cubic-bezier(0.34,1.56,0.64,1),
                      box-shadow 0.28s ease,
                      border-color 0.2s ease !important;
        }
        .beach-card:hover {
          transform: translateY(-6px) !important;
          box-shadow: 0 20px 48px rgba(58,42,32,0.12) !important;
        }
        .score-ring { transition: stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1); }
        .wave-bar   { transition: width 1s cubic-bezier(0.4,0,0.2,1); }
        .card-arrow { transition: transform 0.22s ease; }
        .beach-card:hover .card-arrow { transform: translateX(4px); }
        .card-thumb { transition: transform 0.42s ease; }
        .beach-card:hover .card-thumb { transform: scale(1.05); }
        .card-shimmer {
          position: absolute; inset: 0;
          background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.45) 50%, transparent 60%);
          background-size: 200% 100%;
          background-position: -200% 0;
          transition: background-position 0.55s ease;
          pointer-events: none; border-radius: inherit;
        }
        .beach-card:hover .card-shimmer { background-position: 200% 0; }
      `}</style>

      {(
        isDashboard ? (searchQuery || statusFilter !== 'ALL' || showExploreGrid) : true
      ) && (
        <div className="space-y-6 mt-8">

          {/* Section header */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl shadow-sm bg-white" style={{ color: '#A67C5A' }}>
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-2xl font-bold leading-tight" style={{ fontFamily: "'Playfair Display', serif", color: '#3A2A20' }}>
                  Explore Beaches
                </h3>
                <p className="text-xs font-semibold mt-1" style={{ color: '#A08070' }}>
                  {filteredBeaches.length} location{filteredBeaches.length !== 1 ? 's' : ''} found
                </p>
              </div>
            </div>
            {(searchQuery || statusFilter !== 'ALL') && (
              <button
                onClick={() => { setSearchQuery(''); setStatusFilter('ALL'); }}
                className="text-xs px-4 py-2 rounded-full transition-all font-bold shadow-sm hover:shadow-md bg-white text-gray-700"
              >
                Clear filters ×
              </button>
            )}
          </div>

          {filteredBeaches.length === 0 ? (
            <div className="text-center py-20 rounded-[32px] bg-white shadow-sm border border-orange-50/50">
              <div className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-5 bg-orange-50/50">
                <Search className="w-8 h-8" style={{ color: '#DCC9B2' }} />
              </div>
              <p className="text-lg font-bold mb-1" style={{ color: '#3A2A20' }}>No beaches match your search</p>
              <p className="text-sm" style={{ color: '#A08070' }}>Try adjusting your filters or search term</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredBeaches.slice(0, !isDashboard && !searchQuery ? 6 : undefined).map((beach, idx) => {
                const score = beach.safety_score ?? 0;
                const waveH = beach.wave_height ?? 0;
                const maxWave = 5;
                const wavePct = Math.min(100, (waveH / maxWave) * 100);

                // Status-specific palette for soft styling
                const palette: Record<string, { grad: string; badge: string; badgeText: string; scoreColor: string }> = {
                  SAFE:    { grad: '#F2F8F5', badge: 'rgba(61,139,110,0.15)', badgeText: '#276B52', scoreColor: '#3D8B6E' },
                  CAUTION: { grad: '#FDF8ED', badge: 'rgba(192,138,42,0.15)',  badgeText: '#8A6010', scoreColor: '#C08A2A' },
                  UNSAFE:  { grad: '#FDF2F0', badge: 'rgba(199,75,63,0.15)',  badgeText: '#9B2A20', scoreColor: '#C74B3F' },
                };
                const p = palette[beach.status] ?? palette.CAUTION;

                return (
                  <Link
                    key={beach.id}
                    to={`/beaches/${beach.id}`}
                    className="beach-card group relative rounded-[32px] overflow-hidden flex flex-col bg-white"
                    style={{
                      boxShadow: '0 12px 40px rgba(58,42,32,0.06)',
                      animationDelay: `${idx * 0.05}s`,
                    }}
                  >
                    {/* ── Thumbnail Image ── */}
                    <div className="w-full relative overflow-hidden" style={{ height: 220, flexShrink: 0, background: p.grad }}>
                      {(beach.heroImage || beach.gallery?.[0]) ? (
                        <img
                          src={beach.heroImage ?? beach.gallery![0]}
                          alt={beach.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center opacity-20">
                          <Waves className="w-16 h-16" style={{ color: p.scoreColor }} />
                        </div>
                      )}
                      
                      {/* Floating Status Badge */}
                      <div className="absolute top-5 left-5 z-10">
                        <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg backdrop-blur-md ${getStatusBgColor(beach.status)}`} style={{ border: 'none' }}>
                          {beach.status}
                        </span>
                      </div>
                    </div>

                    {/* ── Card Body ── */}
                    <div className="p-6 flex-1 flex flex-col relative">
                      
                      {/* Floating BSI Orb (Overlapping image slightly) */}
                      <div 
                        className="absolute right-6 -top-10 w-16 h-16 rounded-full flex flex-col items-center justify-center shadow-lg backdrop-blur-xl transition-transform duration-300 group-hover:-translate-y-1"
                        style={{ background: 'rgba(255,255,255,0.85)', color: p.scoreColor, border: '2px solid white' }}
                      >
                         <span className="text-xl font-black leading-none">{score}</span>
                         <span className="text-[8px] font-black tracking-widest uppercase opacity-70 mt-0.5">BSI</span>
                      </div>

                      <div className="pr-16 mb-6">
                        <h3
                          className="font-bold leading-tight mb-2"
                          style={{ fontFamily: "'Playfair Display', serif", color: '#3A2A20', fontSize: '1.4rem' }}
                        >
                          {beach.name}
                        </h3>
                        <p className="text-xs flex items-center gap-1.5 font-medium" style={{ color: '#A08070' }}>
                          <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: '#D69A3C' }} />
                          {beach.location}
                        </p>
                      </div>

                      {/* Stats */}
                      <div className="space-y-4 mt-auto">
                        {/* Wave height */}
                        {waveH > 0 && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Waves className="w-4 h-4" style={{ color: '#6E93A6' }} />
                                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#A08070' }}>Wave Height</span>
                              </div>
                              <span className="text-sm font-bold" style={{ color: '#3A2A20' }}>{waveH} m</span>
                            </div>
                            <div className="h-2 rounded-full overflow-hidden" style={{ background: '#F0F4F6' }}>
                              <div
                                className="h-full rounded-full transition-all duration-1000"
                                style={{ width: `${wavePct}%`, background: '#6E93A6' }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Water quality */}
                        {beach.water_quality && (
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-2">
                              <Droplets className="w-4 h-4" style={{ color: '#7C9986' }} />
                              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#A08070' }}>Water Quality</span>
                            </div>
                            <span className="text-[11px] font-bold px-3 py-1 rounded-full capitalize" style={{ background: '#F2F6F3', color: '#4C8B6F' }}>
                              {beach.water_quality}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
          
          {/* Explore More Button for Landing Page */}
          {!isDashboard && !searchQuery && filteredBeaches.length > 6 && (
            <div className="flex justify-center mt-10">
              <Link 
                to="/dashboard"
                className="px-8 py-3.5 rounded-full text-sm font-bold shadow-lg transition-transform hover:-translate-y-1"
                style={{ background: '#3A2A20', color: '#FFFFFF' }}
              >
                View all {filteredBeaches.length} beaches
              </Link>
            </div>
          )}
          
        </div>
      )}

    </div>
  );
}
