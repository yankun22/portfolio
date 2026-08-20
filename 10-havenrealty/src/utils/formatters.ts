import { CurrencyCode, UnitSystem } from '../types/property';

export const CURRENCY_RATES: Record<CurrencyCode, { symbol: string; rate: number; name: string }> = {
  USD: { symbol: '$', rate: 1.0, name: 'US Dollar' },
  EUR: { symbol: '€', rate: 0.92, name: 'Euro' },
  GBP: { symbol: '£', rate: 0.79, name: 'British Pound' },
  JPY: { symbol: '¥', rate: 155.0, name: 'Japanese Yen' },
  CAD: { symbol: 'CA$', rate: 1.36, name: 'Canadian Dollar' },
};

export function formatCurrency(amountInUSD: number, currency: CurrencyCode = 'USD', compact: boolean = false): string {
  const info = CURRENCY_RATES[currency] || CURRENCY_RATES.USD;
  const converted = amountInUSD * info.rate;

  if (compact) {
    if (converted >= 1_000_000) {
      return `${info.symbol}${(converted / 1_000_000).toFixed(2)}M`;
    }
    if (converted >= 1_000) {
      return `${info.symbol}${(converted / 1_000).toFixed(0)}k`;
    }
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: currency === 'JPY' ? 0 : 0,
    minimumFractionDigits: 0,
  }).format(converted);
}

export function formatArea(sqft: number, unit: UnitSystem = 'imperial'): string {
  if (unit === 'metric') {
    const sqm = Math.round(sqft * 0.092903);
    return `${sqm.toLocaleString()} m²`;
  }
  return `${sqft.toLocaleString()} sq ft`;
}

export function formatPercent(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
