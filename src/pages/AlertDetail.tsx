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

  const getStatusBadgeColor = (status: string) => {
    switch(status) {
      case 'ACTIVE': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'RESOLVED': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'EXPIRED': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse pb-12 max-w-[1000px] mx-auto">
        <div className="h-6 w-24 bg-[#0D1B2A] rounded mb-6" />
        <div className="bg-[#0D1B2A] h-80 rounded-3xl border border-[#20364A]" />
      </div>
    );
  }

  if (error || !alert) {
    return (
      <div className="text-center py-20 bg-red-500/10 rounded-3xl border border-red-500/20 max-w-[1000px] mx-auto">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-red-400 mb-2">Error</h2>
        <p className="text-red-400/80 mb-6">{error || 'Alert not found'}</p>
        <button onClick={() => navigate(-1)} className="text-cyan-400 hover:underline">
          &larr; Back to Alerts
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-16 max-w-[1000px] mx-auto">
      
      <button 
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Alerts
      </button>

      <div className={`relative overflow-hidden rounded-3xl border bg-[#0D1B2A] ${getSeverityColor(alert.severity).replace('text-', 'border-').replace('/10', '/30')}`}>
        {/* Banner header */}
        <div className={`px-8 py-6 border-b flex flex-wrap items-center justify-between gap-4 ${
          alert.severity === 'CRITICAL' ? 'bg-red-500/10 border-red-500/20' :
          alert.severity === 'WARNING' ? 'bg-amber-500/10 border-amber-500/20' :
          'bg-blue-500/10 border-blue-500/20'
        }`}>
          <div className="flex flex-wrap items-center gap-3">
            <span className={`px-3 py-1 rounded-md text-sm font-bold uppercase tracking-wider border ${
              alert.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
              alert.severity === 'WARNING' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
              'bg-blue-500/20 text-blue-400 border-blue-500/30'
            }`}>
              {alert.severity} ALERT
            </span>
            <span className={`px-3 py-1 rounded-md text-sm font-bold uppercase tracking-wider border ${getStatusBadgeColor(alert.status)}`}>
              {alert.status}
            </span>
          </div>
          <span className="text-sm font-medium text-slate-300 bg-[#13263A] border border-[#20364A] px-4 py-1.5 rounded-full">
            Source: {alert.source || 'Local Authority'}
          </span>
        </div>

        {/* Content body */}
        <div className="p-8 md:p-12">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className={`p-5 rounded-2xl hidden md:block shrink-0 ${
              alert.severity === 'CRITICAL' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
              alert.severity === 'WARNING' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
              'bg-blue-500/10 text-blue-400 border border-blue-500/20'
            }`}>
              {getSeverityIcon(alert.severity)}
            </div>
            
            <div className="flex-1 w-full">
              <h1 className="text-3xl md:text-4xl font-bold mb-6 text-white leading-tight">{alert.title}</h1>
              
              {/* Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-6 bg-[#13263A]/50 rounded-2xl border border-[#20364A]">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Type</p>
                  <p className="text-sm font-medium text-slate-200 capitalize">{alert.alert_type.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Issued</p>
                  <p className="text-sm font-medium text-slate-200">{timeAgo(alert.created_at)}</p>
                </div>
                {alert.expires_at && (
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Expires</p>
                    <p className="text-sm font-medium text-slate-200">{timeAgo(alert.expires_at)}</p>
                  </div>
                )}
                {alert.beach_name && (
                  <div className="col-span-2 md:col-span-1">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Location</p>
                    <p className="text-sm font-medium text-slate-200">{alert.beach_name}</p>
                  </div>
                )}
              </div>

              {alert.beach_name && alert.beach_id && (
                <Link 
                  to={`/beaches/${alert.beach_id}`}
                  className="inline-flex items-center gap-2 text-sm font-medium bg-[#20364A] text-white hover:bg-[#2A4560] px-5 py-2.5 rounded-xl transition-colors mb-8"
                >
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  View Affected Beach Dashboard
                  <ExternalLink className="w-4 h-4 ml-1 opacity-70" />
                </Link>
              )}

              <div className="space-y-8">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 border-b border-[#20364A] pb-2">Description</h3>
                  <p className="text-lg text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {alert.message}
                  </p>
                </div>

                {(alert.instruction || alert.severity === 'CRITICAL') && (
                  <div className="bg-[#13263A] rounded-2xl p-6 md:p-8 border-l-4 border-l-amber-500 border-t border-r border-b border-[#20364A] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                      <Shield className="w-32 h-32" />
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5" />
                        What should you do?
                      </h3>
                      <p className="text-lg font-medium text-slate-200 leading-relaxed">
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
