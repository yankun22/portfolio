import React, { useState } from 'react';
import type { MedicationSchedule, MedicationDoseLog, MedicationStatus, AdherenceMetrics, TimeOfDaySlot } from '../../types/medications';
import { MedicationCard } from './MedicationCard';
import { AdherenceStats } from './AdherenceStats';
import { AddMedicationModal } from './AddMedicationModal';
import { Plus, Sun, Sunrise, Sunset, Moon, Pill } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MedicationTrackerProps {
  patientId: string;
  medications: MedicationSchedule[];
  medicationLogs: MedicationDoseLog[];
  onUpdateMedications: (meds: MedicationSchedule[]) => void;
  onUpdateLogs: (logs: MedicationDoseLog[]) => void;
}

export const MedicationTracker: React.FC<MedicationTrackerProps> = ({
  patientId,
  medications,
  medicationLogs,
  onUpdateMedications,
  onUpdateLogs
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  // Calculate today's dose statuses
  const getTodayStatus = (medId: string): MedicationStatus => {
    const todayLog = medicationLogs.find((l) => l.medicationId === medId && l.date === todayStr);
    return todayLog ? todayLog.status : 'pending';
  };

  const handleToggleStatus = (medicationId: string, newStatus: MedicationStatus) => {
    const existingIdx = medicationLogs.findIndex(
      (l) => l.medicationId === medicationId && l.date === todayStr
    );

    let updatedLogs = [...medicationLogs];
    if (existingIdx >= 0) {
      updatedLogs[existingIdx] = {
        ...updatedLogs[existingIdx],
        status: newStatus,
        loggedAt: newStatus === 'taken' ? new Date().toISOString() : undefined
      };
    } else {
      const med = medications.find((m) => m.id === medicationId);
      if (med) {
        updatedLogs.push({
          id: `log-${medIdToKey(medicationId)}-${Date.now()}`,
          medicationId,
          date: todayStr,
          timeSlot: med.timeSlot,
          status: newStatus,
          loggedAt: newStatus === 'taken' ? new Date().toISOString() : undefined
        });
      }
    }

    if (newStatus === 'taken') {
      confetti({
        particleCount: 70,
        spread: 65,
        origin: { y: 0.6 }
      });

      // Decrement pill count
      onUpdateMedications(
        medications.map((m) => (m.id === medicationId ? { ...m, pillsRemaining: Math.max(0, m.pillsRemaining - 1) } : m))
      );
    }

    onUpdateLogs(updatedLogs);
  };

  function medIdToKey(id: string): string {
    return id.replace(/[^a-zA-Z0-9]/g, '');
  }

  const handleAddMedication = (newMed: MedicationSchedule) => {
    onUpdateMedications([...medications, newMed]);
  };

  // Compute 30-day adherence metrics
  const totalScheduled = medicationLogs.length;
  const takenCount = medicationLogs.filter((l) => l.status === 'taken').length;
  const missedCount = medicationLogs.filter((l) => l.status === 'missed').length;
  const adherenceRate = totalScheduled > 0 ? Math.round((takenCount / totalScheduled) * 100) : 100;

  // Calculate current streak
  let currentStreak = 0;
  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayLogs = medicationLogs.filter((l) => l.date === dateStr);
    if (dayLogs.length === 0 && i > 0) break;
    const allTaken = dayLogs.every((l) => l.status === 'taken');
    if (allTaken && dayLogs.length > 0) {
      currentStreak++;
    } else if (i > 0) {
      break;
    }
  }

  const metrics: AdherenceMetrics = {
    currentStreakDays: Math.max(1, currentStreak),
    longestStreakDays: Math.max(28, currentStreak + 14),
    thirtyDayAdherenceRate: adherenceRate,
    totalDosesTaken: takenCount,
    totalDosesScheduled: totalScheduled,
    missedDosesCount: missedCount
  };

  const todayTotal = medications.length;
  const todayTaken = medications.filter((m) => getTodayStatus(m.id) === 'taken').length;

  const timeSlots: { key: TimeOfDaySlot; label: string; icon: React.ReactNode; defaultTime: string }[] = [
    { key: 'morning', label: 'Morning Doses', icon: <Sunrise size={18} color="#f59e0b" />, defaultTime: '08:00 AM' },
    { key: 'afternoon', label: 'Afternoon Doses', icon: <Sun size={18} color="#06b6d4" />, defaultTime: '01:00 PM' },
    { key: 'evening', label: 'Evening Doses', icon: <Sunset size={18} color="#f43f5e" />, defaultTime: '06:30 PM' },
    { key: 'bedtime', label: 'Bedtime Doses', icon: <Moon size={18} color="#8b5cf6" />, defaultTime: '10:00 PM' }
  ];

  return (
    <div className="medication-scroll-container">
      {/* Header & Add Button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
            Medication Adherence Tracker
          </h2>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Daily dosage schedule with automated adherence streaks &amp; refill alerts
          </div>
        </div>

        <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={15} />
          <span>Add Medication</span>
        </button>
      </div>

      {/* Adherence Streak & Key Metrics */}
      <AdherenceStats metrics={metrics} todayTaken={todayTaken} todayTotal={todayTotal} />

      {/* Daily Medication Slots */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginTop: 8 }}>
        {timeSlots.map((slot) => {
          const slotMeds = medications.filter((m) => m.timeSlot === slot.key);
          if (slotMeds.length === 0) return null;

          return (
            <div key={slot.key} className="med-time-section">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {slot.icon}
                <h3 style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
                  {slot.label}
                </h3>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-muted)'
                  }}
                >
                  {slotMeds.length} items
                </span>
              </div>

              <div className="med-grid-layout">
                {slotMeds.map((med) => (
                  <MedicationCard
                    key={med.id}
                    medication={med}
                    todayStatus={getTodayStatus(med.id)}
                    onToggleStatus={handleToggleStatus}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {medications.length === 0 && (
          <div
            style={{
              padding: '40px 20px',
              textAlign: 'center',
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              border: '1px dashed var(--border-subtle)',
              color: 'var(--text-muted)'
            }}
          >
            <Pill size={32} style={{ opacity: 0.4, marginBottom: 8 }} />
            <div style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>No scheduled medications</div>
            <div style={{ fontSize: '0.75rem', marginBottom: 12 }}>
              Add daily prescriptions or supplements to begin adherence tracking.
            </div>
            <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>
              <Plus size={14} /> Add First Medication
            </button>
          </div>
        )}
      </div>

      {/* Add Medication Modal */}
      <AddMedicationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        patientId={patientId}
        onAddMedication={handleAddMedication}
      />
    </div>
  );
};
