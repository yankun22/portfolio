export interface FireParams {
  currentAge: number;
  targetRetirementAge: number;
  annualSpending: number;
  leanAnnualSpending: number;
  fatAnnualSpending: number;
  safeWithdrawalRate: number; // e.g. 4.0 for 4%
  expectedReturnRate: number; // e.g. 7.0 for 7%
  inflationRate: number; // e.g. 2.5 for 2.5%
  monthlySavings: number;
  currentNetWorth: number;
  usePortfolioNetWorth: boolean;
}

export type FireType = 'coast' | 'lean' | 'traditional' | 'fat' | 'barista';

export interface FireMilestone {
  id: FireType;
  title: string;
  badge: string;
  targetAmount: number;
  currentProgressPercent: number;
  isAchieved: boolean;
  projectedAge: number | null;
  projectedYear: number | null;
  yearsRemaining: number | null;
  description: string;
  monthlySafeWithdrawal: number;
  annualSafeWithdrawal: number;
  color: string;
  gradient: string;
}

export interface FireCalculationResults {
  milestones: Record<FireType, FireMilestone>;
  yearsToTraditionalFire: number | null;
  traditionalFireTargetDate: string | null;
  savingsRatePercent: number;
  coastFireSurplusOrDeficit: number;
  fireNumberFormatted: string;
  summaryText: string;
}
