import type { FireCalculationResults, FireMilestone, FireParams, FireType } from '../types/fire';

function calculateMonthsToTarget(
  targetAmount: number,
  initialNetWorth: number,
  monthlySavings: number,
  annualReturnRatePercent: number
): number | null {
  if (initialNetWorth >= targetAmount) {
    return 0;
  }

  const monthlyRate = annualReturnRatePercent / 100 / 12;
  let current = initialNetWorth;
  const maxMonths = 1200; // 100 years max

  for (let month = 1; month <= maxMonths; month++) {
    if (monthlyRate > 0) {
      current = current * (1 + monthlyRate) + monthlySavings;
    } else {
      current += monthlySavings;
    }

    if (current >= targetAmount) {
      return month;
    }
  }

  return null;
}

export function calculateFireMilestones(params: FireParams): FireCalculationResults {
  const {
    currentAge,
    targetRetirementAge,
    annualSpending,
    leanAnnualSpending,
    fatAnnualSpending,
    safeWithdrawalRate,
    expectedReturnRate,
    inflationRate,
    monthlySavings,
    currentNetWorth,
  } = params;

  const currentYear = new Date().getFullYear();
  const swrFactor = safeWithdrawalRate / 100;
  const realReturnRate = Math.max(0.1, expectedReturnRate - inflationRate);
  const yearsToRetirement = Math.max(1, targetRetirementAge - currentAge);

  // 1. Traditional FIRE
  const traditionalTarget = annualSpending / swrFactor;
  const traditionalProgress = Math.min(999, Math.round((currentNetWorth / traditionalTarget) * 1000) / 10);
  const traditionalMonths = calculateMonthsToTarget(traditionalTarget, currentNetWorth, monthlySavings, realReturnRate);
  const traditionalYearsRemaining = traditionalMonths !== null ? Math.round((traditionalMonths / 12) * 10) / 10 : null;
  const traditionalProjectedAge = traditionalYearsRemaining !== null ? Math.round((currentAge + traditionalYearsRemaining) * 10) / 10 : null;
  const traditionalProjectedYear = traditionalYearsRemaining !== null ? Math.round(currentYear + traditionalYearsRemaining) : null;

  // 2. Lean FIRE
  const leanTarget = leanAnnualSpending / swrFactor;
  const leanProgress = Math.min(999, Math.round((currentNetWorth / leanTarget) * 1000) / 10);
  const leanMonths = calculateMonthsToTarget(leanTarget, currentNetWorth, monthlySavings, realReturnRate);
  const leanYearsRemaining = leanMonths !== null ? Math.round((leanMonths / 12) * 10) / 10 : null;
  const leanProjectedAge = leanYearsRemaining !== null ? Math.round((currentAge + leanYearsRemaining) * 10) / 10 : null;
  const leanProjectedYear = leanYearsRemaining !== null ? Math.round(currentYear + leanYearsRemaining) : null;

  // 3. Coast FIRE
  const discountFactor = Math.pow(1 + realReturnRate / 100, yearsToRetirement);
  const coastTarget = traditionalTarget / discountFactor;
  const coastProgress = Math.min(999, Math.round((currentNetWorth / coastTarget) * 1000) / 10);
  const coastIsAchieved = currentNetWorth >= coastTarget;
  const coastMonths = coastIsAchieved ? 0 : calculateMonthsToTarget(coastTarget, currentNetWorth, monthlySavings, realReturnRate);
  const coastYearsRemaining = coastMonths !== null ? Math.round((coastMonths / 12) * 10) / 10 : null;
  const coastProjectedAge = coastYearsRemaining !== null ? Math.round((currentAge + coastYearsRemaining) * 10) / 10 : null;
  const coastProjectedYear = coastYearsRemaining !== null ? Math.round(currentYear + coastYearsRemaining) : null;

  // 4. Fat FIRE
  const fatTarget = fatAnnualSpending / swrFactor;
  const fatProgress = Math.min(999, Math.round((currentNetWorth / fatTarget) * 1000) / 10);
  const fatMonths = calculateMonthsToTarget(fatTarget, currentNetWorth, monthlySavings, realReturnRate);
  const fatYearsRemaining = fatMonths !== null ? Math.round((fatMonths / 12) * 10) / 10 : null;
  const fatProjectedAge = fatYearsRemaining !== null ? Math.round((currentAge + fatYearsRemaining) * 10) / 10 : null;
  const fatProjectedYear = fatYearsRemaining !== null ? Math.round(currentYear + fatYearsRemaining) : null;

  // 5. Barista FIRE
  const baristaTarget = (annualSpending * 0.5) / swrFactor;
  const baristaProgress = Math.min(999, Math.round((currentNetWorth / baristaTarget) * 1000) / 10);
  const baristaMonths = calculateMonthsToTarget(baristaTarget, currentNetWorth, monthlySavings, realReturnRate);
  const baristaYearsRemaining = baristaMonths !== null ? Math.round((baristaMonths / 12) * 10) / 10 : null;
  const baristaProjectedAge = baristaYearsRemaining !== null ? Math.round((currentAge + baristaYearsRemaining) * 10) / 10 : null;
  const baristaProjectedYear = baristaYearsRemaining !== null ? Math.round(currentYear + baristaYearsRemaining) : null;

  const milestones: Record<FireType, FireMilestone> = {
    coast: {
      id: 'coast',
      title: 'Coast FIRE',
      badge: 'Zero Future Savings Required',
      targetAmount: Math.round(coastTarget),
      currentProgressPercent: coastProgress,
      isAchieved: coastIsAchieved,
      projectedAge: coastProjectedAge,
      projectedYear: coastProjectedYear,
      yearsRemaining: coastYearsRemaining,
      description: `Investments alone will compound to your full Traditional FIRE number ($${Math.round(traditionalTarget).toLocaleString()}) by age ${targetRetirementAge} without adding another penny.`,
      monthlySafeWithdrawal: Math.round((traditionalTarget * swrFactor) / 12),
      annualSafeWithdrawal: Math.round(traditionalTarget * swrFactor),
      color: '#06b6d4',
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
    },
    lean: {
      id: 'lean',
      title: 'Lean FIRE',
      badge: 'Essential Freedom',
      targetAmount: Math.round(leanTarget),
      currentProgressPercent: leanProgress,
      isAchieved: currentNetWorth >= leanTarget,
      projectedAge: leanProjectedAge,
      projectedYear: leanProjectedYear,
      yearsRemaining: leanYearsRemaining,
      description: `Covers bare-bones essential living expenses ($${leanAnnualSpending.toLocaleString()}/yr) in retirement with maximum frugality.`,
      monthlySafeWithdrawal: Math.round(leanAnnualSpending / 12),
      annualSafeWithdrawal: Math.round(leanAnnualSpending),
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    },
    barista: {
      id: 'barista',
      title: 'Barista FIRE',
      badge: 'Semi-Retirement',
      targetAmount: Math.round(baristaTarget),
      currentProgressPercent: baristaProgress,
      isAchieved: currentNetWorth >= baristaTarget,
      projectedAge: baristaProjectedAge,
      projectedYear: baristaProjectedYear,
      yearsRemaining: baristaYearsRemaining,
      description: `Passive portfolio cashflow covers 50% of expenses ($${Math.round(annualSpending * 0.5).toLocaleString()}/yr). You only work enjoyable, low-stress part-time work for the rest.`,
      monthlySafeWithdrawal: Math.round((annualSpending * 0.5) / 12),
      annualSafeWithdrawal: Math.round(annualSpending * 0.5),
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    },
    traditional: {
      id: 'traditional',
      title: 'Traditional FIRE',
      badge: 'Full Independence',
      targetAmount: Math.round(traditionalTarget),
      currentProgressPercent: traditionalProgress,
      isAchieved: currentNetWorth >= traditionalTarget,
      projectedAge: traditionalProjectedAge,
      projectedYear: traditionalProjectedYear,
      yearsRemaining: traditionalYearsRemaining,
      description: `100% financial freedom at your current desired lifestyle ($${annualSpending.toLocaleString()}/yr) with a perpetual ${safeWithdrawalRate}% safe withdrawal rate.`,
      monthlySafeWithdrawal: Math.round(annualSpending / 12),
      annualSafeWithdrawal: Math.round(annualSpending),
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
    },
    fat: {
      id: 'fat',
      title: 'Fat FIRE',
      badge: 'Luxury Abundance',
      targetAmount: Math.round(fatTarget),
      currentProgressPercent: fatProgress,
      isAchieved: currentNetWorth >= fatTarget,
      projectedAge: fatProjectedAge,
      projectedYear: fatProjectedYear,
      yearsRemaining: fatYearsRemaining,
      description: `Uncompromised luxury retirement ($${fatAnnualSpending.toLocaleString()}/yr) with extensive travel, gifting, and premium healthcare buffers.`,
      monthlySafeWithdrawal: Math.round(fatAnnualSpending / 12),
      annualSafeWithdrawal: Math.round(fatAnnualSpending),
      color: '#ec4899',
      gradient: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
    },
  };

  const coastSurplus = currentNetWorth - coastTarget;
  const annualIncome = annualSpending + monthlySavings * 12;
  const savingsRate = annualIncome > 0 ? Math.min(100, Math.round(((monthlySavings * 12) / annualIncome) * 100)) : 0;

  let summaryText = '';
  if (currentNetWorth >= traditionalTarget) {
    summaryText = `🎉 Congratulations! You have achieved 100% Financial Independence. Your portfolio can sustainably generate $${Math.round(annualSpending).toLocaleString()}/year in passive withdrawals.`;
  } else if (coastIsAchieved) {
    summaryText = `🚀 Coast-FIRE Achieved! Your current wealth of $${Math.round(currentNetWorth).toLocaleString()} exceeds your Coast target ($${Math.round(coastTarget).toLocaleString()}) by $${Math.round(coastSurplus).toLocaleString()}. You can ease off aggressive saving and let compounding carry you to retirement at age ${targetRetirementAge}.`;
  } else {
    summaryText = `📈 On track for Traditional FIRE in ${traditionalYearsRemaining ?? '—'} years (at age ${traditionalProjectedAge ?? '—'}). Increasing your monthly contribution by $500 would accelerate your independence date by ~2.5 years.`;
  }

  return {
    milestones,
    yearsToTraditionalFire: traditionalYearsRemaining,
    traditionalFireTargetDate: traditionalProjectedYear ? `${traditionalProjectedYear}` : null,
    savingsRatePercent: savingsRate,
    coastFireSurplusOrDeficit: Math.round(coastSurplus),
    fireNumberFormatted: `$${Math.round(traditionalTarget).toLocaleString()}`,
    summaryText,
  };
}
