import React from 'react';

interface LoaderProps {
    size?: 'sm' | 'md' | 'lg';
    color?: 'white' | 'black' | 'rose';
}

export const Loader: React.FC<LoaderProps> = ({ size = 'md', color = 'rose' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const colorClasses = {
      white: 'border-white',
      black: 'border-black',
      rose: 'border-rose-500'
  }
  
  return (
    <div
      className={`animate-spin rounded-full border-t-2 border-b-2 ${colorClasses[color]} ${sizeClasses[size]}`}
    ></div>
  );
};