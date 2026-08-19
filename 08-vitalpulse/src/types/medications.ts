export type TimeOfDaySlot = 'morning' | 'afternoon' | 'evening' | 'bedtime';

export type MedicationStatus = 'taken' | 'skipped' | 'pending' | 'missed';

export interface MedicationSchedule {
  id: string;
  patientId: string;
  name: string;
  brandName?: string;
  dosage: string; // e.g. "10mg", "500mg"
  form: 'tablet' | 'capsule' | 'injection' | 'liquid' | 'inhaler';
  timeSlot: TimeOfDaySlot;
  scheduledTime: string; // e.g. "08:00 AM"
  instructions: string; // e.g. "Take with food", "Before breakfast"
  color: string; // Hex color for pill badge
  indication: string; // e.g. "Hypertension", "Type 2 Diabetes", "Cholesterol"
  pillsRemaining: number;
  totalRefillPills: number;
  refillThresholdDays: number;
  prescribingDoctor?: string;
  startDate: string;
}

export interface MedicationDoseLog {
  id: string;
  medicationId: string;
  date: string; // YYYY-MM-DD
  timeSlot: TimeOfDaySlot;
  status: MedicationStatus;
  loggedAt?: string; // Timestamp when taken
  skipReason?: string;
}

export interface AdherenceMetrics {
  currentStreakDays: number;
  longestStreakDays: number;
  thirtyDayAdherenceRate: number; // 0 - 100%
  totalDosesTaken: number;
  totalDosesScheduled: number;
  missedDosesCount: number;
}
