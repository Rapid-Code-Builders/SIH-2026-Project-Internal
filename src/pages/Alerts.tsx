import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bell, 
  Search, 
  AlertTriangle, 
  ShieldAlert, 
  Info,
  ChevronRight,
  Clock,
  ShieldCheck
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

  const stats = useMemo(() => {
    return {
      critical: alerts.filter(a => a.severity === 'CRITICAL').length,
      warning: alerts.filter(a => a.severity === 'WARNING').length,
      info: alerts.filter(a => a.severity === 'INFO').length,
      all: alerts.length
    };
  }, [alerts]);

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
    <div className="space-y-8 animate-fade-in pb-12 max-w-[1440px] mx-auto">
      
      {/* ---- Header ---- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#20364A] pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-2">
            <Bell className="w-8 h-8 text-cyan-400" />
            Active Alerts
          </h1>
          <p className="text-slate-400">Live safety advisories and warnings across all monitored beaches.</p>
        </div>
      </div>

      {/* ---- Filters ---- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'All', value: 'ALL', count: stats.all, color: 'text-slate-300' },
            { label: 'Critical', value: 'CRITICAL', count: stats.critical, color: 'text-red-400' },
            { label: 'Warning', value: 'WARNING', count: stats.warning, color: 'text-amber-400' },
            { label: 'Info', value: 'INFO', count: stats.info, color: 'text-blue-400' }
          ].map(tab => (
            <button
              key={tab.value}
              onClick={() => setFilterSeverity(tab.value)}
              className={`px-4 py-2 rounded-full font-medium text-sm transition-colors flex items-center gap-2 ${
                filterSeverity === tab.value 
                  ? 'bg-[#13263A] border-cyan-500/50 text-white shadow-sm' 
                  : 'bg-[#0D1B2A] text-slate-400 border border-[#20364A] hover:border-cyan-500/30'
              } border`}
            >
              <span className={filterSeverity === tab.value ? tab.color : ''}>{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs bg-black/20 ${filterSeverity === tab.value ? tab.color : 'text-slate-500'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search alerts by title or beach..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#0D1B2A] border border-[#20364A] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/25 transition-colors text-sm"
          />
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
          <ShieldCheck className="w-12 h-12 text-emerald-500/50 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-300 mb-2">No active safety alerts</h2>
          <p className="text-slate-500">All beaches are being monitored.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredAlerts.map(alert => (
            <Link 
              key={alert.id}
              to={`/alerts/${alert.id}`}
              className={`group flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-2xl border transition-all hover:scale-[1.01] hover:shadow-lg ${getSeverityColor(alert.severity)} bg-[#0D1B2A] bg-opacity-40`}
            >
              <div className="flex items-start gap-5">
                <div className={`p-3 rounded-xl mt-1 ${alert.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : alert.severity === 'WARNING' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}`}>
                  {getSeverityIcon(alert.severity)}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                      alert.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      alert.severity === 'WARNING' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {alert.severity}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-medium text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      {timeAgo(alert.created_at)}
                    </span>
                    {alert.beach_name && (
                      <span className="text-xs font-bold text-slate-300 border-l border-slate-700 pl-2">
                        @ {alert.beach_name}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-1.5 text-slate-100 group-hover:text-cyan-400 transition-colors">
                    {alert.title}
                  </h3>
                  <p className="text-slate-400 text-sm line-clamp-2 md:line-clamp-1 max-w-4xl">
                    {alert.message}
                  </p>
                </div>
              </div>
              <div className="hidden md:flex items-center justify-center p-3 bg-[#13263A] rounded-xl group-hover:bg-[#20364A] transition-colors border border-[#20364A]">
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white" />
              </div>
            </Link>
          ))}
        </div>
      )}

    </div>
  );
}
