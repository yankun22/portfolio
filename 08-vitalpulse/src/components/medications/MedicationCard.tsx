import React from 'react';
import type { MedicationSchedule, MedicationStatus } from '../../types/medications';
import { Check, X, Clock, AlertTriangle, Pill } from 'lucide-react';

interface MedicationCardProps {
  medication: MedicationSchedule;
  todayStatus: MedicationStatus;
  onToggleStatus: (medicationId: string, newStatus: MedicationStatus) => void;
}

export const MedicationCard: React.FC<MedicationCardProps> = ({
  medication,
  todayStatus,
  onToggleStatus
}) => {
  const isTaken = todayStatus === 'taken';
  const isSkipped = todayStatus === 'skipped';
  const isLowSupply = medication.pillsRemaining <= medication.refillThresholdDays * 2;

  return (
    <div className={`med-card ${isTaken ? 'is-taken' : isSkipped ? 'is-skipped' : ''}`}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, minWidth: 0, flex: 1 }}>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 'var(--radius-lg)',
            background: `${medication.color}18`,
            border: `1.5px solid ${medication.color}40`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: medication.color,
            flexShrink: 0
          }}
        >
          <Pill size={20} />
        </div>

        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <h4
              style={{
                fontSize: '0.9375rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                textDecoration: isTaken ? 'line-through' : 'none',
                opacity: isTaken ? 0.7 : 1
              }}
            >
              {medication.name}
            </h4>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-secondary)'
              }}
            >
              {medication.dosage}
            </span>
          </div>

          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
            {medication.instructions}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8, fontSize: '0.72rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)' }}>
              <Clock size={12} /> {medication.scheduledTime}
            </span>

            {isLowSupply && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  color: '#f59e0b',
                  fontWeight: 700
                }}
              >
                <AlertTriangle size={12} /> {medication.pillsRemaining} doses left (Refill needed)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        {isTaken ? (
          <button
            className="btn-secondary"
            style={{
              padding: '6px 12px',
              fontSize: '0.75rem',
              color: '#10b981',
              borderColor: 'rgba(16, 185, 129, 0.3)',
              background: 'rgba(16, 185, 129, 0.1)'
            }}
            onClick={() => onToggleStatus(medication.id, 'pending')}
            title="Mark as pending / undo"
          >
            <Check size={14} /> Taken
          </button>
        ) : isSkipped ? (
          <button
            className="btn-secondary"
            style={{
              padding: '6px 12px',
              fontSize: '0.75rem',
              color: '#f43f5e',
              borderColor: 'rgba(244, 63, 94, 0.3)',
              background: 'rgba(244, 63, 94, 0.1)'
            }}
            onClick={() => onToggleStatus(medication.id, 'pending')}
            title="Undo skipped status"
          >
            <X size={14} /> Skipped
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              className="btn-primary"
              style={{ padding: '6px 12px', fontSize: '0.75rem' }}
              onClick={() => onToggleStatus(medication.id, 'taken')}
              title="Mark dose as taken"
            >
              <Check size={14} /> Take
            </button>
            <button
              className="btn-icon"
              style={{ width: 32, height: 32 }}
              onClick={() => onToggleStatus(medication.id, 'skipped')}
              title="Skip this dose"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
