import React from 'react';
import { Wand2 } from 'lucide-react';
import { DESIGNER_PRESETS } from '../../services/materialLibrary';
import { useStudio } from '../../context/useStudio';

export const PresetShowcase: React.FC = () => {
  const { applyPresetDesign } = useStudio();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Wand2 size={14} color="#f59e0b" />
          <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
            Designer Curated Builds
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {DESIGNER_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            className="btn-spatial btn-pill"
            style={{
              padding: '10px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              textAlign: 'left',
              gap: '4px',
            }}
            onClick={() => applyPresetDesign(preset.id)}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: preset.thumbnailColor,
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                }}
              />
              <span
                style={{
                  fontSize: '0.625rem',
                  color: '#00f0ff',
                  background: 'rgba(0, 240, 255, 0.1)',
                  padding: '1px 6px',
                  borderRadius: '4px',
                }}
              >
                {preset.badge}
              </span>
            </div>

            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>
              {preset.name}
            </span>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', lineHeight: 1.2 }}>
              {preset.tagline}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
