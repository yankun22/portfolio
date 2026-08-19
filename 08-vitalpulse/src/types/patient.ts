import type { BloodPressureReading, HeartRateReading, GlucoseReading, SleepRecord } from './biometrics';
import type { MedicationSchedule, MedicationDoseLog } from './medications';
import type { MealEntry } from './nutrition';
import type { ASCVDRiskInputs, MetabolicRiskInputs } from './clinicalRisk';

export interface PatientProfile {
  id: string;
  mrn: string; // Medical Record Number (e.g. "VP-84920")
  fullName: string;
  preferredName?: string;
  age: number;
  dob: string;
  gender: 'male' | 'female';
  bloodType: string;
  avatarColor: string;
  avatarEmoji: string;
  heightCm: number;
  weightKg: number;
  bmi: number;
  primaryPhysician: {
    name: string;
    specialty: string;
    clinic: string;
    phone: string;
  };
  diagnoses: {
    code: string; // ICD-10 e.g. "I10", "E11.9"
    name: string;
    diagnosedDate: string;
    status: 'active' | 'managed' | 'resolved';
  }[];
  allergies: {
    allergen: string;
    severity: 'Mild' | 'Moderate' | 'Severe (Anaphylaxis)';
    reaction: string;
  }[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  riskBaseline: {
    ascvd: ASCVDRiskInputs;
    metabolic: MetabolicRiskInputs;
  };
}

export interface PatientHealthRecord {
  patient: PatientProfile;
  bloodPressure: BloodPressureReading[];
  heartRate: HeartRateReading[];
  glucose: GlucoseReading[];
  sleep: SleepRecord[];
  medications: MedicationSchedule[];
  medicationLogs: MedicationDoseLog[];
  meals: MealEntry[];
  waterLogs: { date: string; amountMl: number }[];
}

export interface AppStateSnapshot {
  activePatientId: string;
  patients: PatientProfile[];
  records: Record<string, PatientHealthRecord>;
}
