import React from 'react';
import { Sliders, RefreshCw, Calendar } from 'lucide-react';
import { useWealth } from '../../context/useWealth';
import { Card } from '../common/Card';
import { SliderInput } from '../common/SliderInput';

export const SimulationControls: React.FC = () => {
  const { mcParams, setMcParams, summary, currency } = useWealth();

  const handleSyncWithNetWorth = () => {
    setMcParams((prev) => ({ ...prev, initialCapital: summary.totalValue }));
  };

  return (
    <Card>
      <div className="card-header">
        <div>
          <h2 className="card-title">
            <Sliders size={20} color="#10b981" />
            Simulation Parameters
          </h2>
          <p className="card-subtitle">Configure 500-iteration stochastic parameters</p>
        </div>
      </div>

      {/* Horizon Preset Buttons */}
      <div style={{ marginBottom: '18px' }}>
        <label className="form-label" style={{ marginBottom: '8px' }}>
          <span>Time Horizon</span>
          <span style={{ color: '#10b981', fontFamily: 'var(--font-mono)' }}>{mcParams.timeHorizonYears} Years</span>
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '8px' }}>
          {[10, 25, 50].map((years) => (
            <button
              key={years}
              type="button"
              className={`btn btn-sm ${mcParams.timeHorizonYears === years ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setMcParams((prev) => ({ ...prev, timeHorizonYears: years }))}
            >
              <Calendar size={13} />
              {years} Years
            </button>
          ))}
        </div>
        <input
          type="range"
          min={5}
          max={50}
          step={1}
          value={mcParams.timeHorizonYears}
          onChange={(e) => setMcParams((prev) => ({ ...prev, timeHorizonYears: parseInt(e.target.value) }))}
          className="custom-range"
        />
      </div>

      {/* Initial Capital */}
      <div className="form-group">
        <div className="form-label">
          <span>Initial Capital ({currency.symbol})</span>
          <button
            type="button"
            onClick={handleSyncWithNetWorth}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#06b6d4',
              cursor: 'pointer',
              fontSize: '0.725rem',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: 600,
            }}
            title="Sync with current portfolio net worth"
          >
            <RefreshCw size={11} /> Sync Portfolio
          </button>
        </div>
        <input
          type="number"
          step="1000"
          className="input-text"
          value={mcParams.initialCapital}
          onChange={(e) =>
            setMcParams((prev) => ({ ...prev, initialCapital: Math.max(0, parseFloat(e.target.value) || 0) }))
          }
        />
      </div>

      {/* Monthly Contribution */}
      <SliderInput
        label="Monthly Contribution"
        value={mcParams.monthlyContribution}
        onChange={(val) => setMcParams((prev) => ({ ...prev, monthlyContribution: val }))}
        min={0}
        max={25000}
        step={100}
        prefix={currency.symbol}
        unit="/mo"
        badgeColor="emerald"
        description={`Adds ${currency.symbol}${(mcParams.monthlyContribution * 12).toLocaleString()}/year into investments`}
      />

      {/* Expected Return */}
      <SliderInput
        label="Mean Expected Return"
        value={mcParams.meanAnnualReturn}
        onChange={(val) => setMcParams((prev) => ({ ...prev, meanAnnualReturn: val }))}
        min={-2}
        max={20}
        step={0.25}
        unit="%"
        badgeColor="cyan"
        description="Historical S&P 500 real return ~7-10%"
      />

      {/* Volatility */}
      <SliderInput
        label="Annual Volatility (σ)"
        value={mcParams.annualVolatility}
        onChange={(val) => setMcParams((prev) => ({ ...prev, annualVolatility: val }))}
        min={2}
        max={40}
        step={0.5}
        unit="%"
        badgeColor="violet"
        description="Higher volatility widens the 10th-90th percentile envelope"
      />

      {/* Inflation Rate */}
      <SliderInput
        label="Inflation Rate"
        value={mcParams.inflationRate}
        onChange={(val) => setMcParams((prev) => ({ ...prev, inflationRate: val }))}
        min={0}
        max={10}
        step={0.25}
        unit="%"
        badgeColor="amber"
        description="Long-term central bank target ~2-3%"
      />

      {/* Inflation Adjustment Toggle */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 14px',
          background: 'var(--bg-subtle)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          marginTop: '12px',
          marginBottom: '16px',
        }}
      >
        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Real Purchasing Power
          </div>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
            Adjust trajectory for inflation
          </div>
        </div>
        <button
          type="button"
          onClick={() => setMcParams((prev) => ({ ...prev, isInflationAdjusted: !prev.isInflationAdjusted }))}
          className={`badge ${mcParams.isInflationAdjusted ? 'badge-emerald' : 'badge-slate'}`}
          style={{ cursor: 'pointer', padding: '6px 12px', fontSize: '0.8rem' }}
        >
          {mcParams.isInflationAdjusted ? 'Inflation-Adjusted' : 'Nominal $'}
        </button>
      </div>

      {/* Target Goal Amount */}
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">
          <span>Target Wealth Goal ({currency.symbol})</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Goal benchmark</span>
        </label>
        <input
          type="number"
          step="50000"
          className="input-text"
          value={mcParams.targetGoalAmount}
          onChange={(e) =>
            setMcParams((prev) => ({ ...prev, targetGoalAmount: Math.max(0, parseFloat(e.target.value) || 0) }))
          }
        />
      </div>
    </Card>
  );
};
