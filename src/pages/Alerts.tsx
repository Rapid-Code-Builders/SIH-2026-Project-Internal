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
  // DERIVED STATE
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

  const getSeverityIconBg = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return { background: 'rgba(89,125,138,0.12)', color: '#597D8A' };
      case 'WARNING':  return { background: 'rgba(110,147,166,0.12)', color: '#6E93A6' };
      default:         return { background: 'rgba(166,124,90,0.12)', color: '#A67C5A' };
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return { background: 'rgba(89,125,138,0.12)', color: '#597D8A', border: 'rgba(89,125,138,0.35)' };
      case 'WARNING':  return { background: 'rgba(110,147,166,0.12)', color: '#6E93A6', border: 'rgba(110,147,166,0.35)' };
      default:         return { background: 'rgba(166,124,90,0.12)', color: '#A67C5A', border: 'rgba(166,124,90,0.35)' };
    }
  };

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------
  return (
    <div className="w-full space-y-10 animate-fade-in pb-16 max-w-[1280px] mx-auto">
      
      {/* ---- Header ---- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6" style={{ borderBottom: '1px solid #DCC9B2' }}>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 mb-2" style={{ fontFamily: "'Playfair Display', serif", color: '#3A2A20' }}>
            <Bell className="w-8 h-8" style={{ color: '#A67C5A' }} />
            Active Alerts
          </h1>
          <p style={{ color: '#6B4F3E' }}>Live safety advisories and warnings across all monitored beaches.</p>
        </div>
      </div>

      {/* ---- Filters ---- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'All', value: 'ALL', count: stats.all },
            { label: 'Critical', value: 'CRITICAL', count: stats.critical },
            { label: 'Warning', value: 'WARNING', count: stats.warning },
            { label: 'Info', value: 'INFO', count: stats.info }
          ].map(tab => {
            const active = filterSeverity === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setFilterSeverity(tab.value)}
                className="px-4 py-2 rounded-full font-medium text-sm transition-colors flex items-center gap-2"
                style={{
                  background: active ? '#A67C5A' : '#FFFFFF',
                  color: active ? '#FFFFFF' : '#6B4F3E',
                  border: active ? '1px solid #A67C5A' : '1px solid #DCC9B2',
                  fontWeight: active ? 700 : 500,
                }}
                onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLButtonElement).style.borderColor = '#A67C5A'; } }}
                onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLButtonElement).style.borderColor = '#DCC9B2'; } }}
              >
                <span>{tab.label}</span>
                <span
                  className="px-2 py-0.5 rounded-full text-xs"
                  style={{ background: active ? 'rgba(255,255,255,0.25)' : '#FBF6EE', color: active ? '#FFFFFF' : '#6B4F3E' }}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#A08070' }} />
          <input
            type="text"
            placeholder="Search alerts by title or beach..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-colors"
            style={{
              background: '#FFFFFF',
              border: '1px solid #DCC9B2',
              color: '#3A2A20',
              outline: 'none',
            }}
            onFocus={e => { e.currentTarget.style.borderColor = '#A67C5A'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(166,124,90,0.1)'; }}
            onBlur={e => { e.currentTarget.style.borderColor = '#DCC9B2'; e.currentTarget.style.boxShadow = 'none'; }}
          />
        </div>
      </div>

      {/* ---- Content ---- */}
      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-28 rounded-2xl" style={{ background: '#DCC9B2' }} />
          ))}
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(89,125,138,0.08)', border: '1px solid rgba(89,125,138,0.25)' }}>
          <AlertTriangle className="w-8 h-8 mx-auto mb-3" style={{ color: '#597D8A' }} />
          <p style={{ color: '#597D8A' }}>{error}</p>
        </div>
      ) : filteredAlerts.length === 0 ? (
        <div className="text-center py-20 rounded-2xl" style={{ background: '#FBF6EE', border: '1px solid #DCC9B2' }}>
          <ShieldCheck className="w-12 h-12 mx-auto mb-4" style={{ color: '#7C9986', opacity: 0.5 }} />
          <h2 className="text-xl font-bold mb-2" style={{ color: '#3A2A20' }}>No active safety alerts</h2>
          <p style={{ color: '#6B4F3E' }}>All beaches are being monitored.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredAlerts.map(alert => {
            const iconStyle = getSeverityIconBg(alert.severity);
            const badgeStyle = getSeverityBadge(alert.severity);
            return (
              <Link 
                key={alert.id}
                to={`/alerts/${alert.id}`}
                className={`group flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-2xl border transition-all hover:scale-[1.01] hover:shadow-md ${getSeverityColor(alert.severity)}`}
              >
                <div className="flex items-start gap-5">
                  <div className="p-3 rounded-xl mt-1" style={iconStyle}>
                    {getSeverityIcon(alert.severity)}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span
                        className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider"
                        style={{ background: badgeStyle.background, color: badgeStyle.color, border: `1px solid ${badgeStyle.border}` }}
                      >
                        {alert.severity}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-medium" style={{ color: '#6B4F3E' }}>
                        <Clock className="w-3.5 h-3.5" />
                        {timeAgo(alert.created_at)}
                      </span>
                      {alert.beach_name && (
                        <span className="text-xs font-bold pl-2" style={{ color: '#3A2A20', borderLeft: '1px solid #DCC9B2' }}>
                          @ {alert.beach_name}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold mb-1.5 transition-colors" style={{ color: '#3A2A20' }}>
                      {alert.title}
                    </h3>
                    <p className="text-sm line-clamp-2 md:line-clamp-1 max-w-4xl" style={{ color: '#6B4F3E' }}>
                      {alert.message}
                    </p>
                  </div>
                </div>
                <div className="hidden md:flex items-center justify-center p-3 rounded-xl transition-colors" style={{ background: '#FBF6EE', border: '1px solid #DCC9B2' }}>
                  <ChevronRight className="w-5 h-5" style={{ color: '#A67C5A' }} />
                </div>
              </Link>
            );
          })}
        </div>
      )}

    </div>
  );
}
