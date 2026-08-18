import React from 'react';
import { SimulationControls } from './SimulationControls';
import { FanChart } from './FanChart';
import { ProbabilityCards } from './ProbabilityCards';

export const MonteCarloView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="grid-simulation">
        {/* Left: Interactive Controls */}
        <div>
          <SimulationControls />
        </div>

        {/* Right: Fan Chart */}
        <div>
          <FanChart />
        </div>
      </div>

      {/* Outcome Cards & Trajectory Checkpoints */}
      <div>
        <ProbabilityCards />
      </div>
    </div>
  );
};
