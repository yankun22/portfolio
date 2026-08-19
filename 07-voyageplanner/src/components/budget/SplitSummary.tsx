import React, { useState } from 'react';
import type { Companion, CompanionBalance, Settlement } from '../../types/budget';
import { formatMoney } from '../../data/currencies';
import { ArrowRight, Check, Copy, UserPlus, Users, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SplitSummaryProps {
  balances: CompanionBalance[];
  settlements: Settlement[];
  currency: string;
  onAddCompanion: (companion: Companion) => void;
  onSettleDebt?: (settlement: Settlement) => void;
}

export const SplitSummary: React.FC<SplitSummaryProps> = ({
  balances,
  settlements,
  currency,
  onAddCompanion,
  onSettleDebt
}) => {
  const [copied, setCopied] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCompanionName, setNewCompanionName] = useState('');
  const [newCompanionEmail, setNewCompanionEmail] = useState('');

  const AVATAR_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#ef4444'];

  const handleCopySummary = () => {
    if (settlements.length === 0) return;
    const text = settlements
      .map((s) => `${s.fromName} pays ${s.toName} ${formatMoney(s.amount, s.currency)}`)
      .join('\n');

    navigator.clipboard.writeText(
      `--- VoyagePlanner Settlement Summary ---\n${text}\n--------------------------------------`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanionName.trim()) return;

    const newComp: Companion = {
      id: `comp-${Date.now()}`,
      name: newCompanionName.trim(),
      email: newCompanionEmail.trim() || undefined,
      avatarColor: AVATAR_COLORS[balances.length % AVATAR_COLORS.length]
    };

    onAddCompanion(newComp);
    setNewCompanionName('');
    setNewCompanionEmail('');
    setShowAddForm(false);
  };

  const handleSettle = (s: Settlement) => {
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 }
    });

    if (onSettleDebt) {
      onSettleDebt(s);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="budget-metric-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Users size={16} color="var(--accent-primary)" />
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700 }}>Companion Balances</h4>
          </div>
          <button
            className="btn-secondary"
            style={{ fontSize: '0.75rem', padding: '4px 10px' }}
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <UserPlus size={13} />
            <span>Add Companion</span>
          </button>
        </div>

        {showAddForm && (
          <form
            onSubmit={handleAddSubmit}
            style={{
              padding: 12,
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-medium)',
              display: 'flex',
              flexDirection: 'column',
              gap: 8
            }}
          >
            <div style={{ fontSize: '0.8125rem', fontWeight: 600 }}>New Travel Companion</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr auto', gap: 8 }}>
              <input
                type="text"
                className="form-input"
                placeholder="Full name (e.g. Taylor Chen)"
                required
                value={newCompanionName}
                onChange={(e) => setNewCompanionName(e.target.value)}
              />
              <input
                type="email"
                className="form-input"
                placeholder="Email (optional)"
                value={newCompanionEmail}
                onChange={(e) => setNewCompanionEmail(e.target.value)}
              />
              <button type="submit" className="btn-primary" style={{ padding: '8px 14px' }}>
                Add
              </button>
            </div>
          </form>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
          {balances.map((b) => {
            const isPositive = b.netBalance > 0.01;
            const isNegative = b.netBalance < -0.01;

            return (
              <div
                key={b.companion.id}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12
                }}
              >
                <div
                  className="companion-avatar"
                  style={{ background: b.companion.avatarColor }}
                >
                  {b.companion.name.charAt(0)}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {b.companion.name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    Paid: {formatMoney(b.totalPaid, currency)}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div
                    style={{
                      fontSize: '0.8125rem',
                      fontWeight: 800,
                      color: isPositive ? '#34d399' : isNegative ? '#fb7185' : 'var(--text-muted)'
                    }}
                  >
                    {isPositive ? `+${formatMoney(b.netBalance, currency)}` : isNegative ? `-${formatMoney(Math.abs(b.netBalance), currency)}` : 'Settled'}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>
                    {isPositive ? 'Receives' : isNegative ? 'Owes' : 'Even'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="budget-metric-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={16} color="#f59e0b" />
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700 }}>
              Optimal Debt Settlements ({settlements.length} Transfers)
            </h4>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            {settlements.length > 0 && (
              <button
                className="btn-secondary"
                style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                onClick={handleCopySummary}
              >
                {copied ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                <span>{copied ? 'Copied' : 'Copy Split'}</span>
              </button>
            )}
          </div>
        </div>

        {settlements.length === 0 ? (
          <div
            style={{
              padding: 24,
              textAlign: 'center',
              background: 'rgba(16, 185, 129, 0.05)',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed rgba(16, 185, 129, 0.3)',
              color: '#34d399'
            }}
          >
            <Check size={24} style={{ marginBottom: 6 }} />
            <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>All balances are completely settled!</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              No outstanding debts remain among travel companions.
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {settlements.map((s, idx) => (
              <div key={`settlement-${idx}`} className="settlement-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#fb7185' }}>
                    {s.fromName}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)'
                    }}
                  >
                    <span>pays</span>
                    <ArrowRight size={13} />
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#34d399' }}>
                    {s.toName}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1rem',
                      fontWeight: 800,
                      color: 'var(--text-primary)'
                    }}
                  >
                    {formatMoney(s.amount, s.currency)}
                  </span>
                  <button
                    className="btn-icon"
                    style={{
                      width: 30,
                      height: 30,
                      background: 'rgba(16, 185, 129, 0.12)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      color: '#10b981'
                    }}
                    onClick={() => handleSettle(s)}
                    title={`Record payment & mark settled: ${s.fromName} pays ${s.toName} ${formatMoney(s.amount, s.currency)}`}
                  >
                    <Check size={14} color="#10b981" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
