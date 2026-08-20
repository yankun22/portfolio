import React, { useState } from 'react';
import {
  Users,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Plus,
  Minus,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BookingReservation, CurrencyCode, Property } from '../../types/property';
import { calculateBookingPrice } from '../../utils/bookingMath';
import { formatCurrency } from '../../utils/formatters';

interface BookingSummaryCardProps {
  property: Property;
  checkIn: string;
  checkOut: string;
  currency: CurrencyCode;
  onBookingConfirmed: (reservation: BookingReservation) => void;
}

export const BookingSummaryCard: React.FC<BookingSummaryCardProps> = ({
  property,
  checkIn,
  checkOut,
  currency,
  onBookingConfirmed,
}) => {
  const [guests, setGuests] = useState(2);
  const [guestName, setGuestName] = useState('Alexandra Vance');
  const [guestEmail, setGuestEmail] = useState('alexandra.vance@havenrealty.luxury');

  const breakdown = calculateBookingPrice(property, checkIn, checkOut, guests);

  const handleBookNow = () => {
    if (!breakdown.isValid) return;

    // Trigger celebratory confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#c5a059', '#dfba73', '#f8fafc', '#10b981'],
    });

    const reservation: BookingReservation = {
      id: `HVN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      propertyId: property.id,
      propertyTitle: property.title,
      checkIn,
      checkOut,
      nights: breakdown.nights,
      guests,
      currency,
      currencyRate: 1.0,
      nightlyRateAvg: breakdown.effectiveRatePerNight,
      baseTotal: breakdown.baseTotal,
      seasonalAdjustment: breakdown.seasonalMultiplier,
      extraGuestFee: breakdown.extraGuestFee,
      cleaningFee: breakdown.cleaningFee,
      preservationFee: breakdown.preservationFee,
      lengthOfStayDiscount: breakdown.lengthOfStayDiscount,
      grandTotal: breakdown.grandTotal,
      guestName,
      guestEmail,
      guestPhone: '+1 (555) 234-8900',
      specialRequests: 'Curated architectural welcome pack & private wine tasting.',
      createdAt: new Date().toISOString(),
    };

    onBookingConfirmed(reservation);
  };

  return (
    <div
      className="glass-card"
      style={{
        padding: '24px',
        border: '1px solid rgba(197, 160, 89, 0.4)',
        background: '#12161f',
        position: 'sticky',
        top: '20px',
      }}
    >
      {/* Price Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: '16px',
          marginBottom: '18px',
        }}
      >
        <div>
          <span style={{ fontSize: '1.6rem', fontWeight: 700, color: '#f8fafc' }} className="font-mono">
            {formatCurrency(breakdown.effectiveRatePerNight, currency)}
          </span>
          <span style={{ fontSize: '0.85rem', color: '#8e97a6' }}> / night</span>
        </div>

        {breakdown.seasonalMultiplier !== 1.0 && (
          <span className="gold-badge" style={{ fontSize: '0.7rem' }}>
            {breakdown.seasonName} ({breakdown.seasonalMultiplier}x)
          </span>
        )}
      </div>

      {/* Guest Selector Control */}
      <div style={{ marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '0.82rem', color: '#8e97a6', textTransform: 'uppercase', fontWeight: 600 }}>
            Guests (Max {property.bedrooms * 2})
          </span>
          <span style={{ fontSize: '0.78rem', color: '#dfba73' }}>
            {guests > 2 ? `+$75/nt extra guest fee` : `Standard 2 guests`}
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 14px',
            background: 'var(--bg-input)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#f8fafc' }}>
            <Users size={16} color="#c5a059" />
            <span>{guests} {guests === 1 ? 'Guest' : 'Guests'}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setGuests((g) => Math.max(1, g - 1))}
              disabled={guests <= 1}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                background: 'rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: guests <= 1 ? '#475569' : '#f8fafc',
              }}
            >
              <Minus size={14} />
            </button>
            <button
              onClick={() => setGuests((g) => Math.min(property.bedrooms * 2, g + 1))}
              disabled={guests >= property.bedrooms * 2}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                background: 'rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: guests >= property.bedrooms * 2 ? '#475569' : '#f8fafc',
              }}
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Date Validation Alert Banner */}
      {!breakdown.isValid && (
        <div
          id="booking-validation-error"
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            padding: '12px 14px',
            background: 'rgba(244, 63, 94, 0.1)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: '8px',
            marginBottom: '18px',
          }}
        >
          <AlertTriangle size={18} color="#f43f5e" style={{ flexShrink: 0, marginTop: '2px' }} />
          <span style={{ fontSize: '0.82rem', color: '#fca5a5' }}>
            {breakdown.validationError}
          </span>
        </div>
      )}

      {/* Pricing Breakdown Line Items */}
      {breakdown.isValid && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            padding: '16px 0',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            marginBottom: '18px',
            fontSize: '0.88rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#c7cbd3' }}>
            <span>
              {formatCurrency(breakdown.effectiveRatePerNight, currency)} x {breakdown.nights} nights
            </span>
            <span className="font-mono">{formatCurrency(breakdown.baseTotal, currency)}</span>
          </div>

          {breakdown.extraGuestFee > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#c7cbd3' }}>
              <span>Extra Guest Surcharge</span>
              <span className="font-mono">+{formatCurrency(breakdown.extraGuestFee, currency)}</span>
            </div>
          )}

          {breakdown.lengthOfStayDiscount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}>
              <span>Stay Discount ({breakdown.discountPercentage}%)</span>
              <span className="font-mono">-{formatCurrency(breakdown.lengthOfStayDiscount, currency)}</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#c7cbd3' }}>
            <span>Cleaning & Sanitization Fee</span>
            <span className="font-mono">{formatCurrency(breakdown.cleaningFee, currency)}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#c7cbd3' }}>
            <span>Architectural Preservation Deposit</span>
            <span className="font-mono">{formatCurrency(breakdown.preservationFee, currency)}</span>
          </div>

          {/* Grand Total */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              paddingTop: '10px',
              borderTop: '1px dashed rgba(255, 255, 255, 0.1)',
              fontWeight: 700,
            }}
          >
            <span style={{ fontSize: '1rem', color: '#f8fafc' }}>Total (incl. fees)</span>
            <span style={{ fontSize: '1.35rem', color: '#dfba73' }} className="font-mono">
              {formatCurrency(breakdown.grandTotal, currency)}
            </span>
          </div>
        </div>
      )}

      {/* Guest contact form */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' }}>
        <input
          type="text"
          placeholder="Primary Guest Full Name"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          className="input-luxury"
          style={{ fontSize: '0.85rem' }}
        />
        <input
          type="email"
          placeholder="Contact Email for Verification Pass"
          value={guestEmail}
          onChange={(e) => setGuestEmail(e.target.value)}
          className="input-luxury"
          style={{ fontSize: '0.85rem' }}
        />
      </div>

      {/* Instant Reserve CTA */}
      <button
        id="btn-instant-reserve"
        onClick={handleBookNow}
        disabled={!breakdown.isValid}
        className="btn-primary"
        style={{
          width: '100%',
          padding: '14px',
          opacity: breakdown.isValid ? 1 : 0.4,
          cursor: breakdown.isValid ? 'pointer' : 'not-allowed',
        }}
      >
        <Lock size={16} /> Instant Reserve Architectural Stay
      </button>

      {/* Micro-guarantee */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          marginTop: '12px',
          fontSize: '0.75rem',
          color: '#8e97a6',
        }}
      >
        <ShieldCheck size={14} color="#10b981" />
        <span>Instant booking conflict prevention active</span>
      </div>
    </div>
  );
};
