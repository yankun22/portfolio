import React, { useState } from 'react';
import {
  Heart,
  MapPin,
  Maximize2,
  Bed,
  Bath,
  Layers,
  Sparkles,
  TrendingUp,
  Calendar,
  Eye,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { CurrencyCode, Property, UnitSystem } from '../../types/property';
import { formatArea, formatCurrency } from '../../utils/formatters';

interface PropertyCardProps {
  property: Property;
  currency: CurrencyCode;
  unitSystem: UnitSystem;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelectProperty: (property: Property) => void;
  onQuickBook: (property: Property) => void;
  onQuickFloorPlan: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  currency,
  unitSystem,
  isFavorite,
  onToggleFavorite,
  onSelectProperty,
  onQuickBook,
  onQuickFloorPlan,
}) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev === 0 ? property.gallery.length - 1 : prev - 1));
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev === property.gallery.length - 1 ? 0 : prev + 1));
  };

  // Gross yield calc
  const grossYield = ((property.projectedMonthlyRent * 12) / property.purchasePrice) * 100;

  return (
    <div
      className="glass-card"
      id={`property-card-${property.id}`}
      style={{
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        cursor: 'pointer',
      }}
      onClick={() => onSelectProperty(property)}
    >
      {/* Image Container with Badges */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 10', overflow: 'hidden' }}>
        <img
          src={property.gallery[currentImgIndex] || property.heroImage}
          alt={property.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
          }}
          className="card-img"
        />

        {/* Gradient Scrim */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(12, 14, 18, 0.9) 0%, transparent 60%)',
            pointerEvents: 'none',
          }}
        />

        {/* Style Tag & Yield Badge */}
        <div
          style={{
            position: 'absolute',
            top: '14px',
            left: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span className="gold-badge" style={{ fontSize: '0.7rem' }}>
            {property.style}
          </span>
          <span
            style={{
              padding: '4px 8px',
              borderRadius: '9999px',
              background: 'rgba(16, 185, 129, 0.2)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#34d399',
              fontSize: '0.7rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
            className="font-mono"
          >
            <TrendingUp size={11} /> {grossYield.toFixed(1)}% ROI
          </span>
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(property.id);
          }}
          style={{
            position: 'absolute',
            top: '14px',
            right: '14px',
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: 'rgba(12, 14, 18, 0.7)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isFavorite ? '#f43f5e' : '#f8fafc',
            border: isFavorite ? '1px solid #f43f5e' : '1px solid rgba(255,255,255,0.15)',
            transition: 'all 0.2s ease',
          }}
          title={isFavorite ? 'Remove from Saved' : 'Save Property'}
          aria-label="Save Property"
        >
          <Heart size={16} fill={isFavorite ? '#f43f5e' : 'none'} />
        </button>

        {/* Image Carousel Controls */}
        {property.gallery.length > 1 && (
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              right: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <button
              onClick={prevImage}
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                background: 'rgba(0,0,0,0.6)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Previous Photo"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={nextImage}
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                background: 'rgba(0,0,0,0.6)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Next Photo"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}

        {/* Location banner */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.78rem',
            color: '#c7cbd3',
          }}
        >
          <MapPin size={13} color="#dfba73" />
          <span>{property.location.city}, {property.location.stateOrCountry}</span>
        </div>
      </div>

      {/* Card Content Body */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Title & Architect */}
        <div>
          <h3 style={{ fontSize: '1.2rem', color: '#f8fafc', fontWeight: 600, lineHeight: 1.3 }}>
            {property.title}
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#dfba73', marginTop: '3px' }}>
            {property.architect} ({property.yearBuilt})
          </p>
        </div>

        {/* Architectural specs quick metrics */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            margin: '14px 0',
            padding: '10px 0',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            fontSize: '0.82rem',
            color: '#8e97a6',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Bed size={15} color="#dfba73" /> {property.bedrooms} Beds
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Bath size={15} color="#dfba73" /> {property.bathrooms} Baths
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="font-mono">
            <Layers size={15} color="#dfba73" /> {formatArea(property.totalSqFt, unitSystem)}
          </span>
        </div>

        {/* Pricing Rows */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto' }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#8e97a6', textTransform: 'uppercase' }}>Purchase Price</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }} className="font-mono">
              {formatCurrency(property.purchasePrice, currency)}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.72rem', color: '#8e97a6', textTransform: 'uppercase' }}>Stay Rate</span>
            <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#dfba73' }} className="font-mono">
              {formatCurrency(property.nightlyRate, currency)}<span style={{ fontSize: '0.75rem', color: '#8e97a6' }}>/nt</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '16px' }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickFloorPlan(property);
            }}
            className="btn-secondary"
            style={{ padding: '8px', fontSize: '0.8rem' }}
          >
            <Eye size={14} /> 360° Floor Plan
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickBook(property);
            }}
            className="btn-primary"
            style={{ padding: '8px', fontSize: '0.8rem' }}
          >
            <Calendar size={14} /> Book Stays
          </button>
        </div>
      </div>
    </div>
  );
};
