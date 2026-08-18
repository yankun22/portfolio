import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Asset, Currency, PortfolioSummary } from '../types/portfolio';
import type { MonteCarloParams, SimulationResults } from '../types/monteCarlo';
import type { FireCalculationResults, FireParams } from '../types/fire';

export interface PdfExportData {
  assets: Asset[];
  summary: PortfolioSummary;
  currency: Currency;
  mcParams: MonteCarloParams;
  mcResults: SimulationResults;
  fireParams: FireParams;
  fireResults: FireCalculationResults;
}

export function generateWealthflowPdfReport(data: PdfExportData): void {
  const { assets, summary, currency, mcParams, mcResults, fireParams, fireResults } = data;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  const formatMoney = (amount: number): string => {
    const val = amount * currency.rate;
    return `${currency.symbol}${Math.round(val).toLocaleString()}`;
  };

  const drawHeader = (pageNum: number, totalPages: number, pageTitle: string) => {
    // Top luxury dark banner
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, pageWidth, 24, 'F');

    // Accent line
    doc.setFillColor(16, 185, 129); // emerald-500
    doc.rect(0, 23.5, pageWidth, 0.8, 'F');

    // Title & Brand
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('WEALTHFLOW™', margin, 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text('PRIVATE WEALTH INTELLIGENCE REPORT', margin, 18);

    // Right header info
    doc.setFontSize(8.5);
    doc.setTextColor(203, 213, 225);
    const dateStr = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    doc.text(`DATE: ${dateStr.toUpperCase()}  |  CURRENCY: ${currency.code}`, pageWidth - margin, 12, { align: 'right' });
    doc.setTextColor(148, 163, 184);
    doc.text(`SECTION: ${pageTitle.toUpperCase()}`, pageWidth - margin, 18, { align: 'right' });

    // Footer
    doc.setFillColor(248, 250, 252);
    doc.rect(0, pageHeight - 12, pageWidth, 12, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text('Confidential — Prepared for Personal Wealth Planning & Strategy', margin, pageHeight - 5);
    doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - margin, pageHeight - 5, { align: 'right' });
  };

  // ==========================================
  // PAGE 1: Executive Overview & Allocation
  // ==========================================
  drawHeader(1, 3, 'Executive Wealth Scorecard');

  let y = 32;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42);
  doc.text('Portfolio Executive Overview', margin, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Consolidated multi-asset balance sheet, performance yield, and capital distribution.', margin, y);
  y += 10;

  const cardWidth = (contentWidth - 9) / 4;
  const cardHeight = 22;

  const kpis = [
    {
      title: 'TOTAL NET WORTH',
      val: formatMoney(summary.totalValue),
      sub: `${summary.assetCount} Total Assets`,
      color: [16, 185, 129],
    },
    {
      title: 'UNREALIZED GAIN',
      val: `${summary.unrealizedGain >= 0 ? '+' : ''}${formatMoney(summary.unrealizedGain)}`,
      sub: `${summary.unrealizedGainPercent >= 0 ? '+' : ''}${summary.unrealizedGainPercent.toFixed(1)}% Return`,
      color: summary.unrealizedGain >= 0 ? [16, 185, 129] : [239, 68, 68],
    },
    {
      title: 'ANNUAL PASSIVE YIELD',
      val: formatMoney(summary.annualPassiveIncome),
      sub: `${summary.weightedYieldPercent.toFixed(2)}% Weighted Yield`,
      color: [6, 182, 212],
    },
    {
      title: 'TOTAL COST BASIS',
      val: formatMoney(summary.totalCostBasis),
      sub: 'Cumulative Invested',
      color: [139, 92, 246],
    },
  ];

  kpis.forEach((kpi, idx) => {
    const cardX = margin + idx * (cardWidth + 3);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(cardX, y, cardWidth, cardHeight, 2, 2, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(cardX, y, cardWidth, cardHeight, 2, 2, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(kpi.title, cardX + 3.5, y + 5.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11.5);
    doc.setTextColor(15, 23, 42);
    doc.text(kpi.val, cardX + 3.5, y + 13);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(kpi.color[0], kpi.color[1], kpi.color[2]);
    doc.text(kpi.sub, cardX + 3.5, y + 18.5);
  });

  y += cardHeight + 10;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('Asset Class Allocation & Rebalancing Targets', margin, y);
  y += 6;

  const categoryRows = Object.values(summary.categoryBreakdown).map((c) => {
    const diffPct = (c.percent - c.targetPercent).toFixed(1);
    const diffSign = c.percent >= c.targetPercent ? '+' : '';
    const action =
      c.diffValue > 500
        ? `Trim ${formatMoney(Math.abs(c.diffValue))}`
        : c.diffValue < -500
        ? `Add ${formatMoney(Math.abs(c.diffValue))}`
        : 'On Target';

    return [
      c.category,
      formatMoney(c.value),
      `${c.percent.toFixed(1)}%`,
      `${c.targetPercent.toFixed(1)}%`,
      `${diffSign}${diffPct}%`,
      action,
    ];
  });

  autoTable(doc, {
    startY: y,
    head: [['Asset Class', 'Current Value', 'Current %', 'Target %', 'Drift %', 'Rebalance Guidance']],
    body: categoryRows,
    theme: 'grid',
    styles: {
      fontSize: 8.5,
      cellPadding: 3,
      textColor: [30, 41, 59],
    },
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { left: margin, right: margin },
  });

  // @ts-expect-error autoTable adds lastAutoTable to doc
  y = doc.lastAutoTable.finalY + 12;

  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, y, contentWidth, 38, 2, 2, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 38, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Key Portfolio Observations & Health Highlights', margin + 5, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);

  const topAssetPct = summary.totalValue > 0 && summary.topHolding ? ((summary.topHolding.value / summary.totalValue) * 100).toFixed(1) : '0';
  const points = [
    `• Top Holding Concentration: ${summary.topHolding ? `${summary.topHolding.name} represents ${topAssetPct}% of total net worth.` : 'N/A'}`,
    `• Liquid Reserves: Cash & cash equivalents provide ${summary.categoryBreakdown.Cash ? summary.categoryBreakdown.Cash.percent.toFixed(1) : '0'}% liquidity cushion.`,
    `• Growth & Compounding Engine: Equities and alternatives represent ${(100 - (summary.categoryBreakdown.Cash ? summary.categoryBreakdown.Cash.percent : 0)).toFixed(1)}% of productively invested capital.`,
    `• Estimated Annual Cashflow: Portfolio is producing ${formatMoney(summary.annualPassiveIncome)} per year (${formatMoney(summary.annualPassiveIncome / 12)}/month) in passive dividends and yields.`,
  ];

  points.forEach((p, idx) => {
    doc.text(p, margin + 5, y + 14 + idx * 5.5);
  });

  // ==========================================
  // PAGE 2: Detailed Holdings Ledger
  // ==========================================
  doc.addPage();
  drawHeader(2, 3, 'Holdings Ledger & Cost Basis');

  y = 32;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42);
  doc.text('Itemized Asset Holdings Ledger', margin, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Granular breakdown of individual assets, cost basis, unrealized gain, and dividend yields.', margin, y);
  y += 8;

  const holdingsRows = assets.map((a) => {
    const gain = a.value - a.costBasis;
    const gainPct = a.costBasis > 0 ? ((gain / a.costBasis) * 100).toFixed(1) : '0.0';
    const gainSign = gain >= 0 ? '+' : '';
    const shareOfTotal = summary.totalValue > 0 ? ((a.value / summary.totalValue) * 100).toFixed(1) : '0.0';

    return [
      a.name + (a.symbol ? ` (${a.symbol})` : ''),
      a.category,
      formatMoney(a.costBasis),
      formatMoney(a.value),
      `${gainSign}${formatMoney(gain)} (${gainSign}${gainPct}%)`,
      `${shareOfTotal}%`,
      `${a.annualYieldPercent.toFixed(1)}%`,
      a.notes || '—',
    ];
  });

  autoTable(doc, {
    startY: y,
    head: [['Asset Name / Symbol', 'Class', 'Cost Basis', 'Market Value', 'Unrealized Gain', 'Share %', 'Yield', 'Notes']],
    body: holdingsRows,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2.8,
      textColor: [30, 41, 59],
    },
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 42 },
      1: { cellWidth: 20 },
      7: { cellWidth: 35 },
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { left: margin, right: margin },
  });

  // @ts-expect-error autoTable adds lastAutoTable to doc
  y = doc.lastAutoTable.finalY + 12;

  // ==========================================
  // PAGE 3: FIRE Readiness & Monte Carlo Projections
  // ==========================================
  doc.addPage();
  drawHeader(3, 3, 'FIRE Readiness & Monte Carlo Analysis');

  y = 32;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42);
  doc.text('Financial Independence (FIRE) Readiness', margin, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Projections based on ${fireParams.safeWithdrawalRate}% Safe Withdrawal Rate & $${fireParams.annualSpending.toLocaleString()} desired annual spending.`, margin, y);
  y += 8;

  const fireMilestoneRows = Object.values(fireResults.milestones).map((m) => {
    return [
      m.title,
      formatMoney(m.targetAmount),
      `${m.currentProgressPercent.toFixed(1)}%`,
      m.isAchieved ? 'ACHIEVED' : m.projectedYear ? `${m.projectedYear} (Age ${m.projectedAge})` : 'In Progress',
      m.isAchieved ? '0 Yrs' : m.yearsRemaining ? `${m.yearsRemaining} Yrs` : '—',
      formatMoney(m.annualSafeWithdrawal),
    ];
  });

  autoTable(doc, {
    startY: y,
    head: [['FIRE Milestone', 'Target Capital', 'Progress %', 'Projected Date', 'Time Remaining', 'Annual Safe Income']],
    body: fireMilestoneRows,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2.8,
      textColor: [30, 41, 59],
    },
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { left: margin, right: margin },
  });

  // @ts-expect-error autoTable adds lastAutoTable to doc
  y = doc.lastAutoTable.finalY + 12;

  // Monte Carlo Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('Monte Carlo 500-Iteration Stochastic Trajectories', margin, y);
  y += 5.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Mean Return: ${mcParams.meanAnnualReturn}% | Volatility: ${mcParams.annualVolatility}% | Inflation: ${mcParams.inflationRate}% | Monthly: ${formatMoney(mcParams.monthlyContribution)}/mo`, margin, y);
  y += 6;

  const horizonYears = [10, 25, 50].filter((h) => h <= mcParams.timeHorizonYears || h === 10 || h === 25);
  const mcRows = horizonYears.map((h) => {
    const item = mcResults.yearlyData.find((d) => d.year === h) || mcResults.yearlyData[mcResults.yearlyData.length - 1];
    return [
      `${h} Years (${item.calendarYear})`,
      formatMoney(item.p10),
      formatMoney(item.p50),
      formatMoney(item.p90),
      formatMoney(item.mean),
      formatMoney(item.contributionsOnly),
    ];
  });

  autoTable(doc, {
    startY: y,
    head: [['Time Horizon', '10th Percentile (Bear)', '50th Percentile (Median)', '90th Percentile (Bull)', 'Mean Outcome', 'Principal Contributed']],
    body: mcRows,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2.8,
      textColor: [30, 41, 59],
    },
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { left: margin, right: margin },
  });

  // @ts-expect-error autoTable adds lastAutoTable to doc
  y = doc.lastAutoTable.finalY + 10;

  // Disclaimer Box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, contentWidth, 20, 1.5, 1.5, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 20, 1.5, 1.5, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('DISCLAIMER & METHODOLOGY NOTE', margin + 3, y + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  const disclaimerText =
    'This report is generated for educational and financial modeling purposes only. Past performance does not guarantee future results. Monte Carlo simulations model stochastic log-normal Brownian motion returns based on specified inputs and do not account for extreme black-swan market dislocations or personalized tax implications.';
  const splitDisclaimer = doc.splitTextToSize(disclaimerText, contentWidth - 6);
  doc.text(splitDisclaimer, margin + 3, y + 9);

  // Save PDF
  const filename = `wealthflow_financial_health_report_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
}
