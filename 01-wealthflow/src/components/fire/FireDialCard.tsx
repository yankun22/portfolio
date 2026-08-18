import React from 'react';
import { CheckCircle2, Clock } from 'lucide-react';
import type { FireMilestone } from '../../types/fire';
import { useWealth } from '../../context/useWealth';
import { Card } from '../common/Card';

interface FireDialCardProps {
  milestone: FireMilestone;
}

export const FireDialCard: React.FC<FireDialCardProps> = ({ milestone }) => {
  const { formatCurrency } = useWealth();

  const radius = 42;
  const strokeWidth = 7;
  const circumference = 2 * Math.PI * radius;
  const cappedProgress = Math.min(100, Math.max(0, milestone.currentProgressPercent));
  const strokeDashoffset = circumference - (cappedProgress / 100) * circumference;

  return (
    <Card
      style={{
        position: 'relative',
        overflow: 'hidden',
        border: milestone.isAchieved ? `1px solid ${milestone.color}66` : undefined,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: '120px',
          height: '120px',
          background: `radial-gradient(circle, ${milestone.color}22 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <span
            style={{
              fontSize: '0.725rem',
              fontWeight: 700,
              color: milestone.color,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {milestone.badge}
          </span>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
            {milestone.title}
          </h3>
        </div>

        {milestone.isAchieved ? (
          <span
            className="badge"
            style={{
              background: `${milestone.color}22`,
              color: milestone.color,
              border: `1px solid ${milestone.color}44`,
            }}
          >
            <CheckCircle2 size={12} /> Achieved!
          </span>
        ) : (
          <span className="badge badge-slate">
            <Clock size={12} />
            {milestone.yearsRemaining !== null ? `${milestone.yearsRemaining} Yrs` : 'In Progress'}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', margin: '14px 0' }}>
        <div style={{ width: '96px', height: '96px', position: 'relative', flexShrink: 0 }}>
          <svg width="96" height="96" viewBox="0 0 96 96" className="circular-dial-svg">
            <circle
              cx="48"
              cy="48"
              r={radius}
              fill="transparent"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={strokeWidth}
            />
            <circle
              cx="48"
              cy="48"
              r={radius}
              fill="transparent"
              stroke={milestone.color}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="dial-circle-progress"
              style={{ filter: `drop-shadow(0 0 6px ${milestone.color}88)` }}
            />
          </svg>

          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
              {milestone.currentProgressPercent.toFixed(0)}%
            </span>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Target Capital Goal</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            {formatCurrency(milestone.targetAmount)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Safe Income: <strong style={{ color: '#fff' }}>{formatCurrency(milestone.monthlySafeWithdrawal)}/mo</strong>
          </div>
        </div>
      </div>

      <div
        style={{
          background: 'var(--bg-subtle)',
          padding: '10px 14px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.8rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '12px',
        }}
      >
        <span style={{ color: 'var(--text-secondary)' }}>Projected Independence:</span>
        <span style={{ fontWeight: 700, color: milestone.isAchieved ? milestone.color : 'var(--text-primary)' }}>
          {milestone.isAchieved
            ? 'Unlocked Today ✓'
            : milestone.projectedYear
            ? `${milestone.projectedYear} (Age ${milestone.projectedAge})`
            : '—'}
        </span>
      </div>

      <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '10px', lineHeight: 1.4 }}>
        {milestone.description}
      </p>
    </Card>
  );
};
