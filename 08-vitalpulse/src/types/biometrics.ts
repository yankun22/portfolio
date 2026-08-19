export type TimeframeOption = '7d' | '14d' | '30d' | '90d';

export type HypertensionStage =
  | 'Normal'
  | 'Elevated'
  | 'Stage 1 HTN'
  | 'Stage 2 HTN'
  | 'Hypertensive Crisis';

export type GlucoseState = 'Fasting' | 'Post-Prandial' | 'Pre-Meal' | 'Bedtime' | 'Random';

export type GlucoseTier = 'Low (Hypo)' | 'Optimal' | 'Elevated' | 'High (Hyper)';

export type HeartRateZone = 'Bradycardia' | 'Resting' | 'Optimal' | 'Elevated' | 'Tachycardia';

export interface BloodPressureReading {
  id: string;
  timestamp: string; // ISO date string or YYYY-MM-DD HH:mm
  date: string; // YYYY-MM-DD
  systolic: number; // mmHg
  diastolic: number; // mmHg
  pulse: number; // bpm
  hypertensionStage: HypertensionStage;
  notes?: string;
  isAnomaly?: boolean;
}

export interface HeartRateReading {
  id: string;
  timestamp: string;
  date: string;
  bpm: number;
  restingBpm: number;
  hrvRmssd?: number; // Heart Rate Variability in ms
  zone: HeartRateZone;
}

export interface GlucoseReading {
  id: string;
  timestamp: string;
  date: string;
  value: number; // mg/dL
  state: GlucoseState;
  tier: GlucoseTier;
  mealTag?: string;
}

export interface SleepStageDistribution {
  deepMinutes: number;
  remMinutes: number;
  lightMinutes: number;
  awakeMinutes: number;
}

export interface SleepRecord {
  id: string;
  date: string; // Night of YYYY-MM-DD
  totalSleepHours: number;
  efficiencyPercentage: number;
  score: number; // 0-100 Quality Score
  stages: SleepStageDistribution;
  respiratoryRateAvg?: number; // breaths/min
  spO2Avg?: number; // %
}

export interface BiometricAggregateStats {
  meanSystolic: number;
  meanDiastolic: number;
  meanArterialPressure: number; // MAP = (2*DBP + SBP)/3
  systolicDelta: number; // +/- compared to prior period
  diastolicDelta: number;
  meanHeartRate: number;
  heartRateDelta: number;
  meanGlucose: number;
  glucoseDelta: number;
  glucoseInRangePercentage: number; // Time In Range (70-140 mg/dL)
  meanSleepScore: number;
  meanSleepHours: number;
  hypertensionDistribution: Record<HypertensionStage, number>;
}
