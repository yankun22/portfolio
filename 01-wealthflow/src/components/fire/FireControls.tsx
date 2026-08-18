import React from 'react';
import { Flame } from 'lucide-react';
import { useWealth } from '../../context/useWealth';
import { Card } from '../common/Card';
import { SliderInput } from '../common/SliderInput';

export const FireControls: React.FC = () => {
  const { fireParams, setFireParams, summary, currency } = useWealth();

  return (
    <Card>
      <div className="card-header">
        <div>
          <h2 className="card-title">
            <Flame size={20} color="#f59e0b" />
            FIRE Milestone Parameters
          </h2>
          <p className="card-subtitle">
            Configure age, target spending, and safe withdrawal assumptions
          </p>
        </div>
      </div>

      {/* Age Grid */}
      <div className="grid-2" style={{ marginBottom: '16px' }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">
            <span>Current Age</span>
            <span style={{ color: '#10b981', fontFamily: 'var(--font-mono)' }}>{fireParams.currentAge}</span>
          </label>
          <input
            type="range"
            min={18}
            max={75}
            step={1}
            value={fireParams.currentAge}
            onChange={(e) => setFireParams((prev) => ({ ...prev, currentAge: parseInt(e.target.value) }))}
            className="custom-range"
          />
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">
            <span>Target Retirement Age</span>
            <span style={{ color: '#06b6d4', fontFamily: 'var(--font-mono)' }}>{fireParams.targetRetirementAge}</span>
          </label>
          <input
            type="range"
            min={Math.max(fireParams.currentAge + 1, 30)}
            max={85}
            step={1}
            value={fireParams.targetRetirementAge}
            onChange={(e) => setFireParams((prev) => ({ ...prev, targetRetirementAge: parseInt(e.target.value) }))}
            className="custom-range"
          />
        </div>
      </div>

      {/* Annual Desired Living Expenses */}
      <SliderInput
        label="Desired Annual Spending (Traditional)"
        value={fireParams.annualSpending}
        onChange={(val) => setFireParams((prev) => ({ ...prev, annualSpending: val }))}
        min={20000}
        max={300000}
        step={2500}
        prefix={currency.symbol}
        unit="/yr"
        badgeColor="violet"
        description={`Requires ~${currency.symbol}${(fireParams.annualSpending / 12).toLocaleString(undefined, { maximumFractionDigits: 0 })}/month in retirement`}
      />

      {/* Lean vs Fat Spending Inputs */}
      <div className="grid-2">
        <div className="form-group">
          <label className="form-label">Lean Spending ({currency.symbol}/yr)</label>
          <input
            type="number"
            step="1000"
            className="input-text"
            value={fireParams.leanAnnualSpending}
            onChange={(e) =>
              setFireParams((prev) => ({ ...prev, leanAnnualSpending: Math.max(0, parseFloat(e.target.value) || 0) }))
            }
          />
        </div>

        <div className="form-group">
          <label className="form-label">Fat Spending ({currency.symbol}/yr)</label>
          <input
            type="number"
            step="5000"
            className="input-text"
            value={fireParams.fatAnnualSpending}
            onChange={(e) =>
              setFireParams((prev) => ({ ...prev, fatAnnualSpending: Math.max(0, parseFloat(e.target.value) || 0) }))
            }
          />
        </div>
      </div>

      {/* Safe Withdrawal Rate */}
      <SliderInput
        label="Safe Withdrawal Rate (SWR)"
        value={fireParams.safeWithdrawalRate}
        onChange={(val) => setFireParams((prev) => ({ ...prev, safeWithdrawalRate: val }))}
        min={2.5}
        max={5.5}
        step={0.1}
        unit="%"
        badgeColor="emerald"
        description="Standard 4.0% Trinity Study rule (25x multiplier)"
      />

      {/* Expected Return Rate */}
      <SliderInput
        label="Expected Annual Return"
        value={fireParams.expectedReturnRate}
        onChange={(val) => setFireParams((prev) => ({ ...prev, expectedReturnRate: val }))}
        min={3.0}
        max={15.0}
        step={0.25}
        unit="%"
        badgeColor="cyan"
      />

      {/* Monthly Savings Contribution */}
      <SliderInput
        label="Monthly Savings & Investments"
        value={fireParams.monthlySavings}
        onChange={(val) => setFireParams((prev) => ({ ...prev, monthlySavings: val }))}
        min={0}
        max={20000}
        step={100}
        prefix={currency.symbol}
        unit="/mo"
        badgeColor="amber"
      />

      {/* Portfolio Net Worth Sync Switch */}
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
        }}
      >
        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Sync With Portfolio Net Worth
          </div>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
            Current: {currency.symbol}{summary.totalValue.toLocaleString()}
          </div>
        </div>
        <button
          type="button"
          onClick={() =>
            setFireParams((prev) => ({ ...prev, usePortfolioNetWorth: !prev.usePortfolioNetWorth }))
          }
          className={`badge ${fireParams.usePortfolioNetWorth ? 'badge-emerald' : 'badge-slate'}`}
          style={{ cursor: 'pointer', padding: '6px 12px', fontSize: '0.8rem' }}
        >
          {fireParams.usePortfolioNetWorth ? 'Synced ✓' : 'Manual Entry'}
        </button>
      </div>

      {!fireParams.usePortfolioNetWorth && (
        <div className="form-group" style={{ marginTop: '14px', marginBottom: 0 }}>
          <label className="form-label">Manual Starting Net Worth ({currency.symbol})</label>
          <input
            type="number"
            step="1000"
            className="input-text"
            value={fireParams.currentNetWorth}
            onChange={(e) =>
              setFireParams((prev) => ({ ...prev, currentNetWorth: Math.max(0, parseFloat(e.target.value) || 0) }))
            }
          />
        </div>
      )}
    </Card>
  );
};
