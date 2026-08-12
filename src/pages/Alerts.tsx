// =============================================================================
// TideSense — Global Alerts Dashboard (Alerts.tsx)
// =============================================================================
//
// WHAT THIS PAGE DOES:
// 1. Fetches all active alerts globally (GET /api/alerts).
// 2. Displays them in a searchable/filterable list.
// 3. Applies severity-based styling (CRITICAL=Red, WARNING=Amber, INFO=Blue).
//
// REACT CONCEPTS:
// - Conditional Rendering: We show different UI states for Loading, Error,
//   Empty (no alerts), and Populated (list of alerts).
// =============================================================================

import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bell, 
  Search, 
  AlertTriangle, 
  ShieldAlert, 
  Info,
  ChevronRight,
  Clock
} from 'lucide-react';

import { getAlerts } from '../services/api';
import type { Alert } from '../types';
import { getSeverityColor } from '../utils/helpers';
import { timeAgo } from '../utils/helpers';

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // ---------------------------------------------------------------------------
  // DATA FETCHING
  // ---------------------------------------------------------------------------
  useEffect(() => {
    async function loadAlerts() {
      try {
        const data = await getAlerts();
        // Sort alerts by created_at (newest first)
        const sorted = data.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setAlerts(sorted);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load alerts');
      } finally {
        setIsLoading(false);
      }
    }
    loadAlerts();
  }, []);

  // ---------------------------------------------------------------------------
  // DERIVED STATE: Searching and Filtering
  // ---------------------------------------------------------------------------
  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      const matchesSearch = alert.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (alert.beach_name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
      const matchesSeverity = filterSeverity === 'ALL' || alert.severity === filterSeverity;
      return matchesSearch && matchesSeverity;
    });
  }, [alerts, searchQuery, filterSeverity]);

  // ---------------------------------------------------------------------------
  // HELPER: Severity Icon
  // ---------------------------------------------------------------------------
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return <ShieldAlert className="w-5 h-5" />;
      case 'WARNING': return <AlertTriangle className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------
  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* ---- Header ---- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#20364A] pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-2">
            <Bell className="w-8 h-8 text-cyan-400" />
            Global Alerts
          </h1>
          <p className="text-slate-400">Live safety advisories and warnings across all monitored beaches.</p>
        </div>
      </div>

      {/* ---- Filters ---- */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search by title or beach name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-[#0D1B2A] border border-[#20364A] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
        </div>
        
        <div className="flex gap-2">
          {['ALL', 'CRITICAL', 'WARNING', 'INFO'].map(sev => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                filterSeverity === sev 
                  ? 'bg-cyan-500 text-[#07111F]' 
                  : 'bg-[#0D1B2A] text-slate-400 border border-[#20364A] hover:border-cyan-500/50'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* ---- Content ---- */}
      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-[#0D1B2A] h-28 rounded-2xl border border-[#20364A]" />
          ))}
        </div>
      ) : error ? (
        <div className="p-6 bg-red-500/10 border border-red-500/25 rounded-2xl text-center">
          <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-3" />
          <p className="text-red-400">{error}</p>
        </div>
      ) : filteredAlerts.length === 0 ? (
        <div className="text-center py-20 bg-[#0D1B2A] border border-[#20364A] rounded-2xl">
          <ShieldAlert className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-300 mb-2">No Active Alerts</h2>
          <p className="text-slate-500">Conditions are currently safe across the filtered parameters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredAlerts.map(alert => (
            <Link 
              key={alert.id}
              to={`/alerts/${alert.id}`}
              className={`group flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-2xl border transition-all hover:scale-[1.01] ${getSeverityColor(alert.severity)}`}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-black/20 rounded-xl mt-1">
                  {getSeverityIcon(alert.severity)}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-black/20 rounded text-xs font-bold uppercase tracking-wider">
                      {alert.alert_type.replace('_', ' ')}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-medium opacity-80">
                      <Clock className="w-3.5 h-3.5" />
                      {timeAgo(alert.created_at)}
                    </span>
                    {alert.beach_name && (
                      <span className="text-xs font-bold opacity-90 border-l border-current pl-2">
                        @ {alert.beach_name}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-1 group-hover:underline decoration-2 underline-offset-4">
                    {alert.title}
                  </h3>
                  <p className="opacity-90 text-sm line-clamp-2 md:line-clamp-1 max-w-3xl">
                    {alert.message}
                  </p>
                </div>
              </div>
              <div className="hidden md:flex items-center justify-center p-3 bg-black/10 rounded-xl group-hover:bg-black/20 transition-colors">
                <ChevronRight className="w-6 h-6" />
              </div>
            </Link>
          ))}
        </div>
      )}

    </div>
  );
}
