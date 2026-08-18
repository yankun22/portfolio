import React from 'react';
import { Activity } from 'lucide-react';
import { useAudioEngine } from '../../context/useAudioEngine';
import { Knob } from '../common/Knob';
import { LedSwitch } from '../common/LedSwitch';

export const BiquadFilterUnit: React.FC = () => {
  const { fxParams, setFxParams } = useAudioEngine();
  const filter = fxParams.filter;

  const updateFilter = (partial: Partial<typeof filter>) => {
    setFxParams((prev) => ({
      ...prev,
      filter: { ...prev.filter, ...partial },
    }));
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
          <Activity size={16} color="#10b981" />
          <span style={{ fontSize: '0.825rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Dual Biquad Filters
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* High-Pass Filter */}
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.25)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>HIGH-PASS</span>
            <LedSwitch
              label={filter.highpassEnabled ? 'ON' : 'OFF'}
              active={filter.highpassEnabled}
              onChange={(active) => updateFilter({ highpassEnabled: active })}
              color="#10b981"
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Knob
              label="Cutoff"
              value={filter.highpassCutoff}
              onChange={(val) => updateFilter({ highpassCutoff: val })}
              min={20}
              max={4000}
              step={10}
              defaultValue={30}
              unit=" Hz"
              color="#10b981"
              size={44}
            />
            <Knob
              label="Resonance"
              value={filter.highpassQ}
              onChange={(val) => updateFilter({ highpassQ: val })}
              min={0.1}
              max={15.0}
              step={0.1}
              defaultValue={1.0}
              unit=" Q"
              color="#10b981"
              size={44}
            />
          </div>
        </div>

        {/* Low-Pass Filter */}
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.25)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>LOW-PASS</span>
            <LedSwitch
              label={filter.lowpassEnabled ? 'ON' : 'OFF'}
              active={filter.lowpassEnabled}
              onChange={(active) => updateFilter({ lowpassEnabled: active })}
              color="#f59e0b"
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Knob
              label="Cutoff"
              value={filter.lowpassCutoff}
              onChange={(val) => updateFilter({ lowpassCutoff: val })}
              min={200}
              max={20000}
              step={100}
              defaultValue={18000}
              unit=" Hz"
              color="#f59e0b"
              size={44}
            />
            <Knob
              label="Resonance"
              value={filter.lowpassQ}
              onChange={(val) => updateFilter({ lowpassQ: val })}
              min={0.1}
              max={15.0}
              step={0.1}
              defaultValue={1.0}
              unit=" Q"
              color="#f59e0b"
              size={44}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
