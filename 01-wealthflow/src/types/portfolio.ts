export type AssetCategory = 'Cash' | 'Stocks' | 'Crypto' | 'Real Estate' | 'Commodities';

export interface Asset {
  id: string;
  name: string;
  symbol?: string;
  category: AssetCategory;
  value: number;
  costBasis: number;
  quantity?: number;
  annualYieldPercent: number; // e.g. 2.5 for 2.5% dividend/yield
  targetAllocationPercent: number; // e.g. 20 for 20%
  notes?: string;
  lastUpdated: string;
}

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  rate: number; // Relative to USD
}

export interface CategoryBreakdownItem {
  category: AssetCategory;
  value: number;
  percent: number;
  targetPercent: number;
  count: number;
  diffValue: number;
  color: string;
}

export interface PortfolioSummary {
  totalValue: number;
  totalCostBasis: number;
  unrealizedGain: number;
  unrealizedGainPercent: number;
  annualPassiveIncome: number;
  weightedYieldPercent: number;
  categoryBreakdown: Record<AssetCategory, CategoryBreakdownItem>;
  topHolding: Asset | null;
  assetCount: number;
}
