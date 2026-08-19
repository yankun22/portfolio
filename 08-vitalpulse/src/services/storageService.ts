import type { AppStateSnapshot, PatientHealthRecord, PatientProfile } from '../types/patient';
import { INITIAL_PATIENTS, INITIAL_HEALTH_RECORDS } from '../data/samplePatients';

const STORAGE_KEYS = {
  ACTIVE_PATIENT_ID: 'vitalpulse_active_patient_id',
  PATIENTS: 'vitalpulse_patients',
  RECORDS: 'vitalpulse_health_records'
};

export function loadInitialAppState(): AppStateSnapshot {
  try {
    const storedPatients = localStorage.getItem(STORAGE_KEYS.PATIENTS);
    const storedActiveId = localStorage.getItem(STORAGE_KEYS.ACTIVE_PATIENT_ID);
    const storedRecords = localStorage.getItem(STORAGE_KEYS.RECORDS);

    if (storedPatients && storedRecords) {
      const parsedPatients: PatientProfile[] = JSON.parse(storedPatients);
      const parsedRecords: Record<string, PatientHealthRecord> = JSON.parse(storedRecords);
      const activeId = storedActiveId && parsedPatients.some(p => p.id === storedActiveId)
        ? storedActiveId
        : parsedPatients[0]?.id || INITIAL_PATIENTS[0].id;

      return {
        activePatientId: activeId,
        patients: parsedPatients,
        records: parsedRecords
      };
    }
  } catch {
    // Fall back to seed data if localStorage is empty or corrupted
  }

  return {
    activePatientId: INITIAL_PATIENTS[0].id,
    patients: INITIAL_PATIENTS,
    records: INITIAL_HEALTH_RECORDS
  };
}

export function savePatientsToStorage(patients: PatientProfile[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
  } catch {}
}

export function saveActivePatientId(id: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PATIENT_ID, id);
  } catch {}
}

export function saveRecordsToStorage(records: Record<string, PatientHealthRecord>): void {
  try {
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
  } catch {}
}

export function exportPatientEHRJson(patientId: string, state: AppStateSnapshot): string {
  const patient = state.patients.find(p => p.id === patientId);
  const record = state.records[patientId];

  const bundle = {
    exportDate: new Date().toISOString(),
    system: 'VitalPulse Clinical Analytics Studio v1.0',
    fhirStandardVersion: 'R4-Compatible Export',
    patient,
    record
  };

  return JSON.stringify(bundle, null, 2);
}

export function downloadJsonFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
