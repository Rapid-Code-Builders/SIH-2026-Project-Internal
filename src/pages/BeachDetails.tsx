import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Waves,
  Droplets,
  Users,
  AlertTriangle,
  Info,
  ThermometerSun,
  MapPin,
  RefreshCw
} from 'lucide-react';

import { getBeachDashboard } from '../services/api';
import type { DashboardResponse } from '../types';
import { getStatusColor, getStatusBgColor, getSeverityColor } from '../utils/helpers';

const ACTIVITIES = [
  { id: 'swimming', label: 'Swimming' },
  { id: 'surfing', label: 'Surfing' },
  { id: 'fishing', label: 'Fishing' },
  { id: 'diving', label: 'Diving' }
];

const LoadingSkeleton = () => (
  <div className="space-y-6 animate-pulse pb-12">
    <div className="h-8 w-32 bg-[#0D1B2A] rounded mb-6" />
    <div className="bg-[#0D1B2A] h-[300px] rounded-3xl border border-[#20364A]" />
    <div className="h-10 w-full md:w-96 bg-[#0D1B2A] rounded-xl" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[1, 2, 3, 4].map(i => <div key={i} className="bg-[#0D1B2A] h-40 rounded-2xl" />)}
    </div>
  </div>
);

// Inline BSIGauge
const BSIGauge = ({ score, status }: { score: number, status: string }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  let strokeColor = '#f87171'; // red-400
  if (status === 'SAFE') strokeColor = '#34d399'; // emerald-400
  else if (status === 'CAUTION') strokeColor = '#fbbf24'; // amber-400

  return (
    <div className="relative flex items-center justify-center w-40 h-40">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
        <circle
          cx="70"
          cy="70"
          r={radius}
          className="stroke-[#20364A] fill-none"
          strokeWidth="12"
        />
        <circle
          cx="70"
          cy="70"
          r={radius}
          className="fill-none transition-all duration-1000 ease-out"
          stroke={strokeColor}
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-4xl font-black text-white">{score}</span>
        <span className={`text-xs font-bold mt-1 ${getStatusColor(status)}`}>{status}</span>
      </div>
    </div>
  );
};

