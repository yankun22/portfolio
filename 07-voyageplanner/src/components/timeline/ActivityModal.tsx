import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import type { Activity, ActivityCategory, Trip } from '../../types/itinerary';
import { searchPlacesOnlineOrOffline } from '../../services/geoService';
import { POPULAR_CURRENCIES } from '../../data/currencies';
import type { Hotspot } from '../../data/globalHotspots';
import { Search } from 'lucide-react';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (activity: Activity) => void;
  trip: Trip;
  initialActivity?: Activity | null;
  targetDayId?: string;
  primaryCurrency: string;
}

const CATEGORIES: { value: ActivityCategory; label: string; icon: string }[] = [
  { value: 'sightseeing', label: 'Sightseeing', icon: '🏛️' },
  { value: 'dining', label: 'Food & Dining', icon: '🍜' },
  { value: 'culture', label: 'Culture & Temples', icon: '⛩️' },
  { value: 'nature', label: 'Nature & Parks', icon: '🌲' },
  { value: 'entertainment', label: 'Entertainment', icon: '🎭' },
  { value: 'shopping', label: 'Shopping', icon: '🛍️' },
  { value: 'relaxation', label: 'Relaxation & Spa', icon: '♨️' },
  { value: 'transit', label: 'Transit & Flight', icon: '🚆' },
  { value: 'lodging', label: 'Lodging & Hotel', icon: '🏨' }
];

