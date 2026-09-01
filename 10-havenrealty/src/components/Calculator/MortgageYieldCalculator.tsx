import React, { useState, useId } from 'react';
import {
  DollarSign,
  Percent,
  TrendingUp,
  PieChart,
  Home,
  Shield,
  Layers,
  Calendar,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { CurrencyCode, MortgageInputs, Property } from '../../types/property';
import { calculateMortgage } from '../../utils/mortgageMath';
import { formatCurrency, formatPercent } from '../../utils/formatters';

interface MortgageYieldCalculatorProps {
  property: Property;
  currency: CurrencyCode;
}

export const MortgageYieldCalculator: React.FC<MortgageYieldCalculatorProps> = ({
  property,
  currency,
}) => {
  const downPaymentId = useId();
  const [price, setPrice] = useState<number>(property.purchasePrice);
  const [downPaymentPct, setDownPaymentPct] = useState<number>(20);
  const [loanTermYears, setLoanTermYears] = useState<number>(30);
  const [interestRate, setInterestRate] = useState<number>(6.5);
  const propertyTaxRate = property.propertyTaxRate;
  const insuranceAnnual = property.insuranceAnnual;
  const hoaMonthly = property.hoaMonthly;
  const [monthlyRentalIncome, setMonthlyRentalIncome] = useState<number>(property.projectedMonthlyRent);
  const [occupancyRate, setOccupancyRate] = useState<number>(property.estimatedOccupancy);
  const [showAmortization, setShowAmortization] = useState<boolean>(false);

  const inputs: MortgageInputs = {
    price,
    downPaymentPct,
    loanTermYears,
    interestRate,
    propertyTaxRate,
    insuranceAnnual,
    hoaMonthly,
    monthlyRentalIncome,
    occupancyRate,
  };

  const results = calculateMortgage(inputs);

  // Donut chart calculations
  const total = results.totalMonthlyPayment || 1;
  const pniPct = (results.monthlyPrincipalAndInterest / total) * 100;
  const taxPct = (results.monthlyTax / total) * 100;
  const insPct = (results.monthlyInsurance / total) * 100;
  const hoaPct = (results.monthlyHOA / total) * 100;

  // SVG Donut circumference = 2 * PI * 40 = 251.32
  const circumference = 251.32;
  const pniDash = (pniPct / 100) * circumference;
  const taxDash = (taxPct / 100) * circumference;
  const insDash = (insPct / 100) * circumference;
  const hoaDash = (hoaPct / 100) * circumference;

  return (
    <div className="glass-card" style={{ padding: '28px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="gold-badge">
            <TrendingUp size={12} /> Investment Engine
          </span>
          <span style={{ fontSize: '0.85rem', color: '#8e97a6' }}>
            Real-time Loan & Rental Yield Analytics
          </span>
        </div>
        <h3 style={{ fontSize: '1.4rem', color: '#f8fafc', fontWeight: 600, marginTop: '6px' }}>
          Mortgage & Yield ROI Calculator
        </h3>
      </div>

      {/* Main Grid: Inputs vs Results & Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
        {/* Controls Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Purchase Price Input */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.82rem', color: '#8e97a6', textTransform: 'uppercase', fontWeight: 600 }}>
                Purchase Price
              </span>
              <span style={{ fontSize: '0.95rem', color: '#dfba73', fontWeight: 700 }} className="font-mono">
                {formatCurrency(price, currency)}
              </span>
            </div>
            <input
              type="range"
              min={1000000}
              max={30000000}
              step={250000}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              aria-label="Purchase Price"
            />
          </div>

          {/* Down Payment % and Amount */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.82rem', color: '#8e97a6', textTransform: 'uppercase', fontWeight: 600 }}>
                Down Payment ({downPaymentPct}%)
              </span>
              <span style={{ fontSize: '0.95rem', color: '#f8fafc', fontWeight: 600 }} className="font-mono">
                {formatCurrency(results.downPaymentAmount, currency)}
              </span>
            </div>
            <input
              id={downPaymentId}
              type="range"
              min={5}
              max={50}
              step={1}
              value={downPaymentPct}
              onChange={(e) => setDownPaymentPct(Number(e.target.value))}
              aria-label="Down Payment Percentage"
            />
          </div>

          {/* Interest Rate Slider (1% to 12%) */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.82rem', color: '#8e97a6', textTransform: 'uppercase', fontWeight: 600 }}>
                Interest Rate (APR)
              </span>
              <span
                id="mortgage-interest-rate-value"
                style={{ fontSize: '1rem', color: '#dfba73', fontWeight: 700 }}
                className="font-mono"
              >
                {formatPercent(interestRate, 2)}
              </span>
            </div>
            <input
              id="mortgage-interest-rate-slider"
              type="range"
              min={1.0}
              max={12.0}
              step={0.1}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              aria-label="Mortgage Interest Rate"
            />
          </div>

          {/* Loan Term Selection */}
          <div>
            <span style={{ fontSize: '0.82rem', color: '#8e97a6', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
              Loan Term
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {[15, 30].map((term) => (
                <button
                  key={term}
                  onClick={() => setLoanTermYears(term)}
                  style={{
                    padding: '8px',
                    borderRadius: '6px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    background: loanTermYears === term ? '#c5a059' : 'rgba(255,255,255,0.05)',
                    color: loanTermYears === term ? '#0c0e12' : '#c7cbd3',
                    border: loanTermYears === term ? '1px solid #dfba73' : '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  {term} Years
                </button>
              ))}
            </div>
          </div>

          {/* Monthly Rental Income & Occupancy (Yield inputs) */}
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.82rem', color: '#dfba73', textTransform: 'uppercase', fontWeight: 600 }}>
                Est. Monthly Short-Term Rental Revenue
              </span>
              <span style={{ fontSize: '0.95rem', color: '#10b981', fontWeight: 700 }} className="font-mono">
                {formatCurrency(monthlyRentalIncome, currency)}/mo
              </span>
            </div>
            <input
              type="range"
              min={10000}
              max={150000}
              step={2000}
              value={monthlyRentalIncome}
              onChange={(e) => setMonthlyRentalIncome(Number(e.target.value))}
              aria-label="Monthly Rental Income"
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.78rem', color: '#8e97a6' }}>Estimated Occupancy</span>
              <span style={{ fontSize: '0.85rem', color: '#f8fafc', fontWeight: 600 }} className="font-mono">
                {occupancyRate}%
              </span>
            </div>
            <input
              type="range"
              min={40}
              max={95}
              step={1}
              value={occupancyRate}
              onChange={(e) => setOccupancyRate(Number(e.target.value))}
              aria-label="Occupancy Rate"
            />
          </div>
        </div>

        {/* Results & Breakdown Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Monthly Payment Hero Card */}
          <div
            style={{
              background: 'linear-gradient(135deg, #18202d, #12161f)',
              border: '1px solid #c5a059',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            }}
          >
            <span style={{ fontSize: '0.78rem', color: '#8e97a6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Estimated Monthly Payment
            </span>
            <div
              id="mortgage-total-monthly-payment"
              style={{ fontSize: '2rem', color: '#dfba73', fontWeight: 700, marginTop: '4px' }}
              className="font-mono"
            >
              {formatCurrency(results.totalMonthlyPayment, currency)}
              <span style={{ fontSize: '0.9rem', color: '#8e97a6', fontWeight: 400 }}> / month</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#8e97a6', marginTop: '4px' }}>
              Loan Amount: <strong style={{ color: '#f8fafc' }}>{formatCurrency(results.loanAmount, currency)}</strong> over {loanTermYears} years
            </div>
          </div>

          {/* SVG Donut Chart & Breakdown */}
          <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '24px' }}>
            {/* SVG Donut */}
            <div style={{ position: 'relative', width: '110px', height: '110px', flexShrink: 0 }}>
              <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                {/* Principal & Interest */}
                <circle
                  cx="50" cy="50" r="40"
                  fill="transparent"
                  stroke="#c5a059"
                  strokeWidth="12"
                  strokeDasharray={`${pniDash} ${circumference}`}
                  strokeDashoffset="0"
                />
                {/* Property Tax */}
                <circle
                  cx="50" cy="50" r="40"
                  fill="transparent"
                  stroke="#3b82f6"
                  strokeWidth="12"
                  strokeDasharray={`${taxDash} ${circumference}`}
                  strokeDashoffset={`-${pniDash}`}
                />
                {/* Insurance */}
                <circle
                  cx="50" cy="50" r="40"
                  fill="transparent"
                  stroke="#10b981"
                  strokeWidth="12"
                  strokeDasharray={`${insDash} ${circumference}`}
                  strokeDashoffset={`-${pniDash + taxDash}`}
                />
                {/* HOA */}
                <circle
                  cx="50" cy="50" r="40"
                  fill="transparent"
                  stroke="#8b5cf6"
                  strokeWidth="12"
                  strokeDasharray={`${hoaDash} ${circumference}`}
                  strokeDashoffset={`-${pniDash + taxDash + insDash}`}
                />
              </svg>
            </div>

            {/* Breakdown lines */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#c7cbd3' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#c5a059' }} /> Principal & Interest
                </span>
                <span className="font-mono" style={{ color: '#f8fafc', fontWeight: 600 }}>
                  {formatCurrency(results.monthlyPrincipalAndInterest, currency)}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#c7cbd3' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }} /> Property Taxes
                </span>
                <span className="font-mono" style={{ color: '#f8fafc', fontWeight: 600 }}>
                  {formatCurrency(results.monthlyTax, currency)}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#c7cbd3' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} /> Homeowners Insurance
                </span>
                <span className="font-mono" style={{ color: '#f8fafc', fontWeight: 600 }}>
                  {formatCurrency(results.monthlyInsurance, currency)}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#c7cbd3' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8b5cf6' }} /> HOA / Maintenance
                </span>
                <span className="font-mono" style={{ color: '#f8fafc', fontWeight: 600 }}>
                  {formatCurrency(results.monthlyHOA, currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Investment Yield & ROI Badges */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            <div className="glass-card" style={{ padding: '14px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: '#8e97a6', textTransform: 'uppercase' }}>Gross Yield</span>
              <div id="metric-gross-yield" style={{ fontSize: '1.2rem', color: '#dfba73', fontWeight: 700, marginTop: '2px' }} className="font-mono">
                {formatPercent(results.grossRentalYield, 2)}
              </div>
            </div>

            <div className="glass-card" style={{ padding: '14px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: '#8e97a6', textTransform: 'uppercase' }}>Net Cap Rate</span>
              <div id="metric-net-cap-rate" style={{ fontSize: '1.2rem', color: '#10b981', fontWeight: 700, marginTop: '2px' }} className="font-mono">
                {formatPercent(results.netCapRate, 2)}
              </div>
            </div>

            <div className="glass-card" style={{ padding: '14px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: '#8e97a6', textTransform: 'uppercase' }}>Cash-on-Cash</span>
              <div id="metric-cash-on-cash" style={{ fontSize: '1.2rem', color: '#06b6d4', fontWeight: 700, marginTop: '2px' }} className="font-mono">
                {formatPercent(results.cashOnCashReturn, 2)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Amortization Schedule Toggle */}
      <div style={{ marginTop: '24px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
        <button
          onClick={() => setShowAmortization(!showAmortization)}
          className="btn-ghost"
          style={{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255,255,255,0.03)' }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#dfba73', fontWeight: 600, fontSize: '0.9rem' }}>
            <Layers size={16} /> View Yearly Equity & Amortization Progression ({loanTermYears} Years)
          </span>
          {showAmortization ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {showAmortization && (
          <div style={{ marginTop: '14px', maxHeight: '280px', overflowY: 'auto', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'right' }}>
              <thead>
                <tr style={{ background: '#171c25', color: '#8e97a6', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Year</th>
                  <th style={{ padding: '10px' }}>Principal Paid</th>
                  <th style={{ padding: '10px' }}>Interest Paid</th>
                  <th style={{ padding: '10px' }}>Remaining Balance</th>
                  <th style={{ padding: '10px' }}>Accumulated Equity</th>
                </tr>
              </thead>
              <tbody>
                {results.amortizationSchedule.map((entry) => (
                  <tr key={entry.year} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#c7cbd3' }}>
                    <td style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, color: '#f8fafc' }}>
                      Year {entry.year}
                    </td>
                    <td style={{ padding: '8px 10px' }} className="font-mono">
                      {formatCurrency(entry.principalPaidYear, currency)}
                    </td>
                    <td style={{ padding: '8px 10px', color: '#f43f5e' }} className="font-mono">
                      {formatCurrency(entry.interestPaidYear, currency)}
                    </td>
                    <td style={{ padding: '8px 10px' }} className="font-mono">
                      {formatCurrency(entry.balance, currency)}
                    </td>
                    <td style={{ padding: '8px 10px', color: '#10b981', fontWeight: 600 }} className="font-mono">
                      {formatCurrency(entry.equity, currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
