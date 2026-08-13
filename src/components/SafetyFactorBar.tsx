import React from 'react';
import { getStatusColor } from '../utils/helpers';

interface SafetyFactorBarProps {
  label: string;
  score: number; // 0-100
  status: string;
  source?: string;
  lastUpdated?: string;
}

export const SafetyFactorBar: React.FC<SafetyFactorBarProps> = ({
  label,
  score,
  status,
  source,
  lastUpdated
}) => {
  const colorClass = getStatusColor(status);
  // Convert text-emerald-400 to bg-emerald-400 for the bar fill
  const bgFillClass = colorClass.replace('text-', 'bg-');
  
  return (
    <div className="w-full py-2">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm font-medium text-slate-200">{label}</span>
        <span className={`text-sm font-bold uppercase ${colorClass}`}>{status}</span>
      </div>
      
      <div className="w-full h-2.5 bg-[#20364A] rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full ${bgFillClass} transition-all duration-700 ease-out`}
          style={{ width: `${Math.max(0, Math.min(100, score))}%` }}
        />
      </div>
      
      {(source || lastUpdated) && (
        <div className="flex justify-between items-center mt-1.5 text-[11px] text-slate-500">
          <span>{source ? `Source: ${source}` : ''}</span>
          <span>{lastUpdated ? `Updated: ${lastUpdated}` : ''}</span>
        </div>
      )}
    </div>
  );
};

export default SafetyFactorBar;
