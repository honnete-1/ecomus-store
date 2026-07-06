import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="animate-pulse">
      <div className="bg-light-gray rounded-lg w-full aspect-[4/5] mb-4"></div>
      <div className="h-5 bg-light-gray rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-light-gray rounded w-1/2 mb-3"></div>
      <div className="h-5 bg-light-gray rounded w-1/4"></div>
    </div>
  );
};

export default SkeletonCard;
