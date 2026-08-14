import React from 'react';
import { getStatusColor } from '../utils/helpers';

interface BSIGaugeProps {
  score: number; // 0-100
  status: 'SAFE' | 'CAUTION' | 'UNSAFE' | string;
  size?: 'sm' | 'lg';
  label?: string;
  lastUpdated?: string;
}

export const BSIGauge: React.FC<BSIGaugeProps> = ({ 
  score, 
  status, 
  size = 'md', 
  label, 
  lastUpdated 
}) => {
  const isLg = size === 'lg';
  const radius = isLg ? 80 : 48;
  const stroke = isLg ? 12 : 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const colorClass = getStatusColor(status);

  return (
    <div className={`flex flex-col items-center justify-center ${isLg ? 'w-48' : 'w-28'}`}>
      <div className="relative flex items-center justify-center">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90"
        >
          <circle
            stroke="#DCC9B2"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            className={`${colorClass} transition-all duration-1000 ease-out`}
            stroke="currentColor"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className={`font-bold ${isLg ? 'text-4xl' : 'text-xl'}`} style={{ color: '#3A2A20' }}>
            {score}
          </span>
          <span className={`uppercase font-semibold tracking-wider ${colorClass} ${isLg ? 'text-sm' : 'text-[10px]'}`}>
            {status}
          </span>
        </div>
      </div>
      {(label || lastUpdated) && (
        <div className="mt-4 text-center">
          {label && <div className="text-sm font-medium" style={{ color: '#6B4F3E' }}>{label}</div>}
          {lastUpdated && <div className="text-xs mt-1" style={{ color: '#A08070' }}>Updated {lastUpdated}</div>}
        </div>
      )}
    </div>
  );
};

export default BSIGauge;
