import React from 'react';

interface SkeletonCardProps {
  type: 'event' | 'album';
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({ type }) => {
  if (type === 'album') {
    return (
      <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-[4/3] bg-secondary">
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-surface/5 to-transparent animate-shimmer" />
        
        {/* Badge skeleton */}
        <div className="absolute top-4 right-4 z-10">
          <div className="w-24 h-7 rounded-full bg-surface/10" />
        </div>
        
        {/* Content skeleton */}
        <div className="absolute inset-x-0 bottom-0 p-5">
          <div className="h-6 w-3/4 bg-surface/10 rounded mb-2" />
          <div className="h-4 w-1/2 bg-surface/10 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden shadow-lg bg-secondary">
      {/* Image skeleton */}
      <div className="relative h-48 bg-surface/10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-surface/5 to-transparent animate-shimmer" />
      </div>
      
      {/* Content skeleton */}
      <div className="p-6 space-y-4">
        <div className="h-6 w-3/4 bg-surface/10 rounded" />
        
        <div className="space-y-2">
          <div className="h-4 w-1/2 bg-surface/10 rounded" />
          <div className="h-4 w-1/3 bg-surface/10 rounded" />
          <div className="h-4 w-2/3 bg-surface/10 rounded" />
        </div>
        
        <div className="h-4 w-full bg-surface/10 rounded" />
        
        <div className="pt-2">
          <div className="h-12 w-full bg-surface/10 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
