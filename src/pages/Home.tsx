// =============================================================================
// TideSense — Public Dashboard (Home.tsx)
// =============================================================================
//
// WHAT THIS PAGE DOES:
// 1. Fetches all beaches (GET /api/beaches) and active alerts (GET /api/alerts).
// 2. Computes summary statistics (SAFE vs CAUTION vs UNSAFE counts).
// 3. Displays a responsive Leaflet Map with colored markers.
// 4. Displays a searchable grid of Beach Cards.
//
// CONCEPTS FOR BACKEND DEVS:
// - useEffect: Think of it like a startup script. It runs once when the page
//   loads, calls the APIs, and saves the data in React state.
// - Filter/Map: We use array.filter() to power the search bar. When you type,
//   React automatically recalculates the filtered list and re-renders the grid.
// =============================================================================

import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import {
  Search,
  ShieldCheck,
  AlertTriangle,
  ShieldAlert,
  Bell,
  MapPin,
  Activity,
  Waves
} from 'lucide-react';
import L from 'leaflet';

import { getBeaches, getAlerts } from '../services/api';
import type { Beach, Alert } from '../types';
import { getStatusColor, getStatusBgColor } from '../utils/helpers';

// =============================================================================
// LEAFLET MARKER FIX
// =============================================================================
// By default, Leaflet looks for marker images in the same folder as its CSS.
// In Vite, this breaks. We define custom markers using SVG icons dynamically.
// =============================================================================
const createCustomIcon = (status: string) => {
  let color = '#94a3b8'; // slate-400 (default)
  if (status === 'SAFE') color = '#34d399'; // emerald-400
  if (status === 'CAUTION') color = '#fbbf24'; // amber-400
  if (status === 'UNSAFE') color = '#f87171'; // red-400

  // We use a simple SVG circle for the map marker
  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="24" height="24">
      <circle cx="12" cy="12" r="10" stroke="white" stroke-width="2" />
    </svg>
  `;

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: svgIcon,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

export default function Home() {
  // ---------------------------------------------------------------------------
  // STATE DEFINITIONS
  // ---------------------------------------------------------------------------
  const [beaches, setBeaches] = useState<Beach[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // ---------------------------------------------------------------------------
  // DATA FETCHING (ON MOUNT)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    async function loadDashboardData() {
      try {
        // Promise.all runs both API calls concurrently (like asyncio.gather)
        const [beachesData, alertsData] = await Promise.all([
          getBeaches(),
          getAlerts(),
        ]);
        setBeaches(beachesData);
        setAlerts(alertsData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load dashboard data'
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, []); // Empty dependency array = run once on mount

  // ---------------------------------------------------------------------------
  // DERIVED STATE (Recalculated automatically when inputs change)
  // ---------------------------------------------------------------------------
  // useMemo ensures we only recalculate when 'beaches' or 'searchQuery' change,
  // preventing unnecessary computation on every render.
  
  // 1. Filtered Beaches (for the grid)
  const filteredBeaches = useMemo(() => {
    if (!searchQuery.trim()) return beaches;
    const query = searchQuery.toLowerCase();
    return beaches.filter(
      (b) =>
        b.name.toLowerCase().includes(query) ||
        b.location.toLowerCase().includes(query)
    );
  }, [beaches, searchQuery]);

  // 2. Summary Statistics
  const stats = useMemo(() => {
    return {
      safe: beaches.filter((b) => b.status === 'SAFE').length,
      caution: beaches.filter((b) => b.status === 'CAUTION').length,
      unsafe: beaches.filter((b) => b.status === 'UNSAFE').length,
      activeAlerts: alerts.filter((a) => a.status === 'ACTIVE').length,
    };
  }, [beaches, alerts]);

  // ---------------------------------------------------------------------------
  // RENDER (LOADING / ERROR STATES)
  // ---------------------------------------------------------------------------
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Skeleton Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-[#0D1B2A] h-24 rounded-2xl border border-[#20364A]" />
          ))}
        </div>
        {/* Skeleton Map */}
        <div className="bg-[#0D1B2A] h-96 rounded-2xl border border-[#20364A]" />
        {/* Skeleton Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#0D1B2A] h-48 rounded-2xl border border-[#20364A]" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-500/10 border border-red-500/25 rounded-2xl text-center">
        <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-3" />
        <h2 className="text-lg font-semibold text-red-400 mb-1">Error Loading Dashboard</h2>
        <p className="text-red-400/80 text-sm">{error}</p>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER (MAIN DASHBOARD)
  // ---------------------------------------------------------------------------
  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* ==================== SUMMARY CARDS ==================== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Safe Card */}
        <div className="bg-[#0D1B2A] border border-[#20364A] rounded-2xl p-5 shadow-lg shadow-black/10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">Safe Beaches</p>
              <p className="text-3xl font-bold text-white">{stats.safe}</p>
            </div>
            <div className="p-2.5 bg-emerald-500/15 rounded-xl text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Caution Card */}
        <div className="bg-[#0D1B2A] border border-[#20364A] rounded-2xl p-5 shadow-lg shadow-black/10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">Caution</p>
              <p className="text-3xl font-bold text-white">{stats.caution}</p>
            </div>
            <div className="p-2.5 bg-amber-500/15 rounded-xl text-amber-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Unsafe Card */}
        <div className="bg-[#0D1B2A] border border-[#20364A] rounded-2xl p-5 shadow-lg shadow-black/10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">Unsafe</p>
              <p className="text-3xl font-bold text-white">{stats.unsafe}</p>
            </div>
            <div className="p-2.5 bg-red-500/15 rounded-xl text-red-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Active Alerts Card */}
        <div className="bg-[#0D1B2A] border border-[#20364A] rounded-2xl p-5 shadow-lg shadow-black/10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">Active Alerts</p>
              <p className="text-3xl font-bold text-white">{stats.activeAlerts}</p>
            </div>
            <div className="p-2.5 bg-cyan-500/15 rounded-xl text-cyan-400">
              <Bell className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* ==================== INTERACTIVE MAP ==================== */}
      <div className="bg-[#0D1B2A] border border-[#20364A] rounded-2xl overflow-hidden shadow-xl shadow-black/20">
        <div className="px-6 py-4 border-b border-[#20364A] flex items-center gap-3">
          <MapPin className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-semibold text-white">Live Coastal Map</h2>
        </div>
        
        <div className="h-[400px] w-full z-0 relative">
          {beaches.length > 0 ? (
            <MapContainer
              // Center roughly on India/coastal region (adjust based on actual data)
              center={[15.2993, 74.1240]} 
              zoom={5}
              scrollWheelZoom={false}
              className="w-full h-full"
            >
              {/* Dark theme tiles to match the UI */}
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              />
              
              {/* Render markers for each beach */}
              {beaches.map((beach) => (
                <Marker 
                  key={beach.id} 
                  position={[beach.latitude, beach.longitude]}
                  icon={createCustomIcon(beach.status)}
                >
                  {/* The popup appears when clicking a marker */}
                  <Popup className="custom-popup">
                    <div className="p-1">
                      <h3 className="font-semibold text-sm mb-1">{beach.name}</h3>
                      <p className={`text-xs font-bold mb-2 ${getStatusColor(beach.status)}`}>
                        {beach.status} (Score: {beach.safety_score})
                      </p>
                      <Link 
                        to={`/beaches/${beach.id}`}
                        className="text-xs text-cyan-600 hover:underline"
                      >
                        View Dashboard &rarr;
                      </Link>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm">
              No map data available.
            </div>
          )}
        </div>
      </div>

      {/* ==================== BEACH LISTING ==================== */}
      <div>
        {/* Header & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Waves className="w-5 h-5 text-cyan-400" />
            Monitored Beaches
          </h2>
          
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search beaches by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#0D1B2A] border border-[#20364A] rounded-xl text-white placeholder-slate-500 
                focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/25 transition-colors text-sm"
            />
          </div>
        </div>

        {/* Grid */}
        {filteredBeaches.length === 0 ? (
          <div className="text-center py-16 bg-[#0D1B2A] border border-[#20364A] rounded-2xl">
            <Search className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">No beaches found matching "{searchQuery}"</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-4 text-cyan-400 hover:text-cyan-300 text-sm"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBeaches.map((beach) => (
              <Link 
                key={beach.id}
                to={`/beaches/${beach.id}`}
                className="bg-[#0D1B2A] border border-[#20364A] rounded-2xl overflow-hidden hover:border-[#385B7A] transition-colors group flex flex-col"
              >
                {/* Card Header (Name, Location, Status Badge) */}
                <div className="p-5 border-b border-[#20364A]">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                        {beach.name}
                      </h3>
                      <p className="text-slate-400 text-sm">{beach.location}</p>
                    </div>
                    {/* Status Badge */}
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${getStatusBgColor(beach.status)}`}>
                      {beach.status}
                    </span>
                  </div>
                </div>

                {/* Card Body (Stats) */}
                <div className="p-5 flex-1 grid grid-cols-2 gap-4">
                  {/* Safety Score */}
                  <div>
                    <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Safety Index</p>
                    <div className="flex items-center gap-2">
                      <Activity className={`w-4 h-4 ${getStatusColor(beach.status)}`} />
                      <span className="text-lg font-bold text-white">{beach.safety_score}/100</span>
                    </div>
                  </div>

                  {/* Wave Height (optional) */}
                  {beach.wave_height !== undefined && (
                    <div>
                      <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Wave Height</p>
                      <div className="flex items-center gap-2">
                        <Waves className="w-4 h-4 text-blue-400" />
                        <span className="text-lg font-bold text-white">{beach.wave_height}m</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Crowd Level (optional) */}
                  {beach.crowd_level && (
                    <div>
                      <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Crowd</p>
                      <p className="text-sm font-medium text-slate-300 capitalize">{beach.crowd_level}</p>
                    </div>
                  )}
                  
                  {/* Water Quality (optional) */}
                  {beach.water_quality && (
                    <div>
                      <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Water</p>
                      <p className="text-sm font-medium text-slate-300 capitalize">{beach.water_quality}</p>
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="px-5 py-3 bg-[#13263A]/50 border-t border-[#20364A] mt-auto">
                  <span className="text-sm font-medium text-cyan-400 group-hover:text-cyan-300 flex items-center justify-between">
                    View Full Dashboard &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
