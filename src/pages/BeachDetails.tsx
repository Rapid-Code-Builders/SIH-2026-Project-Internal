// =============================================================================
// TideSense — Beach Details Page (BeachDetails.tsx)
// =============================================================================
//
// WHAT THIS PAGE DOES:
// 1. Reads the `id` from the URL (e.g., /beaches/1).
// 2. Maintains local state for the selected `activity` (default: swimming).
// 3. Fetches the full dashboard data (GET /api/beaches/{id}/dashboard?activity={act}).
// 4. Renders a dynamic Hero section, Activity tabs, Condition Cards, and Alerts.
//
// REACT CONCEPTS FOR BACKEND DEVS:
// - useParams(): Like capturing path parameters in FastAPI `@app.get("/beaches/{id}")`.
// - useEffect dependencies: We pass `[id, activity]` to the dependency array.
//   This tells React: "Re-run the fetch function WHENEVER `id` or `activity` changes."
//   It's a reactive system. When a user clicks the "Surfing" tab, `setActivity('surfing')`
//   is called, state changes, the component re-renders, the effect fires, and new data is loaded.
// =============================================================================

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Activity,
  Waves,
  Droplets,
  Users,
  AlertTriangle,
  Info,
  ThermometerSun,
  MapPin
} from 'lucide-react';

import { getBeachDashboard } from '../services/api';
import type { DashboardResponse } from '../types';
import { getStatusColor, getStatusBgColor, getSeverityColor } from '../utils/helpers';

// Predefined list of activities supported by the backend weighting algorithm
const ACTIVITIES = [
  { id: 'swimming', label: 'Swimming' },
  { id: 'surfing', label: 'Surfing' },
  { id: 'fishing', label: 'Fishing' },
  { id: 'diving', label: 'Diving' }
];

