import type { CurrencyRate } from '../types/budget';

export const POPULAR_CURRENCIES: CurrencyRate[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', rateAgainstUSD: 1.0 },
  { code: 'EUR', name: 'Euro', symbol: '€', rateAgainstUSD: 0.92 },
  { code: 'GBP', name: 'British Pound', symbol: '£', rateAgainstUSD: 0.79 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rateAgainstUSD: 155.2 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', rateAgainstUSD: 1.37 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rateAgainstUSD: 1.53 },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', rateAgainstUSD: 0.91 },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', rateAgainstUSD: 1.34 },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rateAgainstUSD: 7.24 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', rateAgainstUSD: 83.5 },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', rateAgainstUSD: 1380.0 },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', rateAgainstUSD: 36.8 },
  { code: 'ISK', name: 'Icelandic Króna', symbol: 'kr', rateAgainstUSD: 139.5 },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', rateAgainstUSD: 1.66 },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'Mex$', rateAgainstUSD: 18.2 },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', rateAgainstUSD: 5.45 },
  { code: 'AED', name: 'UAE Dirham', symbol: 'AED', rateAgainstUSD: 3.67 },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', rateAgainstUSD: 10.65 }
];

export const CURRENCY_MAP: Record<string, CurrencyRate> = POPULAR_CURRENCIES.reduce((acc, curr) => {
  acc[curr.code] = curr;
  return acc;
}, {} as Record<string, CurrencyRate>);

export function convertCurrency(
  amount: number,
  fromCode: string,
  toCode: string,
  customRates?: Record<string, number>
): number {
  if (fromCode === toCode) return amount;
  
  const fromRate = customRates?.[fromCode] ?? CURRENCY_MAP[fromCode]?.rateAgainstUSD ?? 1.0;
  const toRate = customRates?.[toCode] ?? CURRENCY_MAP[toCode]?.rateAgainstUSD ?? 1.0;

  const inUSD = amount / fromRate;
  const inTarget = inUSD * toRate;
  return Math.round(inTarget * 100) / 100;
}

export function formatMoney(amount: number, currencyCode: string = 'USD'): string {
  const meta = CURRENCY_MAP[currencyCode] || { symbol: currencyCode + ' ' };
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: ['JPY', 'KRW', 'ISK'].includes(currencyCode) ? 0 : 2,
    maximumFractionDigits: ['JPY', 'KRW', 'ISK'].includes(currencyCode) ? 0 : 2,
  }).format(amount);

  return `${meta.symbol}${formatted}`;
}
