import React from 'react';
import { Waves, Wind, Sun } from 'lucide-react';

interface ActivitySelectorProps {
  selected: string;
  onChange: (activity: string) => void;
  activities?: string[];
}

const getActivityIcon = (activity: string) => {
  switch (activity.toLowerCase()) {
    case 'swimming': return <Waves className="w-4 h-4" />;
    case 'surfing': return <Wind className="w-4 h-4" />;
    case 'leisure': return <Sun className="w-4 h-4" />;
    default: return null;
  }
};

export const ActivitySelector: React.FC<ActivitySelectorProps> = ({ 
  selected, 
  onChange, 
  activities = ['Swimming', 'Surfing', 'Leisure'] 
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {activities.map(activity => {
        const isSelected = selected.toLowerCase() === activity.toLowerCase();
        return (
          <button
            key={activity}
            onClick={() => onChange(activity)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
              ${isSelected 
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20' 
                : 'bg-transparent border border-[#20364A] text-slate-300 hover:border-cyan-500/50 hover:text-cyan-400'
              }
            `}
          >
            {getActivityIcon(activity)}
            {activity}
          </button>
        );
      })}
    </div>
  );
};

export default ActivitySelector;
