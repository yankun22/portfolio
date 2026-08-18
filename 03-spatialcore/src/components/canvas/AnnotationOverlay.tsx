import React from 'react';
import type { ProductPartId } from '../../types/product';
import { PART_METADATA, MATERIAL_TIERS } from '../../services/materialLibrary';
import { useStudio } from '../../context/useStudio';

export interface ProjectedAnnotation {
  id: ProductPartId;
  x: number;
  y: number;
  visible: boolean;
}

interface AnnotationOverlayProps {
  projectedPoints: Record<ProductPartId, ProjectedAnnotation>;
}

export const AnnotationOverlay: React.FC<AnnotationOverlayProps> = ({ projectedPoints }) => {
  const { isExploded, activePartId, setActivePartId, productConfig } = useStudio();

  if (!isExploded) return null;

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {PART_METADATA.map((meta) => {
        const point = projectedPoints[meta.id];
        if (!point || !point.visible) return null;

        const isSelected = activePartId === meta.id;
        const currentMaterial = MATERIAL_TIERS[productConfig[meta.id].material];

        return (
          <div
            key={meta.id}
            className="annotation-pin"
            style={{
              left: `${point.x}px`,
              top: `${point.y}px`,
              opacity: isExploded ? 1 : 0,
            }}
            onClick={() => setActivePartId(meta.id)}
          >
            {/* Pulsing Hotspot Target */}
            <div
              className="annotation-dot"
              style={{
                background: isSelected ? '#ec4899' : '#00f0ff',
                boxShadow: isSelected ? '0 0 16px #ec4899' : '0 0 12px #00f0ff',
                borderColor: '#ffffff',
              }}
            />

            {/* Engineering Callout Card */}
            <div
              className="annotation-card"
              style={{
                borderColor: isSelected ? 'rgba(236, 72, 153, 0.7)' : 'rgba(0, 240, 255, 0.4)',
                background: isSelected ? 'rgba(15, 23, 42, 0.96)' : 'rgba(15, 23, 42, 0.88)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: isSelected ? '#ec4899' : '#00f0ff',
                    letterSpacing: '0.05em',
                  }}
                >
                  {meta.name}
                </span>
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontFamily: 'var(--font-mono)',
                    color: '#94a3b8',
                    background: 'rgba(255, 255, 255, 0.08)',
                    padding: '1px 6px',
                    borderRadius: '4px',
                  }}
                >
                  {currentMaterial.name.split(' ')[0]}
                </span>
              </div>

              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#f8fafc', margin: 0 }}>
                {meta.specTitle}
              </p>
              <p style={{ fontSize: '0.675rem', color: '#94a3b8', marginTop: '2px', lineHeight: 1.3 }}>
                {meta.specDescription}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
