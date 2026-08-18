import React from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, CheckCircle, Compass } from 'lucide-react';
import { useWealth } from '../../context/useWealth';
import { Card } from '../common/Card';

export const FireMilestoneTimeline: React.FC = () => {
  const { fireResults, formatCurrency } = useWealth();

  const handleCelebrate = () => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b'],
    });
  };

  const milestonesList = [
    fireResults.milestones.coast,
    fireResults.milestones.lean,
    fireResults.milestones.barista,
    fireResults.milestones.traditional,
    fireResults.milestones.fat,
  ];

  return (
    <Card>
      <div className="card-header">
        <div>
          <h3 className="card-title">
            <Compass size={20} color="#06b6d4" />
            Financial Freedom Milestone Ladder
          </h3>
          <p className="card-subtitle">
            Progressive stages of capital independence and milestone achievement
          </p>
        </div>

        <button className="btn btn-sm btn-primary" onClick={handleCelebrate}>
          <Sparkles size={14} />
          Celebrate Milestones 🎉
        </button>
      </div>

      {/* Summary Narrative Banner */}
      <div
        style={{
          padding: '14px 18px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          color: '#e2e8f0',
          fontSize: '0.875rem',
          lineHeight: 1.6,
          marginBottom: '24px',
        }}
      >
        {fireResults.summaryText}
      </div>

      {/* Visual Milestone Track */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {milestonesList.map((m, idx) => {
          const isAchieved = m.isAchieved;

          return (
            <div
              key={m.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                borderRadius: 'var(--radius-md)',
                background: isAchieved ? 'rgba(16, 185, 129, 0.06)' : 'var(--bg-subtle)',
                border: isAchieved ? `1px solid ${m.color}66` : '1px solid var(--border-subtle)',
                transition: 'all 0.2s ease',
              }}
            >
              {/* Left Indicator & Name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: isAchieved ? m.color : 'rgba(255,255,255,0.05)',
                    color: isAchieved ? '#ffffff' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                  }}
                >
                  {isAchieved ? <CheckCircle size={18} /> : idx + 1}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                      {m.title}
                    </span>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        color: m.color,
                        background: `${m.color}15`,
                        padding: '1px 6px',
                        borderRadius: '4px',
                      }}
                    >
                      {m.badge}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Target: <strong>{formatCurrency(m.targetAmount)}</strong> • Passive Income:{' '}
                    <strong>{formatCurrency(m.annualSafeWithdrawal)}/yr</strong>
                  </div>
                </div>
              </div>

              {/* Right Status */}
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: isAchieved ? m.color : 'var(--text-primary)' }}>
                  {m.currentProgressPercent.toFixed(1)}%
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {isAchieved ? 'Milestone Cleared' : m.projectedYear ? `Target Year ${m.projectedYear}` : '—'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
