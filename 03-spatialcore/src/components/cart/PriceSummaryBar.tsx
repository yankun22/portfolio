import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useStudio } from '../../context/useStudio';

const SIZES = ['US 7.0', 'US 7.5', 'US 8.0', 'US 8.5', 'US 9.0', 'US 9.5', 'US 10.0', 'US 10.5', 'US 11.0', 'US 11.5', 'US 12.0', 'US 13.0'];

export const PriceSummaryBar: React.FC = () => {
  const { activePrice, addToCart, selectedShoeSize, setSelectedShoeSize } = useStudio();

  return (
    <div
      style={{
        padding: '16px 20px',
        background: 'rgba(10, 15, 26, 0.95)',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginTop: 'auto',
      }}
    >
      {/* Size Selector & Price Breakdown */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            Size:
          </span>
          <select
            value={selectedShoeSize}
            onChange={(e) => setSelectedShoeSize(e.target.value)}
            style={{
              background: '#090d15',
              color: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '4px 8px',
              fontSize: '0.75rem',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
            }}
          >
            {SIZES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#ffffff' }}>
            ${activePrice.unitPrice.toFixed(2)}
          </div>
          {activePrice.upgradesTotal > 0 && (
            <div style={{ fontSize: '0.675rem', color: '#00f0ff', fontFamily: 'var(--font-mono)' }}>
              (Includes +${activePrice.upgradesTotal} in custom tiers)
            </div>
          )}
        </div>
      </div>

      {/* Add to Bag CTA */}
      <button
        type="button"
        className="btn-spatial btn-primary-glow"
        style={{ width: '100%', padding: '12px', fontSize: '0.875rem' }}
        onClick={() => addToCart()}
      >
        <ShoppingBag size={18} />
        <span>Add Custom Build to Bag</span>
      </button>
    </div>
  );
};
