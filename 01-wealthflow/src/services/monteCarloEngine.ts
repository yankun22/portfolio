import type { MonteCarloParams, SimulationResults, SimulationYearData } from '../types/monteCarlo';

/**
 * Standard Normal Random Variable Generator using the Box-Muller Transform
 */
function gaussianRandom(): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

/**
 * Run a fast, 500-iteration stochastic Monte Carlo wealth projection
 * using Geometric Brownian Motion with continuous monthly compounding
 * and monthly recurring contributions.
 */
export function runMonteCarloSimulation(params: MonteCarloParams): SimulationResults {
  const startTime = performance.now();

  const {
    initialCapital,
    monthlyContribution,
    timeHorizonYears,
    meanAnnualReturn,
    annualVolatility,
    inflationRate,
    isInflationAdjusted,
    numSimulations = 500,
    targetGoalAmount = 1000000,
  } = params;

  const mu = meanAnnualReturn / 100;
  const sigma = annualVolatility / 100;
  const inflation = inflationRate / 100;
  const dt = 1 / 12; // monthly step
  const totalMonths = timeHorizonYears * 12;

  // Monthly drift and diffusion scale
  const monthlyDrift = (mu - 0.5 * sigma * sigma) * dt;
  const monthlyVol = sigma * Math.sqrt(dt);

  // Store matrix of simulation endpoints per year [year][simulationIndex]
  const yearlySimulations: Float64Array[] = [];
  for (let y = 0; y <= timeHorizonYears; y++) {
    yearlySimulations.push(new Float64Array(numSimulations));
  }

  // Pre-fill Year 0
  for (let i = 0; i < numSimulations; i++) {
    yearlySimulations[0][i] = initialCapital;
  }

  // Run 500 simulation paths
  for (let i = 0; i < numSimulations; i++) {
    let currentWealth = initialCapital;

    for (let month = 1; month <= totalMonths; month++) {
      const z = gaussianRandom();
      const returnFactor = Math.exp(monthlyDrift + monthlyVol * z);
      currentWealth = currentWealth * returnFactor + monthlyContribution;

      // Avoid negative wealth from extreme volatility
      if (currentWealth < 0) currentWealth = 0;

      // If at end of a year, record checkpoint
      if (month % 12 === 0) {
        const yearIndex = month / 12;
        yearlySimulations[yearIndex][i] = currentWealth;
      }
    }
  }

  const currentCalendarYear = new Date().getFullYear();
  const yearlyData: SimulationYearData[] = [];
  const totalContributionsAtHorizon = initialCapital + monthlyContribution * totalMonths;

  // Calculate percentiles for each year
  for (let y = 0; y <= timeHorizonYears; y++) {
    const rawValues = yearlySimulations[y];
    const sorted = Array.from(rawValues).sort((a, b) => a - b);
    const count = sorted.length;

    let p10 = sorted[Math.floor(count * 0.10)];
    let p25 = sorted[Math.floor(count * 0.25)];
    let p50 = sorted[Math.floor(count * 0.50)]; // Median
    let p75 = sorted[Math.floor(count * 0.75)];
    let p90 = sorted[Math.floor(count * 0.90)];

    let sum = 0;
    for (let i = 0; i < count; i++) {
      sum += sorted[i];
    }
    let mean = sum / count;

    const contributionsOnly = initialCapital + monthlyContribution * 12 * y;
    const inflationFactor = Math.pow(1 + inflation, y);
    const realPurchasingPowerMedian = p50 / inflationFactor;

    if (isInflationAdjusted && y > 0) {
      p10 = p10 / inflationFactor;
      p25 = p25 / inflationFactor;
      p50 = p50 / inflationFactor;
      p75 = p75 / inflationFactor;
      p90 = p90 / inflationFactor;
      mean = mean / inflationFactor;
    }

    yearlyData.push({
      year: y,
      calendarYear: currentCalendarYear + y,
      p10: Math.round(p10),
      p25: Math.round(p25),
      p50: Math.round(p50),
      p75: Math.round(p75),
      p90: Math.round(p90),
      mean: Math.round(mean),
      contributionsOnly: Math.round(contributionsOnly),
      realPurchasingPowerMedian: Math.round(realPurchasingPowerMedian),
    });
  }

  // Final horizon statistics
  const finalYearValues = yearlySimulations[timeHorizonYears];
  const finalInflationFactor = isInflationAdjusted ? Math.pow(1 + inflation, timeHorizonYears) : 1;

  let successfulRuns = 0;
  for (let i = 0; i < numSimulations; i++) {
    const adjustedFinal = finalYearValues[i] / finalInflationFactor;
    if (adjustedFinal >= targetGoalAmount) {
      successfulRuns++;
    }
  }

  const successRateTarget = Math.round((successfulRuns / numSimulations) * 100);
  const finalYearData = yearlyData[timeHorizonYears];
  const executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;

  return {
    yearlyData,
    finalP10: finalYearData.p10,
    finalP25: finalYearData.p25,
    finalP50: finalYearData.p50,
    finalP75: finalYearData.p75,
    finalP90: finalYearData.p90,
    finalMean: finalYearData.mean,
    totalContributions: totalContributionsAtHorizon,
    successRateTarget,
    executionTimeMs,
  };
}
