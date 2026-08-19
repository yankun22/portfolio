import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import type {
  BloodPressureReading,
  HeartRateReading,
  GlucoseReading,
  SleepRecord,
  GlucoseState
} from '../../types/biometrics';
import { getHypertensionStage, getGlucoseTier, getHeartRateZone } from '../../data/referenceRanges';
import { Activity, Heart, Droplets, Moon, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LogVitalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogBloodPressure: (reading: BloodPressureReading) => void;
  onLogHeartRate: (reading: HeartRateReading) => void;
  onLogGlucose: (reading: GlucoseReading) => void;
  onLogSleep: (record: SleepRecord) => void;
}

type VitalTab = 'bp' | 'hr' | 'glucose' | 'sleep';

export const LogVitalModal: React.FC<LogVitalModalProps> = ({
  isOpen,
  onClose,
  onLogBloodPressure,
  onLogHeartRate,
  onLogGlucose,
  onLogSleep
}) => {
  const [activeType, setActiveType] = useState<VitalTab>('bp');

  // BP fields
  const [systolic, setSystolic] = useState(128);
  const [diastolic, setDiastolic] = useState(82);
  const [pulse, setPulse] = useState(72);
  const [bpNotes, setBpNotes] = useState('');

  // HR fields
  const [restingBpm, setRestingBpm] = useState(68);

  // Glucose fields
  const [glucoseVal, setGlucoseVal] = useState(105);
  const [glucoseState, setGlucoseState] = useState<GlucoseState>('Fasting');
  const [mealTag, setMealTag] = useState('Morning Fasting');

  // Sleep fields
  const [sleepHrs, setSleepHrs] = useState(7.5);
  const [sleepScore, setSleepScore] = useState(82);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const timestamp = `${dateStr} ${timeStr}`;

    if (activeType === 'bp') {
      const newBp: BloodPressureReading = {
        id: `bp-${Date.now()}`,
        timestamp,
        date: dateStr,
        systolic: Number(systolic),
        diastolic: Number(diastolic),
        pulse: Number(pulse),
        hypertensionStage: getHypertensionStage(Number(systolic), Number(diastolic)),
        notes: bpNotes.trim() || undefined
      };
      onLogBloodPressure(newBp);
    } else if (activeType === 'hr') {
      const newHr: HeartRateReading = {
        id: `hr-${Date.now()}`,
        timestamp,
        date: dateStr,
        bpm: Number(restingBpm),
        restingBpm: Number(restingBpm),
        zone: getHeartRateZone(Number(restingBpm))
      };
      onLogHeartRate(newHr);
    } else if (activeType === 'glucose') {
      const newGluc: GlucoseReading = {
        id: `glu-${Date.now()}`,
        timestamp,
        date: dateStr,
        value: Number(glucoseVal),
        state: glucoseState,
        tier: getGlucoseTier(Number(glucoseVal), glucoseState === 'Fasting'),
        mealTag: mealTag.trim() || undefined
      };
      onLogGlucose(newGluc);
    } else if (activeType === 'sleep') {
      const hrs = Number(sleepHrs);
      const totalMin = hrs * 60;
      const newSleep: SleepRecord = {
        id: `sleep-${Date.now()}`,
        date: dateStr,
        totalSleepHours: hrs,
        efficiencyPercentage: 92,
        score: Number(sleepScore),
        stages: {
          deepMinutes: Math.round(totalMin * 0.2),
          remMinutes: Math.round(totalMin * 0.22),
          lightMinutes: Math.round(totalMin * 0.5),
          awakeMinutes: Math.round(totalMin * 0.08)
        }
      };
      onLogSleep(newSleep);
    }

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log Patient Biometric Reading" maxWidth="520px">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Vital Type Selector Tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, background: 'var(--bg-input)', padding: 4, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
          <button
            type="button"
            className={`tab-btn ${activeType === 'bp' ? 'active' : ''}`}
            onClick={() => setActiveType('bp')}
            style={{ justifyContent: 'center' }}
          >
            <Activity size={14} />
            <span>BP</span>
          </button>
          <button
            type="button"
            className={`tab-btn ${activeType === 'hr' ? 'active' : ''}`}
            onClick={() => setActiveType('hr')}
            style={{ justifyContent: 'center' }}
          >
            <Heart size={14} />
            <span>Pulse</span>
          </button>
          <button
            type="button"
            className={`tab-btn ${activeType === 'glucose' ? 'active' : ''}`}
            onClick={() => setActiveType('glucose')}
            style={{ justifyContent: 'center' }}
          >
            <Droplets size={14} />
            <span>Glucose</span>
          </button>
          <button
            type="button"
            className={`tab-btn ${activeType === 'sleep' ? 'active' : ''}`}
            onClick={() => setActiveType('sleep')}
            style={{ justifyContent: 'center' }}
          >
            <Moon size={14} />
            <span>Sleep</span>
          </button>
        </div>

        {/* Form Body based on Active Type */}
        {activeType === 'bp' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Systolic (mmHg)</label>
                <input
                  type="number"
                  className="form-input"
                  min="60"
                  max="260"
                  required
                  value={systolic}
                  onChange={(e) => setSystolic(Number(e.target.value))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Diastolic (mmHg)</label>
                <input
                  type="number"
                  className="form-input"
                  min="40"
                  max="160"
                  required
                  value={diastolic}
                  onChange={(e) => setDiastolic(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Pulse / Heart Rate (bpm)</label>
              <input
                type="number"
                className="form-input"
                min="35"
                max="220"
                required
                value={pulse}
                onChange={(e) => setPulse(Number(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Clinical Notes / Symptoms (Optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Post-exercise, morning reading, felt mild dizziness"
                value={bpNotes}
                onChange={(e) => setBpNotes(e.target.value)}
              />
            </div>

            <div
              style={{
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <span style={{ color: 'var(--text-muted)' }}>Calculated AHA Stage:</span>
              <strong style={{ color: '#10b981' }}>{getHypertensionStage(Number(systolic), Number(diastolic))}</strong>
            </div>
          </div>
        )}

        {activeType === 'hr' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Resting Heart Rate (BPM)</label>
              <input
                type="number"
                className="form-input"
                min="35"
                max="220"
                required
                value={restingBpm}
                onChange={(e) => setRestingBpm(Number(e.target.value))}
              />
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Resting heart rate measured after 5 minutes of quiet resting sitting down.
            </div>
          </div>
        )}

        {activeType === 'glucose' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Blood Glucose Value (mg/dL)</label>
              <input
                type="number"
                className="form-input"
                min="30"
                max="500"
                required
                value={glucoseVal}
                onChange={(e) => setGlucoseVal(Number(e.target.value))}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Glycemic State</label>
                <select
                  className="form-select"
                  value={glucoseState}
                  onChange={(e) => setGlucoseState(e.target.value as GlucoseState)}
                >
                  <option value="Fasting">Fasting (Morning)</option>
                  <option value="Post-Prandial">Post-Prandial (2hr after meal)</option>
                  <option value="Pre-Meal">Pre-Meal</option>
                  <option value="Bedtime">Bedtime</option>
                  <option value="Random">Random Spot Check</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Meal Tag / Context</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Post-Breakfast, Pre-Dinner"
                  value={mealTag}
                  onChange={(e) => setMealTag(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {activeType === 'sleep' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Total Sleep Duration (Hours)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-input"
                  min="1"
                  max="16"
                  required
                  value={sleepHrs}
                  onChange={(e) => setSleepHrs(Number(e.target.value))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Sleep Quality Score (0 - 100)</label>
                <input
                  type="number"
                  className="form-input"
                  min="0"
                  max="100"
                  required
                  value={sleepScore}
                  onChange={(e) => setSleepScore(Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            <Check size={14} />
            <span>Save &amp; Update Telemetry</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
