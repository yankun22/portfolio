import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Trip } from '../types/itinerary';
import type { Companion, Expense } from '../types/budget';
import type { PackingItem } from '../types/packing';
import { formatMoney } from '../data/currencies';
import { calculateTripBudgetSummary } from './budgetService';

export function exportTripToPDF(
  trip: Trip,
  companions: Companion[],
  expenses: Expense[],
  packing: PackingItem[]
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Header Banner
  doc.setFillColor(30, 41, 59);
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text('VOYAGEPLANNER ITINERARY', 14, 18);

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(148, 163, 184);
  doc.text(`${trip.title} | ${trip.destination}, ${trip.country}`, 14, 26);
  doc.text(`Dates: ${trip.startDate} to ${trip.endDate} • Currency: ${trip.primaryCurrency}`, 14, 34);

  let currentY = 50;

  // Companions section
  if (companions.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    doc.text('Travel Companions', 14, currentY);
    currentY += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    const compNames = companions.map(c => c.name + (c.isCurrentUser ? ' (Lead)' : '')).join(', ');
    doc.text(compNames, 14, currentY);
    currentY += 10;
  }

  // Daily Itinerary Activities Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(30, 41, 59);
  doc.text('Daily Schedule & Bookings', 14, currentY);
  currentY += 4;

  const tableRows: any[] = [];

  trip.days.forEach(day => {
    const dayActs = trip.activities
      .filter(a => a.dayId === day.id)
      .sort((a, b) => a.order - b.order || a.startTime.localeCompare(b.startTime));

    if (dayActs.length === 0) {
      tableRows.push([
        `Day ${day.dayNumber}: ${day.title} (${day.date})`,
        '-',
        'No scheduled activities',
        '-',
        '-',
        '-'
      ]);
    } else {
      dayActs.forEach((act, idx) => {
        tableRows.push([
          idx === 0 ? `Day ${day.dayNumber}\n${day.date}` : '',
          act.startTime,
          `${act.title}\n${act.location.name}`,
          act.category.toUpperCase(),
          act.cost > 0 ? formatMoney(act.cost, act.currency) : 'Free',
          act.confirmationCode || (act.booked ? 'Booked' : 'Planned')
        ]);
      });
    }
  });

  autoTable(doc, {
    startY: currentY,
    head: [['Day / Date', 'Time', 'Activity & Location', 'Category', 'Cost', 'Status / Ref']],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [37, 99, 235],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9
    },
    bodyStyles: {
      fontSize: 8,
      cellPadding: 3,
      textColor: [51, 65, 85]
    },
    columnStyles: {
      0: { cellWidth: 26, fontStyle: 'bold' },
      1: { cellWidth: 16 },
      2: { cellWidth: 70 },
      3: { cellWidth: 24 },
      4: { cellWidth: 22 },
      5: { cellWidth: 24 }
    },
    didDrawPage: (data) => {
      currentY = data.cursor?.y ? data.cursor.y + 12 : 200;
    }
  });

  if (currentY > 220) {
    doc.addPage();
    currentY = 20;
  }

  // Budget & Split-Bill Summary
  const budgetSummary = calculateTripBudgetSummary(expenses, companions, trip.totalBudget, trip.primaryCurrency);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(30, 41, 59);
  doc.text('Financial & Expense Split Summary', 14, currentY);
  currentY += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`Total Budget: ${formatMoney(budgetSummary.totalBudget, trip.primaryCurrency)}   |   Total Spent: ${formatMoney(budgetSummary.totalSpent, trip.primaryCurrency)}   |   Remaining: ${formatMoney(budgetSummary.remainingBudget, trip.primaryCurrency)}`, 14, currentY);
  currentY += 6;

  // Settlements Table
  if (budgetSummary.settlements.length > 0) {
    const settlementRows = budgetSummary.settlements.map(s => [
      s.fromName,
      'owes',
      s.toName,
      formatMoney(s.amount, s.currency)
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [['From (Debtor)', 'Action', 'To (Creditor)', 'Amount']],
      body: settlementRows,
      theme: 'striped',
      headStyles: { fillColor: [16, 185, 129], fontSize: 8 },
      bodyStyles: { fontSize: 8, cellPadding: 2.5 },
      margin: { left: 14, right: 14 }
    });

    const lastAutoTable = (doc as any).lastAutoTable;
    currentY = lastAutoTable ? lastAutoTable.finalY + 12 : currentY + 30;
  }

  // Packing Checklist Overview
  if (packing && packing.length > 0) {
    if (currentY > 230) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(30, 41, 59);
    doc.text('Packing Essentials Checklist', 14, currentY);
    currentY += 6;

    const packedCount = packing.filter(p => p.packed).length;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text(`Packed ${packedCount} of ${packing.length} items (${Math.round((packedCount / packing.length) * 100)}%)`, 14, currentY);
    currentY += 4;

    const packingRows = packing.slice(0, 20).map(p => [
      p.packed ? '[x] Packed' : '[ ] Pending',
      p.category,
      p.name,
      p.quantity.toString(),
      p.essential ? 'Essential' : 'Optional'
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [['Status', 'Category', 'Item Name', 'Qty', 'Priority']],
      body: packingRows,
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229], fontSize: 8 },
      bodyStyles: { fontSize: 8, cellPadding: 2 }
    });
  }

  const pageCount = (doc.internal as any).getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`VoyagePlanner • Page ${i} of ${pageCount} • Generated on ${new Date().toLocaleDateString()}`, 14, 290);
  }

  doc.save(`${trip.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-itinerary.pdf`);
}
