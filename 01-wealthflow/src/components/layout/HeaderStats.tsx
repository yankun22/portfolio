import React from 'react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Coins,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useWealth } from '../../context/useWealth';
import { Card } from '../common/Card';

export const HeaderStats: React.FC = () => {
  const { summary, formatCurrency, fireResults } = useWealth();

  const isGain = summary.unrealizedGain >= 0;

  return (
    <div className="grid-4" style={{ marginBottom: '24px' }}>
      {/* Net Worth */}
      <Card style={{ position: 'relative', overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100px',
            height: '100px',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>TOTAL NET WORTH</span>
          <div
            style={{
              padding: '6px',
              borderRadius: '8px',
              background: 'rgba(16, 185, 129, 0.12)',
              color: '#10b981',
            }}
          >
            <Wallet size={16} />
          </div>
        </div>
        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          {formatCurrency(summary.totalValue)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
          <span className="badge badge-emerald">
            <ShieldCheck size={12} />
            {summary.assetCount} Assets Tracked
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Cost: {formatCurrency(summary.totalCostBasis)}
          </span>
        </div>
      </Card>

      {/* Unrealized Gain/Loss */}
      <Card style={{ position: 'relative', overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100px',
            height: '100px',
            background: isGain
              ? 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(244, 63, 94, 0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>UNREALIZED GAINS</span>
          <div
            style={{
              padding: '6px',
              borderRadius: '8px',
              background: isGain ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
              color: isGain ? '#10b981' : '#f43f5e',
            }}
          >
            {isGain ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          </div>
        </div>
        <div
          style={{
            fontSize: '1.8rem',
            fontWeight: 800,
            color: isGain ? '#10b981' : '#f43f5e',
            letterSpacing: '-0.02em',
          }}
        >
          {isGain ? '+' : ''}
          {formatCurrency(summary.unrealizedGain)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
          <span className={`badge ${isGain ? 'badge-emerald' : 'badge-rose'}`}>
            {isGain ? '+' : ''}
            {summary.unrealizedGainPercent.toFixed(1)}% All-time ROI
          </span>
        </div>
      </Card>

      {/* Annual Passive Yield */}
      <Card style={{ position: 'relative', overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100px',
            height: '100px',
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>ANNUAL PASSIVE CASHFLOW</span>
          <div
            style={{
              padding: '6px',
              borderRadius: '8px',
              background: 'rgba(6, 182, 212, 0.12)',
              color: '#06b6d4',
            }}
          >
            <Coins size={16} />
          </div>
        </div>
        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#06b6d4', letterSpacing: '-0.02em' }}>
          {formatCurrency(summary.annualPassiveIncome)}
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>/yr</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
          <span className="badge badge-cyan">
            {formatCurrency(summary.annualPassiveIncome / 12)}/mo
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {summary.weightedYieldPercent.toFixed(2)}% Portfolio Yield
          </span>
        </div>
      </Card>

      {/* FIRE Independence Readiness */}
      <Card style={{ position: 'relative', overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100px',
            height: '100px',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>FIRE INDEPENDENCE</span>
          <div
            style={{
              padding: '6px',
              borderRadius: '8px',
              background: 'rgba(139, 92, 246, 0.12)',
              color: '#8b5cf6',
            }}
          >
            <Zap size={16} />
          </div>
        </div>
        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#a78bfa', letterSpacing: '-0.02em' }}>
          {fireResults.milestones.traditional.currentProgressPercent.toFixed(1)}%
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}> of FIRE</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
          <span className={`badge ${fireResults.milestones.coast.isAchieved ? 'badge-cyan' : 'badge-violet'}`}>
            {fireResults.milestones.coast.isAchieved
              ? '🎯 Coast-FIRE Reached!'
              : `${fireResults.milestones.traditional.yearsRemaining ?? '—'} Yrs to Freedom`}
          </span>
        </div>
      </Card>
    </div>
  );
};
