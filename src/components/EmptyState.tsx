import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  message: string;
  action?: { label: string; onClick: () => void };
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon, 
  title, 
  message, 
  action 
}) => {
  return (
    <div
      className="flex flex-col items-center justify-center p-8 text-center rounded-xl h-full min-h-[250px]"
      style={{ background: '#FBF6EE', border: '1px solid #DCC9B2' }}
    >
      {icon && (
        <div className="mb-4" style={{ color: '#A67C5A', opacity: 0.7 }}>
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold mb-2" style={{ color: '#3A2A20' }}>{title}</h3>
      <p className="text-sm max-w-md mb-6" style={{ color: '#6B4F3E' }}>{message}</p>
      
      {action && (
        <button 
          onClick={action.onClick}
          className="px-5 py-2.5 text-white text-sm font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2"
          style={{ background: '#A67C5A' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#8C6647')}
          onMouseLeave={e => (e.currentTarget.style.background = '#A67C5A')}
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
