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
  Waves,
  RefreshCw,
  Droplets,
  Users
} from 'lucide-react';
import L from 'leaflet';

import { getBeaches, getAlerts } from '../services/api';
import type { Beach, Alert } from '../types';
import { getStatusColor, getStatusBgColor, getGreeting } from '../utils/helpers';

// =============================================================================
// INLINE COMPONENTS (to avoid missing file errors)
// =============================================================================
const SafetyBadge = ({ status }: { status: string }) => {
  return (
    <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${getStatusBgColor(status)}`}>
      {status}
    </span>
  );
};

const LoadingSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-[#0D1B2A] h-24 rounded-2xl border border-[#20364A]" />
      ))}
    </div>
    <div className="bg-[#0D1B2A] h-[400px] rounded-2xl border border-[#20364A]" />
    <div className="flex gap-2">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-[#0D1B2A] h-10 w-24 rounded-full border border-[#20364A]" />
      ))}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-[#0D1B2A] h-48 rounded-2xl border border-[#20364A]" />
      ))}
    </div>
  </div>
);

const EmptyState = ({ message, onClear }: { message: string, onClear?: () => void }) => (
  <div className="text-center py-16 bg-[#0D1B2A] border border-[#20364A] rounded-2xl">
    <Search className="w-10 h-10 text-slate-600 mx-auto mb-3" />
    <p className="text-slate-400 font-medium">{message}</p>
    {onClear && (
      <button 
        onClick={onClear}
        className="mt-4 text-cyan-400 hover:text-cyan-300 text-sm font-medium"
      >
        Clear filters
      </button>
    )}
  </div>
);

// =============================================================================
// LEAFLET MARKER FIX
// =============================================================================
const createCustomIcon = (status: string) => {
  let color = '#94a3b8'; // slate-400 (default)
  if (status === 'SAFE') color = '#34d399'; // emerald-400
  if (status === 'CAUTION') color = '#fbbf24'; // amber-400
  if (status === 'UNSAFE') color = '#f87171'; // red-400

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
  const [beaches, setBeaches] = useState<Beach[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SAFE' | 'CAUTION' | 'UNSAFE'>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboardData = async () => {
    setIsLoading(true);
    setError('');
    try {
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
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const filteredBeaches = useMemo(() => {
    return beaches.filter((b) => {
      const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            b.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [beaches, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    return {
      safe: beaches.filter((b) => b.status === 'SAFE').length,
      caution: beaches.filter((b) => b.status === 'CAUTION').length,
      unsafe: beaches.filter((b) => b.status === 'UNSAFE').length,
      activeAlerts: alerts.filter((a) => a.status === 'ACTIVE').length,
    };
  }, [beaches, alerts]);

  if (isLoading) return <LoadingSkeleton />;

  if (error) {
    return (
      <div className="p-8 bg-red-500/10 border border-red-500/25 rounded-2xl text-center">
        <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-red-400 mb-2">Error Loading Dashboard</h2>
        <p className="text-red-400/80 mb-6">{error}</p>
        <button 
          onClick={loadDashboardData}
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-[1440px] mx-auto">
      
      {/* ==================== HEADER & SEARCH ==================== */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
            {getGreeting()}, <br className="hidden lg:block xl:hidden" />
            <span className="text-cyan-400">check the safety of India's beaches.</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base">Live monitoring and safety alerts for coastal regions.</p>
        </div>
        <div className="relative w-full xl:w-96 shrink-0">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search beaches by name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-[#0D1B2A] border border-[#20364A] rounded-xl text-white placeholder-slate-500 
              focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/25 transition-colors text-sm"
          />
        </div>
      </div>

      {/* ==================== SUMMARY CARDS ==================== */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px] bg-[#0D1B2A] border border-[#20364A] rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Safe</p>
            <p className="text-2xl font-bold text-white">{stats.safe}</p>
          </div>
          <div className="p-2.5 bg-emerald-500/15 rounded-xl text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
        <div className="flex-1 min-w-[200px] bg-[#0D1B2A] border border-[#20364A] rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Caution</p>
            <p className="text-2xl font-bold text-white">{stats.caution}</p>
          </div>
          <div className="p-2.5 bg-amber-500/15 rounded-xl text-amber-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
        <div className="flex-1 min-w-[200px] bg-[#0D1B2A] border border-[#20364A] rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Unsafe</p>
            <p className="text-2xl font-bold text-white">{stats.unsafe}</p>
          </div>
          <div className="p-2.5 bg-red-500/15 rounded-xl text-red-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>
        <div className="flex-1 min-w-[200px] bg-[#0D1B2A] border border-[#20364A] rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Alerts</p>
            <p className="text-2xl font-bold text-white">{stats.activeAlerts}</p>
          </div>
          <div className="p-2.5 bg-cyan-500/15 rounded-xl text-cyan-400">
            <Bell className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* ==================== INTERACTIVE MAP ==================== */}
      <div className="bg-[#0D1B2A] border border-[#20364A] rounded-2xl overflow-hidden shadow-xl shadow-black/20">
        <div className="px-6 py-4 border-b border-[#20364A] flex items-center gap-3">
          <MapPin className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-semibold text-white">Live Coastal Map</h2>
        </div>
        <div className="h-[450px] w-full z-0 relative">
          {beaches.length > 0 ? (
            <MapContainer
              center={[15.2993, 74.1240]} 
              zoom={5}
              scrollWheelZoom={false}
              className="w-full h-full"
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              />
              {beaches.map((beach) => (
                <Marker 
                  key={beach.id} 
                  position={[beach.latitude, beach.longitude]}
                  icon={createCustomIcon(beach.status)}
                >
                  <Popup className="custom-popup">
                    <div className="p-2 min-w-[150px]">
                      <h3 className="font-bold text-sm text-slate-800 mb-1">{beach.name}</h3>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-xs font-bold ${getStatusColor(beach.status)}`}>
                          {beach.status}
                        </span>
                        <span className="text-xs text-slate-500">BSI: {beach.safety_score}</span>
                      </div>
                      <Link 
                        to={`/beaches/${beach.id}`}
                        className="block w-full text-center text-xs bg-cyan-50 text-cyan-600 py-1.5 rounded-md font-medium hover:bg-cyan-100 transition-colors"
                      >
                        View Details &rarr;
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

      {/* ==================== FILTERS & GRID ==================== */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-400 text-sm font-medium mr-2">Filter by Status:</span>
          {['ALL', 'SAFE', 'CAUTION', 'UNSAFE'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status as any)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-cyan-500 text-[#07111F]'
                  : 'bg-[#0D1B2A] border border-[#20364A] text-slate-300 hover:border-cyan-500/50'
              }`}
            >
              {status === 'ALL' ? 'All Beaches' : status}
            </button>
          ))}
        </div>

        {filteredBeaches.length === 0 ? (
          <EmptyState 
            message="No beaches found matching your search and filters."
            onClear={() => {
              setSearchQuery('');
              setStatusFilter('ALL');
            }} 
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBeaches.map((beach) => (
              <div 
                key={beach.id}
                className="bg-[#0D1B2A] border border-[#20364A] rounded-2xl overflow-hidden hover:border-[#385B7A] transition-colors group flex flex-col shadow-sm"
              >
                <div className="p-5 border-b border-[#20364A]">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                        {beach.name}
                      </h3>
                      <p className="text-slate-400 text-sm flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {beach.location}
                      </p>
                    </div>
                    <SafetyBadge status={beach.status} />
                  </div>
                </div>

                <div className="p-5 flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1.5">Safety Index</p>
                    <div className="flex items-center gap-2">
                      <Activity className={`w-4 h-4 ${getStatusColor(beach.status)}`} />
                      <span className="text-lg font-bold text-white">{beach.safety_score}</span>
                      <span className="text-slate-500 text-xs">/100</span>
                    </div>
                  </div>
                  
                  {beach.wave_height !== undefined && (
                    <div>
                      <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1.5">Wave Height</p>
                      <div className="flex items-center gap-2">
                        <Waves className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-medium text-slate-200">{beach.wave_height}m</span>
                      </div>
                    </div>
                  )}

                  {beach.crowd_level && (
                    <div>
                      <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1.5">Crowd</p>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-400" />
                        <span className="text-sm font-medium text-slate-200 capitalize">{beach.crowd_level}</span>
                      </div>
                    </div>
                  )}

                  {beach.water_quality && (
                    <div>
                      <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1.5">Water</p>
                      <div className="flex items-center gap-2">
                        <Droplets className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm font-medium text-slate-200 capitalize">{beach.water_quality}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="px-5 py-4 bg-[#13263A]/40 border-t border-[#20364A] mt-auto">
                  <Link 
                    to={`/beaches/${beach.id}`}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-[#20364A] hover:bg-[#2A4560] text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    View Beach Details &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
