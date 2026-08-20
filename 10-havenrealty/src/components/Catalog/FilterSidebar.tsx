import React, { useState } from 'react';
import {
  Filter,
  Sliders,
  Sparkles,
  RotateCcw,
  Compass,
  DollarSign,
  Home,
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ArchitecturalStyle, CurrencyCode, FilterState } from '../../types/property';
import { formatCurrency, formatArea } from '../../utils/formatters';

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (updated: Partial<FilterState>) => void;
  onResetFilters: () => void;
  currency: CurrencyCode;
  totalMatches: number;
}

const STYLES: ArchitecturalStyle[] = [
  'Mid-Century Modern',
  'Brutalist',
  'Scandinavian',
  'Minimalist',
  'Organic Modernism',
  'Bauhaus',
];

const ALL_AMENITIES = [
  'Cantilever Deck',
  'Starphire Glass Walls',
  'Infinity Lap Pool',
  'Board-Formed Concrete Walls',
  'Central Karesansui Zen Courtyard',
  'Hinoki Cypress Onsen Spa',
  'Carbon-Negative CLT Construction',
  'Nordic Sauna with Lake Plunge',
  'Iconic Butterfly Roofline',
  'Valser Quartzite Stone Slabs',
  'Private Riva Boat Slip & Dock',
  'Solar Microgrid & Tesla Powerwalls',
];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  currency,
  totalMatches,
}) => {
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  const toggleStyle = (style: ArchitecturalStyle) => {
    const exists = filters.styles.includes(style);
    if (exists) {
      onFilterChange({ styles: filters.styles.filter((s) => s !== style) });
    } else {
      onFilterChange({ styles: [...filters.styles, style] });
    }
  };

  const toggleAmenity = (amenity: string) => {
    const exists = filters.amenities.includes(amenity);
    if (exists) {
      onFilterChange({ amenities: filters.amenities.filter((a) => a !== amenity) });
    } else {
      onFilterChange({ amenities: [...filters.amenities, amenity] });
    }
  };

  const activeCount = filters.styles.length + filters.amenities.length + (filters.minBedrooms > 0 ? 1 : 0) + (filters.minSqFt > 0 ? 1 : 0);

  return (
    <aside
      className="glass-card filter-sidebar-card"
      style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
        height: 'fit-content',
        position: 'sticky',
        top: '20px',
      }}
    >
      {/* Header with Mobile Collapse Button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sliders size={18} color="#c5a059" />
          <h4 style={{ fontSize: '1.05rem', color: '#f8fafc', fontWeight: 600 }}>
            Architectural Filters
          </h4>
          {activeCount > 0 && (
            <span className="gold-badge" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
              {activeCount} active
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={onResetFilters}
            className="btn-ghost"
            style={{ padding: '4px 8px', fontSize: '0.75rem', color: '#dfba73' }}
            title="Reset Filters"
          >
            <RotateCcw size={12} /> Reset
          </button>
          {/* Mobile toggle button */}
          <button
            onClick={() => setIsMobileExpanded(!isMobileExpanded)}
            className="btn-ghost mobile-filter-header"
            style={{ padding: '4px 8px', fontSize: '0.8rem', color: '#f8fafc' }}
          >
            {isMobileExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Body: Hidden on mobile unless expanded, always visible on desktop via CSS */}
      <div
        className={`filter-sidebar-content ${isMobileExpanded ? 'mobile-expanded' : ''}`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
        }}
      >

      {/* Mode Switcher (Purchase vs Nightly Stays) */}
      <div>
        <span style={{ fontSize: '0.78rem', color: '#8e97a6', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
          Target Category
        </span>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            background: 'var(--bg-input)',
            padding: '4px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <button
            onClick={() => onFilterChange({ priceMode: 'purchase' })}
            style={{
              padding: '8px',
              borderRadius: '6px',
              fontSize: '0.82rem',
              fontWeight: 600,
              background: filters.priceMode === 'purchase' ? '#c5a059' : 'transparent',
              color: filters.priceMode === 'purchase' ? '#0c0e12' : '#c7cbd3',
              transition: 'all 0.15s ease',
            }}
          >
            Acquisitions ($)
          </button>
          <button
            onClick={() => onFilterChange({ priceMode: 'nightly' })}
            style={{
              padding: '8px',
              borderRadius: '6px',
              fontSize: '0.82rem',
              fontWeight: 600,
              background: filters.priceMode === 'nightly' ? '#c5a059' : 'transparent',
              color: filters.priceMode === 'nightly' ? '#0c0e12' : '#c7cbd3',
              transition: 'all 0.15s ease',
            }}
          >
            Nightly Stays
          </button>
        </div>
      </div>

      {/* Architectural Style Multi-select */}
      <div>
        <span style={{ fontSize: '0.78rem', color: '#8e97a6', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '10px' }}>
          Architectural Style
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {STYLES.map((style) => {
            const isSelected = filters.styles.includes(style);
            return (
              <button
                key={style}
                id={`filter-style-${style.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => toggleStyle(style)}
                className={`pill-tag ${isSelected ? 'active' : ''}`}
                style={{ fontSize: '0.8rem', padding: '6px 12px' }}
              >
                {isSelected && <Check size={12} />}
                {style}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Slider */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '0.78rem', color: '#8e97a6', textTransform: 'uppercase', fontWeight: 600 }}>
            Max {filters.priceMode === 'purchase' ? 'Purchase Price' : 'Nightly Rate'}
          </span>
          <span style={{ fontSize: '0.9rem', color: '#dfba73', fontWeight: 700 }} className="font-mono">
            {formatCurrency(filters.maxPrice, currency, filters.priceMode === 'purchase')}
          </span>
        </div>
        <input
          type="range"
          min={filters.priceMode === 'purchase' ? 2000000 : 1000}
          max={filters.priceMode === 'purchase' ? 25000000 : 6000}
          step={filters.priceMode === 'purchase' ? 500000 : 100}
          value={filters.maxPrice}
          onChange={(e) => onFilterChange({ maxPrice: Number(e.target.value) })}
          aria-label="Max Price Range"
        />
      </div>

      {/* Bedrooms & Bathrooms */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <span style={{ fontSize: '0.78rem', color: '#8e97a6', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
            Min Bedrooms
          </span>
          <select
            value={filters.minBedrooms}
            onChange={(e) => onFilterChange({ minBedrooms: Number(e.target.value) })}
            className="input-luxury"
            style={{ fontSize: '0.85rem' }}
          >
            <option value={0}>Any</option>
            <option value={3}>3+ Beds</option>
            <option value={4}>4+ Beds</option>
            <option value={5}>5+ Beds</option>
          </select>
        </div>

        <div>
          <span style={{ fontSize: '0.78rem', color: '#8e97a6', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
            Min Area (Sq Ft)
          </span>
          <select
            value={filters.minSqFt}
            onChange={(e) => onFilterChange({ minSqFt: Number(e.target.value) })}
            className="input-luxury"
            style={{ fontSize: '0.85rem' }}
          >
            <option value={0}>Any Size</option>
            <option value={4000}>4,000+ sq ft</option>
            <option value={6000}>6,000+ sq ft</option>
            <option value={8000}>8,000+ sq ft</option>
          </select>
        </div>
      </div>

      {/* Amenities & Signatures */}
      <div>
        <span style={{ fontSize: '0.78rem', color: '#8e97a6', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
          Architectural Features
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
          {ALL_AMENITIES.map((amenity) => {
            const isChecked = filters.amenities.includes(amenity);
            return (
              <label
                key={amenity}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.82rem',
                  color: isChecked ? '#f8fafc' : '#8e97a6',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleAmenity(amenity)}
                  style={{ accentColor: '#c5a059' }}
                />
                <span>{amenity}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Match Results Count */}
      <div
        style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.85rem',
        }}
      >
        <span style={{ color: '#8e97a6' }}>Properties Found</span>
        <span style={{ fontWeight: 700, color: '#dfba73' }} className="font-mono">
          {totalMatches} Masterpieces
        </span>
        </div>
      </div>
    </aside>
  );
};
