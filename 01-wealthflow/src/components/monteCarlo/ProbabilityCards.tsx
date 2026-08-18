import React from 'react';
import { Target, TrendingUp, ShieldAlert, Cpu, Sparkles } from 'lucide-react';
import { useWealth } from '../../context/useWealth';
import { Card } from '../common/Card';

export const ProbabilityCards: React.FC = () => {
  const { mcResults, mcParams, formatCurrency } = useWealth();

  const finalYear = mcResults.yearlyData[mcResults.yearlyData.length - 1];
  const compoundGain = finalYear.p50 - finalYear.contributionsOnly;
  const growthMultiplier = finalYear.contributionsOnly > 0 ? (finalYear.p50 / finalYear.contributionsOnly).toFixed(1) : '1.0';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 4 Outcome Metrics */}
      <div className="grid-4">
        {/* Median Expected Horizon */}
        <Card subtle>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              MEDIAN WEALTH (50TH %ILE)
            </span>
            <Sparkles size={15} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981', letterSpacing: '-0.02em' }}>
            {formatCurrency(finalYear.p50)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            In {mcParams.timeHorizonYears} Years ({finalYear.calendarYear})
          </div>
        </Card>

        {/* 90% Confidence Range */}
        <Card subtle>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              90% CONFIDENCE RANGE
            </span>
            <ShieldAlert size={15} color="#38bdf8" />
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8' }}>
            {formatCurrency(finalYear.p10)} — {formatCurrency(finalYear.p90)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            10th %ile (Bear) to 90th %ile (Bull)
          </div>
        </Card>

        {/* Target Goal Probability */}
        <Card subtle>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              GOAL SUCCESS CHANCE
            </span>
            <Target size={15} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fbbf24' }}>
            {mcResults.successRateTarget}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            To reach {formatCurrency(mcParams.targetGoalAmount)}
          </div>
        </Card>

        {/* Compounding Multiplier */}
        <Card subtle>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              WEALTH MULTIPLIER
            </span>
            <TrendingUp size={15} color="#a78bfa" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#a78bfa' }}>
            {growthMultiplier}x Capital
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            +{formatCurrency(compoundGain)} compound interest
          </div>
        </Card>
      </div>

      {/* Trajectory Breakdown Table & Execution Speed */}
      <Card>
        <div className="card-header">
          <div>
            <h3 className="card-title">Milestone Trajectory Breakdown</h3>
            <p className="card-subtitle">Detailed stochastic distribution checkpoints</p>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.75rem',
              color: '#34d399',
              background: 'rgba(16, 185, 129, 0.1)',
              padding: '4px 10px',
              borderRadius: '20px',
              border: '1px solid rgba(16, 185, 129, 0.25)',
            }}
          >
            <Cpu size={13} />
            <span>500 Paths generated in {mcResults.executionTimeMs}ms</span>
          </div>
        </div>

        <div className="table-responsive">
          <table className="wealth-table">
            <thead>
              <tr>
                <th>Checkpoint</th>
                <th style={{ textAlign: 'right' }}>10th %ile (Bear)</th>
                <th style={{ textAlign: 'right' }}>50th %ile (Median)</th>
                <th style={{ textAlign: 'right' }}>90th %ile (Bull)</th>
                <th style={{ textAlign: 'right' }}>Arithmetic Mean</th>
                <th style={{ textAlign: 'right' }}>Principal Saved</th>
              </tr>
            </thead>
            <tbody>
              {[5, 10, 15, 20, 25, 30, 40, 50]
                .filter((yr) => yr <= mcParams.timeHorizonYears)
                .map((yr) => {
                  const item = mcResults.yearlyData.find((d) => d.year === yr) || finalYear;
                  return (
                    <tr key={yr}>
                      <td style={{ fontWeight: 700 }}>
                        Year {yr} ({item.calendarYear})
                      </td>
                      <td style={{ textAlign: 'right', color: '#f43f5e', fontFamily: 'var(--font-mono)' }}>
                        {formatCurrency(item.p10)}
                      </td>
                      <td style={{ textAlign: 'right', color: '#10b981', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                        {formatCurrency(item.p50)}
                      </td>
                      <td style={{ textAlign: 'right', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                        {formatCurrency(item.p90)}
                      </td>
                      <td style={{ textAlign: 'right', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                        {formatCurrency(item.mean)}
                      </td>
                      <td style={{ textAlign: 'right', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {formatCurrency(item.contributionsOnly)}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
