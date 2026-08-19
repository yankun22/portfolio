import React, { useState } from 'react';
import type { PatientProfile } from '../../types/patient';
import type { ASCVDRiskInputs, MetabolicRiskInputs } from '../../types/clinicalRisk';
import { calculateASCVDRisk, calculateMetabolicRisk, generateClinicalRecommendations } from '../../services/clinicalRiskService';
import { RiskGauge } from './RiskGauge';
import { RecommendationCard } from './RecommendationCard';
import { ShieldAlert, Activity, CheckCircle2, XCircle, Sliders } from 'lucide-react';

interface ClinicalRiskViewProps {
  patient: PatientProfile;
  onUpdateBaselineRisk: (ascvd: ASCVDRiskInputs, metabolic: MetabolicRiskInputs) => void;
}

export const ClinicalRiskView: React.FC<ClinicalRiskViewProps> = ({
  patient,
  onUpdateBaselineRisk
}) => {
  const [ascvdInputs, setAscvdInputs] = useState<ASCVDRiskInputs>(patient.riskBaseline.ascvd);
  const [metabolicInputs, setMetabolicInputs] = useState<MetabolicRiskInputs>(patient.riskBaseline.metabolic);

  const ascvdResult = calculateASCVDRisk(ascvdInputs);
  const metabolicResult = calculateMetabolicRisk(metabolicInputs, ascvdInputs.gender);
  const recommendations = generateClinicalRecommendations(ascvdResult, metabolicResult);

  const updateAscvd = (field: keyof ASCVDRiskInputs, value: unknown) => {
    const updated = { ...ascvdInputs, [field]: value };
    setAscvdInputs(updated);
    onUpdateBaselineRisk(updated, metabolicInputs);
  };

  const updateMetabolic = (field: keyof MetabolicRiskInputs, value: unknown) => {
    const updated = { ...metabolicInputs, [field]: value };
    setMetabolicInputs(updated);
    onUpdateBaselineRisk(ascvdInputs, updated);
  };

  return (
    <div className="risk-scroll-container">
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
          Clinical Cardiovascular &amp; Metabolic Risk Stratification
        </h2>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          AHA/ACC Pooled Cohort 10-Year ASCVD Risk Score &amp; ATP III Metabolic Syndrome Matrix
        </div>
      </div>

      {/* Main Dual Grid: ASCVD Model & Metabolic Model */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
        {/* 1. ASCVD 10-Year CVD Risk Card */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 20
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(244, 63, 94, 0.15)',
                  color: '#f43f5e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ShieldAlert size={18} />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                10-Year ASCVD Risk Calculator
              </h3>
            </div>

            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>ACC/AHA Guidelines</span>
          </div>

          <RiskGauge
            scorePercentage={ascvdResult.tenYearRiskPercentage}
            riskTier={ascvdResult.riskTier}
            riskColor={ascvdResult.riskTierColor}
          />

          <div
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.75rem',
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <span>Optimal Peer Benchmark: <strong>{ascvdResult.optimalRiskPercentage}%</strong></span>
            <span>Lifetime Risk: <strong>{ascvdResult.lifetimeRiskPercentage}%</strong></span>
          </div>

          {/* Interactive Parameters Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, borderTop: '1px solid var(--border-subtle)', paddingTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', fontWeight: 700 }}>
              <Sliders size={14} color="#06b6d4" />
              <span>Interactive Patient Biomarkers</span>
            </div>

            {/* Age Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 4 }}>
                <span style={{ color: 'var(--text-secondary)' }}>Age (Years)</span>
                <strong>{ascvdInputs.age} y</strong>
              </div>
              <input
                type="range"
                min="20"
                max="79"
                value={ascvdInputs.age}
                onChange={(e) => updateAscvd('age', Number(e.target.value))}
                style={{ width: '100%', accentColor: '#06b6d4' }}
              />
            </div>

            {/* Systolic BP Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 4 }}>
                <span style={{ color: 'var(--text-secondary)' }}>Systolic Blood Pressure</span>
                <strong>{ascvdInputs.systolicBP} mmHg</strong>
              </div>
              <input
                type="range"
                min="90"
                max="200"
                value={ascvdInputs.systolicBP}
                onChange={(e) => updateAscvd('systolicBP', Number(e.target.value))}
                style={{ width: '100%', accentColor: '#f43f5e' }}
              />
            </div>

            {/* Total Cholesterol Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 4 }}>
                <span style={{ color: 'var(--text-secondary)' }}>Total Cholesterol</span>
                <strong>{ascvdInputs.totalCholesterol} mg/dL</strong>
              </div>
              <input
                type="range"
                min="130"
                max="320"
                value={ascvdInputs.totalCholesterol}
                onChange={(e) => updateAscvd('totalCholesterol', Number(e.target.value))}
                style={{ width: '100%', accentColor: '#f59e0b' }}
              />
            </div>

            {/* HDL Cholesterol Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 4 }}>
                <span style={{ color: 'var(--text-secondary)' }}>HDL &quot;Good&quot; Cholesterol</span>
                <strong>{ascvdInputs.hdlCholesterol} mg/dL</strong>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={ascvdInputs.hdlCholesterol}
                onChange={(e) => updateAscvd('hdlCholesterol', Number(e.target.value))}
                style={{ width: '100%', accentColor: '#10b981' }}
              />
            </div>

            {/* Toggle checkboxes */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 4 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.75rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={ascvdInputs.onHypertensionMeds}
                  onChange={(e) => updateAscvd('onHypertensionMeds', e.target.checked)}
                />
                <span>On BP Meds</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.75rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={ascvdInputs.hasDiabetes}
                  onChange={(e) => updateAscvd('hasDiabetes', e.target.checked)}
                />
                <span>Diabetes Diagnosis</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.75rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={ascvdInputs.isSmoker}
                  onChange={(e) => updateAscvd('isSmoker', e.target.checked)}
                />
                <span>Current Smoker</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.75rem', cursor: 'pointer' }}>
                <select
                  className="form-select"
                  style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                  value={ascvdInputs.gender}
                  onChange={(e) => updateAscvd('gender', e.target.value)}
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>
              </label>
            </div>
          </div>
        </div>

        {/* 2. Metabolic Syndrome & Diabetes Matrix */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 20
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(6, 182, 212, 0.15)',
                  color: '#06b6d4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Activity size={18} />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                Metabolic Syndrome Matrix
              </h3>
            </div>

            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                padding: '3px 8px',
                borderRadius: 'var(--radius-full)',
                background: metabolicResult.hasMetabolicSyndrome ? 'rgba(244, 63, 94, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                color: metabolicResult.hasMetabolicSyndrome ? '#f43f5e' : '#10b981'
              }}
            >
              {metabolicResult.metabolicSyndromeCriteriaMet}/5 Criteria Met
            </span>
          </div>

          {/* Criteria Checklist */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {metabolicResult.criteriaResults.map((crit, idx) => (
              <div
                key={idx}
                style={{
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: crit.isMet ? 'rgba(244, 63, 94, 0.05)' : 'rgba(16, 185, 129, 0.04)',
                  border: crit.isMet ? '1px solid rgba(244, 63, 94, 0.2)' : '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {crit.isMet ? (
                    <XCircle size={16} color="#f43f5e" />
                  ) : (
                    <CheckCircle2 size={16} color="#10b981" />
                  )}
                  <div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {crit.name}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      Threshold: {crit.threshold}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right', fontSize: '0.8125rem', fontWeight: 700, color: crit.isMet ? '#f43f5e' : '#10b981' }}>
                  {crit.measured}
                </div>
              </div>
            ))}
          </div>

          {/* Metabolic Sliders */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, borderTop: '1px solid var(--border-subtle)', paddingTop: 16 }}>
            {/* BMI */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 4 }}>
                <span style={{ color: 'var(--text-secondary)' }}>Body Mass Index (BMI)</span>
                <strong>{metabolicInputs.bmi} kg/m²</strong>
              </div>
              <input
                type="range"
                min="18.0"
                max="45.0"
                step="0.1"
                value={metabolicInputs.bmi}
                onChange={(e) => updateMetabolic('bmi', Number(e.target.value))}
                style={{ width: '100%', accentColor: '#06b6d4' }}
              />
            </div>

            {/* Fasting Glucose */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 4 }}>
                <span style={{ color: 'var(--text-secondary)' }}>Fasting Glucose</span>
                <strong>{metabolicInputs.fastingGlucose} mg/dL</strong>
              </div>
              <input
                type="range"
                min="70"
                max="250"
                value={metabolicInputs.fastingGlucose}
                onChange={(e) => updateMetabolic('fastingGlucose', Number(e.target.value))}
                style={{ width: '100%', accentColor: '#06b6d4' }}
              />
            </div>

            {/* Triglycerides */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 4 }}>
                <span style={{ color: 'var(--text-secondary)' }}>Serum Triglycerides</span>
                <strong>{metabolicInputs.triglycerides} mg/dL</strong>
              </div>
              <input
                type="range"
                min="50"
                max="400"
                value={metabolicInputs.triglycerides}
                onChange={(e) => updateMetabolic('triglycerides', Number(e.target.value))}
                style={{ width: '100%', accentColor: '#f59e0b' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Clinical Evidence-Based Recommendations */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
          Guideline-Directed Clinical Interventions ({recommendations.length})
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 14 }}>
          {recommendations.map((rec) => (
            <RecommendationCard key={rec.id} recommendation={rec} />
          ))}
        </div>
      </div>
    </div>
  );
};
