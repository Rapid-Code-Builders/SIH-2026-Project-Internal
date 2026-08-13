import React from 'react';
import { getStatusBgColor, getStatusColor } from '../utils/helpers';

interface SafetyBadgeProps {
  status: 'SAFE' | 'CAUTION' | 'UNSAFE' | string;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
}

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base font-medium'
};

const dotSizeClasses = {
  sm: 'w-1.5 h-1.5',
  md: 'w-2 h-2',
  lg: 'w-2.5 h-2.5'
};

export const SafetyBadge: React.FC<SafetyBadgeProps> = ({ 
  status, 
  size = 'md', 
  showDot = false 
}) => {
  const bgClass = getStatusBgColor(status);
  const textClass = getStatusColor(status);
  
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${bgClass} ${sizeClasses[size]}`}>
      {showDot && (
        <span className={`rounded-full bg-current ${textClass} ${dotSizeClasses[size]}`} />
      )}
      <span className="capitalize">{status?.toLowerCase() || 'Unknown'}</span>
    </span>
  );
};

export default SafetyBadge;
