import type { Asset, Currency } from '../types/portfolio';
import type { SimulationYearData } from '../types/monteCarlo';

function triggerDownload(content: string, filename: string, mimeType = 'text/csv;charset=utf-8;') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportHoldingsToCsv(assets: Asset[], currency: Currency): void {
  const headers = [
    'Asset Name',
    'Symbol/Ticker',
    'Category',
    `Current Value (${currency.code})`,
    `Cost Basis (${currency.code})`,
    `Unrealized Gain/Loss (${currency.code})`,
    'Gain/Loss (%)',
    'Annual Yield (%)',
    'Target Allocation (%)',
    'Notes',
    'Last Updated',
  ];

  const rows = assets.map((a) => {
    const gain = a.value - a.costBasis;
    const gainPct = a.costBasis > 0 ? ((gain / a.costBasis) * 100).toFixed(2) : '0.00';
    return [
      `"${a.name.replace(/"/g, '""')}"`,
      `"${a.symbol || ''}"`,
      `"${a.category}"`,
      (a.value * currency.rate).toFixed(2),
      (a.costBasis * currency.rate).toFixed(2),
      (gain * currency.rate).toFixed(2),
      `${gainPct}%`,
      `${a.annualYieldPercent.toFixed(2)}%`,
      `${a.targetAllocationPercent.toFixed(1)}%`,
      `"${(a.notes || '').replace(/"/g, '""')}"`,
      a.lastUpdated,
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\r\n');
  const filename = `wealthflow_portfolio_holdings_${new Date().toISOString().split('T')[0]}.csv`;
  triggerDownload(csvContent, filename);
}

export function exportMonteCarloToCsv(yearlyData: SimulationYearData[], currency: Currency): void {
  const headers = [
    'Year',
    'Calendar Year',
    `10th Percentile Bear Case (${currency.code})`,
    `25th Percentile (${currency.code})`,
    `50th Percentile Median Base Case (${currency.code})`,
    `75th Percentile (${currency.code})`,
    `90th Percentile Bull Case (${currency.code})`,
    `Arithmetic Mean (${currency.code})`,
    `Total Cumulative Contributions (${currency.code})`,
    `Real Purchasing Power Median (${currency.code})`,
  ];

  const rows = yearlyData.map((d) =>
    [
      d.year,
      d.calendarYear,
      Math.round(d.p10 * currency.rate),
      Math.round(d.p25 * currency.rate),
      Math.round(d.p50 * currency.rate),
      Math.round(d.p75 * currency.rate),
      Math.round(d.p90 * currency.rate),
      Math.round(d.mean * currency.rate),
      Math.round(d.contributionsOnly * currency.rate),
      Math.round(d.realPurchasingPowerMedian * currency.rate),
    ].join(',')
  );

  const csvContent = [headers.join(','), ...rows].join('\r\n');
  const filename = `wealthflow_monte_carlo_projections_${new Date().toISOString().split('T')[0]}.csv`;
  triggerDownload(csvContent, filename);
}
