import React from 'react';

interface LoadingSkeletonProps {
  type?: 'card' | 'list' | 'detail' | 'map';
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  type = 'card', 
  count = 1 
}) => {
  const renderSkeleton = (key: number) => {
    switch (type) {
      case 'card':
        return (
          <div key={key} className="rounded-lg p-4 animate-pulse w-full" style={{ background: '#FBF6EE', border: '1px solid #DCC9B2' }}>
            <div className="flex justify-between items-start mb-4">
              <div className="w-2/3">
                <div className="h-5 rounded w-3/4 mb-2" style={{ background: '#DCC9B2' }}></div>
                <div className="h-3 rounded w-1/2" style={{ background: '#DCC9B2' }}></div>
              </div>
              <div className="h-6 w-16 rounded-full" style={{ background: '#DCC9B2' }}></div>
            </div>
            <div className="flex gap-3 mb-5 mt-8">
              <div className="h-4 rounded w-1/4" style={{ background: '#DCC9B2' }}></div>
              <div className="h-4 rounded w-1/4" style={{ background: '#DCC9B2' }}></div>
            </div>
            <div className="h-4 rounded w-full pt-4 mt-auto" style={{ background: '#DCC9B2', borderTop: '1px solid #DCC9B2' }}></div>
          </div>
        );
        
      case 'list':
        return (
          <div key={key} className="flex items-center gap-4 py-3 animate-pulse" style={{ borderBottom: '1px solid #DCC9B2' }}>
            <div className="w-10 h-10 rounded-full shrink-0" style={{ background: '#DCC9B2' }}></div>
            <div className="flex-1">
              <div className="h-4 rounded w-1/3 mb-2" style={{ background: '#DCC9B2' }}></div>
              <div className="h-3 rounded w-1/4" style={{ background: '#DCC9B2' }}></div>
            </div>
            <div className="h-6 w-20 rounded-full" style={{ background: '#DCC9B2' }}></div>
          </div>
        );
        
      case 'detail':
        return (
          <div key={key} className="animate-pulse w-full">
            <div className="h-10 rounded w-1/3 mb-4" style={{ background: '#DCC9B2' }}></div>
            <div className="h-4 rounded w-1/4 mb-8" style={{ background: '#DCC9B2' }}></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <div className="h-64 rounded-xl w-full" style={{ background: '#DCC9B2' }}></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-32 rounded-xl w-full" style={{ background: '#DCC9B2' }}></div>
                  <div className="h-32 rounded-xl w-full" style={{ background: '#DCC9B2' }}></div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-48 rounded-xl w-full" style={{ background: '#DCC9B2' }}></div>
                <div className="h-48 rounded-xl w-full" style={{ background: '#DCC9B2' }}></div>
              </div>
            </div>
          </div>
        );
        
      case 'map':
        return (
          <div key={key} className="w-full h-full min-h-[400px] rounded-xl animate-pulse" style={{ background: '#DCC9B2' }}></div>
        );
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, idx) => renderSkeleton(idx))}
    </>
  );
};

export default LoadingSkeleton;
