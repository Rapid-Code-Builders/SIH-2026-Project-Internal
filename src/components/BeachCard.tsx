import React from 'react';
import type { Beach } from '../types';
import SafetyBadge from './SafetyBadge';
import { Waves, Droplets, Users, ChevronRight } from 'lucide-react';

interface BeachCardProps {
  beach: Beach;
  onClick?: () => void;
}

export const BeachCard: React.FC<BeachCardProps> = ({ beach, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="rounded-xl p-4 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-md flex flex-col"
      style={{
        background: '#FFFFFF',
        border: '1px solid #DCC9B2',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = '#A67C5A';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(166,124,90,0.12)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = '#DCC9B2';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '';
      }}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-base line-clamp-1" style={{ color: '#3A2A20' }}>{beach.name}</h3>
          <p className="text-[13px] line-clamp-1" style={{ color: '#6B4F3E' }}>{beach.location}</p>
        </div>
        <div className="flex flex-col items-end">
          <SafetyBadge status={beach.status} size="sm" showDot />
          <span className="text-xs mt-1" style={{ color: '#6B4F3E' }}>BSI: <strong style={{ color: '#3A2A20' }}>{beach.safety_score}</strong>/100</span>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs mb-4 mt-auto" style={{ color: '#6B4F3E' }}>
        {beach.wave_height !== undefined && (
          <div className="flex items-center gap-1.5" title="Wave Height">
            <Waves className="w-3.5 h-3.5" style={{ color: '#6E93A6' }} />
            <span>{beach.wave_height}m</span>
          </div>
        )}
        {beach.water_quality && (
          <div className="flex items-center gap-1.5" title="Water Quality">
            <Droplets className="w-3.5 h-3.5" style={{ color: '#7C9986' }} />
            <span className="capitalize">{beach.water_quality.toLowerCase()}</span>
          </div>
        )}
        {beach.crowd_level && (
          <div className="flex items-center gap-1.5" title="Crowd Level">
            <Users className="w-3.5 h-3.5" style={{ color: '#A67C5A' }} />
            <span className="capitalize">{beach.crowd_level.toLowerCase()}</span>
          </div>
        )}
      </div>

      <div className="pt-3 flex justify-between items-center text-sm font-medium group" style={{ borderTop: '1px solid #DCC9B2', color: '#A67C5A' }}>
        <span>View Beach</span>
        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </div>
    </div>
  );
};

export default BeachCard;
