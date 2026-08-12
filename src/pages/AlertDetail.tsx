// =============================================================================
// TideSense — Single Alert Detail Page (AlertDetail.tsx)
// =============================================================================

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  AlertTriangle, 
  ShieldAlert, 
  Info,
  Clock,
  MapPin,
  ExternalLink
} from 'lucide-react';

import { getAlertById } from '../services/api';
import type { Alert } from '../types';
import { getSeverityColor } from '../utils/helpers';
import { timeAgo } from '../utils/helpers';

export default function AlertDetail() {
  const { id } = useParams<{ id: string }>();
  
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

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse pb-12">
        <div className="h-6 w-24 bg-[#0D1B2A] rounded mb-6" />
        <div className="bg-[#0D1B2A] h-80 rounded-3xl border border-[#20364A]" />
      </div>
    );
  }

  if (error || !alert) {
    return (
      <div className="text-center py-20 bg-red-500/10 rounded-3xl border border-red-500/20">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-red-400 mb-2">Error</h2>
        <p className="text-red-400/80 mb-6">{error || 'Alert not found'}</p>
        <Link to="/alerts" className="text-cyan-400 hover:underline">
          &larr; Back to Alerts
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      <Link 
        to="/alerts" 
        className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Alerts
      </Link>

      <div className={`relative overflow-hidden rounded-3xl border ${getSeverityColor(alert.severity)}`}>
        {/* Banner header */}
        <div className="bg-black/10 px-8 py-6 border-b border-black/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-black/20 rounded-md text-sm font-bold uppercase tracking-wider">
              {alert.severity} ALERT
            </span>
            <span className="text-sm font-bold opacity-75 flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              Issued {timeAgo(alert.created_at)}
            </span>
          </div>
          <span className="text-sm font-medium opacity-80 border border-current px-3 py-1 rounded-full">
            Source: {alert.source || 'Local Authority'}
          </span>
        </div>

        {/* Content body */}
        <div className="p-8 md:p-12">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="p-4 bg-black/10 rounded-2xl hidden md:block">
              {getSeverityIcon(alert.severity)}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{alert.title}</h1>
              
              {alert.beach_name && (
                <Link 
                  to={`/beaches/${alert.beach_id}`}
                  className="inline-flex items-center gap-2 text-lg font-bold opacity-90 hover:opacity-100 mb-6 group bg-black/10 px-4 py-2 rounded-xl transition-colors"
                >
                  <MapPin className="w-5 h-5" />
                  Affected Area: {alert.beach_name}
                  <ExternalLink className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider opacity-70 mb-2">Description</h3>
                  <p className="text-lg opacity-90 leading-relaxed">
                    {alert.message}
                  </p>
                </div>

                {alert.instruction && (
                  <div className="bg-black/20 rounded-2xl p-6 border border-black/10">
                    <h3 className="text-sm font-bold uppercase tracking-wider opacity-70 mb-3 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4" />
                      Required Action
                    </h3>
                    <p className="text-lg font-medium opacity-100 leading-relaxed">
                      {alert.instruction}
                    </p>
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
