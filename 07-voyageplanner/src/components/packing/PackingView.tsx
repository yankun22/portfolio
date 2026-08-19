import React, { useState } from 'react';
import type { PackingItem, PackingCategory } from '../../types/packing';
import type { Trip } from '../../types/itinerary';
import type { Companion } from '../../types/budget';
import { AddPackingModal } from './AddPackingModal';
import {
  CheckSquare,
  Square,
  Plus,
  Trash2,
  CheckCircle2,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PackingViewProps {
  trip: Trip;
  packingItems: PackingItem[];
  companions: Companion[];
  onUpdatePackingItems: (items: PackingItem[]) => void;
}

const CATEGORY_ICONS: Record<PackingCategory, string> = {
  'Documents & Passports': '🛂',
  'Clothing & Footwear': '👕',
  'Electronics & Tech': '🔌',
  'Toiletries & Health': '🧴',
  'Outdoor & Activity Gear': '🎒',
  'Travel Essentials': '🧭',
  'Emergency & Meds': '🩹'
};

export const PackingView: React.FC<PackingViewProps> = ({
  trip,
  packingItems,
  companions,
  onUpdatePackingItems
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'packed' | 'essential'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalCount = packingItems.length;
  const packedCount = packingItems.filter((i) => i.packed).length;
  const percentage = totalCount > 0 ? Math.round((packedCount / totalCount) * 100) : 0;

  const handleToggleItem = (id: string) => {
    const next = packingItems.map((item) => {
      if (item.id === id) {
        const nextPacked = !item.packed;
        return { ...item, packed: nextPacked };
      }
      return item;
    });

    onUpdatePackingItems(next);

    const nextPackedCount = next.filter((i) => i.packed).length;
    if (nextPackedCount === next.length && next.length > 0) {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  const handleDeleteItem = (id: string) => {
    onUpdatePackingItems(packingItems.filter((i) => i.id !== id));
  };

  const handleQuantityChange = (id: string, delta: number) => {
    onUpdatePackingItems(
      packingItems.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: Math.max(1, item.quantity + delta) };
        }
        return item;
      })
    );
  };

  const handlePackAll = () => {
    onUpdatePackingItems(packingItems.map((i) => ({ ...i, packed: true })));
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleResetAll = () => {
    onUpdatePackingItems(packingItems.map((i) => ({ ...i, packed: false })));
  };

  const handleAddItem = (newItem: PackingItem) => {
    onUpdatePackingItems([...packingItems, newItem]);
  };

  const categories = Array.from(new Set(packingItems.map((i) => i.category))) as PackingCategory[];

  const filteredItems = packingItems.filter((item) => {
    if (filter === 'pending') return !item.packed;
    if (filter === 'packed') return item.packed;
    if (filter === 'essential') return item.essential;
    return true;
  });

  return (
    <div className="packing-container">
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px 28px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}
            >
              <CheckSquare size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                Offline Travel Checklist & Gear Manifest
              </h3>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                {packedCount} of {totalCount} items packed ({percentage}% ready for departure)
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              className="btn-secondary"
              style={{ fontSize: '0.75rem', padding: '6px 12px' }}
              onClick={handlePackAll}
            >
              <CheckCircle2 size={13} color="#10b981" />
              <span>Pack All</span>
            </button>

            <button
              className="btn-secondary"
              style={{ fontSize: '0.75rem', padding: '6px 12px' }}
              onClick={handleResetAll}
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>

            <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
              <Plus size={14} />
              <span>Add Item</span>
            </button>
          </div>
        </div>

        <div>
          <div className="budget-progress-bar-container" style={{ height: 12 }}>
            <div
              className="budget-progress-bar-fill"
              style={{
                width: `${percentage}%`,
                background:
                  percentage === 100
                    ? 'linear-gradient(90deg, #10b981 0%, #06b6d4 100%)'
                    : 'linear-gradient(90deg, #8b5cf6 0%, #3b82f6 100%)'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            className={`tab-btn ${filter === 'all' ? 'active' : ''}`}
            style={{ padding: '4px 12px' }}
            onClick={() => setFilter('all')}
          >
            All Items ({totalCount})
          </button>
          <button
            className={`tab-btn ${filter === 'pending' ? 'active' : ''}`}
            style={{ padding: '4px 12px' }}
            onClick={() => setFilter('pending')}
          >
            Pending ({totalCount - packedCount})
          </button>
          <button
            className={`tab-btn ${filter === 'packed' ? 'active' : ''}`}
            style={{ padding: '4px 12px' }}
            onClick={() => setFilter('packed')}
          >
            Packed ({packedCount})
          </button>
          <button
            className={`tab-btn ${filter === 'essential' ? 'active' : ''}`}
            style={{ padding: '4px 12px' }}
            onClick={() => setFilter('essential')}
          >
            Essentials ⭐
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {categories.map((cat) => {
          const itemsInCat = filteredItems.filter((i) => i.category === cat);
          if (itemsInCat.length === 0) return null;

          const catTotal = packingItems.filter((i) => i.category === cat).length;
          const catPacked = packingItems.filter((i) => i.category === cat && i.packed).length;
          const catPct = catTotal > 0 ? Math.round((catPacked / catTotal) * 100) : 0;

          return (
            <div key={cat} className="packing-category-section">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '1.2rem' }}>{CATEGORY_ICONS[cat] || '📦'}</span>
                  <h4 style={{ fontSize: '0.9375rem', fontWeight: 700 }}>{cat}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    ({catPacked}/{catTotal})
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: 120 }}>
                  <div className="budget-progress-bar-container" style={{ height: 6, margin: 0 }}>
                    <div
                      className="budget-progress-bar-fill"
                      style={{
                        width: `${catPct}%`,
                        background: catPct === 100 ? '#10b981' : '#3b82f6'
                      }}
                    />
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', minWidth: 30 }}>
                    {catPct}%
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {itemsInCat.map((item) => (
                  <div
                    key={item.id}
                    className={`packing-item-row ${item.packed ? 'packed' : ''}`}
                  >
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', flex: 1 }}
                      onClick={() => handleToggleItem(item.id)}
                    >
                      <div style={{ color: item.packed ? '#10b981' : 'var(--text-muted)' }}>
                        {item.packed ? <CheckSquare size={18} /> : <Square size={18} />}
                      </div>

                      <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                          {item.name}
                          {item.essential && (
                            <span
                              style={{
                                marginLeft: 8,
                                fontSize: '0.65rem',
                                color: '#f59e0b',
                                background: 'rgba(245, 158, 11, 0.1)',
                                padding: '2px 6px',
                                borderRadius: 'var(--radius-sm)'
                              }}
                            >
                              ⭐ Priority
                            </span>
                          )}
                        </div>

                        {item.assignedTo && (
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                            👤 Assigned to: {item.assignedTo}
                          </div>
                        )}
                        {item.notes && (
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                            💡 {item.notes}
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          background: 'var(--bg-card)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '2px 6px',
                          border: '1px solid var(--border-subtle)'
                        }}
                      >
                        <button
                          type="button"
                          style={{
                            border: 'none',
                            background: 'transparent',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            padding: '0 4px',
                            fontWeight: 700
                          }}
                          onClick={() => handleQuantityChange(item.id, -1)}
                        >
                          -
                        </button>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, minWidth: 16, textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          style={{
                            border: 'none',
                            background: 'transparent',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            padding: '0 4px',
                            fontWeight: 700
                          }}
                          onClick={() => handleQuantityChange(item.id, 1)}
                        >
                          +
                        </button>
                      </div>

                      <button
                        className="btn-icon"
                        style={{ width: 26, height: 26 }}
                        onClick={() => handleDeleteItem(item.id)}
                        title="Remove item"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <AddPackingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddItem}
        tripId={trip.id}
        companions={companions}
      />
    </div>
  );
};
