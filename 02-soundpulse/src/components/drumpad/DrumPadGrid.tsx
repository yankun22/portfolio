import React, { useState, useEffect, useCallback } from 'react';
import { Drum, Volume2 } from 'lucide-react';
import { useAudioEngine } from '../../context/useAudioEngine';
import type { DrumPadInfo } from '../../types/drumPad';

export const DrumPadGrid: React.FC = () => {
  const { drumPads, setDrumPads, triggerDrumSoundDirect } = useAudioEngine();
  const [activePadIds, setActivePadIds] = useState<Set<string>>(new Set());

  const flashPad = useCallback((padId: string) => {
    setActivePadIds((prev) => new Set(prev).add(padId));
    setTimeout(() => {
      setActivePadIds((prev) => {
        const next = new Set(prev);
        next.delete(padId);
        return next;
      });
    }, 140);
  }, []);

  // Listen for custom trigger events (from keyboard listener in AudioEngineContext)
  useEffect(() => {
    const handleTrigger = (e: Event) => {
      const custom = e as CustomEvent<{ padId: string }>;
      const padId = custom.detail?.padId;
      if (padId) {
        flashPad(padId);
      }
    };

    window.addEventListener('drum-pad-trigger', handleTrigger);
    return () => window.removeEventListener('drum-pad-trigger', handleTrigger);
  }, [flashPad]);

  const handlePadClick = (pad: DrumPadInfo) => {
    triggerDrumSoundDirect(pad.type, pad.pitch, pad.gain);
    flashPad(pad.id);
  };

  const updatePad = (id: string, partial: Partial<DrumPadInfo>) => {
    setDrumPads((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...partial } : p))
    );
  };

  return (
    <div className="rack-chassis">
      <div className="rack-header">
        <h2 className="rack-title">
          <Drum size={18} color="#10b981" />
          <span>8-Pad Synthesized Soundboard & Trigger Bank</span>
        </h2>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Low-Latency Sub-Millisecond Oscillators • Hotkeys [Q, W, E, R, A, S, D, F]
        </span>
      </div>

      <div className="rack-body">
        <div className="drum-grid">
          {drumPads.map((pad) => {
            const isTriggered = activePadIds.has(pad.id);

            return (
              <div
                key={pad.id}
                className={`drum-pad ${isTriggered ? 'triggered' : ''}`}
                style={
                  {
                    '--pad-color': pad.color,
                    '--pad-glow': pad.accentColor,
                    borderColor: isTriggered ? pad.color : 'rgba(255,255,255,0.08)',
                  } as React.CSSProperties
                }
                onClick={() => handlePadClick(pad)}
              >
                {/* Top Row: Key Badge + Category */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="pad-key-badge">{pad.key}</span>
                  <span className="pad-category">{pad.category}</span>
                </div>

                {/* Center: Pad Title & Description */}
                <div>
                  <div className="pad-name" style={{ color: isTriggered ? '#ffffff' : pad.color }}>
                    {pad.name}
                  </div>
                  <div style={{ fontSize: '0.675rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                    {pad.description}
                  </div>
                </div>

                {/* Bottom Row: Mini Pitch & Gain Controls (stops click propagation) */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '4px',
                    paddingTop: '6px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Pitch:</span>
                    <input
                      type="range"
                      min="-12"
                      max="12"
                      step="1"
                      value={pad.pitch}
                      onChange={(e) => updatePad(pad.id, { pitch: parseFloat(e.target.value) })}
                      style={{ width: '50px', accentColor: pad.color, cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: pad.color }}>
                      {pad.pitch > 0 ? `+${pad.pitch}` : pad.pitch}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Volume2 size={12} color="var(--text-dim)" />
                    <input
                      type="range"
                      min="0.1"
                      max="1.5"
                      step="0.05"
                      value={pad.gain}
                      onChange={(e) => updatePad(pad.id, { gain: parseFloat(e.target.value) })}
                      style={{ width: '45px', accentColor: pad.color, cursor: 'pointer' }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
