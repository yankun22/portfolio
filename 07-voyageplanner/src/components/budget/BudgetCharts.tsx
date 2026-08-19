import React from 'react';
import type { BudgetSummary } from '../../services/budgetService';
import { formatMoney } from '../../data/currencies';
import type { ExpenseCategory } from '../../types/budget';
import { PieChart, DollarSign, Wallet, TrendingUp, AlertTriangle } from 'lucide-react';

interface BudgetChartsProps {
  summary: BudgetSummary;
}

const CATEGORY_META: Record<ExpenseCategory, { label: string; color: string; icon: string }> = {
  Lodging: { label: 'Lodging & Hotels', color: '#8b5cf6', icon: '🏨' },
  Food: { label: 'Food & Dining', color: '#f59e0b', icon: '🍜' },
  Transit: { label: 'Transit & Flights', color: '#06b6d4', icon: '🚆' },
  Tickets: { label: 'Tickets & Attractions', color: '#3b82f6', icon: '🎟️' },
  Shopping: { label: 'Shopping & Souvenirs', color: '#eab308', icon: '🛍️' },
  Activities: { label: 'Tours & Outdoor', color: '#10b981', icon: '⛰️' },
  Emergency: { label: 'Emergency / Medical', color: '#ef4444', icon: '🚨' },
  Misc: { label: 'Miscellaneous', color: '#64748b', icon: '📦' }
};

export const BudgetCharts: React.FC<BudgetChartsProps> = ({ summary }) => {
  const isOverBudget = summary.remainingBudget < 0;

  const activeCategories = Object.entries(summary.categoryTotals)
    .filter(([, amount]) => amount > 0)
    .sort(([, a], [, b]) => b - a) as [ExpenseCategory, number][];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
        <div className="budget-metric-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: '0.75rem' }}>
            <Wallet size={14} color="var(--accent-primary)" />
            <span>Total Target Budget</span>
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
            {formatMoney(summary.totalBudget, summary.currency)}
          </div>
        </div>

        <div className="budget-metric-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: '0.75rem' }}>
            <TrendingUp size={14} color="#f59e0b" />
            <span>Total Recorded Spent</span>
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: '#f59e0b' }}>
            {formatMoney(summary.totalSpent, summary.currency)}
          </div>
        </div>

        <div className="budget-metric-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: '0.75rem' }}>
            {isOverBudget ? <AlertTriangle size={14} color="#ef4444" /> : <DollarSign size={14} color="#10b981" />}
            <span>{isOverBudget ? 'Budget Deficit' : 'Remaining Balance'}</span>
          </div>
          <div
            style={{
              fontSize: '1.35rem',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              color: isOverBudget ? '#ef4444' : '#10b981'
            }}
          >
            {formatMoney(Math.abs(summary.remainingBudget), summary.currency)}
          </div>
        </div>
      </div>

      <div className="budget-metric-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Overall Budget Utilization
          </span>
          <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: isOverBudget ? '#ef4444' : 'var(--accent-primary)' }}>
            {summary.spentPercentage}% ({formatMoney(summary.totalSpent, summary.currency)} of {formatMoney(summary.totalBudget, summary.currency)})
          </span>
        </div>

        <div className="budget-progress-bar-container">
          <div
            className="budget-progress-bar-fill"
            style={{
              width: `${Math.min(summary.spentPercentage, 100)}%`,
              background: isOverBudget
                ? 'linear-gradient(90deg, #f59e0b 0%, #ef4444 100%)'
                : 'linear-gradient(90deg, #3b82f6 0%, #10b981 100%)'
            }}
          />
        </div>
      </div>

      <div className="budget-metric-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <PieChart size={16} color="var(--accent-primary)" />
          <h4 style={{ fontSize: '0.9375rem', fontWeight: 700 }}>Expense Category Distribution</h4>
        </div>

        {summary.totalSpent > 0 && (
          <div
            style={{
              display: 'flex',
              height: 12,
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden',
              marginTop: 6,
              background: 'var(--bg-secondary)'
            }}
          >
            {activeCategories.map(([cat, amount]) => {
              const pct = (amount / summary.totalSpent) * 100;
              const meta = CATEGORY_META[cat];
              return (
                <div
                  key={cat}
                  style={{
                    width: `${pct}%`,
                    background: meta.color,
                    transition: 'width 0.4s ease'
                  }}
                  title={`${meta.label}: ${formatMoney(amount, summary.currency)} (${Math.round(pct)}%)`}
                />
              );
            })}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
          {activeCategories.length === 0 ? (
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', textAlign: 'center', padding: '12px 0' }}>
              No expenses recorded yet.
            </div>
          ) : (
            activeCategories.map(([cat, amount]) => {
              const pct = Math.round((amount / summary.totalSpent) * 100);
              const meta = CATEGORY_META[cat];
              return (
                <div
                  key={cat}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-secondary)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 3,
                        background: meta.color
                      }}
                    />
                    <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                      {meta.icon} {meta.label}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{pct}%</span>
                    <strong style={{ fontSize: '0.8125rem', color: 'var(--text-primary)' }}>
                      {formatMoney(amount, summary.currency)}
                    </strong>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
