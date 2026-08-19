import React, { useState } from 'react';
import type { Expense, Companion } from '../../types/budget';
import type { Trip } from '../../types/itinerary';
import { calculateTripBudgetSummary } from '../../services/budgetService';
import { formatMoney, convertCurrency } from '../../data/currencies';
import { BudgetCharts } from './BudgetCharts';
import { SplitSummary } from './SplitSummary';
import { ExpenseModal } from './ExpenseModal';
import { Plus, Edit2, Trash2, Receipt, Calendar, User } from 'lucide-react';

interface BudgetViewProps {
  trip: Trip;
  expenses: Expense[];
  companions: Companion[];
  onUpdateExpenses: (expenses: Expense[]) => void;
  onAddCompanion: (companion: Companion) => void;
  primaryCurrency: string;
}

export const BudgetView: React.FC<BudgetViewProps> = ({
  trip,
  expenses,
  companions,
  onUpdateExpenses,
  onAddCompanion,
  primaryCurrency
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const budgetSummary = calculateTripBudgetSummary(
    expenses,
    companions,
    trip.totalBudget,
    primaryCurrency
  );

  const handleSaveExpense = (saved: Expense) => {
    if (editingExpense) {
      onUpdateExpenses(expenses.map((e) => (e.id === saved.id ? saved : e)));
    } else {
      onUpdateExpenses([saved, ...expenses]);
    }
  };

  const handleDeleteExpense = (id: string) => {
    onUpdateExpenses(expenses.filter((e) => e.id !== id));
  };

  const getPayerName = (payerId: string): string => {
    const comp = companions.find((c) => c.id === payerId);
    return comp ? comp.name : 'Unknown';
  };

  return (
    <div className="budget-grid">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
              Expense Ledger & Receipts
            </h3>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {expenses.length} transactions recorded
            </div>
          </div>

          <button
            className="btn-primary"
            onClick={() => {
              setEditingExpense(null);
              setIsModalOpen(true);
            }}
          >
            <Plus size={15} />
            <span>Add Expense</span>
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {expenses.length === 0 ? (
            <div
              style={{
                padding: '40px 20px',
                textAlign: 'center',
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                border: '1px dashed var(--border-subtle)',
                color: 'var(--text-muted)'
              }}
            >
              <Receipt size={32} style={{ opacity: 0.4, marginBottom: 8 }} />
              <div style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                No expenses logged yet
              </div>
              <div style={{ fontSize: '0.75rem', marginBottom: 12 }}>
                Track group dinners, lodging, transport, and museum tickets
              </div>
              <button
                className="btn-primary"
                style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                onClick={() => {
                  setEditingExpense(null);
                  setIsModalOpen(true);
                }}
              >
                <Plus size={13} /> Log First Expense
              </button>
            </div>
          ) : (
            expenses.map((exp) => (
              <div
                key={exp.id}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 16,
                  transition: 'var(--transition-fast)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.1rem'
                    }}
                  >
                    {exp.category === 'Food'
                      ? '🍜'
                      : exp.category === 'Lodging'
                      ? '🏨'
                      : exp.category === 'Transit'
                      ? '🚆'
                      : exp.category === 'Tickets'
                      ? '🎟️'
                      : exp.category === 'Shopping'
                      ? '🛍️'
                      : exp.category === 'Activities'
                      ? '⛰️'
                      : '📦'}
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {exp.title}
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                        marginTop: 2
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <User size={12} /> Paid by {getPayerName(exp.payerId)}
                      </span>
                      <span>•</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Calendar size={12} /> {exp.date}
                      </span>
                    </div>

                    {exp.receiptNote && (
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: 2 }}>
                        Ref: {exp.receiptNote}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
                  <div style={{ textAlign: 'right' }}>
                    {/* Always show the amount converted to primary currency */}
                    <div
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.05rem',
                        fontWeight: 800,
                        color: 'var(--text-primary)'
                      }}
                    >
                      {formatMoney(
                        exp.currency === primaryCurrency
                          ? exp.amount
                          : convertCurrency(exp.amount, exp.currency, primaryCurrency),
                        primaryCurrency
                      )}
                    </div>
                    {/* Show original amount in smaller text if currency differs */}
                    {exp.currency !== primaryCurrency && (
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {formatMoney(exp.amount, exp.currency)}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: 4 }}>
                    <button
                      className="btn-icon"
                      style={{ width: 28, height: 28 }}
                      onClick={() => {
                        setEditingExpense(exp);
                        setIsModalOpen(true);
                      }}
                      title="Edit expense"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      className="btn-icon"
                      style={{ width: 28, height: 28 }}
                      onClick={() => handleDeleteExpense(exp.id)}
                      title="Delete expense"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <SplitSummary
          balances={budgetSummary.companionBalances}
          settlements={budgetSummary.settlements}
          currency={primaryCurrency}
          onAddCompanion={onAddCompanion}
        />

        <BudgetCharts summary={budgetSummary} />
      </div>

      <ExpenseModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingExpense(null);
        }}
        onSave={handleSaveExpense}
        companions={companions}
        primaryCurrency={primaryCurrency}
        initialExpense={editingExpense}
        tripId={trip.id}
      />
    </div>
  );
};