export default function BeachDetails() {
  // 1. Capture the 'id' parameter from the URL path
  const { id } = useParams<{ id: string }>();

  // 2. Local State
  const [activity, setActivity] = useState('swimming');
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // 3. Data Fetching Effect
  useEffect(() => {
    async function fetchDashboard() {
      if (!id) return;
      
      setIsLoading(true);
      setError('');
      
      try {
        const dashboardData = await getBeachDashboard(Number(id), activity);
        setData(dashboardData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load beach details');
      } finally {
        setIsLoading(false);
      }
    }

    // This runs on mount, AND whenever `id` or `activity` changes.
    fetchDashboard();
  }, [id, activity]);

  // ---------------------------------------------------------------------------
  // HELPER: Map condition categories to icons
  // ---------------------------------------------------------------------------
  const getConditionIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'weather': return <ThermometerSun className="w-5 h-5 text-amber-400" />;
      case 'ocean': return <Waves className="w-5 h-5 text-blue-400" />;
      case 'water_quality': return <Droplets className="w-5 h-5 text-cyan-400" />;
      case 'crowd': return <Users className="w-5 h-5 text-purple-400" />;
      default: return <Info className="w-5 h-5 text-slate-400" />;
    }
  };

  // ---------------------------------------------------------------------------
  // RENDER: Loading State
  // ---------------------------------------------------------------------------
  if (isLoading && !data) {
    return (
      <div className="space-y-6 animate-pulse pb-12">
        <div className="h-8 w-24 bg-[#0D1B2A] rounded mb-6" /> {/* Back button */}
        <div className="bg-[#0D1B2A] h-64 rounded-3xl border border-[#20364A]" /> {/* Hero */}
        <div className="flex gap-2">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-10 w-24 bg-[#0D1B2A] rounded-xl" />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="bg-[#0D1B2A] h-40 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER: Error State
  // ---------------------------------------------------------------------------
  if (error || !data) {
    return (
      <div className="text-center py-20 bg-red-500/10 rounded-3xl border border-red-500/20">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-red-400 mb-2">Failed to Load Dashboard</h2>
        <p className="text-red-400/80 mb-6">{error || 'Beach not found'}</p>
        <Link to="/dashboard" className="text-cyan-400 hover:underline">
          &larr; Return to Dashboard
        </Link>
      </div>
    );
  }

  // Destructure data for cleaner JSX
  const { beach, safety_index, conditions, alerts } = data;

  // ---------------------------------------------------------------------------
  // RENDER: Main Dashboard
  // ---------------------------------------------------------------------------
  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* ---- Back Navigation ---- */}
      <Link 
        to="/dashboard" 
        className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Map
      </Link>

      {/* ==================== HERO SECTION ==================== */}
      {/* 
        This is the dynamic hero. The background/border colors subtly shift 
        based on the overall safety status. 
      */}
      <div className={`relative overflow-hidden rounded-3xl border ${getStatusBgColor(beach.status)}`}>
        {/* Decorative background blur */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />
        
        <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          
          {/* Left: Beach Info */}
          <div>
            <span className={`inline-block px-3 py-1 rounded-md text-xs font-bold border mb-4 ${getStatusBgColor(beach.status)}`}>
              OVERALL STATUS: {beach.status}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{beach.name}</h1>
            <p className="text-lg text-slate-300 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-cyan-500" />
              {beach.location}
            </p>
          </div>

          {/* Right: Dynamic Safety Index */}
          <div className="bg-[#07111F]/50 backdrop-blur-md rounded-2xl p-6 border border-[#20364A] text-center min-w-[200px]">
            <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">
              Safety Index ({safety_index.activity})
            </p>
            <div className="flex items-center justify-center gap-3">
              <Activity className={`w-8 h-8 ${getStatusColor(safety_index.status)}`} />
              <span className={`text-5xl font-black ${getStatusColor(safety_index.status)}`}>
                {safety_index.score}
              </span>
              <span className="text-slate-500 text-xl font-bold self-end mb-1">/100</span>
            </div>
            <p className={`mt-2 text-sm font-bold ${getStatusColor(safety_index.status)}`}>
              {safety_index.status} FOR {safety_index.activity.toUpperCase()}
            </p>
          </div>
        </div>
      </div>

      {/* ==================== ALERTS SECTION ==================== */}
      {/* Only renders if there are active alerts for this beach */}
      {alerts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Active Alerts
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {alerts.map(alert => (
              <div 
                key={alert.id}
                className={`p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${getSeverityColor(alert.severity)}`}
              >
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="px-2 py-0.5 bg-black/20 rounded text-xs font-bold uppercase">
                      {alert.alert_type.replace('_', ' ')}
                    </span>
                    <span className="text-sm font-medium opacity-70">
                      From: {alert.source || 'Authority'}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold">{alert.title}</h4>
                  <p className="opacity-90 mt-1 text-sm">{alert.message}</p>
                </div>
                {alert.instruction && (
                  <div className="bg-black/20 p-3 rounded-xl md:max-w-xs text-sm font-medium">
                    <span className="block text-xs uppercase opacity-70 mb-1">Instruction</span>
                    {alert.instruction}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== ACTIVITY SELECTOR ==================== */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4">Select Activity to Recalculate Index</h3>
        <div className="flex flex-wrap gap-3">
          {ACTIVITIES.map(act => (
            <button
              key={act.id}
              onClick={() => setActivity(act.id)}
              className={`px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                activity === act.id
                  ? 'bg-cyan-500 text-[#07111F] shadow-lg shadow-cyan-500/20'
                  : 'bg-[#0D1B2A] text-slate-400 border border-[#20364A] hover:border-cyan-500/50 hover:text-cyan-400'
              }`}
            >
              {act.label}
            </button>
          ))}
          {/* Loading indicator that shows specifically during tab switches */}
          {isLoading && data && (
            <div className="px-4 py-2.5 flex items-center text-cyan-400 text-sm animate-pulse">
              Recalculating...
            </div>
          )}
        </div>
      </div>

      {/* ==================== CONDITION CARDS ==================== */}
      {/* 
        This dynamically maps over the conditions array returned by the API.
        Object.entries is used to render the flexible 'details' JSON dictionary. 
      */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4">Live Conditions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {conditions.map((cond, idx) => (
            <div key={idx} className="bg-[#0D1B2A] border border-[#20364A] rounded-2xl p-6 shadow-lg shadow-black/10">
              
              {/* Header: Icon, Category, Score */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#20364A]">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#13263A] rounded-xl border border-[#20364A]">
                    {getConditionIcon(cond.category)}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white capitalize">{cond.category.replace('_', ' ')}</h4>
                    <p className="text-xs text-slate-500">Source: {cond.source}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-xl font-black ${getStatusColor(cond.status)}`}>{cond.score}/100</p>
                  <p className={`text-xs font-bold ${getStatusColor(cond.status)}`}>{cond.status}</p>
                </div>
              </div>

              {/* Body: Key-Value pairs from details dict */}
              <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                {Object.entries(cond.details).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">
                      {key.replace(/_/g, ' ')}
                    </p>
                    <p className="text-slate-200 font-medium">{String(value)}</p>
                  </div>
                ))}
              </div>
              
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
