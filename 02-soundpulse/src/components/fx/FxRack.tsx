import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { ParametricEq } from './ParametricEq';
import { BiquadFilterUnit } from './BiquadFilterUnit';
import { ReverbUnit } from './ReverbUnit';
import { DistortionUnit } from './DistortionUnit';

export const FxRack: React.FC = () => {
  return (
    <div className="rack-chassis">
      <div className="rack-header">
        <h2 className="rack-title">
          <SlidersHorizontal size={18} color="#06b6d4" />
          <span>Real-Time Web Audio DSP FX Rack</span>
        </h2>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Biquad & Convolution DSP Graph
        </span>
      </div>

      <div className="rack-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(360px, 100%), 1fr))', gap: '16px' }}>
        {/* 1. 3-Band Parametric EQ */}
        <ParametricEq />

        {/* 2. Dual Biquad Resonant Filters */}
        <BiquadFilterUnit />

        {/* 3. Algorithmic Convolution Reverb */}
        <ReverbUnit />

        {/* 4. WaveShaper Distortion */}
        <DistortionUnit />
      </div>
    </div>
  );
};
