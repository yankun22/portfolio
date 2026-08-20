import React from 'react';
import {
  Grid,
  Map as MapIcon,
  Columns,
  ArrowUpDown,
  Search,
  SlidersHorizontal,
  X,
  Compass
} from 'lucide-react';
import { CurrencyCode, FilterState, Property, UnitSystem } from '../../types/property';
import { PropertyCard } from './PropertyCard';
import { InteractiveMap } from './InteractiveMap';

interface PropertyCatalogProps {
  properties: Property[];
  filters: FilterState;
  onFilterChange: (updated: Partial<FilterState>) => void;
  currency: CurrencyCode;
  unitSystem: UnitSystem;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onSelectProperty: (property: Property) => void;
  onQuickBook: (property: Property) => void;
  onQuickFloorPlan: (property: Property) => void;
  selectedProperty: Property | null;
}

export const PropertyCatalog: React.FC<PropertyCatalogProps> = ({
  properties,
  filters,
  onFilterChange,
  currency,
  unitSystem,
  favorites,
  onToggleFavorite,
  onSelectProperty,
  onQuickBook,
  onQuickFloorPlan,
  selectedProperty,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Action Bar: Search, View Mode, Sorting */}
      <div
        className="glass-card"
        style={{
          padding: '16px 20px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        {/* Instant Search Query Bar */}
        <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '420px' }}>
          <Search
            size={16}
            color="#8e97a6"
            style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            id="catalog-search-input"
            type="text"
            placeholder="Search architect, style, location, or keyword..."
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            className="input-luxury"
            style={{ paddingLeft: '38px', fontSize: '0.85rem' }}
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ searchQuery: '' })}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#8e97a6',
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* View Mode & Sorting */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Sort By Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ArrowUpDown size={15} color="#c5a059" />
            <select
              id="sort-select"
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
              className="input-luxury"
              style={{ padding: '8px 12px', fontSize: '0.82rem', width: 'auto' }}
            >
              <option value="featured">Featured Curations</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="yield-desc">Highest Rental Yield ROI</option>
              <option value="sqft-desc">Largest Floor Area (Sq Ft)</option>
              <option value="year-desc">Newest Architectural Era</option>
            </select>
          </div>

          {/* View Mode Switcher */}
          <div
            style={{
              display: 'flex',
              background: 'rgba(255,255,255,0.05)',
              padding: '3px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <button
              onClick={() => onFilterChange({ viewMode: 'grid' })}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: filters.viewMode === 'grid' ? '#c5a059' : 'transparent',
                color: filters.viewMode === 'grid' ? '#0c0e12' : '#c7cbd3',
                fontWeight: 600,
              }}
              title="Grid View"
            >
              <Grid size={15} /> Grid
            </button>
            <button
              onClick={() => onFilterChange({ viewMode: 'split' })}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: filters.viewMode === 'split' ? '#c5a059' : 'transparent',
                color: filters.viewMode === 'split' ? '#0c0e12' : '#c7cbd3',
                fontWeight: 600,
              }}
              title="Split Map View"
            >
              <Columns size={15} /> Split Map
            </button>
            <button
              onClick={() => onFilterChange({ viewMode: 'map' })}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: filters.viewMode === 'map' ? '#c5a059' : 'transparent',
                color: filters.viewMode === 'map' ? '#0c0e12' : '#c7cbd3',
                fontWeight: 600,
              }}
              title="Map Only"
            >
              <MapIcon size={15} /> Coordinates
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Tags Bar */}
      {(filters.styles.length > 0 || filters.amenities.length > 0 || filters.searchQuery) && (
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.75rem', color: '#8e97a6', textTransform: 'uppercase' }}>
            Active Criteria:
          </span>
          {filters.styles.map((style) => (
            <span
              key={style}
              className="gold-badge"
              style={{ cursor: 'pointer', fontSize: '0.72rem' }}
              onClick={() =>
                onFilterChange({ styles: filters.styles.filter((s) => s !== style) })
              }
            >
              {style} <X size={10} />
            </span>
          ))}
          {filters.amenities.map((amenity) => (
            <span
              key={amenity}
              className="pill-tag"
              style={{ cursor: 'pointer', fontSize: '0.72rem' }}
              onClick={() =>
                onFilterChange({ amenities: filters.amenities.filter((a) => a !== amenity) })
              }
            >
              {amenity} <X size={10} />
            </span>
          ))}
        </div>
      )}

      {/* Main Content Layout based on View Mode */}
      {filters.viewMode === 'grid' && (
        <div className="property-catalog-grid">
          {properties.map((prop) => (
            <PropertyCard
              key={prop.id}
              property={prop}
              currency={currency}
              unitSystem={unitSystem}
              isFavorite={favorites.includes(prop.id)}
              onToggleFavorite={onToggleFavorite}
              onSelectProperty={onSelectProperty}
              onQuickBook={onQuickBook}
              onQuickFloorPlan={onQuickFloorPlan}
            />
          ))}
        </div>
      )}

      {filters.viewMode === 'split' && (
        <div className="split-map-layout">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '780px', overflowY: 'auto', paddingRight: '6px' }}>
            {properties.map((prop) => (
              <PropertyCard
                key={prop.id}
                property={prop}
                currency={currency}
                unitSystem={unitSystem}
                isFavorite={favorites.includes(prop.id)}
                onToggleFavorite={onToggleFavorite}
                onSelectProperty={onSelectProperty}
                onQuickBook={onQuickBook}
                onQuickFloorPlan={onQuickFloorPlan}
              />
            ))}
          </div>

          <div style={{ position: 'sticky', top: '20px' }}>
            <InteractiveMap
              properties={properties}
              selectedProperty={selectedProperty}
              onSelectProperty={onSelectProperty}
              currency={currency}
              unitSystem={unitSystem}
            />
          </div>
        </div>
      )}

      {filters.viewMode === 'map' && (
        <InteractiveMap
          properties={properties}
          selectedProperty={selectedProperty}
          onSelectProperty={onSelectProperty}
          currency={currency}
          unitSystem={unitSystem}
        />
      )}

      {/* Empty State */}
      {properties.length === 0 && (
        <div
          className="glass-card"
          style={{
            padding: '60px 20px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <Compass size={40} color="#c5a059" />
          <h4 style={{ fontSize: '1.2rem', color: '#f8fafc' }}>No Architectural Matches Found</h4>
          <p style={{ fontSize: '0.85rem', color: '#8e97a6', maxWidth: '420px' }}>
            No properties matched your current filter criteria. Try loosening your price or architectural style constraints.
          </p>
        </div>
      )}
    </div>
  );
};
