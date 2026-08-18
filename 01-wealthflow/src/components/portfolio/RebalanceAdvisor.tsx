import React from 'react';
import { Layers, CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react';
import { useWealth } from '../../context/useWealth';
import { Card } from '../common/Card';

export const RebalanceAdvisor: React.FC = () => {
  const { summary, formatCurrency } = useWealth();

  const categories = Object.values(summary.categoryBreakdown);
  const totalTargetPct = categories.reduce((sum, c) => sum + c.targetPercent, 0);

  const maxDrift = Math.max(...categories.map((c) => Math.abs(c.percent - c.targetPercent)));

  const getDriftStatus = () => {
    if (maxDrift <= 2.5) {
      return {
        label: 'Optimal Balance',
        color: '#10b981',
        icon: CheckCircle2,
        desc: 'Your portfolio allocation closely aligns with target weights. No urgent rebalancing necessary.',
      };
    } else if (maxDrift <= 7.0) {
      return {
        label: 'Moderate Drift',
        color: '#f59e0b',
        icon: AlertCircle,
        desc: 'Minor deviation detected from target weights. Consider directing new deposits to underweight asset classes.',
      };
    } else {
      return {
        label: 'Significant Drift',
        color: '#f43f5e',
        icon: ShieldAlert,
        desc: 'Substantial allocation divergence detected. Portfolio risk profile may deviate from your desired strategy.',
      };
    }
  };

  const status = getDriftStatus();
  const StatusIcon = status.icon;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Overview Banner */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 className="card-title">
              <Layers size={20} color="#10b981" />
              Strategic Asset Rebalance Advisor
            </h2>
            <p className="card-subtitle">
              Calculates exact buy and sell adjustments required to restore target allocation
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'var(--bg-subtle)',
              padding: '10px 16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <StatusIcon size={22} color={status.color} />
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: status.color }}>
                {status.label} (Max Drift: {maxDrift.toFixed(1)}%)
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Target Allocation Sum: {totalTargetPct.toFixed(0)}%
              </div>
            </div>
          </div>
        </div>

        {totalTargetPct !== 100 && (
          <div
            style={{
              marginTop: '16px',
              padding: '10px 14px',
              borderRadius: '8px',
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              color: '#fbbf24',
              fontSize: '0.825rem',
            }}
          >
            ⚠️ Note: Your target allocation percentages sum to {totalTargetPct.toFixed(1)}% instead of 100%. Adjust asset target weights in the portfolio ledger for 100% precision.
          </div>
        )}
      </Card>

      {/* Rebalance Action Grid */}
      <div className="grid-2">
        {/* Allocation Comparison Chart */}
        <Card>
          <div className="card-header">
            <div>
              <h3 className="card-title">Allocation Comparison</h3>
              <p className="card-subtitle">Current Actual % vs Configured Target %</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {categories.map((c) => {
              const diffPct = c.percent - c.targetPercent;
              const isOver = diffPct > 0;

              return (
                <div key={c.category} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: c.color }} />
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{c.category}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Actual: {c.percent.toFixed(1)}%</span>
                      <span style={{ color: 'var(--text-muted)' }}>|</span>
                      <span style={{ color: 'var(--text-secondary)' }}>Target: {c.targetPercent.toFixed(1)}%</span>
                      <span
                        style={{
                          fontWeight: 700,
                          color: Math.abs(diffPct) < 0.5 ? '#10b981' : isOver ? '#f59e0b' : '#06b6d4',
                          minWidth: '46px',
                          textAlign: 'right',
                        }}
                      >
                        {diffPct >= 0 ? '+' : ''}
                        {diffPct.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      height: '8px',
                      width: '100%',
                      background: 'var(--bg-subtle)',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${Math.min(100, c.percent)}%`,
                        background: c.color,
                        borderRadius: '4px',
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Actionable Rebalancing Trades */}
        <Card>
          <div className="card-header">
            <div>
              <h3 className="card-title">Actionable Trade Orders</h3>
              <p className="card-subtitle">Recommended cashflow or trade adjustments</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {categories.map((c) => {
              const diffVal = c.diffValue;
              const isOver = diffVal > 500;
              const isUnder = diffVal < -500;

              return (
                <div
                  key={c.category}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: c.color }} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                        {c.category}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Current: {formatCurrency(c.value)}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    {isOver ? (
                      <span className="badge badge-amber" style={{ padding: '5px 10px', fontSize: '0.8rem' }}>
                        Trim / Sell {formatCurrency(Math.abs(diffVal))}
                      </span>
                    ) : isUnder ? (
                      <span className="badge badge-emerald" style={{ padding: '5px 10px', fontSize: '0.8rem' }}>
                        Buy / Add {formatCurrency(Math.abs(diffVal))}
                      </span>
                    ) : (
                      <span className="badge badge-slate" style={{ padding: '5px 10px', fontSize: '0.8rem' }}>
                        Balanced ✓
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div
            style={{
              marginTop: '20px',
              padding: '12px 16px',
              borderRadius: '8px',
              background: 'rgba(6, 182, 212, 0.08)',
              border: '1px solid rgba(6, 182, 212, 0.2)',
              fontSize: '0.8rem',
              color: '#94a3b8',
              lineHeight: 1.5,
            }}
          >
            💡 <strong style={{ color: '#22d3ee' }}>Tax-Efficient Rebalance Tip:</strong> To avoid realizing capital gains taxes from selling appreciated assets, direct future monthly contributions toward underweight asset classes until balance is restored.
          </div>
        </Card>
      </div>
    </div>
  );
};
