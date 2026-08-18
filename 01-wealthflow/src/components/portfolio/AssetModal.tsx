import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import type { Asset, AssetCategory } from '../../types/portfolio';
import { useWealth } from '../../context/useWealth';

interface AssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  assetToEdit?: Asset | null;
}

const CATEGORIES: AssetCategory[] = ['Cash', 'Stocks', 'Crypto', 'Real Estate', 'Commodities'];

const AssetModalForm: React.FC<{
  onClose: () => void;
  assetToEdit?: Asset | null;
}> = ({ onClose, assetToEdit }) => {
  const { addAsset, updateAsset, currency } = useWealth();

  const [name, setName] = useState(assetToEdit?.name || '');
  const [symbol, setSymbol] = useState(assetToEdit?.symbol || '');
  const [category, setCategory] = useState<AssetCategory>(assetToEdit?.category || 'Stocks');
  const [value, setValue] = useState(assetToEdit ? assetToEdit.value.toString() : '');
  const [costBasis, setCostBasis] = useState(assetToEdit ? assetToEdit.costBasis.toString() : '');
  const [quantity, setQuantity] = useState(assetToEdit?.quantity ? assetToEdit.quantity.toString() : '');
  const [annualYieldPercent, setAnnualYieldPercent] = useState(assetToEdit ? assetToEdit.annualYieldPercent.toString() : '2.0');
  const [targetAllocationPercent, setTargetAllocationPercent] = useState(assetToEdit ? assetToEdit.targetAllocationPercent.toString() : '15.0');
  const [notes, setNotes] = useState(assetToEdit?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const numValue = Math.max(0, parseFloat(value) || 0);
    const numCostBasis =
      costBasis !== '' && !isNaN(parseFloat(costBasis)) ? Math.max(0, parseFloat(costBasis)) : numValue;
    const numQuantity = quantity ? parseFloat(quantity) : undefined;
    const numYield = Math.max(0, parseFloat(annualYieldPercent) || 0);
    const numTarget = Math.max(0, parseFloat(targetAllocationPercent) || 0);

    if (assetToEdit) {
      updateAsset(assetToEdit.id, {
        name: name.trim(),
        symbol: symbol.trim().toUpperCase() || undefined,
        category,
        value: numValue,
        costBasis: numCostBasis,
        quantity: numQuantity,
        annualYieldPercent: numYield,
        targetAllocationPercent: numTarget,
        notes: notes.trim() || undefined,
      });
    } else {
      addAsset({
        name: name.trim(),
        symbol: symbol.trim().toUpperCase() || undefined,
        category,
        value: numValue,
        costBasis: numCostBasis,
        quantity: numQuantity,
        annualYieldPercent: numYield,
        targetAllocationPercent: numTarget,
        notes: notes.trim() || undefined,
      });
    }

    onClose();
  };

  return (
    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {assetToEdit ? 'Edit Asset Holding' : 'Add New Portfolio Asset'}
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Record individual holdings with cost basis and dividend yields
          </p>
        </div>
        <button className="btn-icon" onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Asset Name *</label>
            <input
              type="text"
              className="input-text"
              placeholder="e.g. Vanguard Total Stock Market"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Ticker / Symbol (Optional)</label>
            <input
              type="text"
              className="input-text"
              placeholder="e.g. VTI, BTC, RE-01"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
            />
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Asset Category *</label>
            <select
              className="select-input"
              value={category}
              onChange={(e) => setCategory(e.target.value as AssetCategory)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Quantity / Units (Optional)</label>
            <input
              type="number"
              step="any"
              className="input-text"
              placeholder="e.g. 150"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Current Market Value ({currency.symbol}) *</label>
            <input
              type="number"
              step="any"
              className="input-text"
              placeholder="e.g. 25000"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Total Cost Basis ({currency.symbol})</label>
            <input
              type="number"
              step="any"
              className="input-text"
              placeholder="Defaults to current value"
              value={costBasis}
              onChange={(e) => setCostBasis(e.target.value)}
            />
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Annual Dividend / Yield (%)</label>
            <input
              type="number"
              step="0.1"
              className="input-text"
              placeholder="e.g. 2.5"
              value={annualYieldPercent}
              onChange={(e) => setAnnualYieldPercent(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Target Allocation (%)</label>
            <input
              type="number"
              step="0.5"
              className="input-text"
              placeholder="e.g. 20"
              value={targetAllocationPercent}
              onChange={(e) => setTargetAllocationPercent(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Strategy Notes / Account (Optional)</label>
          <input
            type="text"
            className="input-text"
            placeholder="e.g. Roth IRA, Long-term compounder, Hardware wallet"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            <Check size={16} />
            {assetToEdit ? 'Save Changes' : 'Add Holding'}
          </button>
        </div>
      </form>
    </div>
  );
};

export const AssetModal: React.FC<AssetModalProps> = ({ isOpen, onClose, assetToEdit }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <AssetModalForm
        key={assetToEdit?.id || 'new_asset'}
        onClose={onClose}
        assetToEdit={assetToEdit}
      />
    </div>
  );
};
