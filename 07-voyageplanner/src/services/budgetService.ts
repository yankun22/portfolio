import type { Expense, Companion, CompanionBalance, Settlement, ExpenseCategory } from '../types/budget';
import { convertCurrency } from '../data/currencies';

export interface BudgetSummary {
  totalBudget: number;
  totalSpent: number;
  remainingBudget: number;
  spentPercentage: number;
  currency: string;
  categoryTotals: Record<ExpenseCategory, number>;
  companionBalances: CompanionBalance[];
  settlements: Settlement[];
}

/**
 * Calculates companion balances and generates the optimal simplified debt settlement matrix.
 */
export function calculateTripBudgetSummary(
  expenses: Expense[],
  companions: Companion[],
  totalBudget: number,
  primaryCurrency: string
): BudgetSummary {
  const paidMap: Record<string, number> = {};
  const owedMap: Record<string, number> = {};

  companions.forEach(c => {
    paidMap[c.id] = 0;
    owedMap[c.id] = 0;
  });

  const categoryTotals: Record<ExpenseCategory, number> = {
    Lodging: 0,
    Food: 0,
    Transit: 0,
    Tickets: 0,
    Shopping: 0,
    Activities: 0,
    Emergency: 0,
    Misc: 0
  };

  let totalSpent = 0;

  expenses.forEach(exp => {
    const amountInPrimary = exp.currency === primaryCurrency
      ? exp.amount
      : convertCurrency(exp.amount, exp.currency, primaryCurrency);

    totalSpent += amountInPrimary;
    if (categoryTotals[exp.category] !== undefined) {
      categoryTotals[exp.category] += amountInPrimary;
    } else {
      categoryTotals.Misc += amountInPrimary;
    }

    paidMap[exp.payerId] = (paidMap[exp.payerId] || 0) + amountInPrimary;

    if (!exp.splits || exp.splits.length === 0) {
      const count = companions.length || 1;
      const perPerson = amountInPrimary / count;
      companions.forEach(c => {
        owedMap[c.id] = (owedMap[c.id] || 0) + perPerson;
      });
    } else if (exp.splitType === 'EQUAL') {
      const totalShares = exp.splits.reduce((s, item) => s + (item.share > 0 ? 1 : 0), 0) || 1;
      const perShare = amountInPrimary / totalShares;
      exp.splits.forEach(item => {
        if (item.share > 0) {
          owedMap[item.companionId] = (owedMap[item.companionId] || 0) + perShare;
        }
      });
    } else if (exp.splitType === 'EXACT') {
      exp.splits.forEach(item => {
        const shareInPrimary = exp.currency === primaryCurrency
          ? item.share
          : convertCurrency(item.share, exp.currency, primaryCurrency);
        owedMap[item.companionId] = (owedMap[item.companionId] || 0) + shareInPrimary;
      });
    } else {
      const sumWeight = exp.splits.reduce((s, item) => s + item.share, 0) || 1;
      exp.splits.forEach(item => {
        const shareAmount = (amountInPrimary * item.share) / sumWeight;
        owedMap[item.companionId] = (owedMap[item.companionId] || 0) + shareAmount;
      });
    }
  });

  const companionBalances: CompanionBalance[] = companions.map(c => {
    const totalPaid = Math.round((paidMap[c.id] || 0) * 100) / 100;
    const totalOwed = Math.round((owedMap[c.id] || 0) * 100) / 100;
    const netBalance = Math.round((totalPaid - totalOwed) * 100) / 100;

    return {
      companion: c,
      totalPaid,
      totalOwed,
      netBalance
    };
  });

  const settlements = calculateOptimalSettlements(companionBalances, primaryCurrency);

  const roundedSpent = Math.round(totalSpent * 100) / 100;
  const remaining = Math.round((totalBudget - roundedSpent) * 100) / 100;
  const spentPct = totalBudget > 0 ? Math.min(100, Math.round((roundedSpent / totalBudget) * 100)) : 0;

  return {
    totalBudget,
    totalSpent: roundedSpent,
    remainingBudget: remaining,
    spentPercentage: spentPct,
    currency: primaryCurrency,
    categoryTotals,
    companionBalances,
    settlements
  };
}

export function calculateOptimalSettlements(
  balances: CompanionBalance[],
  currency: string
): Settlement[] {
  interface Party {
    id: string;
    name: string;
    amount: number;
  }

  const debtors: Party[] = [];
  const creditors: Party[] = [];

  balances.forEach(b => {
    if (b.netBalance < -0.01) {
      debtors.push({ id: b.companion.id, name: b.companion.name, amount: -b.netBalance });
    } else if (b.netBalance > 0.01) {
      creditors.push({ id: b.companion.id, name: b.companion.name, amount: b.netBalance });
    }
  });

  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  const settlements: Settlement[] = [];
  let dIdx = 0;
  let cIdx = 0;

  while (dIdx < debtors.length && cIdx < creditors.length) {
    const debtor = debtors[dIdx];
    const creditor = creditors[cIdx];

    const settledAmount = Math.min(debtor.amount, creditor.amount);
    if (settledAmount > 0.01) {
      settlements.push({
        fromId: debtor.id,
        fromName: debtor.name,
        toId: creditor.id,
        toName: creditor.name,
        amount: Math.round(settledAmount * 100) / 100,
        currency
      });
    }

    debtor.amount -= settledAmount;
    creditor.amount -= settledAmount;

    if (debtor.amount < 0.01) dIdx++;
    if (creditor.amount < 0.01) cIdx++;
  }

  return settlements;
}
