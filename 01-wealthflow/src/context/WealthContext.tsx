import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { Asset, AssetCategory, CategoryBreakdownItem, Currency, PortfolioSummary } from '../types/portfolio';
import type { MonteCarloParams, SimulationResults } from '../types/monteCarlo';
import type { FireCalculationResults, FireParams } from '../types/fire';
import { PRESET_PROFILES } from '../data/presetProfiles';
import { runMonteCarloSimulation } from '../services/monteCarloEngine';
import { calculateFireMilestones } from '../services/fireCalculator';
import { exportHoldingsToCsv, exportMonteCarloToCsv } from '../services/csvExportService';
import { generateWealthflowPdfReport } from '../services/pdfExportService';
import {
  StorageService,
  SUPPORTED_CURRENCIES,
  DEFAULT_MONTE_CARLO_PARAMS,
  DEFAULT_FIRE_PARAMS,
} from '../services/storageService';
import { WealthContext } from './WealthContextCore';

const CATEGORY_COLORS: Record<AssetCategory, string> = {
  Cash: '#10b981',
  Stocks: '#3b82f6',
  Crypto: '#8b5cf6',
  'Real Estate': '#f59e0b',
  Commodities: '#ec4899',
};

export const WealthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assets, setAssets] = useState<Asset[]>(() => StorageService.loadAssets());
  const [currency, setCurrencyState] = useState<Currency>(() => StorageService.loadCurrency());
  const [mcParams, setMcParamsState] = useState<MonteCarloParams>(() => StorageService.loadMonteCarloParams());
  const [fireParams, setFireParamsState] = useState<FireParams>(() => StorageService.loadFireParams());
  const [activeTab, setActiveTabState] = useState<string>(() => StorageService.loadActiveTab());
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  }, []);

  useEffect(() => {
    StorageService.saveAssets(assets);
  }, [assets]);

  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c);
    StorageService.saveCurrency(c);
  }, []);

  const setMcParams: React.Dispatch<React.SetStateAction<MonteCarloParams>> = useCallback((action) => {
    setMcParamsState((prev) => {
      const next = typeof action === 'function' ? action(prev) : action;
      StorageService.saveMonteCarloParams(next);
      return next;
    });
  }, []);

  const setFireParams: React.Dispatch<React.SetStateAction<FireParams>> = useCallback((action) => {
    setFireParamsState((prev) => {
      const next = typeof action === 'function' ? action(prev) : action;
      StorageService.saveFireParams(next);
      return next;
    });
  }, []);

  const setActiveTab = useCallback((tab: string) => {
    setActiveTabState(tab);
    StorageService.saveActiveTab(tab);
  }, []);

  const summary = useMemo<PortfolioSummary>(() => {
    let totalValue = 0;
    let totalCostBasis = 0;
    let annualPassiveIncome = 0;
    let topHolding: Asset | null = null;
    let maxVal = -1;

    const categories: AssetCategory[] = ['Cash', 'Stocks', 'Crypto', 'Real Estate', 'Commodities'];
    const catMap: Record<AssetCategory, { value: number; targetPercent: number; count: number }> = {
      Cash: { value: 0, targetPercent: 0, count: 0 },
      Stocks: { value: 0, targetPercent: 0, count: 0 },
      Crypto: { value: 0, targetPercent: 0, count: 0 },
      'Real Estate': { value: 0, targetPercent: 0, count: 0 },
      Commodities: { value: 0, targetPercent: 0, count: 0 },
    };

    assets.forEach((a) => {
      totalValue += a.value;
      totalCostBasis += a.costBasis;
      annualPassiveIncome += (a.value * a.annualYieldPercent) / 100;

      if (catMap[a.category]) {
        catMap[a.category].value += a.value;
        catMap[a.category].targetPercent += a.targetAllocationPercent;
        catMap[a.category].count += 1;
      }

      if (a.value > maxVal) {
        maxVal = a.value;
        topHolding = a;
      }
    });

    const unrealizedGain = totalValue - totalCostBasis;
    const unrealizedGainPercent = totalCostBasis > 0 ? (unrealizedGain / totalCostBasis) * 100 : 0;
    const weightedYieldPercent = totalValue > 0 ? (annualPassiveIncome / totalValue) * 100 : 0;

    const categoryBreakdown = {} as Record<AssetCategory, CategoryBreakdownItem>;
    categories.forEach((cat) => {
      const val = catMap[cat].value;
      const pct = totalValue > 0 ? (val / totalValue) * 100 : 0;
      const targetPct = catMap[cat].targetPercent;
      const targetVal = (targetPct / 100) * totalValue;
      const diffVal = val - targetVal;

      categoryBreakdown[cat] = {
        category: cat,
        value: val,
        percent: pct,
        targetPercent: targetPct,
        count: catMap[cat].count,
        diffValue: diffVal,
        color: CATEGORY_COLORS[cat],
      };
    });

    return {
      totalValue,
      totalCostBasis,
      unrealizedGain,
      unrealizedGainPercent,
      annualPassiveIncome,
      weightedYieldPercent,
      categoryBreakdown,
      topHolding,
      assetCount: assets.length,
    };
  }, [assets]);

  const mcResults = useMemo<SimulationResults>(() => {
    return runMonteCarloSimulation(mcParams);
  }, [mcParams]);

  const effectiveFireParams = useMemo<FireParams>(() => {
    return {
      ...fireParams,
      currentNetWorth: fireParams.usePortfolioNetWorth ? summary.totalValue : fireParams.currentNetWorth,
    };
  }, [fireParams, summary.totalValue]);

  const fireResults = useMemo<FireCalculationResults>(() => {
    return calculateFireMilestones(effectiveFireParams);
  }, [effectiveFireParams]);

  const addAsset = useCallback((newAssetData: Omit<Asset, 'id' | 'lastUpdated'>) => {
    const newAsset: Asset = {
      ...newAssetData,
      id: 'asset_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    setAssets((prev) => [newAsset, ...prev]);
    showToast(`Added "${newAsset.name}" to portfolio`);
  }, [showToast]);

  const updateAsset = useCallback((id: string, updated: Partial<Asset>) => {
    setAssets((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, ...updated, lastUpdated: new Date().toISOString().split('T')[0] }
          : a
      )
    );
    showToast('Asset updated successfully');
  }, [showToast]);

  const deleteAsset = useCallback((id: string) => {
    setAssets((prev) => {
      const target = prev.find((a) => a.id === id);
      const filtered = prev.filter((a) => a.id !== id);
      showToast(`Removed "${target?.name || 'asset'}" from portfolio`, 'info');
      return filtered;
    });
  }, [showToast]);

  const duplicateAsset = useCallback((id: string) => {
    setAssets((prev) => {
      const match = prev.find((a) => a.id === id);
      if (!match) return prev;
      const copy: Asset = {
        ...match,
        id: 'asset_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        name: `${match.name} (Copy)`,
        lastUpdated: new Date().toISOString().split('T')[0],
      };
      showToast(`Duplicated "${match.name}"`);
      return [copy, ...prev];
    });
  }, [showToast]);

  const loadPreset = useCallback((presetId: string) => {
    const preset = PRESET_PROFILES.find((p) => p.id === presetId);
    if (preset) {
      setAssets(preset.assets);
      setMcParamsState((prev) => ({ ...prev, initialCapital: preset.initialNetWorth }));
      setFireParamsState((prev) => ({ ...prev, currentNetWorth: preset.initialNetWorth }));
      showToast(`Loaded preset profile: ${preset.name}`);
    }
  }, [showToast]);

  const resetToDefault = useCallback(() => {
    StorageService.clearAllData();
    const defaultAssets = PRESET_PROFILES[0].assets;
    setAssets(defaultAssets);
    setCurrencyState(SUPPORTED_CURRENCIES[0]);
    setMcParamsState(DEFAULT_MONTE_CARLO_PARAMS);
    setFireParamsState(DEFAULT_FIRE_PARAMS);
    setActiveTabState('portfolio');
    showToast('Reset all data to defaults', 'info');
  }, [showToast]);

  const formatCurrency = useCallback((amount: number, includeDecimals = false): string => {
    const converted = amount * currency.rate;
    if (includeDecimals) {
      return `${currency.symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `${currency.symbol}${Math.round(converted).toLocaleString()}`;
  }, [currency]);

  const exportPdf = useCallback(() => {
    try {
      generateWealthflowPdfReport({
        assets,
        summary,
        currency,
        mcParams,
        mcResults,
        fireParams: effectiveFireParams,
        fireResults,
      });
      showToast('PDF Financial Report generated & downloaded successfully!');
    } catch (e) {
      console.error('PDF generation error:', e);
      showToast('Failed to generate PDF. Check browser console.', 'warning');
    }
  }, [assets, summary, currency, mcParams, mcResults, effectiveFireParams, fireResults, showToast]);

  const exportHoldingsCsv = useCallback(() => {
    exportHoldingsToCsv(assets, currency);
    showToast('Portfolio holdings CSV downloaded');
  }, [assets, currency, showToast]);

  const exportMonteCarloCsv = useCallback(() => {
    exportMonteCarloToCsv(mcResults.yearlyData, currency);
    showToast('Monte Carlo projection CSV downloaded');
  }, [mcResults.yearlyData, currency, showToast]);

  const exportJsonBackup = useCallback(() => {
    const json = StorageService.exportFullProfileJson(assets, mcParams, fireParams);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wealthflow_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('JSON Profile Backup exported');
  }, [assets, mcParams, fireParams, showToast]);

  const importJsonBackup = useCallback((content: string): boolean => {
    try {
      const parsed = JSON.parse(content);
      if (parsed?.wealthflow?.assets && Array.isArray(parsed.wealthflow.assets)) {
        setAssets(parsed.wealthflow.assets);
        if (parsed.wealthflow.monteCarloParams) {
          setMcParamsState(parsed.wealthflow.monteCarloParams);
        }
        if (parsed.wealthflow.fireParams) {
          setFireParamsState(parsed.wealthflow.fireParams);
        }
        showToast('Profile Backup imported successfully!');
        return true;
      }
      showToast('Invalid backup file structure', 'warning');
      return false;
    } catch {
      showToast('Failed to parse backup JSON file', 'warning');
      return false;
    }
  }, [showToast]);

  return (
    <WealthContext.Provider
      value={{
        assets,
        addAsset,
        updateAsset,
        deleteAsset,
        duplicateAsset,
        loadPreset,
        resetToDefault,
        currency,
        setCurrency,
        formatCurrency,
        summary,
        mcParams,
        setMcParams,
        mcResults,
        fireParams,
        setFireParams,
        fireResults,
        activeTab,
        setActiveTab,
        exportPdf,
        exportHoldingsCsv,
        exportMonteCarloCsv,
        exportJsonBackup,
        importJsonBackup,
        toast,
        showToast,
      }}
    >
      {children}
    </WealthContext.Provider>
  );
};


