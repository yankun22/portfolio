import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  subValue?: string;
  delta?: number;
  deltaLabel?: string;
  icon: React.ReactNode;
  accentColor?: string;
  badge?: {
    text: string;
    color: string;
    bg: string;
  };
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  unit,
  subValue,
  delta,
  deltaLabel,
  icon,
  accentColor = '#06b6d4',
  badge
}) => {
  return (
    <div className="clinical-stat-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 'var(--radius-md)',
              background: `${accentColor}18`,
              color: accentColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {icon}
          </div>
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            {label}
          </span>
        </div>

        {badge && (
          <span
            style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              background: badge.bg,
              color: badge.color
            }}
          >
            {badge.text}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span className="stat-value-display" style={{ color: 'var(--text-primary)' }}>
          {value}
        </span>
        {unit && (
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            {unit}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem' }}>
        {subValue ? (
          <span style={{ color: 'var(--text-muted)' }}>{subValue}</span>
        ) : (
          <span />
        )}

        {delta !== undefined && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 3,
              fontWeight: 700,
              color: delta > 0 ? '#f43f5e' : delta < 0 ? '#10b981' : 'var(--text-muted)'
            }}
          >
            {delta > 0 ? (
              <TrendingUp size={12} />
            ) : delta < 0 ? (
              <TrendingDown size={12} />
            ) : (
              <Minus size={12} />
            )}
            <span>
              {delta > 0 ? `+${delta}` : delta} {deltaLabel || ''}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
