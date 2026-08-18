import React from 'react';
import { PartSelector } from './PartSelector';
import { MaterialPicker } from './MaterialPicker';
import { ColorPalette } from './ColorPalette';
import { PresetShowcase } from './PresetShowcase';
import { PriceSummaryBar } from '../cart/PriceSummaryBar';

export const CustomizerSidebar: React.FC = () => {
  return (
    <aside className="customizer-sidebar">
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
        {/* Model Title Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '14px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div>
            <div style={{ fontSize: '0.675rem', fontWeight: 800, color: '#00f0ff', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              PROTOTYPE SPECIFICATION
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
              SpatialPulse Apex-01
            </h2>
          </div>
          <span
            style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              color: '#10b981',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              padding: '2px 8px',
              borderRadius: '20px',
            }}
          >
            GEN-4 PBR
          </span>
        </div>

        {/* 1. Designer Presets */}
        <PresetShowcase />

        {/* 2. Component Part Selector */}
        <PartSelector />

        {/* 3. Material Tiers */}
        <MaterialPicker />

        {/* 4. Color Palette */}
        <ColorPalette />
      </div>

      {/* Sticky Bottom Price & Add to Bag */}
      <PriceSummaryBar />
    </aside>
  );
};
