import React from 'react';
import {
  Sparkles,
  Compass,
  ArrowRight,
  Eye,
  Calendar,
  TrendingUp,
  Shield,
  Layers
} from 'lucide-react';
import { ArchitecturalStyle, CurrencyCode, Property, UnitSystem } from '../types/property';
import { formatArea, formatCurrency } from '../utils/formatters';

interface HeroSectionProps {
  featuredProperty: Property;
  onExploreFloorPlan: (p: Property) => void;
  onBookStay: (p: Property) => void;
  onOpenCalculator: (p: Property) => void;
  onSelectStyle: (style: ArchitecturalStyle) => void;
  selectedStyles: ArchitecturalStyle[];
  currency: CurrencyCode;
  unitSystem: UnitSystem;
}

const STYLES: ArchitecturalStyle[] = [
  'Mid-Century Modern',
  'Brutalist',
  'Scandinavian',
  'Minimalist',
  'Organic Modernism',
  'Bauhaus',
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  featuredProperty,
  onExploreFloorPlan,
  onBookStay,
  onOpenCalculator,
  onSelectStyle,
  selectedStyles,
  currency,
  unitSystem,
}) => {
  return (
    <section style={{ position: 'relative', overflow: 'hidden', padding: '40px 0 20px 0' }}>
      {/* Background radial glow */}
      <div
        style={{
          position: 'absolute',
          top: '-100px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '800px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(197, 160, 89, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
        {/* Editorial Headline */}
        <div style={{ textAlign: 'center', maxWidth: '850px', margin: '0 auto 36px auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }} className="gold-badge">
            <Sparkles size={12} /> Architectural Masterpieces & Luxury Stays
          </div>
          <h1
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
              lineHeight: 1.15,
              color: '#f8fafc',
              fontWeight: 600,
              letterSpacing: '-0.01em',
            }}
          >
            Spatial Poetry. Immersive Blueprints. Verified Yields.
          </h1>
          <p
            style={{
              fontSize: '1.05rem',
              color: '#c7cbd3',
              marginTop: '16px',
              lineHeight: 1.6,
            }}
          >
            Explore world-renowned residential architecture with interactive 360° SVG floor plans, dynamic seasonal booking rates, and real-time investment yield modeling.
          </p>

          {/* Quick Style Filter Pills */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '24px',
            }}
          >
            {STYLES.map((style) => {
              const active = selectedStyles.includes(style);
              return (
                <button
                  key={style}
                  onClick={() => onSelectStyle(style)}
                  className={`pill-tag ${active ? 'active' : ''}`}
                  style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                >
                  {style}
                </button>
              );
            })}
          </div>
        </div>

        {/* Featured Masterpiece Hero Banner */}
        <div
          className="glass-card"
          style={{
            position: 'relative',
            borderRadius: '20px',
            overflow: 'hidden',
            border: '1px solid rgba(197, 160, 89, 0.4)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.7), 0 0 30px rgba(197, 160, 89, 0.15)',
          }}
        >
          <div className="hero-featured-grid">
            {/* Left Narrative Column */}
            <div
              className="hero-narrative"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: 'linear-gradient(135deg, rgba(14, 18, 25, 0.95), rgba(12, 14, 18, 0.85))',
                zIndex: 2,
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="gold-badge" style={{ fontSize: '0.7rem' }}>
                    Featured Icon of the Month
                  </span>
                  <span style={{ fontSize: '0.78rem', color: '#dfba73' }} className="font-mono">
                    {featuredProperty.location.city}, {featuredProperty.location.stateOrCountry}
                  </span>
                </div>

                <h2 style={{ fontSize: '2.2rem', color: '#f8fafc', fontWeight: 600, marginTop: '12px', lineHeight: 1.2 }}>
                  {featuredProperty.title}
                </h2>
                <p style={{ fontSize: '0.95rem', color: '#dfba73', marginTop: '4px' }}>
                  {featuredProperty.subtitle}
                </p>

                <p style={{ fontSize: '0.88rem', color: '#c7cbd3', marginTop: '14px', lineHeight: 1.6, maxWidth: '480px' }}>
                  {featuredProperty.tagline}
                </p>

                {/* Specs Pill Matrix */}
                <div style={{ display: 'flex', gap: '16px', marginTop: '20px', fontSize: '0.85rem', color: '#8e97a6' }}>
                  <span>{featuredProperty.bedrooms} Bedrooms</span>
                  <span>•</span>
                  <span>{featuredProperty.bathrooms} Baths</span>
                  <span>•</span>
                  <span className="font-mono">{formatArea(featuredProperty.totalSqFt, unitSystem)}</span>
                </div>
              </div>

              {/* Action Triggers */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '28px' }}>
                <button
                  id="hero-explore-floorplan"
                  onClick={() => onExploreFloorPlan(featuredProperty)}
                  className="btn-primary"
                >
                  <Eye size={16} /> Explore 360° Floor Plan
                </button>
                <button
                  id="hero-book-stay"
                  onClick={() => onBookStay(featuredProperty)}
                  className="btn-secondary"
                >
                  <Calendar size={16} /> Reserve Stays ({formatCurrency(featuredProperty.nightlyRate, currency)}/nt)
                </button>
                <button
                  id="hero-calc-yield"
                  onClick={() => onOpenCalculator(featuredProperty)}
                  className="btn-ghost"
                  style={{ color: '#dfba73' }}
                >
                  <TrendingUp size={16} /> Yield ROI
                </button>
              </div>
            </div>

            {/* Right Visual Image */}
            <div style={{ position: 'relative', minHeight: '320px', overflow: 'hidden' }}>
              <img
                src={featuredProperty.heroImage}
                alt={featuredProperty.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to right, rgba(12, 14, 18, 0.9) 0%, transparent 40%)',
                }}
              />

              {/* Floating Valuation Ribbon */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '24px',
                  right: '24px',
                  background: 'rgba(12, 14, 18, 0.85)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(197, 160, 89, 0.4)',
                  padding: '12px 18px',
                  borderRadius: '10px',
                  textAlign: 'right',
                }}
              >
                <span style={{ fontSize: '0.7rem', color: '#8e97a6', textTransform: 'uppercase' }}>Purchase Price</span>
                <div style={{ fontSize: '1.4rem', color: '#f8fafc', fontWeight: 700 }} className="font-mono">
                  {formatCurrency(featuredProperty.purchasePrice, currency)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Platform Metrics Bar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginTop: '28px',
          }}
        >
          <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'rgba(197, 160, 89, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dfba73' }}>
              <Layers size={20} />
            </div>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }} className="font-mono">100% Verified</div>
              <div style={{ fontSize: '0.75rem', color: '#8e97a6' }}>Interactive SVG Blueprints & 360° Panoramas</div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
              <Calendar size={20} />
            </div>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }} className="font-mono">Dynamic Rates</div>
              <div style={{ fontSize: '0.75rem', color: '#8e97a6' }}>Seasonal Multipliers & Zero Booking Collisions</div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06b6d4' }}>
              <TrendingUp size={20} />
            </div>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }} className="font-mono">Real-Time Yield</div>
              <div style={{ fontSize: '0.75rem', color: '#8e97a6' }}>Full Loan Amortization & Net Cap Rate Analytics</div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'rgba(244, 63, 94, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f43f5e' }}>
              <Shield size={20} />
            </div>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }} className="font-mono">White Glove</div>
              <div style={{ fontSize: '0.75rem', color: '#8e97a6' }}>Virtual Consultations with Lead Architects</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
