import React from 'react';
import type { PatientHealthRecord } from '../../types/patient';
import { computeBiometricAggregateStats } from '../../services/telemetryService';
import { calculateASCVDRisk, calculateMetabolicRisk } from '../../services/clinicalRiskService';

interface PrintReportViewProps {
  record: PatientHealthRecord;
}

export const PrintReportView: React.FC<PrintReportViewProps> = ({ record }) => {
  const { patient, bloodPressure, heartRate, glucose, sleep, medications, medicationLogs } = record;
  const stats = computeBiometricAggregateStats(bloodPressure, heartRate, glucose, sleep, '30d');
  const ascvd = calculateASCVDRisk(patient.riskBaseline.ascvd);
  const metabolic = calculateMetabolicRisk(patient.riskBaseline.metabolic, patient.gender);

  const totalDoses = medicationLogs.length;
  const takenDoses = medicationLogs.filter((l) => l.status === 'taken').length;
  const adherencePct = totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 100;

  return (
    <div
      style={{
        background: 'var(--bg-card-solid)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-xl)',
        padding: '32px',
        maxWidth: 900,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        boxShadow: 'var(--shadow-lg)'
      }}
    >
      {/* Clinic & Medical Record Header */}
      <div
        style={{
          borderBottom: '2px solid var(--border-medium)',
          paddingBottom: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 16
        }}
      >
        <div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            VITALPULSE CLINICAL SUMMARY REPORT
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: 2 }}>
            Standardized 30-Day Biometric Telemetry &amp; Adherence Manifest
          </div>
        </div>

        <div style={{ textAlign: 'right', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <div>Generated: <strong>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong></div>
          <div>Physician: <strong>{patient.primaryPhysician.name}</strong></div>
          <div>Clinic: {patient.primaryPhysician.clinic}</div>
        </div>
      </div>

      {/* 1. Patient Demographics & Diagnoses */}
      <div>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#06b6d4', marginBottom: 10 }}>
          1. Patient Demographics &amp; Diagnoses
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10, background: 'var(--bg-secondary)', padding: 14, borderRadius: 'var(--radius-md)', fontSize: '0.8125rem' }}>
          <div>Name: <strong>{patient.fullName}</strong></div>
          <div>MRN: <strong>{patient.mrn}</strong></div>
          <div>DOB: <strong>{patient.dob} ({patient.age}y)</strong></div>
          <div>Gender: <strong>{patient.gender.toUpperCase()}</strong></div>
          <div>BMI: <strong>{patient.bmi} ({patient.heightCm}cm / {patient.weightKg}kg)</strong></div>
          <div>Blood Type: <strong>{patient.bloodType}</strong></div>
        </div>

        <div style={{ marginTop: 10, fontSize: '0.8125rem', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div>
            <strong>Active Diagnoses:</strong> {patient.diagnoses.map((d) => `${d.name} (${d.code})`).join(', ')}
          </div>
          <div>
            <strong>Known Allergies:</strong>{' '}
            {patient.allergies.length > 0
              ? patient.allergies.map((a) => `${a.allergen} [${a.severity}]`).join(', ')
              : 'No Known Drug Allergies (NKDA)'}
          </div>
        </div>
      </div>

      {/* 2. 30-Day Biometric Vitals Table */}
      <div>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#06b6d4', marginBottom: 10 }}>
          2. 30-Day Biometric Rolling Telemetry
        </h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)', textAlign: 'left', borderBottom: '1px solid var(--border-subtle)' }}>
              <th style={{ padding: '8px 12px' }}>Biometric Metric</th>
              <th style={{ padding: '8px 12px' }}>30-Day Mean</th>
              <th style={{ padding: '8px 12px' }}>Clinical Reference</th>
              <th style={{ padding: '8px 12px' }}>Status Assessment</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <td style={{ padding: '8px 12px', fontWeight: 700 }}>Blood Pressure (Mean)</td>
              <td style={{ padding: '8px 12px' }}>{stats.meanSystolic} / {stats.meanDiastolic} mmHg</td>
              <td style={{ padding: '8px 12px', color: 'var(--text-muted)' }}>Target: &lt;120 / &lt;80 mmHg</td>
              <td style={{ padding: '8px 12px', color: stats.meanSystolic < 130 ? '#10b981' : '#f43f5e', fontWeight: 700 }}>
                {stats.meanSystolic < 130 ? 'Controlled' : 'Stage 1 HTN'}
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <td style={{ padding: '8px 12px', fontWeight: 700 }}>Mean Arterial Pressure (MAP)</td>
              <td style={{ padding: '8px 12px' }}>{stats.meanArterialPressure} mmHg</td>
              <td style={{ padding: '8px 12px', color: 'var(--text-muted)' }}>Normal: 70 - 100 mmHg</td>
              <td style={{ padding: '8px 12px', color: '#10b981', fontWeight: 700 }}>Normal</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <td style={{ padding: '8px 12px', fontWeight: 700 }}>Resting Heart Rate</td>
              <td style={{ padding: '8px 12px' }}>{stats.meanHeartRate} bpm</td>
              <td style={{ padding: '8px 12px', color: 'var(--text-muted)' }}>Normal: 60 - 100 bpm</td>
              <td style={{ padding: '8px 12px', color: '#10b981', fontWeight: 700 }}>Optimal</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <td style={{ padding: '8px 12px', fontWeight: 700 }}>Fasting Blood Glucose</td>
              <td style={{ padding: '8px 12px' }}>{stats.meanGlucose} mg/dL</td>
              <td style={{ padding: '8px 12px', color: 'var(--text-muted)' }}>Target: 70 - 99 mg/dL</td>
              <td style={{ padding: '8px 12px', color: stats.meanGlucose <= 100 ? '#10b981' : '#f59e0b', fontWeight: 700 }}>
                {stats.meanGlucose <= 100 ? 'Normal' : 'Pre-Diabetic'}
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <td style={{ padding: '8px 12px', fontWeight: 700 }}>Time in Range (70-140 mg/dL)</td>
              <td style={{ padding: '8px 12px' }}>{stats.glucoseInRangePercentage}%</td>
              <td style={{ padding: '8px 12px', color: 'var(--text-muted)' }}>Target: &ge;70% TIR</td>
              <td style={{ padding: '8px 12px', color: '#10b981', fontWeight: 700 }}>Optimal</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 12px', fontWeight: 700 }}>Sleep Quality &amp; Duration</td>
              <td style={{ padding: '8px 12px' }}>{stats.meanSleepHours}h / {stats.meanSleepScore}/100</td>
              <td style={{ padding: '8px 12px', color: 'var(--text-muted)' }}>Target: 7.0 - 9.0 hrs</td>
              <td style={{ padding: '8px 12px', color: '#10b981', fontWeight: 700 }}>Adequate</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 3. Active Medications Table */}
      <div>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#06b6d4', marginBottom: 10 }}>
          3. Active Medications &amp; Adherence Records
        </h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)', textAlign: 'left', borderBottom: '1px solid var(--border-subtle)' }}>
              <th style={{ padding: '8px 12px' }}>Medication</th>
              <th style={{ padding: '8px 12px' }}>Dosage</th>
              <th style={{ padding: '8px 12px' }}>Schedule</th>
              <th style={{ padding: '8px 12px' }}>Indication</th>
              <th style={{ padding: '8px 12px' }}>Adherence</th>
            </tr>
          </thead>
          <tbody>
            {medications.map((med) => {
              const medLogs = medicationLogs.filter((l) => l.medicationId === med.id);
              const taken = medLogs.filter((l) => l.status === 'taken').length;
              const rate = medLogs.length > 0 ? Math.round((taken / medLogs.length) * 100) : 100;
              return (
                <tr key={med.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '8px 12px', fontWeight: 700 }}>{med.name}</td>
                  <td style={{ padding: '8px 12px' }}>{med.dosage}</td>
                  <td style={{ padding: '8px 12px' }}>{med.scheduledTime}</td>
                  <td style={{ padding: '8px 12px', color: 'var(--text-muted)' }}>{med.indication}</td>
                  <td style={{ padding: '8px 12px', color: rate >= 90 ? '#10b981' : '#f59e0b', fontWeight: 700 }}>
                    {rate}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 4. Risk Stratification */}
      <div style={{ background: 'var(--bg-secondary)', padding: 16, borderRadius: 'var(--radius-lg)', fontSize: '0.8125rem', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          4. Cardiovascular &amp; Metabolic Risk Stratification
        </h4>
        <div>
          • <strong>10-Year ASCVD Risk:</strong> {ascvd.tenYearRiskPercentage}% [{ascvd.riskTier.toUpperCase()} RISK TIER] (Optimal Peer Benchmark: {ascvd.optimalRiskPercentage}%)
        </div>
        <div>
          • <strong>Metabolic Syndrome:</strong> {metabolic.metabolicSyndromeCriteriaMet}/5 criteria met [{metabolic.hasMetabolicSyndrome ? 'POSITIVE' : 'NEGATIVE'}]
        </div>
        <div>
          • <strong>Overall Medication Adherence:</strong> {adherencePct}% across {totalDoses} doses logged
        </div>
      </div>

      {/* Attestation Box */}
      <div
        style={{
          border: '1px dashed var(--border-medium)',
          borderRadius: 'var(--radius-md)',
          padding: 16,
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          display: 'flex',
          flexDirection: 'column',
          gap: 12
        }}
      >
        <div>
          <strong>Clinical Attestation:</strong> Continuous home telemetry and medication adherence logs verified for patient {patient.fullName} (MRN: {patient.mrn}).
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <span>Attending Physician Signature: ____________________________</span>
          <span>Date: ______________</span>
        </div>
      </div>
    </div>
  );
};
