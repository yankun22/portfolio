import React from 'react';
import type { AdherenceMetrics } from '../../types/medications';
import { Flame, Award, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AdherenceStatsProps {
  metrics: AdherenceMetrics;
  todayTaken: number;
  todayTotal: number;
}

export const AdherenceStats: React.FC<AdherenceStatsProps> = ({
  metrics,
  todayTaken,
  todayTotal
}) => {
  const todayProgress = todayTotal > 0 ? Math.round((todayTaken / todayTotal) * 100) : 100;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
      {/* 1. Adherence Streak Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(239, 68, 68, 0.08) 100%)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 16
        }}
      >
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 'var(--radius-full)',
            background: '#f59e0b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)'
          }}
        >
          <Flame size={24} />
        </div>

        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase' }}>
            Adherence Streak
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            {metrics.currentStreakDays} Days
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Personal Best: {metrics.longestStreakDays} Days
          </div>
        </div>
      </div>

      {/* 2. 30-Day Adherence Rate */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 16
        }}
      >
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 'var(--radius-full)',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1.5px solid rgba(16, 185, 129, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#10b981'
          }}
        >
          <Award size={22} />
        </div>

        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            30-Day Adherence
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: '#10b981' }}>
            {metrics.thirtyDayAdherenceRate}%
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            {metrics.totalDosesTaken} of {metrics.totalDosesScheduled} doses taken
          </div>
        </div>
      </div>

      {/* 3. Today's Progress */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 16
        }}
      >
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 'var(--radius-full)',
            background: 'rgba(6, 182, 212, 0.15)',
            border: '1.5px solid rgba(6, 182, 212, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#06b6d4'
          }}
        >
          <CheckCircle2 size={22} />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Today&apos;s Schedule
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#06b6d4' }}>
              {todayTaken}/{todayTotal}
            </span>
          </div>

          <div style={{ height: 6, background: 'var(--bg-input)', borderRadius: 999, overflow: 'hidden', marginTop: 8 }}>
            <div
              style={{
                width: `${todayProgress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #06b6d4, #10b981)',
                transition: 'width 0.3s ease'
              }}
            />
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>
            {todayProgress === 100 ? 'All doses completed today 🎉' : `${todayTotal - todayTaken} doses remaining`}
          </div>
        </div>
      </div>

      {/* 4. Missed Doses Alert Card */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 16
        }}
      >
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 'var(--radius-full)',
            background: metrics.missedDosesCount > 0 ? 'rgba(244, 63, 94, 0.15)' : 'rgba(16, 185, 129, 0.15)',
            color: metrics.missedDosesCount > 0 ? '#f43f5e' : '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <AlertCircle size={22} />
        </div>

        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Missed Dose Log
          </div>
          <div
            style={{
              fontSize: '1.6rem',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              color: metrics.missedDosesCount > 0 ? '#f43f5e' : '#10b981'
            }}
          >
            {metrics.missedDosesCount}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            {metrics.missedDosesCount === 0 ? 'Zero missed doses in 30 days' : 'Recorded in 30-day window'}
          </div>
        </div>
      </div>
    </div>
  );
};
