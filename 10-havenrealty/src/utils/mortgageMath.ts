import { AmortizationEntry, MortgageInputs, MortgageResults } from '../types/property';

export function calculateMortgage(inputs: MortgageInputs): MortgageResults {
  const {
    price,
    downPaymentPct,
    loanTermYears,
    interestRate,
    propertyTaxRate,
    insuranceAnnual,
    hoaMonthly,
    monthlyRentalIncome,
    occupancyRate,
  } = inputs;

  const downPaymentAmount = price * (downPaymentPct / 100);
  const loanAmount = Math.max(0, price - downPaymentAmount);

  const monthlyRate = interestRate > 0 ? interestRate / 100 / 12 : 0;
  const totalMonths = loanTermYears * 12;

  let monthlyPrincipalAndInterest = 0;
  if (loanAmount > 0) {
    if (monthlyRate === 0) {
      monthlyPrincipalAndInterest = loanAmount / totalMonths;
    } else {
      const factor = Math.pow(1 + monthlyRate, totalMonths);
      monthlyPrincipalAndInterest = (loanAmount * (monthlyRate * factor)) / (factor - 1);
    }
  }

  const monthlyTax = (price * (propertyTaxRate / 100)) / 12;
  const monthlyInsurance = insuranceAnnual / 12;
  const totalMonthlyPayment =
    monthlyPrincipalAndInterest + monthlyTax + monthlyInsurance + hoaMonthly;

  const totalLoanCost = monthlyPrincipalAndInterest * totalMonths;
  const totalInterestPaid = Math.max(0, totalLoanCost - loanAmount);

  // Rental Yield & ROI Analytics
  const effectiveOccupancy = Math.max(0, Math.min(100, occupancyRate)) / 100;
  const annualGrossRent = monthlyRentalIncome * 12 * effectiveOccupancy;
  
  // Operating expenses: Tax + Insurance + HOA + 8% Maintenance & Management reserve
  const annualFixedExpenses = (monthlyTax + monthlyInsurance + hoaMonthly) * 12;
  const annualVariableExpenses = annualGrossRent * 0.08;
  const annualOperatingExpenses = annualFixedExpenses + annualVariableExpenses;

  const annualNOI = Math.max(0, annualGrossRent - annualOperatingExpenses);
  const grossRentalYield = price > 0 ? ((monthlyRentalIncome * 12) / price) * 100 : 0;
  const netCapRate = price > 0 ? (annualNOI / price) * 100 : 0;

  const annualDebtService = monthlyPrincipalAndInterest * 12;
  const annualCashFlow = annualNOI - annualDebtService;
  
  const estimatedClosingCosts = price * 0.02;
  const totalInitialCash = downPaymentAmount + estimatedClosingCosts;
  const cashOnCashReturn =
    totalInitialCash > 0 ? (annualCashFlow / totalInitialCash) * 100 : 0;

  // Build Amortization Schedule (Year by Year)
  const amortizationSchedule: AmortizationEntry[] = [];
  let currentBalance = loanAmount;
  let accumulatedInterest = 0;

  for (let year = 1; year <= loanTermYears; year++) {
    let interestPaidThisYear = 0;
    let principalPaidThisYear = 0;

    for (let month = 1; month <= 12; month++) {
      if (currentBalance <= 0) break;
      const interestPayment = currentBalance * monthlyRate;
      const principalPayment = Math.min(
        currentBalance,
        monthlyPrincipalAndInterest - interestPayment
      );

      interestPaidThisYear += interestPayment;
      principalPaidThisYear += principalPayment;
      currentBalance = Math.max(0, currentBalance - principalPayment);
    }

    accumulatedInterest += interestPaidThisYear;
    const equity = price - currentBalance;

    amortizationSchedule.push({
      year,
      balance: Math.round(currentBalance),
      interestPaidYear: Math.round(interestPaidThisYear),
      principalPaidYear: Math.round(principalPaidThisYear),
      totalInterestToDate: Math.round(accumulatedInterest),
      equity: Math.round(equity),
    });
  }

  return {
    downPaymentAmount: Math.round(downPaymentAmount),
    loanAmount: Math.round(loanAmount),
    monthlyPrincipalAndInterest: Math.round(monthlyPrincipalAndInterest),
    monthlyTax: Math.round(monthlyTax),
    monthlyInsurance: Math.round(monthlyInsurance),
    monthlyHOA: Math.round(hoaMonthly),
    totalMonthlyPayment: Math.round(totalMonthlyPayment),
    totalLoanCost: Math.round(totalLoanCost),
    totalInterestPaid: Math.round(totalInterestPaid),
    grossRentalYield: Number(grossRentalYield.toFixed(2)),
    netCapRate: Number(netCapRate.toFixed(2)),
    cashOnCashReturn: Number(cashOnCashReturn.toFixed(2)),
    annualGrossRent: Math.round(annualGrossRent),
    annualOperatingExpenses: Math.round(annualOperatingExpenses),
    annualNOI: Math.round(annualNOI),
    annualCashFlow: Math.round(annualCashFlow),
    amortizationSchedule,
  };
}
