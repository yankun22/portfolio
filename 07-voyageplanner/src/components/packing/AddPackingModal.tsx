import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import type { PackingCategory, PackingItem } from '../../types/packing';
import type { Companion } from '../../types/budget';

interface AddPackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: PackingItem) => void;
  tripId: string;
  companions: Companion[];
}

const CATEGORIES: PackingCategory[] = [
  'Documents & Passports',
  'Clothing & Footwear',
  'Electronics & Tech',
  'Toiletries & Health',
  'Outdoor & Activity Gear',
  'Travel Essentials',
  'Emergency & Meds'
];

export const AddPackingModal: React.FC<AddPackingModalProps> = ({
  isOpen,
  onClose,
  onSave,
  tripId,
  companions
}) => {
  const [category, setCategory] = useState<PackingCategory>('Clothing & Footwear');
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [essential, setEssential] = useState(true);
  const [assignedTo, setAssignedTo] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newItem: PackingItem = {
      id: `pack-${Date.now()}`,
      tripId,
      category,
      name: name.trim(),
      quantity: Number(quantity) || 1,
      packed: false,
      essential,
      assignedTo: assignedTo || undefined,
      notes: notes.trim() || undefined
    };

    onSave(newItem);
    setName('');
    setQuantity(1);
    setNotes('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Packing Item" maxWidth="500px">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="form-group">
          <label className="form-label">Item Name *</label>
          <input
            type="text"
            className="form-input"
            required
            placeholder="e.g. Noise-Cancelling Earplugs or Hiking Poles"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value as PackingCategory)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Quantity</label>
            <input
              type="number"
              min="1"
              max="99"
              className="form-input"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            />
          </div>
        </div>

        {companions.length > 0 && (
          <div className="form-group">
            <label className="form-label">Assign To Companion</label>
            <select
              className="form-select"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
            >
              <option value="">Unassigned (Shared)</option>
              {companions.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={essential}
              onChange={(e) => setEssential(e.target.checked)}
              style={{ width: 16, height: 16, accentColor: 'var(--accent-primary)' }}
            />
            <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
              Must-Pack Priority Essential
            </span>
          </label>
        </div>

        <div className="form-group">
          <label className="form-label">Notes / Brand Ref</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. In carry-on backpack or TSA 100ml limit"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="modal-footer" style={{ margin: '8px -24px -24px', padding: '16px 24px' }}>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Add to Checklist
          </button>
        </div>
      </form>
    </Modal>
  );
};
