import React from 'react';
import { Sliders } from 'lucide-react';
import { useAudioEngine } from '../../context/useAudioEngine';
import { Knob } from '../common/Knob';
import { LedSwitch } from '../common/LedSwitch';

export const ParametricEq: React.FC = () => {
  const { fxParams, setFxParams } = useAudioEngine();
  const eq = fxParams.eq;

  const updateEq = (partial: Partial<typeof eq>) => {
    setFxParams((prev) => ({
      ...prev,
      eq: { ...prev.eq, ...partial },
    }));
  };

  // Generate a simple dynamic SVG curve showing EQ response
  const generateEqPath = () => {
    const points: [number, number][] = [];
    const width = 240;
    const height = 60;
    const midY = height / 2;

    for (let x = 0; x <= width; x += 10) {
      const normX = x / width;
      // Approximate low shelf contribution
      const lowImpact = eq.lowGain * Math.max(0, 1 - normX * 2.5);
      // Approximate mid peaking contribution
      const midDist = Math.abs(normX - 0.5);
      const midImpact = eq.midGain * Math.max(0, 1 - midDist * (eq.midQ * 2));
      // Approximate high shelf contribution
      const highImpact = eq.highGain * Math.max(0, (normX - 0.6) * 2.5);

      const totalGain = lowImpact + midImpact + highImpact;
      const y = midY - (totalGain / 24) * (midY - 8);
      points.push([x, Math.max(4, Math.min(height - 4, y))]);
    }

    return points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`, '');
  };

  return (
    <div
      style={{
        background: 'var(--bg-module)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}
    >
      {/* Unit Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sliders size={16} color="#06b6d4" />
          <span style={{ fontSize: '0.825rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            3-Band Parametric EQ
          </span>
        </div>

        <LedSwitch
          label={eq.enabled ? 'ON' : 'BYPASS'}
          active={eq.enabled}
          onChange={(active) => updateEq({ enabled: active })}
          color="#06b6d4"
        />
      </div>

      {/* Visual EQ Curve Display */}
      <div
        style={{
          width: '100%',
          height: '60px',
          background: '#090d14',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Center zero line */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '50%',
            height: '1px',
            background: 'rgba(255, 255, 255, 0.08)',
          }}
        />

        <svg width="100%" height="100%" viewBox="0 0 240 60" preserveAspectRatio="none">
          <path
            d={generateEqPath()}
            fill="none"
            stroke={eq.enabled ? '#06b6d4' : 'var(--text-dim)'}
            strokeWidth="2.5"
            style={{ filter: eq.enabled ? 'drop-shadow(0 0 4px rgba(6, 182, 212, 0.6))' : 'none' }}
          />
        </svg>
      </div>

      {/* Knobs Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        {/* Low Shelf */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <Knob
            label="Low Gain"
            value={eq.lowGain}
            onChange={(val) => updateEq({ lowGain: val })}
            min={-24}
            max={24}
            step={0.5}
            defaultValue={0}
            unit=" dB"
            color="#10b981"
            size={44}
          />
          <Knob
            label="Low Freq"
            value={eq.lowFreq}
            onChange={(val) => updateEq({ lowFreq: val })}
            min={60}
            max={300}
            step={5}
            defaultValue={100}
            unit=" Hz"
            color="#10b981"
            size={38}
          />
        </div>

        {/* Mid Peak */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <Knob
            label="Mid Gain"
            value={eq.midGain}
            onChange={(val) => updateEq({ midGain: val })}
            min={-24}
            max={24}
            step={0.5}
            defaultValue={0}
            unit=" dB"
            color="#06b6d4"
            size={44}
          />
          <Knob
            label="Mid Freq"
            value={eq.midFreq}
            onChange={(val) => updateEq({ midFreq: val })}
            min={250}
            max={5000}
            step={50}
            defaultValue={1000}
            unit=" Hz"
            color="#06b6d4"
            size={38}
          />
        </div>

        {/* High Shelf */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <Knob
            label="High Gain"
            value={eq.highGain}
            onChange={(val) => updateEq({ highGain: val })}
            min={-24}
            max={24}
            step={0.5}
            defaultValue={0}
            unit=" dB"
            color="#ec4899"
            size={44}
          />
          <Knob
            label="High Freq"
            value={eq.highFreq}
            onChange={(val) => updateEq({ highFreq: val })}
            min={4000}
            max={16000}
            step={100}
            defaultValue={8000}
            unit=" Hz"
            color="#ec4899"
            size={38}
          />
        </div>
      </div>
    </div>
  );
};
