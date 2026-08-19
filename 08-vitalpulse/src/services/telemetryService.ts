import type {
  BloodPressureReading,
  HeartRateReading,
  GlucoseReading,
  SleepRecord,
  TimeframeOption,
  BiometricAggregateStats,
  HypertensionStage
} from '../types/biometrics';

export function filterByTimeframe<T extends { date: string }>(
  items: T[],
  timeframe: TimeframeOption
): T[] {
  const days = timeframe === '7d' ? 7 : timeframe === '14d' ? 14 : timeframe === '30d' ? 30 : 90;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  const cutoffStr = cutoffDate.toISOString().split('T')[0];

  return items.filter(item => item.date >= cutoffStr).sort((a, b) => a.date.localeCompare(b.date));
}

export function computeBiometricAggregateStats(
  bpReadings: BloodPressureReading[],
  hrReadings: HeartRateReading[],
  glucoseReadings: GlucoseReading[],
  sleepRecords: SleepRecord[],
  timeframe: TimeframeOption = '30d'
): BiometricAggregateStats {
  const filteredBp = filterByTimeframe(bpReadings, timeframe);
  const filteredHr = filterByTimeframe(hrReadings, timeframe);
  const filteredGlucose = filterByTimeframe(glucoseReadings, timeframe);
  const filteredSleep = filterByTimeframe(sleepRecords, timeframe);

  // Blood pressure stats
  let totalSys = 0;
  let totalDia = 0;
  const htnDist: Record<HypertensionStage, number> = {
    'Normal': 0,
    'Elevated': 0,
    'Stage 1 HTN': 0,
    'Stage 2 HTN': 0,
    'Hypertensive Crisis': 0
  };

  filteredBp.forEach(bp => {
    totalSys += bp.systolic;
    totalDia += bp.diastolic;
    if (htnDist[bp.hypertensionStage] !== undefined) {
      htnDist[bp.hypertensionStage]++;
    }
  });

  const bpCount = filteredBp.length || 1;
  const meanSys = Math.round(totalSys / bpCount);
  const meanDia = Math.round(totalDia / bpCount);
  const map = Math.round((2 * meanDia + meanSys) / 3);

  // Calculate prior period delta for BP
  let sysDelta = 0;
  let diaDelta = 0;
  if (filteredBp.length >= 4) {
    const half = Math.floor(filteredBp.length / 2);
    const olderHalf = filteredBp.slice(0, half);
    const recentHalf = filteredBp.slice(half);

    const oldMeanSys = olderHalf.reduce((s, b) => s + b.systolic, 0) / (olderHalf.length || 1);
    const recMeanSys = recentHalf.reduce((s, b) => s + b.systolic, 0) / (recentHalf.length || 1);
    sysDelta = Math.round((recMeanSys - oldMeanSys) * 10) / 10;

    const oldMeanDia = olderHalf.reduce((s, b) => s + b.diastolic, 0) / (olderHalf.length || 1);
    const recMeanDia = recentHalf.reduce((s, b) => s + b.diastolic, 0) / (recentHalf.length || 1);
    diaDelta = Math.round((recMeanDia - oldMeanDia) * 10) / 10;
  }

  // Heart Rate stats
  const totalHr = filteredHr.reduce((s, h) => s + (h.restingBpm || h.bpm), 0);
  const hrCount = filteredHr.length || 1;
  const meanHr = Math.round(totalHr / hrCount);

  // Glucose stats
  let totalGluc = 0;
  let inRangeCount = 0;
  filteredGlucose.forEach(g => {
    totalGluc += g.value;
    if (g.value >= 70 && g.value <= 140) {
      inRangeCount++;
    }
  });
  const glucCount = filteredGlucose.length || 1;
  const meanGluc = Math.round(totalGluc / glucCount);
  const tirPct = filteredGlucose.length > 0 ? Math.round((inRangeCount / filteredGlucose.length) * 100) : 100;

  // Sleep stats
  const totalSleepHours = filteredSleep.reduce((s, sl) => s + sl.totalSleepHours, 0);
  const totalSleepScore = filteredSleep.reduce((s, sl) => s + sl.score, 0);
  const sleepCount = filteredSleep.length || 1;
  const meanSleepHours = parseFloat((totalSleepHours / sleepCount).toFixed(1));
  const meanSleepScore = Math.round(totalSleepScore / sleepCount);

  return {
    meanSystolic: meanSys || 120,
    meanDiastolic: meanDia || 80,
    meanArterialPressure: map || 93,
    systolicDelta: sysDelta,
    diastolicDelta: diaDelta,
    meanHeartRate: meanHr || 70,
    heartRateDelta: 0,
    meanGlucose: meanGluc || 100,
    glucoseDelta: 0,
    glucoseInRangePercentage: tirPct,
    meanSleepScore: meanSleepScore || 80,
    meanSleepHours: meanSleepHours || 7.5,
    hypertensionDistribution: htnDist
  };
}
