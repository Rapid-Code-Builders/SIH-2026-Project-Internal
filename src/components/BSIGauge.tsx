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
  // Extract just the hex/tailwind color part for SVG stroke if possible, 
  // but using currentColor with text-color class is safer in Tailwind.

  return (
    <div className={`flex flex-col items-center justify-center ${isLg ? 'w-48' : 'w-28'}`}>
      <div className="relative flex items-center justify-center">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90"
        >
          <circle
            stroke="#20364A" // var(--color-ts-border)
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
          <span className={`font-bold text-white ${isLg ? 'text-4xl' : 'text-xl'}`}>
            {score}
          </span>
          <span className={`uppercase font-semibold tracking-wider ${colorClass} ${isLg ? 'text-sm' : 'text-[10px]'}`}>
            {status}
          </span>
        </div>
      </div>
      {(label || lastUpdated) && (
        <div className="mt-4 text-center">
          {label && <div className="text-slate-300 text-sm font-medium">{label}</div>}
          {lastUpdated && <div className="text-slate-500 text-xs mt-1">Updated {lastUpdated}</div>}
        </div>
      )}
    </div>
  );
};

export default BSIGauge;
