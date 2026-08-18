import { createContext } from 'react';
import type { Asset, CategoryBreakdownItem, Currency, PortfolioSummary } from '../types/portfolio';
import type { MonteCarloParams, SimulationResults } from '../types/monteCarlo';
import type { FireCalculationResults, FireParams } from '../types/fire';

export interface WealthContextType {
  assets: Asset[];
  addAsset: (asset: Omit<Asset, 'id' | 'lastUpdated'>) => void;
  updateAsset: (id: string, asset: Partial<Asset>) => void;
  deleteAsset: (id: string) => void;
  duplicateAsset: (id: string) => void;
  loadPreset: (presetId: string) => void;
  resetToDefault: () => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatCurrency: (amount: number, includeDecimals?: boolean) => string;
  summary: PortfolioSummary;
  mcParams: MonteCarloParams;
  setMcParams: React.Dispatch<React.SetStateAction<MonteCarloParams>>;
  mcResults: SimulationResults;
  fireParams: FireParams;
  setFireParams: React.Dispatch<React.SetStateAction<FireParams>>;
  fireResults: FireCalculationResults;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  exportPdf: () => void;
  exportHoldingsCsv: () => void;
  exportMonteCarloCsv: () => void;
  exportJsonBackup: () => void;
  importJsonBackup: (fileContent: string) => boolean;
  toast: { message: string; type: 'success' | 'info' | 'warning' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

export type { CategoryBreakdownItem };
export const WealthContext = createContext<WealthContextType | undefined>(undefined);
