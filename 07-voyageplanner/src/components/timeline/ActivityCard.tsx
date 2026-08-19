import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Trash2,
  Navigation
} from 'lucide-react';
import type { Activity } from '../../types/itinerary';
import { formatMoney, convertCurrency } from '../../data/currencies';

interface ActivityCardProps {
  activity: Activity;
  index: number;
  onEdit: (activity: Activity) => void;
  onDelete: (activityId: string) => void;
  onFocusMap?: (coords: { lat: number; lng: number }) => void;
  primaryCurrency: string;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  index,
  onEdit,
  onDelete,
  onFocusMap,
  primaryCurrency
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: activity.id,
    data: {
      activity,
      dayId: activity.dayId
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`activity-card ${isDragging ? 'is-dragging' : ''}`}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <div
          {...attributes}
          {...listeners}
          style={{ cursor: 'grab', color: 'var(--text-muted)', padding: '2px 0' }}
          title="Drag to rearrange or move across days"
        >
          <GripVertical size={16} />
        </div>
        <div className="activity-card-order-marker">{index + 1}</div>
      </div>

      <div className="activity-card-body">
        <div className="activity-card-top">
          <div className="activity-card-title">
            <span>{activity.title}</span>
            <span className={`activity-category-badge cat-${activity.category}`}>
              {activity.category}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {activity.location?.coords && onFocusMap && (
              <button
                className="btn-icon"
                style={{ width: 28, height: 28 }}
                onClick={() => onFocusMap(activity.location.coords)}
                title="Focus on map"
              >
                <Navigation size={12} />
              </button>
            )}
            <button
              className="btn-icon"
              style={{ width: 28, height: 28 }}
              onClick={() => onEdit(activity)}
              title="Edit activity"
            >
              <Edit2 size={12} />
            </button>
            <button
              className="btn-icon"
              style={{ width: 28, height: 28 }}
              onClick={() => onDelete(activity.id)}
              title="Delete activity"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div className="activity-card-location">
            <MapPin size={13} color="var(--accent-primary)" />
            <span>{activity.location?.name || 'Custom destination'}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            <Clock size={12} />
            <span>
              {activity.startTime} ({activity.durationMinutes} min)
            </span>
          </div>
        </div>

        {activity.description && (
          <p className="activity-card-desc">{activity.description}</p>
        )}

        {activity.notes && (
          <div
            style={{
              fontSize: '0.75rem',
              color: 'var(--accent-amber)',
              background: 'rgba(245, 158, 11, 0.08)',
              padding: '4px 8px',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            💡 {activity.notes}
          </div>
        )}

        <div className="activity-card-meta-bottom">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              className={`activity-booking-tag ${
                activity.booked ? 'booking-confirmed' : 'booking-pending'
              }`}
            >
              {activity.booked ? (
                <>
                  <CheckCircle2 size={11} /> Booked
                </>
              ) : (
                <>
                  <AlertCircle size={11} /> Needs Booking
                </>
              )}
            </span>

            {activity.confirmationCode && (
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  color: 'var(--text-muted)'
                }}
              >
                Ref: {activity.confirmationCode}
              </span>
            )}
          </div>

          <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.8125rem', flexShrink: 0 }}>
            {activity.cost > 0
              ? (() => {
                  const storedCurrency = activity.currency || 'USD';
                  const displayAmount = storedCurrency === primaryCurrency
                    ? activity.cost
                    : convertCurrency(activity.cost, storedCurrency, primaryCurrency);
                  return formatMoney(displayAmount, primaryCurrency);
                })()
              : 'Free'}
          </div>
        </div>
      </div>
    </div>
  );
};