export default function BeachDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [activity, setActivity] = useState('swimming');
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = async () => {
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
  };

  useEffect(() => {
    fetchDashboard();
  }, [id, activity]);

  const getConditionIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'weather': return <ThermometerSun className="w-5 h-5 text-amber-400" />;
      case 'ocean': return <Waves className="w-5 h-5 text-blue-400" />;
      case 'water_quality': return <Droplets className="w-5 h-5 text-cyan-400" />;
      case 'crowd': return <Users className="w-5 h-5 text-purple-400" />;
      default: return <Info className="w-5 h-5 text-slate-400" />;
    }
  };

  if (isLoading && !data) return <LoadingSkeleton />;

  if (error || !data) {
    return (
      <div className="text-center py-20 bg-red-500/10 rounded-3xl border border-red-500/20">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-red-400 mb-2">Failed to Load Dashboard</h2>
        <p className="text-red-400/80 mb-6">{error || 'Beach not found'}</p>
        <button onClick={() => navigate(-1)} className="text-cyan-400 hover:underline">
          &larr; Back to Beaches
        </button>
      </div>
    );
  }

  const { beach, safety_index, conditions, alerts } = data;
  const isSafetyOverride = (beach as any).safety_override;

  return (
    <div className="space-y-8 animate-fade-in pb-16 max-w-[1440px] mx-auto">
      
      {/* ---- Back Navigation ---- */}
      <button 
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Beaches
      </button>

      {/* ==================== HERO SECTION ==================== */}
      <div className={`relative overflow-hidden rounded-3xl border bg-[#0D1B2A] ${getStatusBgColor(beach.status).replace('bg-', 'border-').replace('/10', '/50')}`}>
        <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
          
          <div className="flex-1">
            <span className={`inline-block px-3 py-1 rounded-md text-xs font-bold border mb-4 ${getStatusBgColor(beach.status)}`}>
              {beach.status}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{beach.name}</h1>
            <p className="text-lg text-slate-300 flex items-center gap-2 mb-6">
              <MapPin className="w-5 h-5 text-cyan-500" />
              {beach.location}
            </p>
            
            <div className="space-y-3 mt-6">
              <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Select Activity</p>
              <div className="flex flex-wrap gap-2">
                {ACTIVITIES.map(act => (
                  <button
                    key={act.id}
                    onClick={() => setActivity(act.id)}
                    className={`px-5 py-2 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                      activity === act.id
                        ? 'bg-cyan-500 text-[#07111F] shadow-lg shadow-cyan-500/20'
                        : 'bg-[#13263A] text-slate-400 border border-[#20364A] hover:border-cyan-500/50 hover:text-cyan-400'
                    }`}
                  >
                    {act.label}
                    {isLoading && activity === act.id && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-[#13263A]/80 rounded-3xl p-6 border border-[#20364A] flex flex-col items-center min-w-[240px] shadow-xl">
            <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-4">
              Beach Safety Index
            </p>
            <BSIGauge score={safety_index.score} status={safety_index.status} />
          </div>
        </div>
      </div>

      {/* ==================== ALERTS SECTION ==================== */}
      {isSafetyOverride && (
        <div className="p-5 rounded-2xl border bg-red-500/10 border-red-500/30 text-red-400 flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold">Manual Safety Override Active</h4>
            <p className="text-sm opacity-90 mt-1">{(beach as any).override_reason || 'Local authorities have manually overridden the safety status of this beach.'}</p>
          </div>
        </div>
      )}

      {alerts.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {alerts.map(alert => (
              <div 
                key={alert.id}
                className={`p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${getSeverityColor(alert.severity)}`}
              >
                <div className="flex gap-4">
                  <div className="mt-1">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="px-2 py-0.5 bg-black/20 rounded text-xs font-bold uppercase">
                        {alert.alert_type.replace('_', ' ')}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold">{alert.title}</h4>
                    <p className="opacity-90 mt-1 text-sm">{alert.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== FACTOR BREAKDOWN ==================== */}
      <div className="bg-[#0D1B2A] border border-[#20364A] rounded-2xl p-6 md:p-8">
        <h3 className="text-xl font-bold text-white mb-6">Safety Factors Breakdown</h3>
        <div className="space-y-5">
          {conditions.map((cond, idx) => {
            const percentage = Math.max(0, Math.min(100, cond.score));
            return (
              <div key={idx} className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="w-48 flex items-center gap-3">
                  {getConditionIcon(cond.category)}
                  <div>
                    <p className="font-semibold text-white capitalize">{cond.category.replace('_', ' ')}</p>
                    <p className="text-xs text-slate-500">Source: {cond.source || 'Unknown'}</p>
                  </div>
                </div>
                <div className="flex-1 flex items-center gap-4">
                  <div className="h-3 w-full bg-[#13263A] rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${getStatusColor(cond.status).replace('text-', 'bg-')}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="w-24 text-right shrink-0">
                    <span className={`text-sm font-bold ${getStatusColor(cond.status)}`}>{cond.status}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ==================== CONDITION CARDS ==================== */}
      <div>
        <h3 className="text-xl font-bold text-white mb-6">Detailed Conditions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {conditions.map((cond, idx) => (
            <div key={idx} className="bg-[#0D1B2A] border border-[#20364A] rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#20364A]">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#13263A] rounded-xl border border-[#20364A]">
                    {getConditionIcon(cond.category)}
                  </div>
                  <h4 className="text-lg font-bold text-white capitalize">{cond.category.replace('_', ' ')}</h4>
                </div>
                <span className={`px-3 py-1 text-xs font-bold rounded-md border ${getStatusBgColor(cond.status)}`}>
                  {cond.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-y-5 gap-x-4">
                {Object.entries(cond.details).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">
                      {key.replace(/_/g, ' ')}
                    </p>
                    <p className="text-slate-200 font-medium">{String(value)}</p>
                  </div>
                ))}
              </div>
              {cond.last_updated && (
                <div className="mt-6 pt-4 border-t border-[#20364A] text-right">
                  <p className="text-xs text-slate-500">Updated: {new Date(cond.last_updated).toLocaleString()}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