export const ActivityModal: React.FC<ActivityModalProps> = ({
  isOpen,
  onClose,
  onSave,
  trip,
  initialActivity,
  targetDayId,
  primaryCurrency
}) => {
  const [title, setTitle] = useState('');
  const [dayId, setDayId] = useState('day-1');
  const [category, setCategory] = useState<ActivityCategory>('sightseeing');
  const [locationName, setLocationName] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({ lat: 35.6812, lng: 139.7671 });
  const [startTime, setStartTime] = useState('09:30');
  const [durationMinutes, setDurationMinutes] = useState(90);
  const [cost, setCost] = useState(0);
  const [currency, setCurrency] = useState(primaryCurrency);
  const [booked, setBooked] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [notes, setNotes] = useState('');
  const [description, setDescription] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Hotspot[]>([]);

  useEffect(() => {
    if (initialActivity) {
      setTitle(initialActivity.title);
      setDayId(initialActivity.dayId);
      setCategory(initialActivity.category);
      setLocationName(initialActivity.location?.name || '');
      setCoords(initialActivity.location?.coords || { lat: 35.6812, lng: 139.7671 });
      setStartTime(initialActivity.startTime);
      setDurationMinutes(initialActivity.durationMinutes);
      setCost(initialActivity.cost);
      setCurrency(initialActivity.currency || primaryCurrency);
      setBooked(initialActivity.booked);
      setConfirmationCode(initialActivity.confirmationCode || '');
      setNotes(initialActivity.notes || '');
      setDescription(initialActivity.description || '');
      setSearchQuery('');
    } else {
      setTitle('');
      setDayId(targetDayId || trip.days[0]?.id || 'day-1');
      setCategory('sightseeing');
      setLocationName('');
      const baseCoords = trip.days[0]?.hotelOrBase?.coords || trip.activities[0]?.location?.coords || { lat: 35.6812, lng: 139.7671 };
      setCoords(baseCoords);
      setStartTime('10:00');
      setDurationMinutes(90);
      setCost(0);
      setCurrency(primaryCurrency);
      setBooked(false);
      setConfirmationCode('');
      setNotes('');
      setDescription('');
      setSearchQuery('');
    }
  }, [initialActivity, targetDayId, trip, primaryCurrency, isOpen]);

  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      const results = await searchPlacesOnlineOrOffline(searchQuery);
      setSearchResults(results);
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const handleSelectHotspot = (spot: Hotspot) => {
    setLocationName(`${spot.name}, ${spot.city}`);
    setCoords({ lat: spot.lat, lng: spot.lng });
    if (!title) setTitle(spot.name);
    if (spot.category) setCategory(spot.category);
    if (!description && spot.description) setDescription(spot.description);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const activityData: Activity = {
      id: initialActivity?.id || `act-${Date.now()}`,
      dayId,
      title: title.trim(),
      description: description.trim() || undefined,
      location: {
        name: locationName.trim() || title.trim(),
        coords
      },
      category,
      startTime,
      durationMinutes: Number(durationMinutes) || 60,
      cost: Number(cost) || 0,
      currency,
      booked,
      confirmationCode: confirmationCode.trim() || undefined,
      notes: notes.trim() || undefined,
      order: initialActivity?.order || 99
    };

    onSave(activityData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialActivity ? 'Edit Activity / Place' : 'Add New Destination'}
      maxWidth="620px"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="form-group" style={{ position: 'relative' }}>
          <label className="form-label">Search Landmark or Destination</label>
          <div style={{ position: 'relative' }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }}
            />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: 36 }}
              placeholder="Search 100+ global hotspots or any city landmark..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {searchResults.length > 0 && (
            <div className="search-results-list">
              {searchResults.map((spot, idx) => (
                <div
                  key={`${spot.name}-${idx}`}
                  className="search-item"
                  onClick={() => handleSelectHotspot(spot)}
                >
                  <div>
                    <strong>{spot.name}</strong>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {spot.city}, {spot.country}
                    </div>
                  </div>
                  <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>{spot.category}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Activity Title *</label>
            <input
              type="text"
              className="form-input"
              required
              placeholder="e.g. Senso-ji Temple & Nakamise Dori"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Schedule To Day</label>
            <select
              className="form-select"
              value={dayId}
              onChange={(e) => setDayId(e.target.value)}
            >
              {trip.days.map((d) => (
                <option key={d.id} value={d.id}>
                  Day {d.dayNumber}: {d.title}
                </option>
              ))}
              <option value="bucket">✨ Ideas / Bucket List</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Location Address / Landmark</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Asakusa, Taito City, Tokyo"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Latitude</label>
            <input
              type="number"
              step="0.0001"
              className="form-input"
              value={coords.lat}
              onChange={(e) => setCoords({ ...coords, lat: parseFloat(e.target.value) || 0 })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Longitude</label>
            <input
              type="number"
              step="0.0001"
              className="form-input"
              value={coords.lng}
              onChange={(e) => setCoords({ ...coords, lng: parseFloat(e.target.value) || 0 })}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Category</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {CATEGORIES.map((c) => (
              <button
                type="button"
                key={c.value}
                onClick={() => setCategory(c.value)}
                className={`btn-secondary ${category === c.value ? 'active' : ''}`}
                style={{
                  justifyContent: 'flex-start',
                  borderColor: category === c.value ? 'var(--accent-primary)' : 'var(--border-subtle)',
                  background: category === c.value ? 'rgba(59, 130, 246, 0.15)' : 'var(--bg-secondary)',
                  color: category === c.value ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  fontSize: '0.75rem'
                }}
              >
                <span>{c.icon}</span>
                <span>{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Start Time</label>
            <input
              type="time"
              className="form-input"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Duration (Mins)</label>
            <input
              type="number"
              min="15"
              step="15"
              className="form-input"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 60)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Est. Cost</label>
            <input
              type="number"
              min="0"
              step="1"
              className="form-input"
              value={cost}
              onChange={(e) => setCost(parseFloat(e.target.value) || 0)}
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
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 12 }}>
          <div className="form-group" style={{ justifyContent: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.8125rem', marginTop: 16 }}>
              <input
                type="checkbox"
                checked={booked}
                onChange={(e) => setBooked(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: 'var(--accent-primary)' }}
              />
              <span style={{ fontWeight: 600 }}>Already Booked / Ticketed</span>
            </label>
          </div>

          <div className="form-group">
            <label className="form-label">Booking Confirmation Ref</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. RES-99823 or QR-PASS"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Description & Highlights</label>
          <textarea
            className="form-textarea"
            rows={2}
            placeholder="Brief overview of what to see or experience..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Travel Tips & Packing Reminder</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Dress code, early arrival advice, cash only..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="modal-footer" style={{ margin: '8px -24px -24px', padding: '16px 24px' }}>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            {initialActivity ? 'Update Destination' : 'Add to Itinerary'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
