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
      className="bg-[#0D1B2A] border border-[#20364A] rounded-lg p-4 cursor-pointer transition-all duration-200 hover:border-[#22D3EE]/50 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-900/20 flex flex-col"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-white font-bold text-base line-clamp-1">{beach.name}</h3>
          <p className="text-slate-400 text-[13px] line-clamp-1">{beach.location}</p>
        </div>
        <div className="flex flex-col items-end">
          <SafetyBadge status={beach.status} size="sm" showDot />
          <span className="text-xs text-slate-400 mt-1">BSI: <strong className="text-white">{beach.safety_score}</strong>/100</span>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-slate-300 mb-4 mt-auto">
        {beach.wave_height !== undefined && (
          <div className="flex items-center gap-1.5" title="Wave Height">
            <Waves className="w-3.5 h-3.5 text-cyan-400" />
            <span>{beach.wave_height}m</span>
          </div>
        )}
        {beach.water_quality && (
          <div className="flex items-center gap-1.5" title="Water Quality">
            <Droplets className="w-3.5 h-3.5 text-blue-400" />
            <span className="capitalize">{beach.water_quality.toLowerCase()}</span>
          </div>
        )}
        {beach.crowd_level && (
          <div className="flex items-center gap-1.5" title="Crowd Level">
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span className="capitalize">{beach.crowd_level.toLowerCase()}</span>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-[#20364A] flex justify-between items-center text-sm font-medium text-cyan-400 group">
        <span>View Beach</span>
        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </div>
    </div>
  );
};

export default BeachCard;
