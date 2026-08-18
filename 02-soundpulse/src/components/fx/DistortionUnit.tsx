import React from 'react';
import { Flame } from 'lucide-react';
import type { DistortionType } from '../../types/fx';
import { useAudioEngine } from '../../context/useAudioEngine';
import { Knob } from '../common/Knob';
import { LedSwitch } from '../common/LedSwitch';

export const DistortionUnit: React.FC = () => {
  const { fxParams, setFxParams } = useAudioEngine();
  const dist = fxParams.distortion;

  const updateDist = (partial: Partial<typeof dist>) => {
    setFxParams((prev) => ({
      ...prev,
      distortion: { ...prev.distortion, ...partial },
    }));
  };

  const curveOptions: { id: DistortionType; label: string }[] = [
    { id: 'warmth', label: 'Warm Tube' },
    { id: 'hard', label: 'Hard Clip' },
    { id: 'fuzz', label: 'Heavy Fuzz' },
    { id: 'bitcrush', label: 'Bitcrush' },
  ];

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
          <Flame size={16} color="#ef4444" />
          <span style={{ fontSize: '0.825rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            WaveShaper Distortion & Drive
          </span>
        </div>

        <LedSwitch
          label={dist.enabled ? 'ON' : 'BYPASS'}
          active={dist.enabled}
          onChange={(active) => updateDist({ enabled: active })}
          color="#ef4444"
        />
      </div>

      {/* Curve Type Selectors */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {curveOptions.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`btn-studio btn-rack ${dist.curveType === c.id ? 'active' : ''}`}
            style={{ padding: '4px 10px', fontSize: '0.725rem' }}
            onClick={() => updateDist({ curveType: c.id, enabled: true })}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Knobs Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        <Knob
          label="Drive"
          value={dist.drive}
          onChange={(val) => updateDist({ drive: val })}
          min={0}
          max={100}
          step={1}
          defaultValue={25}
          unit="%"
          color="#ef4444"
          size={44}
        />
        <Knob
          label="Tone"
          value={dist.tone}
          onChange={(val) => updateDist({ tone: val })}
          min={2000}
          max={20000}
          step={200}
          defaultValue={8000}
          unit=" Hz"
          color="#f59e0b"
          size={44}
        />
        <Knob
          label="Level"
          value={dist.outputGain}
          onChange={(val) => updateDist({ outputGain: val })}
          min={0.1}
          max={2.0}
          step={0.05}
          defaultValue={1.0}
          unit="x"
          color="#ef4444"
          size={44}
        />
      </div>
    </div>
  );
};
