import React from 'react';
import { PART_METADATA, MATERIAL_TIERS } from '../../services/materialLibrary';
import { useStudio } from '../../context/useStudio';

export const PartSelector: React.FC = () => {
  const { activePartId, setActivePartId, productConfig } = useStudio();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
          Select Component to Customize
        </span>
        <span style={{ fontSize: '0.7rem', color: '#00f0ff', fontFamily: 'var(--font-mono)' }}>
          6/6 Parts Active
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
        {PART_METADATA.map((meta) => {
          const isSelected = activePartId === meta.id;
          const partConf = productConfig[meta.id];
          const matTier = MATERIAL_TIERS[partConf.material];

          return (
            <button
              key={meta.id}
              type="button"
              onClick={() => setActivePartId(meta.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '10px 12px',
                background: isSelected ? 'rgba(0, 240, 255, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                border: `1px solid ${isSelected ? '#00f0ff' : 'var(--border-subtle)'}`,
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '3px',
                  background: partConf.color,
                }}
              />

              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: isSelected ? '#ffffff' : 'var(--text-main)',
                  lineHeight: 1.2,
                }}
              >
                {meta.name.split(' ')[0]}
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: partConf.color,
                    border: '1px solid rgba(255, 255, 255, 0.4)',
                  }}
                />
                <span
                  style={{
                    fontSize: '0.65rem',
                    color: isSelected ? '#00f0ff' : 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {matTier.name.split(' ')[0]}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
