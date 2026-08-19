import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import type { Expense, ExpenseCategory, Companion, SplitShare } from '../../types/budget';
import { POPULAR_CURRENCIES } from '../../data/currencies';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: Expense) => void;
  companions: Companion[];
  primaryCurrency: string;
  initialExpense?: Expense | null;
  tripId: string;
}

const CATEGORIES: ExpenseCategory[] = [
  'Lodging',
  'Food',
  'Transit',
  'Tickets',
  'Shopping',
  'Activities',
  'Emergency',
  'Misc'
];

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  companions,
  primaryCurrency,
  initialExpense,
  tripId
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Food');
  const [amount, setAmount] = useState<number>(50);
  const [currency, setCurrency] = useState(primaryCurrency);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [payerId, setPayerId] = useState(companions[0]?.id || '');
  const [splitType, setSplitType] = useState<'EQUAL' | 'EXACT'>('EQUAL');
  const [selectedCompanions, setSelectedCompanions] = useState<Record<string, boolean>>({});
  const [customShares, setCustomShares] = useState<Record<string, number>>({});
  const [receiptNote, setReceiptNote] = useState('');

  useEffect(() => {
    if (initialExpense) {
      setTitle(initialExpense.title);
      setCategory(initialExpense.category);
      setAmount(initialExpense.amount);
      setCurrency(initialExpense.currency || primaryCurrency);
      setDate(initialExpense.date);
      setPayerId(initialExpense.payerId);
      setSplitType(initialExpense.splitType === 'EXACT' ? 'EXACT' : 'EQUAL');
      setReceiptNote(initialExpense.receiptNote || '');

      const selMap: Record<string, boolean> = {};
      const shareMap: Record<string, number> = {};
      companions.forEach((c) => {
        const found = initialExpense.splits.find((s) => s.companionId === c.id);
        selMap[c.id] = !!found && found.share > 0;
        shareMap[c.id] = found?.share || 0;
      });
      setSelectedCompanions(selMap);
      setCustomShares(shareMap);
    } else {
      setTitle('');
      setCategory('Food');
      setAmount(50);
      setCurrency(primaryCurrency);
      setDate(new Date().toISOString().split('T')[0]);
      setPayerId(companions[0]?.id || '');
      setSplitType('EQUAL');
      setReceiptNote('');

      const selMap: Record<string, boolean> = {};
      const shareMap: Record<string, number> = {};
      companions.forEach((c) => {
        selMap[c.id] = true;
        shareMap[c.id] = 0;
      });
      setSelectedCompanions(selMap);
      setCustomShares(shareMap);
    }
  }, [initialExpense, companions, primaryCurrency, isOpen]);

  const handleToggleCompanion = (id: string) => {
    setSelectedCompanions((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCustomShareChange = (id: string, val: number) => {
    setCustomShares((prev) => ({
      ...prev,
      [id]: val
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || amount <= 0) return;

    let splits: SplitShare[] = [];

    if (splitType === 'EQUAL') {
      splits = companions
        .filter((c) => selectedCompanions[c.id])
        .map((c) => ({
          companionId: c.id,
          share: 1
        }));
    } else {
      splits = companions
        .filter((c) => selectedCompanions[c.id])
        .map((c) => ({
          companionId: c.id,
          share: customShares[c.id] || 0
        }));
    }

    const expenseRecord: Expense = {
      id: initialExpense?.id || `exp-${Date.now()}`,
      tripId,
      title: title.trim(),
      category,
      amount: Number(amount),
      currency,
      convertedAmount: Number(amount),
      date,
      payerId,
      splitType,
      splits,
      receiptNote: receiptNote.trim() || undefined,
      createdAt: initialExpense?.createdAt || Date.now()
    };

    onSave(expenseRecord);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialExpense ? 'Edit Shared Expense' : 'Add New Expense & Split'}
      maxWidth="580px"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Expense Title *</label>
            <input
              type="text"
              className="form-input"
              required
              placeholder="e.g. Asakusa Sukiyaki Banquet"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.2fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Amount *</label>
            <input
              type="number"
              min="0.01"
              step="any"
              className="form-input"
              required
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Currency</label>
            <select
              className="form-select"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              {POPULAR_CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} ({c.symbol})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Paid By</label>
          <select
            className="form-select"
            value={payerId}
            onChange={(e) => setPayerId(e.target.value)}
          >
            {companions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} {c.isCurrentUser ? '(You)' : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <label className="form-label" style={{ marginBottom: 0 }}>
              Split Among Companions
            </label>
            <div style={{ display: 'flex', gap: 4 }}>
              <button
                type="button"
                className={`btn-secondary ${splitType === 'EQUAL' ? 'active' : ''}`}
                style={{
                  padding: '3px 8px',
                  fontSize: '0.7rem',
                  borderColor: splitType === 'EQUAL' ? 'var(--accent-primary)' : 'var(--border-subtle)'
                }}
                onClick={() => setSplitType('EQUAL')}
              >
                Split Equally
              </button>
              <button
                type="button"
                className={`btn-secondary ${splitType === 'EXACT' ? 'active' : ''}`}
                style={{
                  padding: '3px 8px',
                  fontSize: '0.7rem',
                  borderColor: splitType === 'EXACT' ? 'var(--accent-primary)' : 'var(--border-subtle)'
                }}
                onClick={() => setSplitType('EXACT')}
              >
                Exact Amounts
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {companions.map((c) => (
              <div
                key={c.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={!!selectedCompanions[c.id]}
                    onChange={() => handleToggleCompanion(c.id)}
                    style={{ width: 16, height: 16, accentColor: 'var(--accent-primary)' }}
                  />
                  <div
                    className="companion-avatar"
                    style={{ background: c.avatarColor, width: 24, height: 24, fontSize: '0.7rem' }}
                  >
                    {c.name.charAt(0)}
                  </div>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{c.name}</span>
                </label>

                {splitType === 'EXACT' && selectedCompanions[c.id] && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{currency}</span>
                    <input
                      type="number"
                      step="any"
                      style={{ width: 80, padding: '4px 8px', fontSize: '0.75rem' }}
                      className="form-input"
                      value={customShares[c.id] || 0}
                      onChange={(e) => handleCustomShareChange(c.id, parseFloat(e.target.value) || 0)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Receipt / Booking Notes</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Invoice #9981 or Table 4 reservation"
            value={receiptNote}
            onChange={(e) => setReceiptNote(e.target.value)}
          />
        </div>

        <div className="modal-footer" style={{ margin: '8px -24px -24px', padding: '16px 24px' }}>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            {initialExpense ? 'Update Expense' : 'Save Shared Expense'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
