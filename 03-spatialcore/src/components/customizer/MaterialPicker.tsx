import React from 'react';
import type { MaterialTierId } from '../../types/product';
import { MATERIAL_TIERS, PART_METADATA } from '../../services/materialLibrary';
import { useStudio } from '../../context/useStudio';

export const MaterialPicker: React.FC = () => {
  const { activePartId, productConfig, updatePartMaterial } = useStudio();
  const currentPartConf = productConfig[activePartId];
  const activePartMeta = PART_METADATA.find((m) => m.id === activePartId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
          Material Tier — {activePartMeta?.name}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {(Object.keys(MATERIAL_TIERS) as MaterialTierId[]).map((tierId) => {
          const tier = MATERIAL_TIERS[tierId];
          const isSelected = currentPartConf.material === tierId;

          return (
            <div
              key={tier.id}
              className={`material-card ${isSelected ? 'selected' : ''}`}
              onClick={() => updatePartMaterial(activePartId, tierId)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  className="material-swatch-circle"
                  style={{ background: tier.swatchGradient }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>
                      {tier.name}
                    </span>
                    {tier.priceAddon > 0 ? (
                      <span
                        style={{
                          fontSize: '0.675rem',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 700,
                          color: '#00f0ff',
                          background: 'rgba(0, 240, 255, 0.12)',
                          padding: '1px 6px',
                          borderRadius: '4px',
                        }}
                      >
                        +${tier.priceAddon}
                      </span>
                    ) : (
                      <span
                        style={{
                          fontSize: '0.675rem',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 600,
                          color: '#10b981',
                          background: 'rgba(16, 185, 129, 0.12)',
                          padding: '1px 6px',
                          borderRadius: '4px',
                        }}
                      >
                        Included
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px', lineHeight: 1.3 }}>
                    {tier.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
