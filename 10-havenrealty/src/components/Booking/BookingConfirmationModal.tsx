import React from 'react';
import {
  CheckCircle2,
  Calendar,
  Users,
  Download,
  Share2,
  X,
  Sparkles,
  MapPin,
  ShieldCheck,
  Printer
} from 'lucide-react';
import { BookingReservation, CurrencyCode } from '../../types/property';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { downloadIcsFile } from '../../utils/icsGenerator';

interface BookingConfirmationModalProps {
  reservation: BookingReservation;
  onClose: () => void;
}

export const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({
  reservation,
  onClose,
}) => {
  // Generate .ics calendar invite for the architectural stay
  const handleDownloadCalendar = () => {
    const startIso = reservation.checkIn.replace(/-/g, '');
    const endIso = reservation.checkOut.replace(/-/g, '');
    const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const icsString = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//HavenRealty Luxury//Architectural Stay//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:stay-${reservation.id}@havenrealty.luxury`,
      `DTSTAMP:${now}`,
      `DTSTART;VALUE=DATE:${startIso}`,
      `DTEND;VALUE=DATE:${endIso}`,
      `SUMMARY:Haven Realty Stay: ${reservation.propertyTitle}`,
      `DESCRIPTION:Architectural Luxury Stay for ${reservation.guestName}\\nNights: ${reservation.nights}\\nGuests: ${reservation.guests}\\nBooking Ref: ${reservation.id}`,
      `LOCATION:${reservation.propertyTitle}`,
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'TRIGGER:-P1D',
      'ACTION:DISPLAY',
      'DESCRIPTION:Haven Realty Stay Starts Tomorrow!',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    downloadIcsFile(icsString, `haven-reservation-${reservation.id}.ics`);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '650px', background: '#0e1219', border: '1px solid #c5a059', padding: '0', overflow: 'hidden' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pass Header Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1c2331, #12161f)',
            padding: '24px 28px',
            borderBottom: '1px solid rgba(197, 160, 89, 0.3)',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid #10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#10b981',
                }}
              >
                <CheckCircle2 size={20} />
              </div>
              <div>
                <span className="gold-badge" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                  Confirmed Reservation Pass
                </span>
                <h3 style={{ fontSize: '1.25rem', color: '#f8fafc', fontWeight: 600, marginTop: '2px' }}>
                  Architectural Stay Confirmed
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                color: '#8e97a6',
                padding: '6px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.05)',
                display: 'flex',
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Digital Architectural Boarding Ticket */}
        <div style={{ padding: '28px' }}>
          <div
            style={{
              background: '#151a24',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '20px',
              position: 'relative',
            }}
          >
            {/* Cutout notch visuals */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '-10px',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: '#0e1219',
                transform: 'translateY(-50%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '50%',
                right: '-10px',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: '#0e1219',
                transform: 'translateY(-50%)',
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px dashed rgba(255,255,255,0.1)', paddingBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#8e97a6', textTransform: 'uppercase' }}>Property</span>
                <h4 style={{ fontSize: '1.15rem', color: '#f8fafc', fontWeight: 600, marginTop: '2px' }}>
                  {reservation.propertyTitle}
                </h4>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: '#8e97a6', textTransform: 'uppercase' }}>Booking ID</span>
                <div style={{ fontSize: '0.95rem', color: '#dfba73', fontWeight: 700 }} className="font-mono">
                  {reservation.id}
                </div>
              </div>
            </div>

            {/* Stay Details Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '16px',
                paddingTop: '16px',
              }}
            >
              <div>
                <span style={{ fontSize: '0.72rem', color: '#8e97a6', textTransform: 'uppercase' }}>Check-In</span>
                <div style={{ fontSize: '0.95rem', color: '#f8fafc', fontWeight: 600, marginTop: '2px' }}>
                  {formatDate(reservation.checkIn)} (15:00)
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#8e97a6', textTransform: 'uppercase' }}>Check-Out</span>
                <div style={{ fontSize: '0.95rem', color: '#f8fafc', fontWeight: 600, marginTop: '2px' }}>
                  {formatDate(reservation.checkOut)} (11:00)
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#8e97a6', textTransform: 'uppercase' }}>Guests & Duration</span>
                <div style={{ fontSize: '0.95rem', color: '#f8fafc', fontWeight: 600, marginTop: '2px' }}>
                  {reservation.guests} Guests • {reservation.nights} Nights
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#8e97a6', textTransform: 'uppercase' }}>Total Paid</span>
                <div style={{ fontSize: '1.1rem', color: '#dfba73', fontWeight: 700 }} className="font-mono">
                  {formatCurrency(reservation.grandTotal, reservation.currency)}
                </div>
              </div>
            </div>
          </div>

          {/* Guarantee Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 16px',
              background: 'rgba(197, 160, 89, 0.08)',
              border: '1px solid rgba(197, 160, 89, 0.25)',
              borderRadius: '8px',
              marginTop: '16px',
            }}
          >
            <ShieldCheck size={18} color="#dfba73" />
            <span style={{ fontSize: '0.82rem', color: '#c7cbd3' }}>
              Your reservation is backed by the <strong>Haven Architectural Guarantee</strong> with full concierge check-in and preservation security.
            </span>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button
              onClick={handleDownloadCalendar}
              className="btn-primary"
              style={{ flex: 1 }}
            >
              <Download size={16} /> Add to Calendar (.ics)
            </button>
            <button
              onClick={() => window.print()}
              className="btn-secondary"
              style={{ padding: '10px 16px' }}
              title="Print Receipt"
            >
              <Printer size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
