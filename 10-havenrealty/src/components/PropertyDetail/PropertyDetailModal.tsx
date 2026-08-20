import React, { useState } from 'react';
import {
  X,
  MapPin,
  Heart,
  Share2,
  Calendar,
  Layers,
  TrendingUp,
  Video,
  Sparkles,
  Bed,
  Bath,
  Maximize2,
  Compass,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { BookingReservation, CurrencyCode, Property, UnitSystem } from '../../types/property';
import { formatArea, formatCurrency } from '../../utils/formatters';
import { FloorPlanViewer } from '../FloorPlan/FloorPlanViewer';
import { DateBookingCalendar } from '../Booking/DateBookingCalendar';
import { BookingSummaryCard } from '../Booking/BookingSummaryCard';
import { MortgageYieldCalculator } from '../Calculator/MortgageYieldCalculator';
import { TourSchedulerModal } from '../Tour/TourSchedulerModal';
import { BookingConfirmationModal } from '../Booking/BookingConfirmationModal';

interface PropertyDetailModalProps {
  property: Property;
  onClose: () => void;
  currency: CurrencyCode;
  unitSystem: UnitSystem;
  onToggleUnit: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  initialTab?: 'overview' | 'floorplan' | 'booking' | 'calculator';
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
  currency,
  unitSystem,
  onToggleUnit,
  isFavorite,
  onToggleFavorite,
  initialTab = 'overview',
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'floorplan' | 'booking' | 'calculator'>(initialTab);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [checkIn, setCheckIn] = useState<string>('2026-08-30');
  const [checkOut, setCheckOut] = useState<string>('2026-09-04');
  const [showTourScheduler, setShowTourScheduler] = useState(false);
  const [confirmedReservation, setConfirmedReservation] = useState<BookingReservation | null>(null);

  const grossYield = ((property.projectedMonthlyRent * 12) / property.purchasePrice) * 100;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        style={{
          maxWidth: '1200px',
          maxHeight: '92vh',
          background: '#0c0f15',
          border: '1px solid rgba(197, 160, 89, 0.4)',
          display: 'flex',
          flexDirection: 'column',
          padding: '0',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header Nav */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px',
            background: 'rgba(14, 18, 26, 0.95)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            zIndex: 50,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="gold-badge" style={{ fontSize: '0.7rem' }}>
              {property.style}
            </span>
            <h2 style={{ fontSize: '1.25rem', color: '#f8fafc', fontWeight: 600 }}>
              {property.title}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setShowTourScheduler(true)}
              className="btn-secondary"
              style={{ padding: '8px 14px', fontSize: '0.82rem', borderColor: '#c5a059', color: '#dfba73' }}
            >
              <Video size={14} /> Schedule Virtual Tour
            </button>

            <button
              onClick={() => onToggleFavorite(property.id)}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isFavorite ? '#f43f5e' : '#c7cbd3',
              }}
              title="Save Property"
            >
              <Heart size={16} fill={isFavorite ? '#f43f5e' : 'none'} />
            </button>

            <button
              onClick={onClose}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#c7cbd3',
              }}
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            padding: '10px 24px',
            background: '#12161f',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            overflowX: 'auto',
          }}
        >
          <button
            onClick={() => setActiveTab('overview')}
            className={`pill-tag ${activeTab === 'overview' ? 'active' : ''}`}
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <Sparkles size={14} /> Residence Overview
          </button>
          <button
            id="tab-floorplan-explorer"
            onClick={() => setActiveTab('floorplan')}
            className={`pill-tag ${activeTab === 'floorplan' ? 'active' : ''}`}
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <Layers size={14} /> Interactive 360° Floor Plan
          </button>
          <button
            id="tab-booking-calendar"
            onClick={() => setActiveTab('booking')}
            className={`pill-tag ${activeTab === 'booking' ? 'active' : ''}`}
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <Calendar size={14} /> Dates & Stay Booking
          </button>
          <button
            id="tab-mortgage-calculator"
            onClick={() => setActiveTab('calculator')}
            className={`pill-tag ${activeTab === 'calculator' ? 'active' : ''}`}
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <TrendingUp size={14} /> Mortgage & Yield Engine
          </button>
        </div>

        {/* Scrollable Content Pane */}
        <div style={{ padding: '28px', overflowY: 'auto', flex: 1 }}>
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              {/* High-res Gallery Carousel */}
              <div style={{ position: 'relative', width: '100%', height: '440px', borderRadius: '12px', overflow: 'hidden' }}>
                <img
                  src={property.gallery[activeGalleryIndex] || property.heroImage}
                  alt={property.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                {/* Thumbnails strip */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '8px',
                    padding: '6px 10px',
                    background: 'rgba(12, 14, 18, 0.75)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '8px',
                  }}
                >
                  {property.gallery.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`Thumb ${i}`}
                      onClick={() => setActiveGalleryIndex(i)}
                      style={{
                        width: '48px',
                        height: '32px',
                        borderRadius: '4px',
                        objectFit: 'cover',
                        cursor: 'pointer',
                        border: activeGalleryIndex === i ? '2px solid #dfba73' : '1px solid transparent',
                        opacity: activeGalleryIndex === i ? 1 : 0.6,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Editorial Title & Location Strip */}
              <div className="responsive-detail-grid">
                <div>
                  <h1 style={{ fontSize: '2rem', color: '#f8fafc', lineHeight: 1.2 }}>
                    {property.title}
                  </h1>
                  <p style={{ fontSize: '1.05rem', color: '#dfba73', marginTop: '6px' }}>
                    {property.subtitle} — Designed by {property.architect} ({property.yearBuilt})
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', color: '#8e97a6', fontSize: '0.9rem' }}>
                    <MapPin size={16} color="#dfba73" />
                    <span>{property.location.address}</span>
                  </div>

                  {/* Architectural Story */}
                  <div style={{ marginTop: '20px' }}>
                    <h3 style={{ fontSize: '1.1rem', color: '#f8fafc', marginBottom: '8px' }}>
                      Architectural Vision & Spatial Design
                    </h3>
                    <p style={{ fontSize: '0.92rem', color: '#c7cbd3', lineHeight: 1.7 }}>
                      {property.architecturalStory}
                    </p>
                  </div>

                  {/* Materiality Story */}
                  <div style={{ marginTop: '20px' }}>
                    <h3 style={{ fontSize: '1.1rem', color: '#f8fafc', marginBottom: '8px' }}>
                      Materiality & Tactile Palettes
                    </h3>
                    <p style={{ fontSize: '0.92rem', color: '#c7cbd3', lineHeight: 1.7 }}>
                      {property.materialityStory}
                    </p>
                  </div>
                </div>

                {/* Key Metrics Card */}
                <div className="glass-card" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '12px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#8e97a6', textTransform: 'uppercase' }}>Purchase Valuation</span>
                    <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#f8fafc' }} className="font-mono">
                      {formatCurrency(property.purchasePrice, currency)}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: '#8e97a6' }}>NIGHTLY STAY</span>
                      <div style={{ fontWeight: 600, color: '#dfba73' }} className="font-mono">
                        {formatCurrency(property.nightlyRate, currency)}/nt
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: '#8e97a6' }}>GROSS YIELD</span>
                      <div style={{ fontWeight: 600, color: '#10b981' }} className="font-mono">
                        {grossYield.toFixed(1)}% ROI
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: '#8e97a6' }}>TOTAL AREA</span>
                      <div style={{ fontWeight: 600, color: '#f8fafc' }} className="font-mono">
                        {formatArea(property.totalSqFt, unitSystem)}
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: '#8e97a6' }}>BED / BATH</span>
                      <div style={{ fontWeight: 600, color: '#f8fafc' }}>
                        {property.bedrooms} Bed • {property.bathrooms} Bath
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('booking')}
                    className="btn-primary"
                    style={{ width: '100%', padding: '12px', marginTop: '6px' }}
                  >
                    <Calendar size={16} /> Check Stay Availability
                  </button>

                  <button
                    onClick={() => setActiveTab('floorplan')}
                    className="btn-secondary"
                    style={{ width: '100%', padding: '10px' }}
                  >
                    <Layers size={16} /> Explore Blueprint & 360°
                  </button>
                </div>
              </div>

              {/* Amenities Grid */}
              <div className="glass-card" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '1.1rem', color: '#dfba73', marginBottom: '16px' }}>
                  Signature Curated Amenities
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                  {property.amenities.map((amenity, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 14px',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        color: '#f8fafc',
                      }}
                    >
                      <CheckCircle2 size={16} color="#c5a059" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'floorplan' && (
            <FloorPlanViewer
              property={property}
              unitSystem={unitSystem}
              onToggleUnit={onToggleUnit}
            />
          )}

          {activeTab === 'booking' && (
            <div className="responsive-booking-grid">
              <div>
                <DateBookingCalendar
                  property={property}
                  checkIn={checkIn}
                  checkOut={checkOut}
                  onSelectRange={(inDate, outDate) => {
                    setCheckIn(inDate);
                    setCheckOut(outDate);
                  }}
                />
              </div>

              <div>
                <BookingSummaryCard
                  property={property}
                  checkIn={checkIn}
                  checkOut={checkOut}
                  currency={currency}
                  onBookingConfirmed={(res) => setConfirmedReservation(res)}
                />
              </div>
            </div>
          )}

          {activeTab === 'calculator' && (
            <MortgageYieldCalculator
              property={property}
              currency={currency}
            />
          )}
        </div>

        {/* Tour Scheduler Modal */}
        {showTourScheduler && (
          <TourSchedulerModal
            property={property}
            onClose={() => setShowTourScheduler(false)}
          />
        )}

        {/* Booking Confirmation Pass Modal */}
        {confirmedReservation && (
          <BookingConfirmationModal
            reservation={confirmedReservation}
            onClose={() => setConfirmedReservation(null)}
          />
        )}
      </div>
    </div>
  );
};
