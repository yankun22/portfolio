import React from 'react';
import type { Trip } from '../../types/itinerary';
import type { Companion, Expense } from '../../types/budget';
import type { PackingItem } from '../../types/packing';
import { formatMoney, convertCurrency } from '../../data/currencies';
import { calculateTripBudgetSummary } from '../../services/budgetService';
import { Printer, Download, ArrowLeft } from 'lucide-react';

interface PrintViewProps {
  trip: Trip;
  companions: Companion[];
  expenses: Expense[];
  packing: PackingItem[];
  primaryCurrency: string;
  onExportPDF: () => void;
  onBackToItinerary: () => void;
}

export const PrintView: React.FC<PrintViewProps> = ({
  trip,
  companions,
  expenses,
  packing,
  primaryCurrency,
  onExportPDF,
  onBackToItinerary
}) => {
  const tripStoredCurrency = trip.primaryCurrency || 'USD';
  const totalBudgetInDisplayCurrency =
    tripStoredCurrency === primaryCurrency
      ? trip.totalBudget
      : convertCurrency(trip.totalBudget, tripStoredCurrency, primaryCurrency);

  const budgetSummary = calculateTripBudgetSummary(
    expenses,
    companions,
    totalBudgetInDisplayCurrency,
    primaryCurrency
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="print-sheet-container">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24,
          paddingBottom: 16,
          borderBottom: '1px solid var(--border-subtle)'
        }}
        className="no-print"
      >
        <button className="btn-secondary" onClick={onBackToItinerary}>
          <ArrowLeft size={15} />
          <span>Back to Planner</span>
        </button>

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-secondary" onClick={onExportPDF}>
            <Download size={15} />
            <span>Download PDF</span>
          </button>
          <button className="btn-primary" onClick={handlePrint}>
            <Printer size={15} />
            <span>Print Itinerary Sheet</span>
          </button>
        </div>
      </div>

      <div
        style={{
          background: '#ffffff',
          color: '#0f172a',
          padding: '36px 40px',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          maxWidth: '900px',
          margin: '0 auto',
          fontFamily: 'var(--font-sans)'
        }}
      >
        <div style={{ borderBottom: '2px solid #0f172a', paddingBottom: 16, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 900, fontFamily: 'var(--font-display)', margin: 0 }}>
                {trip.title}
              </h1>
              <div style={{ fontSize: '0.9375rem', color: '#475569', marginTop: 4 }}>
                📍 {trip.destination}, {trip.country} • {trip.startDate} to {trip.endDate}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>🧭 VoyagePlanner</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Offline Travel Manifest</div>
            </div>
          </div>

          {companions.length > 0 && (
            <div style={{ fontSize: '0.8125rem', color: '#334155', marginTop: 12 }}>
              <strong>Travel Companions:</strong> {companions.map((c) => c.name).join(', ')}
            </div>
          )}
        </div>

        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10, color: '#1e293b' }}>
            📅 Daily Schedule & Confirmations
          </h3>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1', textAlign: 'left' }}>
                <th style={{ padding: '8px 10px', width: '90px' }}>Day / Time</th>
                <th style={{ padding: '8px 10px' }}>Destination / Activity</th>
                <th style={{ padding: '8px 10px', width: '110px' }}>Category</th>
                <th style={{ padding: '8px 10px', width: '90px' }}>Cost</th>
                <th style={{ padding: '8px 10px', width: '130px' }}>Booking Status</th>
              </tr>
            </thead>
            <tbody>
              {trip.days.map((day) => {
                const dayActs = trip.activities
                  .filter((a) => a.dayId === day.id)
                  .sort((a, b) => a.order - b.order);

                return (
                  <React.Fragment key={day.id}>
                    <tr style={{ background: '#e2e8f0', fontWeight: 700 }}>
                      <td colSpan={5} style={{ padding: '6px 10px' }}>
                        Day {day.dayNumber}: {day.title} ({day.date})
                      </td>
                    </tr>

                    {dayActs.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ padding: '8px 10px', color: '#94a3b8', fontStyle: 'italic' }}>
                          No scheduled activities
                        </td>
                      </tr>
                    ) : (
                      dayActs.map((act) => (
                        <tr key={act.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '8px 10px', fontWeight: 600 }}>{act.startTime}</td>
                          <td style={{ padding: '8px 10px' }}>
                            <div style={{ fontWeight: 700 }}>{act.title}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>📍 {act.location?.name}</div>
                            {act.notes && (
                              <div style={{ fontSize: '0.7rem', color: '#d97706', marginTop: 2 }}>
                                💡 {act.notes}
                              </div>
                            )}
                          </td>
                          <td style={{ padding: '8px 10px', textTransform: 'capitalize' }}>
                            {act.category}
                          </td>
                          <td style={{ padding: '8px 10px', fontWeight: 700 }}>
                            {act.cost > 0 ? formatMoney(act.cost, act.currency) : 'Free'}
                          </td>
                          <td style={{ padding: '8px 10px' }}>
                            <span
                              style={{
                                color: act.booked ? '#16a34a' : '#d97706',
                                fontWeight: 700
                              }}
                            >
                              {act.booked ? '✓ Booked' : '○ Planned'}
                            </span>
                            {act.confirmationCode && (
                              <div style={{ fontSize: '0.7rem', fontFamily: 'monospace' }}>
                                Ref: {act.confirmationCode}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ marginBottom: 24, pageBreakInside: 'avoid' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10, color: '#1e293b' }}>
            💰 Financial Overview & Companion Settlements
          </h3>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              background: '#f8fafc',
              padding: '10px 14px',
              borderRadius: 6,
              marginBottom: 10,
              fontSize: '0.875rem'
            }}
          >
            <span><strong>Target Budget:</strong> {formatMoney(budgetSummary.totalBudget, primaryCurrency)}</span>
            <span><strong>Total Recorded Spent:</strong> {formatMoney(budgetSummary.totalSpent, primaryCurrency)}</span>
            <span><strong>Remaining Balance:</strong> {formatMoney(budgetSummary.remainingBudget, primaryCurrency)}</span>
          </div>

          {budgetSummary.settlements.length > 0 && (
            <div style={{ border: '1px solid #cbd5e1', borderRadius: 6, padding: 10 }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, marginBottom: 6 }}>
                Settlement Matrix:
              </div>
              <ul style={{ paddingLeft: 20, margin: 0, fontSize: '0.8125rem' }}>
                {budgetSummary.settlements.map((s, idx) => (
                  <li key={idx}>
                    <strong>{s.fromName}</strong> pays <strong>{s.toName}</strong>: {formatMoney(s.amount, s.currency)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div style={{ pageBreakInside: 'avoid' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10, color: '#1e293b' }}>
            🎒 Packing Checklist ({packing.filter((p) => p.packed).length}/{packing.length} Ready)
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, fontSize: '0.8125rem' }}>
            {packing.slice(0, 16).map((item) => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>{item.packed ? '☑' : '☐'}</span>
                <span style={{ textDecoration: item.packed ? 'line-through' : 'none', color: item.packed ? '#64748b' : '#0f172a' }}>
                  {item.name} ({item.category})
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: '1px solid #e2e8f0', marginTop: 24, paddingTop: 10, fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center' }}>
          Printed via VoyagePlanner • Safe Travels!
        </div>
      </div>
    </div>
  );
};
