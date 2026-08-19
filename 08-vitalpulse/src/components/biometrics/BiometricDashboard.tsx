import React, { useState } from 'react';
import type { PatientHealthRecord } from '../../types/patient';
import type { TimeframeOption } from '../../types/biometrics';
import { filterByTimeframe, computeBiometricAggregateStats } from '../../services/telemetryService';
import { StatCard } from '../common/StatCard';
import { BloodPressureChart } from './BloodPressureChart';
import { HeartRateChart } from './HeartRateChart';
import { GlucoseChart } from './GlucoseChart';
import { SleepHypnogram } from './SleepHypnogram';
import { Activity, Heart, Droplets, Moon, AlertCircle } from 'lucide-react';

interface BiometricDashboardProps {
  record: PatientHealthRecord;
}

export const BiometricDashboard: React.FC<BiometricDashboardProps> = ({ record }) => {
  const [timeframe, setTimeframe] = useState<TimeframeOption>('30d');

  const { patient, bloodPressure, heartRate, glucose, sleep } = record;

  const filteredBp = filterByTimeframe(bloodPressure, timeframe);
  const filteredHr = filterByTimeframe(heartRate, timeframe);
  const filteredGluc = filterByTimeframe(glucose, timeframe);
  const filteredSleep = filterByTimeframe(sleep, timeframe);

  const stats = computeBiometricAggregateStats(bloodPressure, heartRate, glucose, sleep, timeframe);

  const latestBp = bloodPressure[bloodPressure.length - 1];

  return (
    <div className="dashboard-scroll-container">
      {/* Patient Demographic Bar */}
      <div className="patient-banner-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            className="patient-avatar-badge"
            style={{ background: `${patient.avatarColor}20`, border: `2px solid ${patient.avatarColor}` }}
          >
            {patient.avatarEmoji}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                {patient.fullName}
              </h2>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-secondary)'
                }}
              >
                MRN: {patient.mrn}
              </span>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(6, 182, 212, 0.15)',
                  color: '#06b6d4'
                }}
              >
                {patient.age}y / {patient.gender.toUpperCase()}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
              <div className="patient-metric-chip">
                <span>Height: <strong>{patient.heightCm} cm</strong></span>
              </div>
              <div className="patient-metric-chip">
                <span>Weight: <strong>{patient.weightKg} kg</strong></span>
              </div>
              <div className="patient-metric-chip">
                <span>BMI: <strong>{patient.bmi}</strong></span>
              </div>
              <div className="patient-metric-chip">
                <span>Blood: <strong>{patient.bloodType}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Timeframe Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            WINDOW:
          </span>
          <div className="timeframe-pill-bar">
            {(['7d', '14d', '30d', '90d'] as TimeframeOption[]).map((tf) => (
              <button
                key={tf}
                className={`timeframe-btn ${timeframe === tf ? 'active' : ''}`}
                onClick={() => setTimeframe(tf)}
              >
                {tf.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Aggregate Stat Cards */}
      <div className="stats-overview-grid">
        <StatCard
          label="Blood Pressure (Mean)"
          value={`${stats.meanSystolic}/${stats.meanDiastolic}`}
          unit="mmHg"
          subValue={`MAP: ${stats.meanArterialPressure} mmHg`}
          delta={stats.systolicDelta}
          deltaLabel="Sys mmHg"
          icon={<Activity size={18} />}
          accentColor="#f43f5e"
          badge={{
            text: stats.meanSystolic < 130 ? 'Controlled' : 'Stage 1 HTN',
            bg: stats.meanSystolic < 130 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
            color: stats.meanSystolic < 130 ? '#10b981' : '#f43f5e'
          }}
        />

        <StatCard
          label="Resting Heart Rate"
          value={stats.meanHeartRate}
          unit="bpm"
          subValue="Optimal Range (60-80)"
          icon={<Heart size={18} />}
          accentColor="#fb7185"
          badge={{
            text: stats.meanHeartRate <= 75 ? 'Optimal' : 'Resting',
            bg: 'rgba(16, 185, 129, 0.15)',
            color: '#10b981'
          }}
        />

        <StatCard
          label="Fasting Glucose (Avg)"
          value={stats.meanGlucose}
          unit="mg/dL"
          subValue={`${stats.glucoseInRangePercentage}% Time in Range (70-140)`}
          icon={<Droplets size={18} />}
          accentColor="#06b6d4"
          badge={{
            text: stats.meanGlucose <= 100 ? 'Normal' : 'Pre-Diabetic',
            bg: stats.meanGlucose <= 100 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
            color: stats.meanGlucose <= 100 ? '#10b981' : '#f59e0b'
          }}
        />

        <StatCard
          label="Sleep Quality & Duration"
          value={`${stats.meanSleepHours}h`}
          unit="avg/night"
          subValue={`Sleep Score: ${stats.meanSleepScore} / 100`}
          icon={<Moon size={18} />}
          accentColor="#8b5cf6"
          badge={{
            text: stats.meanSleepScore >= 80 ? 'Optimal' : 'Adequate',
            bg: 'rgba(139, 92, 246, 0.15)',
            color: '#8b5cf6'
          }}
        />
      </div>

      {/* Primary Biometric Charts Grid */}
      <div className="charts-dual-grid">
        {/* 1. Blood Pressure Chart */}
        <div className="chart-card-container">
          <div className="chart-header-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f43f5e' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                Blood Pressure Telemetry
              </h3>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                ({filteredBp.length} readings)
              </span>
            </div>

            {latestBp && (
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Latest: <strong>{latestBp.systolic}/{latestBp.diastolic} mmHg</strong>
              </div>
            )}
          </div>

          <BloodPressureChart readings={filteredBp} />

          <div className="chart-legend-row">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span className="legend-dot" style={{ background: '#f43f5e' }} /> Systolic (mmHg)
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span className="legend-dot" style={{ background: '#38bdf8' }} /> Diastolic (mmHg)
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span className="legend-dot" style={{ background: 'rgba(16, 185, 129, 0.4)' }} /> AHA Target Corridor (&lt;120/80)
            </span>
          </div>
        </div>

        {/* 2. Resting Heart Rate Chart */}
        <div className="chart-card-container">
          <div className="chart-header-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#fb7185' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                Resting Heart Rate &amp; Zones
              </h3>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                ({filteredHr.length} logs)
              </span>
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Avg: <strong>{stats.meanHeartRate} bpm</strong>
            </div>
          </div>

          <HeartRateChart readings={filteredHr} />

          <div className="chart-legend-row">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span className="legend-dot" style={{ background: '#fb7185' }} /> Resting BPM
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span className="legend-dot" style={{ background: 'rgba(16, 185, 129, 0.4)' }} /> Optimal Zone (60-80 bpm)
            </span>
          </div>
        </div>

        {/* 3. Blood Glucose Chart */}
        <div className="chart-card-container">
          <div className="chart-header-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#06b6d4' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                Blood Glucose Telemetry
              </h3>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                ({filteredGluc.length} checks)
              </span>
            </div>

            <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>
              {stats.glucoseInRangePercentage}% Time In Range
            </div>
          </div>

          <GlucoseChart readings={filteredGluc} />

          <div className="chart-legend-row">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span className="legend-dot" style={{ background: '#06b6d4' }} /> Fasting (Diamond)
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span className="legend-dot" style={{ background: '#f59e0b' }} /> Post-Prandial (Circle)
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span className="legend-dot" style={{ background: 'rgba(16, 185, 129, 0.4)' }} /> ADA Target Band (70-140 mg/dL)
            </span>
          </div>
        </div>

        {/* 4. Sleep Stage Hypnogram */}
        <div className="chart-card-container">
          <div className="chart-header-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#8b5cf6' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                Sleep Stages &amp; Architecture
              </h3>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                ({filteredSleep.length} nights)
              </span>
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Avg Duration: <strong>{stats.meanSleepHours}h</strong>
            </div>
          </div>

          <SleepHypnogram records={filteredSleep} />

          <div className="chart-legend-row">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span className="legend-dot" style={{ background: '#3b82f6' }} /> Deep Sleep
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span className="legend-dot" style={{ background: '#8b5cf6' }} /> REM
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span className="legend-dot" style={{ background: '#06b6d4' }} /> Light
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span className="legend-dot" style={{ background: '#f59e0b' }} /> Awake
            </span>
          </div>
        </div>
      </div>

      {/* Clinical Notes & Alerts Banner */}
      {stats.meanSystolic >= 140 && (
        <div
          style={{
            padding: '14px 18px',
            borderRadius: 'var(--radius-lg)',
            background: 'rgba(244, 63, 94, 0.1)',
            border: '1px solid rgba(244, 63, 94, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: 12
          }}
        >
          <AlertCircle size={20} color="#f43f5e" />
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-primary)' }}>
            <strong>Stage 2 Hypertension Alert:</strong> 30-day mean systolic is {stats.meanSystolic} mmHg. Consider reviewing antihypertensive medication adherence and scheduling a clinical consultation.
          </div>
        </div>
      )}
    </div>
  );
};
