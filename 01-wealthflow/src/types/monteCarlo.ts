export interface MonteCarloParams {
  initialCapital: number;
  monthlyContribution: number;
  timeHorizonYears: number; // 10, 25, 50, etc.
  meanAnnualReturn: number; // in % (e.g. 8.0)
  annualVolatility: number; // in % (e.g. 15.0)
  inflationRate: number; // in % (e.g. 2.5)
  isInflationAdjusted: boolean;
  numSimulations: number; // e.g. 500
  targetGoalAmount: number; // e.g. 1000000
}

export interface SimulationYearData {
  year: number;
  calendarYear: number;
  p10: number; // 10th percentile (Pessimistic / Bear Case)
  p25: number;
  p50: number; // 50th percentile (Median / Base Case)
  p75: number;
  p90: number; // 90th percentile (Optimistic / Bull Case)
  mean: number;
  contributionsOnly: number;
  realPurchasingPowerMedian: number;
}

export interface SimulationResults {
  yearlyData: SimulationYearData[];
  finalP10: number;
  finalP25: number;
  finalP50: number;
  finalP75: number;
  finalP90: number;
  finalMean: number;
  totalContributions: number;
  successRateTarget: number; // % chance of reaching targetGoalAmount at horizon
  executionTimeMs: number;
}
