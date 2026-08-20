import React, { useState } from 'react';
import {
  Video,
  MapPin,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle2,
  Download,
  X,
  Sparkles,
  Shield,
  Compass
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Property, TourBooking, TourSpecialist } from '../../types/property';
import { TOUR_SPECIALISTS } from '../../data/properties';
import { downloadIcsFile, generateTourIcs } from '../../utils/icsGenerator';

interface TourSchedulerModalProps {
  property: Property;
  onClose: () => void;
}

export const TourSchedulerModal: React.FC<TourSchedulerModalProps> = ({
  property,
  onClose,
}) => {
  const [tourType, setTourType] = useState<'live_video' | 'in_person' | 'architect_consult'>('live_video');
  const [selectedDate, setSelectedDate] = useState<string>('2026-08-25');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('11:00 AM PST');
  const [selectedSpecialist, setSelectedSpecialist] = useState<TourSpecialist>(TOUR_SPECIALISTS[0]);
  const [clientName, setClientName] = useState<string>('Jonathan Reynolds');
  const [clientEmail, setClientEmail] = useState<string>('j.reynolds@havenrealty.luxury');
  const [clientPhone, setClientPhone] = useState<string>('+1 (555) 987-6543');
  const [notes, setNotes] = useState<string>('Inquiring about structural steel load specs and heritage status.');

  const [confirmedBooking, setConfirmedBooking] = useState<TourBooking | null>(null);

  const timeSlots = [
    '09:30 AM PST',
    '11:00 AM PST',
    '01:30 PM PST',
    '03:00 PM PST',
    '04:30 PM PST',
    '06:00 PM PST (Sunset)',
  ];

  const handleConfirmTour = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail) return;

    const booking: TourBooking = {
      id: `TOUR-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      propertyId: property.id,
      propertyTitle: property.title,
      propertyAddress: property.location.address,
      tourType,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      timezone: 'America/Los_Angeles (PST)',
      specialistId: selectedSpecialist.id,
      specialistName: selectedSpecialist.name,
      specialistTitle: selectedSpecialist.title,
      clientName,
      clientEmail,
      clientPhone,
      notes,
      confirmedAt: new Date().toISOString(),
    };

    // Trigger confetti
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.5 },
      colors: ['#c5a059', '#dfba73', '#10b981'],
    });

    setConfirmedBooking(booking);

    // Auto generate and download .ics file
    const icsData = generateTourIcs(booking);
    downloadIcsFile(icsData, `haven-tour-${booking.id}.ics`);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '780px', background: '#0e1219', border: '1px solid #c5a059', padding: '0', overflow: 'hidden' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #18202d, #10141d)',
            padding: '22px 28px',
            borderBottom: '1px solid rgba(197, 160, 89, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <span className="gold-badge" style={{ fontSize: '0.68rem' }}>
              <Compass size={12} /> Architectural Walkthrough Service
            </span>
            <h3 style={{ fontSize: '1.3rem', color: '#f8fafc', fontWeight: 600, marginTop: '4px' }}>
              Schedule a Virtual or Private Tour
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#8e97a6', marginTop: '2px' }}>
              {property.title} • {property.location.city}, {property.location.stateOrCountry}
            </p>
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
            <X size={20} />
          </button>
        </div>

        {/* Form Body or Confirmed Screen */}
        {!confirmedBooking ? (
          <form onSubmit={handleConfirmTour} style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {/* Tour Type Selection */}
            <div>
              <span style={{ fontSize: '0.82rem', color: '#8e97a6', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                Select Walkthrough Format
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setTourType('live_video')}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    textAlign: 'left',
                    background: tourType === 'live_video' ? 'rgba(197, 160, 89, 0.15)' : 'rgba(255,255,255,0.04)',
                    border: tourType === 'live_video' ? '1px solid #c5a059' : '1px solid rgba(255,255,255,0.08)',
                    color: '#f8fafc',
                  }}
                >
                  <Video size={18} color={tourType === 'live_video' ? '#dfba73' : '#8e97a6'} />
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', marginTop: '6px' }}>4K Drone & Video</div>
                  <div style={{ fontSize: '0.72rem', color: '#8e97a6', marginTop: '2px' }}>Live stream walkthrough</div>
                </button>

                <button
                  type="button"
                  onClick={() => setTourType('in_person')}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    textAlign: 'left',
                    background: tourType === 'in_person' ? 'rgba(197, 160, 89, 0.15)' : 'rgba(255,255,255,0.04)',
                    border: tourType === 'in_person' ? '1px solid #c5a059' : '1px solid rgba(255,255,255,0.08)',
                    color: '#f8fafc',
                  }}
                >
                  <MapPin size={18} color={tourType === 'in_person' ? '#dfba73' : '#8e97a6'} />
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', marginTop: '6px' }}>VIP In-Person</div>
                  <div style={{ fontSize: '0.72rem', color: '#8e97a6', marginTop: '2px' }}>White-glove on-site visit</div>
                </button>

                <button
                  type="button"
                  onClick={() => setTourType('architect_consult')}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    textAlign: 'left',
                    background: tourType === 'architect_consult' ? 'rgba(197, 160, 89, 0.15)' : 'rgba(255,255,255,0.04)',
                    border: tourType === 'architect_consult' ? '1px solid #c5a059' : '1px solid rgba(255,255,255,0.08)',
                    color: '#f8fafc',
                  }}
                >
                  <Sparkles size={18} color={tourType === 'architect_consult' ? '#dfba73' : '#8e97a6'} />
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', marginTop: '6px' }}>Lead Architect</div>
                  <div style={{ fontSize: '0.72rem', color: '#8e97a6', marginTop: '2px' }}>Technical design review</div>
                </button>
              </div>
            </div>

            {/* Date and Time Slot Picker */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: '#8e97a6', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  Tour Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  min="2026-08-21"
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="input-luxury"
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: '#8e97a6', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  Available Time Slot
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTimeSlot(slot)}
                      style={{
                        padding: '6px 8px',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        background: selectedTimeSlot === slot ? '#c5a059' : 'rgba(255,255,255,0.05)',
                        color: selectedTimeSlot === slot ? '#0c0e12' : '#c7cbd3',
                        fontWeight: selectedTimeSlot === slot ? 600 : 400,
                        border: selectedTimeSlot === slot ? '1px solid #dfba73' : '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Architectural Specialist Selection */}
            <div>
              <span style={{ fontSize: '0.82rem', color: '#8e97a6', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                Select Your Lead Architectural Specialist
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                {TOUR_SPECIALISTS.map((spec) => (
                  <div
                    key={spec.id}
                    onClick={() => setSelectedSpecialist(spec)}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      background: selectedSpecialist.id === spec.id ? 'rgba(197, 160, 89, 0.12)' : 'rgba(255,255,255,0.03)',
                      border: selectedSpecialist.id === spec.id ? '1px solid #c5a059' : '1px solid rgba(255,255,255,0.06)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <img
                      src={spec.avatar}
                      alt={spec.name}
                      style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f8fafc' }}>{spec.name}</div>
                      <div style={{ fontSize: '0.7rem', color: '#dfba73' }}>{spec.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Client Contact Info */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#8e97a6', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="input-luxury"
                  style={{ fontSize: '0.85rem' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#8e97a6', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="input-luxury"
                  style={{ fontSize: '0.85rem' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#8e97a6', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="input-luxury"
                  style={{ fontSize: '0.85rem' }}
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label style={{ fontSize: '0.78rem', color: '#8e97a6', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                Specific Architectural Questions / Inquiries
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ask about structural integrity, heritage protection, zoning, or customized expansion..."
                className="input-luxury"
                style={{ fontSize: '0.85rem', resize: 'none' }}
              />
            </div>

            {/* Action Submit */}
            <button
              id="btn-confirm-tour"
              type="submit"
              className="btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '0.95rem' }}
            >
              <Calendar size={18} /> Confirm Tour & Export Calendar Invite (.ics)
            </button>
          </form>
        ) : (
          /* Confirmation State with ICS download */
          <div style={{ padding: '36px 28px', textAlign: 'center' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid #10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#10b981',
                margin: '0 auto 16px auto',
              }}
            >
              <CheckCircle2 size={30} />
            </div>

            <h4 style={{ fontSize: '1.4rem', color: '#f8fafc', fontWeight: 600 }}>
              Tour Appointment Scheduled
            </h4>
            <p style={{ fontSize: '0.88rem', color: '#dfba73', marginTop: '4px' }} className="font-mono">
              Confirmation Ref: {confirmedBooking.id}
            </p>

            {/* Details Box */}
            <div
              style={{
                maxWidth: '480px',
                margin: '20px auto',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '8px',
                padding: '16px',
                textAlign: 'left',
                fontSize: '0.85rem',
                color: '#c7cbd3',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div><strong>Property:</strong> {confirmedBooking.propertyTitle}</div>
              <div><strong>Date & Time:</strong> {confirmedBooking.date} at {confirmedBooking.timeSlot}</div>
              <div><strong>Specialist:</strong> {confirmedBooking.specialistName} ({confirmedBooking.specialistTitle})</div>
              <div><strong>Client:</strong> {confirmedBooking.clientName} ({confirmedBooking.clientEmail})</div>
            </div>

            <p style={{ fontSize: '0.82rem', color: '#8e97a6', maxWidth: '420px', margin: '0 auto 20px auto' }}>
              Your calendar invitation file (.ics) has been generated. You can download it again below or import directly to Google Calendar, Apple Calendar, or Outlook.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button
                onClick={() => {
                  const icsData = generateTourIcs(confirmedBooking);
                  downloadIcsFile(icsData, `haven-tour-${confirmedBooking.id}.ics`);
                }}
                className="btn-primary"
              >
                <Download size={16} /> Re-download .ics Invite
              </button>
              <button
                onClick={onClose}
                className="btn-secondary"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
