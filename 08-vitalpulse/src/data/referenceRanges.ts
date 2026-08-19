import type { HypertensionStage, GlucoseTier, HeartRateZone } from '../types/biometrics';

export interface StageThreshold {
  stage: HypertensionStage;
  label: string;
  color: string;
  bgRgba: string;
  sysMin: number;
  sysMax: number;
  diaMin: number;
  diaMax: number;
  guidelineNote: string;
}

export const AHA_BLOOD_PRESSURE_STAGES: StageThreshold[] = [
  {
    stage: 'Normal',
    label: 'Normal (<120 / <80)',
    color: '#10b981',
    bgRgba: 'rgba(16, 185, 129, 0.1)',
    sysMin: 0,
    sysMax: 119,
    diaMin: 0,
    diaMax: 79,
    guidelineNote: 'Maintain heart-healthy diet and active routine.'
  },
  {
    stage: 'Elevated',
    label: 'Elevated (120-129 / <80)',
    color: '#f59e0b',
    bgRgba: 'rgba(245, 158, 11, 0.1)',
    sysMin: 120,
    sysMax: 129,
    diaMin: 0,
    diaMax: 79,
    guidelineNote: 'Lifestyle intervention: lower sodium, increase aerobic activity.'
  },
  {
    stage: 'Stage 1 HTN',
    label: 'Stage 1 HTN (130-139 / 80-89)',
    color: '#f97316',
    bgRgba: 'rgba(249, 115, 22, 0.1)',
    sysMin: 130,
    sysMax: 139,
    diaMin: 80,
    diaMax: 89,
    guidelineNote: 'Clinical review recommended. Evaluate ASCVD risk for pharmacotherapy.'
  },
  {
    stage: 'Stage 2 HTN',
    label: 'Stage 2 HTN (≥140 / ≥90)',
    color: '#f43f5e',
    bgRgba: 'rgba(244, 63, 94, 0.12)',
    sysMin: 140,
    sysMax: 179,
    diaMin: 90,
    diaMax: 119,
    guidelineNote: 'Antihypertensive medication titration and regular clinical follow-up.'
  },
  {
    stage: 'Hypertensive Crisis',
    label: 'Crisis (>180 / >120)',
    color: '#ef4444',
    bgRgba: 'rgba(239, 68, 68, 0.2)',
    sysMin: 180,
    sysMax: 300,
    diaMin: 120,
    diaMax: 200,
    guidelineNote: 'Urgent medical attention required if symptomatic.'
  }
];

export function getHypertensionStage(sys: number, dia: number): HypertensionStage {
  if (sys >= 180 || dia >= 120) return 'Hypertensive Crisis';
  if (sys >= 140 || dia >= 90) return 'Stage 2 HTN';
  if ((sys >= 130 && sys <= 139) || (dia >= 80 && dia <= 89)) return 'Stage 1 HTN';
  if (sys >= 120 && sys <= 129 && dia < 80) return 'Elevated';
  return 'Normal';
}

export function getGlucoseTier(val: number, isFasting: boolean = true): GlucoseTier {
  if (val < 70) return 'Low (Hypo)';
  if (isFasting) {
    if (val <= 99) return 'Optimal';
    if (val <= 125) return 'Elevated';
    return 'High (Hyper)';
  } else {
    // Post-prandial
    if (val < 140) return 'Optimal';
    if (val <= 199) return 'Elevated';
    return 'High (Hyper)';
  }
}

export function getHeartRateZone(bpm: number): HeartRateZone {
  if (bpm < 55) return 'Bradycardia';
  if (bpm <= 70) return 'Optimal';
  if (bpm <= 85) return 'Resting';
  if (bpm <= 100) return 'Elevated';
  return 'Tachycardia';
}
