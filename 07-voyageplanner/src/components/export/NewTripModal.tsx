import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import type { Trip, ItineraryDay } from '../../types/itinerary';
import { POPULAR_CURRENCIES } from '../../data/currencies';

interface NewTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTrip: (newTrip: Trip) => void;
}

export const NewTripModal: React.FC<NewTripModalProps> = ({
  isOpen,
  onClose,
  onCreateTrip
}) => {
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [country, setCountry] = useState('');
  const [startDate, setStartDate] = useState('2026-09-01');
  const [dayCount, setDayCount] = useState(4);
  const [primaryCurrency, setPrimaryCurrency] = useState('USD');
  const [totalBudget, setTotalBudget] = useState(2500);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !destination.trim()) return;

    const startObj = new Date(startDate);
    const endObj = new Date(startDate);
    endObj.setDate(startObj.getDate() + (dayCount - 1));
    const endDate = endObj.toISOString().split('T')[0];

    const days: ItineraryDay[] = [];
    for (let i = 1; i <= dayCount; i++) {
      const d = new Date(startObj);
      d.setDate(d.getDate() + (i - 1));
      days.push({
        id: `day-${i}`,
        dayNumber: i,
        date: d.toISOString().split('T')[0],
        title: `Day ${i} in ${destination}`,
        description: `Explore attractions and experiences in ${destination}.`
      });
    }

    const tripId = `trip-${Date.now()}`;
    const newTrip: Trip = {
      id: tripId,
      title: title.trim(),
      destination: destination.trim(),
      country: country.trim() || 'International',
      coverImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
      startDate,
      endDate,
      primaryCurrency,
      totalBudget: Number(totalBudget) || 2000,
      days,
      activities: [],
      tags: ['Custom Trip', destination.trim()]
    };

    onCreateTrip(newTrip);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Travel Itinerary" maxWidth="560px">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="form-group">
          <label className="form-label">Trip Title *</label>
          <input
            type="text"
            className="form-input"
            required
            placeholder="e.g. 5-Day Barcelona & Costa Brava Getaway"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">City / Destination *</label>
            <input
              type="text"
              className="form-input"
              required
              placeholder="e.g. Barcelona"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Country</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Spain"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              className="form-input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Duration (Days)</label>
            <input
              type="number"
              min="1"
              max="30"
              className="form-input"
              value={dayCount}
              onChange={(e) => setDayCount(parseInt(e.target.value) || 1)}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Primary Currency</label>
            <select
              className="form-select"
              value={primaryCurrency}
              onChange={(e) => setPrimaryCurrency(e.target.value)}
            >
              {POPULAR_CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} ({c.symbol})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Target Budget</label>
            <input
              type="number"
              min="0"
              step="100"
              className="form-input"
              value={totalBudget}
              onChange={(e) => setTotalBudget(parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className="modal-footer" style={{ margin: '8px -24px -24px', padding: '16px 24px' }}>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Create Itinerary
          </button>
        </div>
      </form>
    </Modal>
  );
};
