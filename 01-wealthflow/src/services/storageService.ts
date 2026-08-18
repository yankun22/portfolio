import type { Asset, Currency } from '../types/portfolio';
import type { MonteCarloParams } from '../types/monteCarlo';
import type { FireParams } from '../types/fire';
import { PRESET_PROFILES } from '../data/presetProfiles';

const STORAGE_KEYS = {
  ASSETS: 'wealthflow_assets_v1',
  CURRENCY: 'wealthflow_currency_v1',
  MONTE_CARLO: 'wealthflow_monte_carlo_v1',
  FIRE: 'wealthflow_fire_v1',
  ACTIVE_TAB: 'wealthflow_active_tab_v1',
};

export const SUPPORTED_CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1.0 },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.92 },
  { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.78 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rate: 154.5 },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', rate: 1.37 },
  { code: 'AUD', symbol: 'AU$', name: 'Australian Dollar', rate: 1.52 },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', rate: 0.90 },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 83.5 },
  { code: 'SGD', symbol: 'SG$', name: 'Singapore Dollar', rate: 1.35 },
];

export const DEFAULT_MONTE_CARLO_PARAMS: MonteCarloParams = {
  initialCapital: 435000,
  monthlyContribution: 2500,
  timeHorizonYears: 25,
  meanAnnualReturn: 8.5,
  annualVolatility: 16.0,
  inflationRate: 2.5,
  isInflationAdjusted: true,
  numSimulations: 500,
  targetGoalAmount: 2500000,
};

export const DEFAULT_FIRE_PARAMS: FireParams = {
  currentAge: 32,
  targetRetirementAge: 55,
  annualSpending: 65000,
  leanAnnualSpending: 42000,
  fatAnnualSpending: 120000,
  safeWithdrawalRate: 4.0,
  expectedReturnRate: 8.0,
  inflationRate: 2.5,
  monthlySavings: 2500,
  currentNetWorth: 435000,
  usePortfolioNetWorth: true,
};

export class StorageService {
  static loadAssets(): Asset[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ASSETS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load assets from localStorage:', e);
    }
    return PRESET_PROFILES[0].assets;
  }

  static saveAssets(assets: Asset[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(assets));
    } catch (e) {
      console.error('Failed to save assets to localStorage:', e);
    }
  }

  static loadCurrency(): Currency {
    try {
      const code = localStorage.getItem(STORAGE_KEYS.CURRENCY);
      if (code) {
        const match = SUPPORTED_CURRENCIES.find((c) => c.code === code);
        if (match) return match;
      }
    } catch (e) {
      console.error('Failed to load currency:', e);
    }
    return SUPPORTED_CURRENCIES[0];
  }

  static saveCurrency(currency: Currency): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENCY, currency.code);
    } catch (e) {
      console.error('Failed to save currency:', e);
    }
  }

  static loadMonteCarloParams(): MonteCarloParams {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MONTE_CARLO);
      if (data) {
        return { ...DEFAULT_MONTE_CARLO_PARAMS, ...JSON.parse(data) };
      }
    } catch (e) {
      console.error('Failed to load Monte Carlo params:', e);
    }
    return DEFAULT_MONTE_CARLO_PARAMS;
  }

  static saveMonteCarloParams(params: MonteCarloParams): void {
    try {
      localStorage.setItem(STORAGE_KEYS.MONTE_CARLO, JSON.stringify(params));
    } catch (e) {
      console.error('Failed to save Monte Carlo params:', e);
    }
  }

  static loadFireParams(): FireParams {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FIRE);
      if (data) {
        return { ...DEFAULT_FIRE_PARAMS, ...JSON.parse(data) };
      }
    } catch (e) {
      console.error('Failed to load FIRE params:', e);
    }
    return DEFAULT_FIRE_PARAMS;
  }

  static saveFireParams(params: FireParams): void {
    try {
      localStorage.setItem(STORAGE_KEYS.FIRE, JSON.stringify(params));
    } catch (e) {
      console.error('Failed to save FIRE params:', e);
    }
  }

  static loadActiveTab(): string {
    try {
      return localStorage.getItem(STORAGE_KEYS.ACTIVE_TAB) || 'portfolio';
    } catch {
      return 'portfolio';
    }
  }

  static saveActiveTab(tab: string): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_TAB, tab);
    } catch (e) {
      console.error('Failed to save active tab:', e);
    }
  }

  static exportFullProfileJson(assets: Asset[], mcParams: MonteCarloParams, fireParams: FireParams): string {
    const payload = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      wealthflow: {
        assets,
        monteCarloParams: mcParams,
        fireParams,
      },
    };
    return JSON.stringify(payload, null, 2);
  }

  static clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
  }
}
