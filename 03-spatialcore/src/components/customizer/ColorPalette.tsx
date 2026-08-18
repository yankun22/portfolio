import React from 'react';
import { Pipette } from 'lucide-react';
import { COLOR_PALETTES, PART_METADATA } from '../../services/materialLibrary';
import { useStudio } from '../../context/useStudio';

export const ColorPalette: React.FC = () => {
  const { activePartId, productConfig, updatePartColor } = useStudio();
  const currentPartConf = productConfig[activePartId];
  const activePartMeta = PART_METADATA.find((m) => m.id === activePartId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
          Color Palette — {activePartMeta?.name}
        </span>
        <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#00f0ff', fontWeight: 700 }}>
          {currentPartConf.color.toUpperCase()}
        </span>
      </div>

      {/* Preset Swatches Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px' }}>
        {COLOR_PALETTES.map((color) => {
          const isActive = currentPartConf.color.toLowerCase() === color.hex.toLowerCase();

          return (
            <button
              key={color.hex}
              type="button"
              className={`color-swatch ${isActive ? 'active' : ''}`}
              style={{ background: color.hex }}
              onClick={() => updatePartColor(activePartId, color.hex)}
              title={color.name}
            />
          );
        })}
      </div>

      {/* Custom Hex Color Picker */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '8px 12px',
          marginTop: '4px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Pipette size={15} color="#00f0ff" />
          <span style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Custom Hex Color:
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="color"
            value={currentPartConf.color}
            onChange={(e) => updatePartColor(activePartId, e.target.value)}
            style={{
              width: '28px',
              height: '28px',
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer',
              background: 'transparent',
            }}
          />
          <input
            type="text"
            value={currentPartConf.color.toUpperCase()}
            onChange={(e) => updatePartColor(activePartId, e.target.value)}
            style={{
              width: '80px',
              background: '#090d15',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '4px 8px',
              color: '#ffffff',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              textAlign: 'center',
              fontWeight: 700,
            }}
          />
        </div>
      </div>
    </div>
  );
};
