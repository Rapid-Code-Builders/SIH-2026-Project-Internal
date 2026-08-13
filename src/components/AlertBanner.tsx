import React from 'react';
import type { Alert } from '../types';
import { getSeverityColor } from '../utils/helpers';
import { AlertTriangle, ChevronRight } from 'lucide-react';

interface AlertBannerProps {
  alert: Alert;
  onViewDetails?: () => void;
  compact?: boolean;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({ 
  alert, 
  onViewDetails, 
  compact = false 
}) => {
  const colorClass = getSeverityColor(alert.severity);
  
  if (compact) {
    return (
      <div className={`flex items-center justify-between p-3 border rounded-lg ${colorClass} w-full`}>
        <div className="flex items-center gap-2.5 overflow-hidden">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span className="font-semibold text-sm truncate">{alert.title}</span>
        </div>
        {onViewDetails && (
          <button 
            onClick={onViewDetails}
            className="flex items-center gap-1 text-xs font-medium hover:underline shrink-0 ml-2"
          >
            Details <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>
    );
  }
  
  return (
    <div className={`flex flex-col sm:flex-row sm:items-start gap-4 p-4 border rounded-xl ${colorClass} w-full`}>
      <div className="shrink-0 mt-0.5">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-base mb-1">{alert.title}</h4>
        <p className="text-sm opacity-90 mb-2">{alert.message}</p>
        
        {alert.instruction && (
          <div className="mt-3 p-3 bg-black/20 rounded-md text-sm border border-current border-opacity-20">
            <span className="font-semibold block mb-1">Instruction:</span>
            {alert.instruction}
          </div>
        )}
        
        {alert.source && (
          <div className="mt-2 text-xs opacity-75">
            Source: {alert.source}
          </div>
        )}
      </div>
      
      {onViewDetails && (
        <div className="sm:shrink-0 mt-2 sm:mt-0">
          <button 
            onClick={onViewDetails}
            className="w-full sm:w-auto px-4 py-2 bg-current bg-opacity-20 hover:bg-opacity-30 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            View Alert <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default AlertBanner;
