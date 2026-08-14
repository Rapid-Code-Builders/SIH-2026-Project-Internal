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
                ? 'bg-[#A67C5A] text-white shadow-md shadow-[rgba(166,124,90,0.25)]' 
                : 'bg-transparent border border-[#DCC9B2] text-[#6B4F3E] hover:border-[#A67C5A] hover:text-[#3A2A20]'
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
