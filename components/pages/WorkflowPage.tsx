import React from 'react';
import { HowItWorks } from '../HowItWorks';

export const WorkflowPage: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      <div className="w-full">
        <HowItWorks />
      </div>
    </div>
  );
};
