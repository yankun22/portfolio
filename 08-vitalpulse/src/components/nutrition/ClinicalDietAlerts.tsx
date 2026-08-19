import React from 'react';
import type { NutritionWarning } from '../../types/nutrition';
import { AlertTriangle, AlertOctagon } from 'lucide-react';

interface ClinicalDietAlertsProps {
  warnings: NutritionWarning[];
}

export const ClinicalDietAlerts: React.FC<ClinicalDietAlertsProps> = ({ warnings }) => {
  if (warnings.length === 0) {
    return (
      <div
        style={{
          padding: '14px 18px',
          borderRadius: 'var(--radius-lg)',
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: 12
        }}
      >
        <div style={{ color: '#10b981' }}>✅</div>
        <div style={{ fontSize: '0.8125rem', color: 'var(--text-primary)' }}>
          <strong>Nutritional Status Balanced:</strong> Sodium, sugar, and caloric thresholds are all within heart-healthy guidelines today.
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {warnings.map((w) => {
        const isSevere = w.severity === 'warning';
        const borderColor = isSevere ? 'rgba(244, 63, 94, 0.3)' : 'rgba(245, 158, 11, 0.3)';
        const bg = isSevere ? 'rgba(244, 63, 94, 0.08)' : 'rgba(245, 158, 11, 0.08)';
        const iconColor = isSevere ? '#f43f5e' : '#f59e0b';

        return (
          <div
            key={w.id}
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-lg)',
              background: bg,
              border: `1px solid ${borderColor}`,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12
            }}
          >
            <div style={{ color: iconColor, marginTop: 2 }}>
              {isSevere ? <AlertOctagon size={18} /> : <AlertTriangle size={18} />}
            </div>

            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {w.title}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                {w.message}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
