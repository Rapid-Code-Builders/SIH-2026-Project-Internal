import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  AlertTriangle, 
  ShieldAlert, 
  Info,
  MapPin,
  ExternalLink,
  Shield
} from 'lucide-react';

import { getAlertById } from '../services/api';
import type { Alert } from '../types';
import { getSeverityColor } from '../utils/helpers';
import { timeAgo } from '../utils/helpers';

export default function AlertDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [alert, setAlert] = useState<Alert | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadAlert() {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await getAlertById(Number(id));
        setAlert(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Alert not found');
      } finally {
        setIsLoading(false);
      }
    }
    loadAlert();
  }, [id]);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return <ShieldAlert className="w-12 h-12" />;
      case 'WARNING': return <AlertTriangle className="w-12 h-12" />;
      default: return <Info className="w-12 h-12" />;
    }
  };

  const getSeverityAccent = (severity: string): { color: string; bg: string; border: string; headerBg: string } => {
    switch (severity) {
      case 'CRITICAL': return {
        color: '#C74B3F',
        bg: 'rgba(199,75,63,0.07)',
        border: 'rgba(199,75,63,0.22)',
        headerBg: 'linear-gradient(135deg, rgba(199,75,63,0.10) 0%, rgba(199,75,63,0.04) 100%)',
      };
      case 'WARNING':  return {
        color: '#C08A2A',
        bg: 'rgba(192,138,42,0.07)',
        border: 'rgba(192,138,42,0.22)',
        headerBg: 'linear-gradient(135deg, rgba(192,138,42,0.10) 0%, rgba(192,138,42,0.04) 100%)',
      };
      default:         return {
        color: '#3E6E8E',
        bg: 'rgba(62,110,142,0.07)',
        border: 'rgba(62,110,142,0.22)',
        headerBg: 'linear-gradient(135deg, rgba(62,110,142,0.10) 0%, rgba(62,110,142,0.04) 100%)',
      };
    }
  };

  const getStatusBadge = (status: string): { bg: string; color: string; border: string } => {
    switch (status) {
      case 'ACTIVE':   return { bg: 'rgba(89,125,138,0.08)',  color: '#3D6070', border: 'rgba(89,125,138,0.25)' };
      case 'RESOLVED': return { bg: 'rgba(124,153,134,0.08)', color: '#4C8B6F', border: 'rgba(124,153,134,0.25)' };
      default:         return { bg: '#FBF6EE', color: '#A08070', border: '#DCC9B2' };
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-[1000px] space-y-6 animate-pulse pb-12">
        <div className="h-6 w-24 rounded mb-6" style={{ background: '#DCC9B2' }} />
        <div className="h-80 rounded-3xl" style={{ background: '#DCC9B2', border: '1px solid #DCC9B2' }} />
      </div>
    );
  }

  if (error || !alert) {
    return (
      <div className="w-full max-w-[1000px] text-center py-20 rounded-3xl" style={{ background: 'rgba(89,125,138,0.06)', border: '1px solid rgba(89,125,138,0.2)' }}>
        <AlertTriangle className="w-12 h-12 mx-auto mb-4" style={{ color: '#597D8A' }} />
        <h2 className="text-xl font-bold mb-2" style={{ color: '#597D8A' }}>Error</h2>
        <p className="mb-6" style={{ color: '#597D8A', opacity: 0.8 }}>{error || 'Alert not found'}</p>
        <button onClick={() => navigate(-1)} className="transition-colors" style={{ color: '#A67C5A' }}>
          ← Back to Alerts
        </button>
      </div>
    );
  }

  const accent = getSeverityAccent(alert.severity);

  return (
    <div className="w-full max-w-[1000px] space-y-8 animate-fade-in pb-16">
      
      <button 
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 transition-colors text-sm font-medium"
        style={{ color: '#6B4F3E' }}
        onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = '#A67C5A'}
        onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = '#6B4F3E'}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Alerts
      </button>

      {/* Main card */}
      <div className="relative overflow-hidden rounded-3xl" style={{ background: '#FFFFFF', border: `1px solid ${accent.border}`, boxShadow: '0 4px 24px rgba(58,42,32,0.07)' }}>
        {/* Banner header */}
        <div className="px-8 py-6 flex flex-wrap items-center justify-between gap-4" style={{ borderBottom: `1px solid ${accent.border}`, background: accent.headerBg }}>
          <div className="flex flex-wrap items-center gap-3">
            {/* Severity badge — bold color-coded */}
            <span
              className="px-4 py-1.5 rounded-full text-sm font-black uppercase tracking-widest border flex items-center gap-2"
              style={{ background: accent.bg, color: accent.color, borderColor: accent.border, borderWidth: '1.5px' }}
            >
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: accent.color }} />
              {alert.severity} ALERT
            </span>
            {/* Status badge */}
            {(() => {
              const sb = getStatusBadge(alert.status);
              return (
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border"
                  style={{ background: sb.bg, color: sb.color, borderColor: sb.border }}
                >
                  {alert.status}
                </span>
              );
            })()}
          </div>
          <span
            className="text-sm font-medium px-4 py-1.5 rounded-full"
            style={{ background: '#FBF6EE', color: '#6B4F3E', border: '1px solid #DCC9B2' }}
          >
            Source: {alert.source || 'Local Authority'}
          </span>
        </div>

        {/* Content body */}
        <div className="p-8 md:p-12">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Severity icon block */}
            <div
              className="p-5 rounded-2xl hidden md:block shrink-0"
              style={{ background: accent.bg, color: accent.color, border: `1px solid ${accent.border}` }}
            >
              {getSeverityIcon(alert.severity)}
            </div>
            
            <div className="flex-1 w-full">
              <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif", color: '#3A2A20' }}>
                {alert.title}
              </h1>
              
              {/* Info grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-6 rounded-2xl" style={{ background: 'linear-gradient(135deg, #FBF6EE 0%, #F2E8D8 100%)', border: '1px solid #DCC9B2' }}>
                <div>
                  <p className="text-xs uppercase tracking-wider font-semibold mb-1" style={{ color: '#A08070' }}>Type</p>
                  <p className="text-sm font-medium capitalize" style={{ color: '#3A2A20' }}>{alert.alert_type.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider font-semibold mb-1" style={{ color: '#A08070' }}>Issued</p>
                  <p className="text-sm font-medium" style={{ color: '#3A2A20' }}>{timeAgo(alert.created_at)}</p>
                </div>
                {alert.expires_at && (
                  <div>
                    <p className="text-xs uppercase tracking-wider font-semibold mb-1" style={{ color: '#A08070' }}>Expires</p>
                    <p className="text-sm font-medium" style={{ color: '#3A2A20' }}>{timeAgo(alert.expires_at)}</p>
                  </div>
                )}
                {alert.beach_name && (
                  <div className="col-span-2 md:col-span-1">
                    <p className="text-xs uppercase tracking-wider font-semibold mb-1" style={{ color: '#A08070' }}>Location</p>
                    <p className="text-sm font-medium" style={{ color: '#3A2A20' }}>{alert.beach_name}</p>
                  </div>
                )}
              </div>

              {alert.beach_name && alert.beach_id && (
                <Link 
                  to={`/beaches/${alert.beach_id}`}
                  className="inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-xl transition-colors mb-8"
                  style={{ background: '#FBF6EE', color: '#6B4F3E', border: '1px solid #DCC9B2' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#A67C5A'; (e.currentTarget as HTMLAnchorElement).style.color = '#A67C5A'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#DCC9B2'; (e.currentTarget as HTMLAnchorElement).style.color = '#6B4F3E'; }}
                >
                  <MapPin className="w-4 h-4" style={{ color: '#A67C5A' }} />
                  View Affected Beach Dashboard
                  <ExternalLink className="w-4 h-4 ml-1 opacity-70" />
                </Link>
              )}

              <div className="space-y-8">
                <div>
                  {/* Section label */}
                  <div
                    className="inline-flex items-center px-3 py-1.5 rounded-lg mb-4"
                    style={{ background: 'linear-gradient(135deg, #FBF6EE 0%, #F2E8D8 100%)', border: '1px solid #DCC9B2' }}
                  >
                    <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: '#A08070' }}>Description</h3>
                  </div>
                  <p className="text-lg leading-relaxed whitespace-pre-wrap" style={{ color: '#3A2A20' }}>
                    {alert.message}
                  </p>
                </div>

                {(alert.instruction || alert.severity === 'CRITICAL') && (
                  <div
                    className="rounded-2xl p-6 md:p-8 relative overflow-hidden border-l-4"
                    style={{ background: '#FBF6EE', borderLeftColor: accent.color, borderTop: `1px solid ${accent.border}`, borderRight: `1px solid ${accent.border}`, borderBottom: `1px solid ${accent.border}` }}
                  >
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                      <Shield className="w-32 h-32" />
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: accent.color }}>
                        <ShieldAlert className="w-5 h-5" />
                        What should you do?
                      </h3>
                      <p className="text-lg font-medium leading-relaxed" style={{ color: '#3A2A20' }}>
                        {alert.instruction || "For your safety, please avoid entering the water and follow all instructions from local authorities and coast guard personnel."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
