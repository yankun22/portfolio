import { useState, useEffect } from 'react';
import type { AppStateSnapshot, PatientHealthRecord } from './types/patient';
import type { BloodPressureReading, HeartRateReading, GlucoseReading, SleepRecord } from './types/biometrics';
import type { MedicationSchedule, MedicationDoseLog } from './types/medications';
import type { MealEntry } from './types/nutrition';
import type { ASCVDRiskInputs, MetabolicRiskInputs } from './types/clinicalRisk';
import {
  loadInitialAppState,
  saveActivePatientId,
  saveRecordsToStorage,
  savePatientsToStorage
} from './services/storageService';
import { exportClinicalReportPDF } from './services/clinicalPdfService';
import { Header, type ActiveTab } from './components/common/Header';
import { BiometricDashboard } from './components/biometrics/BiometricDashboard';
import { MedicationTracker } from './components/medications/MedicationTracker';
import { NutritionView } from './components/nutrition/NutritionView';
import { ClinicalRiskView } from './components/riskCalculator/ClinicalRiskView';
import { DoctorSummaryView } from './components/export/DoctorSummaryView';
import { LogVitalModal } from './components/biometrics/LogVitalModal';
import { EHRBackupModal } from './components/export/EHRBackupModal';

export function App() {
  const [appState, setAppState] = useState<AppStateSnapshot>(() => loadInitialAppState());
  const [activeTab, setActiveTab] = useState<ActiveTab>('telemetry');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLogVitalOpen, setIsLogVitalOpen] = useState(false);
  const [isEHROpen, setIsEHROpen] = useState(false);

  // Sync dark mode theme attribute to root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Persist state changes
  useEffect(() => {
    saveActivePatientId(appState.activePatientId);
    savePatientsToStorage(appState.patients);
    saveRecordsToStorage(appState.records);
  }, [appState]);

  const activePatient =
    appState.patients.find((p) => p.id === appState.activePatientId) || appState.patients[0];
  const activeRecord: PatientHealthRecord =
    appState.records[activePatient.id] || {
      patient: activePatient,
      bloodPressure: [],
      heartRate: [],
      glucose: [],
      sleep: [],
      medications: [],
      medicationLogs: [],
      meals: [],
      waterLogs: []
    };

  const handleSelectPatient = (patientId: string) => {
    setAppState((prev) => ({
      ...prev,
      activePatientId: patientId
    }));
  };

  const updateActiveRecord = (updater: (prev: PatientHealthRecord) => PatientHealthRecord) => {
    setAppState((prev) => {
      const current = prev.records[activePatient.id] || activeRecord;
      const updated = updater(current);
      return {
        ...prev,
        records: {
          ...prev.records,
          [activePatient.id]: updated
        }
      };
    });
  };

  // Vitals Logging Handlers
  const handleLogBloodPressure = (reading: BloodPressureReading) => {
    updateActiveRecord((rec) => ({
      ...rec,
      bloodPressure: [...rec.bloodPressure, reading]
    }));
  };

  const handleLogHeartRate = (reading: HeartRateReading) => {
    updateActiveRecord((rec) => ({
      ...rec,
      heartRate: [...rec.heartRate, reading]
    }));
  };

  const handleLogGlucose = (reading: GlucoseReading) => {
    updateActiveRecord((rec) => ({
      ...rec,
      glucose: [...rec.glucose, reading]
    }));
  };

  const handleLogSleep = (record: SleepRecord) => {
    updateActiveRecord((rec) => ({
      ...rec,
      sleep: [...rec.sleep, record]
    }));
  };

  // Medications Handlers
  const handleUpdateMedications = (meds: MedicationSchedule[]) => {
    updateActiveRecord((rec) => ({
      ...rec,
      medications: meds
    }));
  };

  const handleUpdateMedLogs = (logs: MedicationDoseLog[]) => {
    updateActiveRecord((rec) => ({
      ...rec,
      medicationLogs: logs
    }));
  };

  // Nutrition Handlers
  const handleUpdateMeals = (meals: MealEntry[]) => {
    updateActiveRecord((rec) => ({
      ...rec,
      meals
    }));
  };

  const handleUpdateWater = (amountMl: number) => {
    const todayStr = new Date().toISOString().split('T')[0];
    updateActiveRecord((rec) => {
      const existing = rec.waterLogs.filter((w) => w.date !== todayStr);
      return {
        ...rec,
        waterLogs: [...existing, { date: todayStr, amountMl }]
      };
    });
  };

  // Clinical Risk Baseline Handler
  const handleUpdateRiskBaseline = (ascvd: ASCVDRiskInputs, metabolic: MetabolicRiskInputs) => {
    setAppState((prev) => {
      const updatedPatients = prev.patients.map((p) =>
        p.id === activePatient.id
          ? {
              ...p,
              riskBaseline: { ascvd, metabolic }
            }
          : p
      );

      const currentRec = prev.records[activePatient.id] || activeRecord;
      const updatedRec: PatientHealthRecord = {
        ...currentRec,
        patient: {
          ...currentRec.patient,
          riskBaseline: { ascvd, metabolic }
        }
      };

      return {
        ...prev,
        patients: updatedPatients,
        records: {
          ...prev.records,
          [activePatient.id]: updatedRec
        }
      };
    });
  };

  // Import EHR Record
  const handleImportRecord = (importedRecord: PatientHealthRecord) => {
    setAppState((prev) => ({
      ...prev,
      records: {
        ...prev.records,
        [importedRecord.patient.id]: importedRecord
      }
    }));
  };

  // Current water for today
  const todayStr = new Date().toISOString().split('T')[0];
  const todayWaterLog = activeRecord.waterLogs.find((w) => w.date === todayStr);
  const currentWaterMl = todayWaterLog ? todayWaterLog.amountMl : 1500;

  return (
    <div className="app-container">
      <Header
        patients={appState.patients}
        activePatient={activePatient}
        onSelectPatient={handleSelectPatient}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
        onOpenLogVitalModal={() => setIsLogVitalOpen(true)}
        onOpenEHRModal={() => setIsEHROpen(true)}
        onExportPDF={() => exportClinicalReportPDF(activeRecord)}
      />

      <main className="main-content">
        {activeTab === 'telemetry' && <BiometricDashboard record={activeRecord} />}
        {activeTab === 'medications' && (
          <MedicationTracker
            patientId={activePatient.id}
            medications={activeRecord.medications}
            medicationLogs={activeRecord.medicationLogs}
            onUpdateMedications={handleUpdateMedications}
            onUpdateLogs={handleUpdateMedLogs}
          />
        )}
        {activeTab === 'nutrition' && (
          <NutritionView
            patientId={activePatient.id}
            meals={activeRecord.meals}
            waterAmountMl={currentWaterMl}
            onUpdateMeals={handleUpdateMeals}
            onUpdateWater={handleUpdateWater}
          />
        )}
        {activeTab === 'risk' && (
          <ClinicalRiskView
            patient={activePatient}
            onUpdateBaselineRisk={handleUpdateRiskBaseline}
          />
        )}
        {activeTab === 'summary' && <DoctorSummaryView record={activeRecord} />}
      </main>

      {/* Quick Log Vital Modal */}
      <LogVitalModal
        isOpen={isLogVitalOpen}
        onClose={() => setIsLogVitalOpen(false)}
        onLogBloodPressure={handleLogBloodPressure}
        onLogHeartRate={handleLogHeartRate}
        onLogGlucose={handleLogGlucose}
        onLogSleep={handleLogSleep}
      />

      {/* EHR Data Backup & Restore Modal */}
      <EHRBackupModal
        isOpen={isEHROpen}
        onClose={() => setIsEHROpen(false)}
        patientId={activePatient.id}
        appState={appState}
        onImportRecord={handleImportRecord}
      />
    </div>
  );
}

export default App;
