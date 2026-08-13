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
          <div key={key} className="bg-[#0D1B2A] border border-[#20364A] rounded-lg p-4 animate-pulse w-full">
            <div className="flex justify-between items-start mb-4">
              <div className="w-2/3">
                <div className="h-5 bg-[#13263A] rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-[#13263A] rounded w-1/2"></div>
              </div>
              <div className="h-6 w-16 bg-[#13263A] rounded-full"></div>
            </div>
            <div className="flex gap-3 mb-5 mt-8">
              <div className="h-4 bg-[#13263A] rounded w-1/4"></div>
              <div className="h-4 bg-[#13263A] rounded w-1/4"></div>
            </div>
            <div className="h-4 bg-[#13263A] rounded w-full border-t border-[#20364A] pt-4 mt-auto"></div>
          </div>
        );
        
      case 'list':
        return (
          <div key={key} className="flex items-center gap-4 py-3 border-b border-[#20364A] animate-pulse">
            <div className="w-10 h-10 bg-[#13263A] rounded-full shrink-0"></div>
            <div className="flex-1">
              <div className="h-4 bg-[#13263A] rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-[#13263A] rounded w-1/4"></div>
            </div>
            <div className="h-6 w-20 bg-[#13263A] rounded-full"></div>
          </div>
        );
        
      case 'detail':
        return (
          <div key={key} className="animate-pulse w-full">
            <div className="h-10 bg-[#13263A] rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-[#13263A] rounded w-1/4 mb-8"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <div className="h-64 bg-[#13263A] rounded-xl w-full"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-32 bg-[#13263A] rounded-xl w-full"></div>
                  <div className="h-32 bg-[#13263A] rounded-xl w-full"></div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-48 bg-[#13263A] rounded-xl w-full"></div>
                <div className="h-48 bg-[#13263A] rounded-xl w-full"></div>
              </div>
            </div>
          </div>
        );
        
      case 'map':
        return (
          <div key={key} className="w-full h-full min-h-[400px] bg-[#13263A] rounded-xl animate-pulse"></div>
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
