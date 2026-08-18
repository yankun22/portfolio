import React from 'react';
import { Waves } from 'lucide-react';
import { useAudioEngine } from '../../context/useAudioEngine';
import { Knob } from '../common/Knob';
import { LedSwitch } from '../common/LedSwitch';

export const ReverbUnit: React.FC = () => {
  const { fxParams, setFxParams, engine } = useAudioEngine();
  const reverb = fxParams.reverb;

  const updateReverb = (partial: Partial<typeof reverb>) => {
    setFxParams((prev) => {
      const next = { ...prev.reverb, ...partial };
      if (partial.roomSize !== undefined || partial.decay !== undefined) {
        engine.updateReverbImpulse(next.roomSize, next.decay);
      }
      return { ...prev, reverb: next };
    });
  };

  const setPreset = (type: typeof reverb.type, roomSize: number, decay: number, wet: number) => {
    updateReverb({ type, roomSize, decay, wet, dry: 0.85, enabled: true });
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
          <Waves size={16} color="#8b5cf6" />
          <span style={{ fontSize: '0.825rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Convolution Reverb Impulse
          </span>
        </div>

        <LedSwitch
          label={reverb.enabled ? 'ON' : 'BYPASS'}
          active={reverb.enabled}
          onChange={(active) => updateReverb({ enabled: active })}
          color="#8b5cf6"
        />
      </div>

      {/* Preset Selector Badges */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        <button
          type="button"
          className={`btn-studio btn-rack ${reverb.type === 'hall' ? 'active' : ''}`}
          style={{ padding: '4px 10px', fontSize: '0.725rem' }}
          onClick={() => setPreset('hall', 0.8, 3.5, 0.45)}
        >
          Concert Hall
        </button>
        <button
          type="button"
          className={`btn-studio btn-rack ${reverb.type === 'room' ? 'active' : ''}`}
          style={{ padding: '4px 10px', fontSize: '0.725rem' }}
          onClick={() => setPreset('room', 0.35, 1.4, 0.3)}
        >
          Studio Room
        </button>
        <button
          type="button"
          className={`btn-studio btn-rack ${reverb.type === 'plate' ? 'active' : ''}`}
          style={{ padding: '4px 10px', fontSize: '0.725rem' }}
          onClick={() => setPreset('plate', 0.6, 2.2, 0.4)}
        >
          Vintage Plate
        </button>
        <button
          type="button"
          className={`btn-studio btn-rack ${reverb.type === 'ambient' ? 'active' : ''}`}
          style={{ padding: '4px 10px', fontSize: '0.725rem' }}
          onClick={() => setPreset('ambient', 1.0, 5.5, 0.65)}
        >
          Deep Space
        </button>
      </div>

      {/* Knobs Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
        <Knob
          label="Room Size"
          value={reverb.roomSize}
          onChange={(val) => updateReverb({ roomSize: val })}
          min={0.1}
          max={1.0}
          step={0.05}
          defaultValue={0.5}
          unit=""
          color="#8b5cf6"
          size={44}
        />
        <Knob
          label="Decay"
          value={reverb.decay}
          onChange={(val) => updateReverb({ decay: val })}
          min={0.2}
          max={6.0}
          step={0.1}
          defaultValue={2.2}
          unit=" s"
          color="#8b5cf6"
          size={44}
        />
        <Knob
          label="Wet Mix"
          value={reverb.wet}
          onChange={(val) => updateReverb({ wet: val })}
          min={0.0}
          max={1.0}
          step={0.02}
          defaultValue={0.35}
          unit=""
          color="#a78bfa"
          size={44}
        />
        <Knob
          label="Dry Mix"
          value={reverb.dry}
          onChange={(val) => updateReverb({ dry: val })}
          min={0.0}
          max={1.0}
          step={0.02}
          defaultValue={0.85}
          unit=""
          color="#a78bfa"
          size={44}
        />
      </div>
    </div>
  );
};
