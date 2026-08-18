import React from 'react';
import { Sliders, Sparkles, Loader2 } from 'lucide-react';
import { useAudioEngine } from '../../context/useAudioEngine';
import { Knob } from '../common/Knob';
import { LedSwitch } from '../common/LedSwitch';

export const MasterStrip: React.FC = () => {
  const { fxParams, setFxParams, exportProcessedWav, isExporting, activeTrack } = useAudioEngine();

  const handleMasterGainChange = (gain: number) => {
    setFxParams((prev) => ({ ...prev, masterGain: gain }));
  };

  const handlePanChange = (pan: number) => {
    setFxParams((prev) => ({ ...prev, stereoPan: pan }));
  };

  const handlePitchChange = (semitones: number) => {
    setFxParams((prev) => ({ ...prev, pitchShift: semitones }));
  };

  const handleBypassToggle = (bypass: boolean) => {
    setFxParams((prev) => ({ ...prev, bypassAll: bypass }));
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--bg-module)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px 24px',
        flexWrap: 'wrap',
        gap: '20px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Sliders size={18} color="#06b6d4" />
        <span style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Master Output & Routing
        </span>
      </div>

      {/* Knobs & Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '28px', flexWrap: 'wrap' }}>
        {/* Pitch Shift */}
        <Knob
          label="Pitch Shift"
          value={fxParams.pitchShift}
          onChange={handlePitchChange}
          min={-12}
          max={12}
          step={1}
          defaultValue={0}
          unit=" st"
          color="#f59e0b"
          size={48}
        />

        {/* Stereo Pan */}
        <Knob
          label="Stereo Pan"
          value={fxParams.stereoPan}
          onChange={handlePanChange}
          min={-1.0}
          max={1.0}
          step={0.05}
          defaultValue={0}
          unit=""
          color="#8b5cf6"
          size={48}
        />

        {/* Master Output Gain */}
        <Knob
          label="Master Vol"
          value={fxParams.masterGain}
          onChange={handleMasterGainChange}
          min={0}
          max={2.0}
          step={0.02}
          defaultValue={1.0}
          unit="x"
          color="#10b981"
          size={52}
        />

        {/* Master Bypass Switch */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            FX Chain
          </span>
          <LedSwitch
            label={fxParams.bypassAll ? 'Bypassed' : 'Active'}
            active={!fxParams.bypassAll}
            onChange={(active) => handleBypassToggle(!active)}
            color="#10b981"
          />
        </div>

        {/* Quick Master Export with FX Button */}
        <button
          type="button"
          className="btn-studio btn-play"
          style={{
            padding: '8px 16px',
            fontSize: '0.8rem',
            background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
          onClick={() => exportProcessedWav(false)}
          disabled={isExporting || !activeTrack}
          title="Export current track processed with all FX settings"
        >
          {isExporting ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} color="#fef08a" />}
          <span>{isExporting ? 'Rendering...' : 'Export Mix (.WAV)'}</span>
        </button>
      </div>
    </div>
  );
};
