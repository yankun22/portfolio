import React from 'react';
import { AssetList } from './AssetList';
import { AllocationDonut } from './AllocationDonut';

export const PortfolioOverview: React.FC = () => {
  return (
    <div className="grid-portfolio">
      {/* Left: Asset Holdings List */}
      <div>
        <AssetList />
      </div>

      {/* Right: Allocation Breakdown Donut & Insights */}
      <div>
        <AllocationDonut />
      </div>
    </div>
  );
};
