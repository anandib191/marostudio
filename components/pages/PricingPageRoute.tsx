import React from 'react';
import { PricingPage } from '../PricingPage';

export const PricingPageRoute: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      <div className="w-full">
        <PricingPage />
      </div>
    </div>
  );
};
