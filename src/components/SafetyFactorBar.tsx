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
  const bgFillClass = colorClass.replace('text-', 'bg-');
  
  return (
    <div className="w-full py-2">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm font-medium" style={{ color: '#3A2A20' }}>{label}</span>
        <span className={`text-sm font-bold uppercase ${colorClass}`}>{status}</span>
      </div>
      
      <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: '#DCC9B2' }}>
        <div 
          className={`h-full rounded-full ${bgFillClass} transition-all duration-700 ease-out`}
          style={{ width: `${Math.max(0, Math.min(100, score))}%` }}
        />
      </div>
      
      {(source || lastUpdated) && (
        <div className="flex justify-between items-center mt-1.5 text-[11px]" style={{ color: '#A08070' }}>
          <span>{source ? `Source: ${source}` : ''}</span>
          <span>{lastUpdated ? `Updated: ${lastUpdated}` : ''}</span>
        </div>
      )}
    </div>
  );
};

export default SafetyFactorBar;
