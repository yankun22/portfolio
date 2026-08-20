import React, { useState, useMemo, useEffect } from 'react';
import {
  Compass,
  Heart,
  Sliders,
  Eye,
  Calendar,
  Sparkles,
  TrendingUp,
  Layers,
  ArrowUp,
  MapPin
} from 'lucide-react';
import {
  ArchitecturalStyle,
  CurrencyCode,
  FilterState,
  Property,
  UnitSystem
} from './types/property';
import { PROPERTIES } from './data/properties';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FilterSidebar } from './components/Catalog/FilterSidebar';
import { PropertyCatalog } from './components/Catalog/PropertyCatalog';
import { PropertyDetailModal } from './components/PropertyDetail/PropertyDetailModal';
import { TourSchedulerModal } from './components/Tour/TourSchedulerModal';
import { FavoritesDrawer } from './components/FavoritesDrawer';

export const App: React.FC = () => {
  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('imperial');

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>(['glass-pavilion-montecito', 'brutalist-sanctuary-kyoto']);
  const [showFavoritesDrawer, setShowFavoritesDrawer] = useState(false);

  // Global Tour Modal
  const [showGlobalTour, setShowGlobalTour] = useState(false);

  // Property Detail Modal
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [detailModalTab, setDetailModalTab] = useState<'overview' | 'floorplan' | 'booking' | 'calculator'>('overview');

  // Filters state
  const [filters, setFilters] = useState<FilterState>({
    styles: [],
    minPrice: 0,
    maxPrice: 25000000,
    priceMode: 'purchase',
    minBedrooms: 0,
    minBathrooms: 0,
    minSqFt: 0,
    amenities: [],
    searchQuery: '',
    sortBy: 'featured',
    viewMode: 'grid',
  });

  // Apply theme to body
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Handle filter changes
  const handleFilterChange = (updated: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters({
      styles: [],
      minPrice: 0,
      maxPrice: 25000000,
      priceMode: 'purchase',
      minBedrooms: 0,
      minBathrooms: 0,
      minSqFt: 0,
      amenities: [],
      searchQuery: '',
      sortBy: 'featured',
      viewMode: 'grid',
    });
  };

  // Toggle favorite
  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  // Filtered & Sorted Properties List
  const filteredProperties = useMemo(() => {
    let result = [...PROPERTIES];

    // Style filter
    if (filters.styles.length > 0) {
      result = result.filter((p) => filters.styles.includes(p.style));
    }

    // Price filter
    if (filters.priceMode === 'purchase') {
      result = result.filter((p) => p.purchasePrice <= filters.maxPrice);
    } else {
      result = result.filter((p) => p.nightlyRate <= filters.maxPrice);
    }

    // Bedrooms & SqFt
    if (filters.minBedrooms > 0) {
      result = result.filter((p) => p.bedrooms >= filters.minBedrooms);
    }
    if (filters.minSqFt > 0) {
      result = result.filter((p) => p.totalSqFt >= filters.minSqFt);
    }

    // Amenities
    if (filters.amenities.length > 0) {
      result = result.filter((p) =>
        filters.amenities.every((a) => p.amenities.includes(a))
      );
    }

    // Search query (keyword match)
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.architect.toLowerCase().includes(q) ||
          p.firm.toLowerCase().includes(q) ||
          p.style.toLowerCase().includes(q) ||
          p.location.city.toLowerCase().includes(q) ||
          p.location.stateOrCountry.toLowerCase().includes(q) ||
          p.amenities.some((a) => a.toLowerCase().includes(q))
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (filters.sortBy === 'price-asc') {
        const valA = filters.priceMode === 'purchase' ? a.purchasePrice : a.nightlyRate;
        const valB = filters.priceMode === 'purchase' ? b.purchasePrice : b.nightlyRate;
        return valA - valB;
      }
      if (filters.sortBy === 'price-desc') {
        const valA = filters.priceMode === 'purchase' ? a.purchasePrice : a.nightlyRate;
        const valB = filters.priceMode === 'purchase' ? b.purchasePrice : b.nightlyRate;
        return valB - valA;
      }
      if (filters.sortBy === 'yield-desc') {
        const yieldA = (a.projectedMonthlyRent * 12) / a.purchasePrice;
        const yieldB = (b.projectedMonthlyRent * 12) / b.purchasePrice;
        return yieldB - yieldA;
      }
      if (filters.sortBy === 'sqft-desc') {
        return b.totalSqFt - a.totalSqFt;
      }
      if (filters.sortBy === 'year-desc') {
        return b.yearBuilt - a.yearBuilt;
      }
      // 'featured'
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });

    return result;
  }, [filters]);

  // Quick Open Modal Triggers
  const openDetailWithTab = (property: Property, tab: 'overview' | 'floorplan' | 'booking' | 'calculator') => {
    setSelectedProperty(property);
    setDetailModalTab(tab);
  };

  const favoriteProperties = useMemo(() => {
    return PROPERTIES.filter((p) => favorites.includes(p.id));
  }, [favorites]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Luxury Navbar */}
      <Navbar
        currency={currency}
        onChangeCurrency={setCurrency}
        unitSystem={unitSystem}
        onToggleUnit={() => setUnitSystem((u) => (u === 'imperial' ? 'metric' : 'imperial'))}
        favoritesCount={favorites.length}
        onOpenFavorites={() => setShowFavoritesDrawer(true)}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
        onOpenGlobalTour={() => setShowGlobalTour(true)}
        onScrollToCatalog={() => {
          document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Hero Section with Featured Icon */}
      <HeroSection
        featuredProperty={PROPERTIES[0]}
        onExploreFloorPlan={(p) => openDetailWithTab(p, 'floorplan')}
        onBookStay={(p) => openDetailWithTab(p, 'booking')}
        onOpenCalculator={(p) => openDetailWithTab(p, 'calculator')}
        onSelectStyle={(style) => {
          if (filters.styles.includes(style)) {
            handleFilterChange({ styles: filters.styles.filter((s) => s !== style) });
          } else {
            handleFilterChange({ styles: [...filters.styles, style] });
          }
          document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
        }}
        selectedStyles={filters.styles}
        currency={currency}
        unitSystem={unitSystem}
      />

      {/* Main Filterable Catalog Section */}
      <main id="catalog-section" style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 16px', width: '100%', flex: 1 }}>
        <div className="haven-main-grid">
          {/* Sidebar Filters */}
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            currency={currency}
            totalMatches={filteredProperties.length}
          />

          {/* Catalog Grid & Views */}
          <PropertyCatalog
            properties={filteredProperties}
            filters={filters}
            onFilterChange={handleFilterChange}
            currency={currency}
            unitSystem={unitSystem}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onSelectProperty={(p) => openDetailWithTab(p, 'overview')}
            onQuickBook={(p) => openDetailWithTab(p, 'booking')}
            onQuickFloorPlan={(p) => openDetailWithTab(p, 'floorplan')}
            selectedProperty={selectedProperty}
          />
        </div>
      </main>

      {/* Luxury Footer */}
      <footer
        style={{
          background: '#090b0f',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '48px 24px 32px 24px',
          marginTop: '60px',
        }}
      >
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '36px',
            paddingBottom: '36px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '6px', background: '#c5a059', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0c0e12' }}>
                <Compass size={18} />
              </div>
              <span style={{ fontFamily: 'Cinzel, serif', fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc', letterSpacing: '0.1em' }}>
                HAVEN<span style={{ color: '#c5a059' }}>REALTY</span>
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#8e97a6', marginTop: '12px', lineHeight: 1.6 }}>
              The international platform for architectural acquisitions, verified blueprints, and luxury design stays.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', color: '#dfba73', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>
              Architectural Styles
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: '#c7cbd3' }}>
              <li>Mid-Century Modern Classics</li>
              <li>Brutalist Concrete Sanctuaries</li>
              <li>Scandinavian Biophilic Timber</li>
              <li>Minimalist Glass Monuments</li>
              <li>Organic Alpine Modernism</li>
              <li>Bauhaus Waterfront Estates</li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', color: '#dfba73', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>
              Platform Verification
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: '#c7cbd3' }}>
              <li>Interactive 360° Floor Plan Explorer</li>
              <li>Real-time Amortization & Yield ROI</li>
              <li>Dynamic Seasonal Rate Calendars</li>
              <li>Calendar Sync (.ics) Export Service</li>
              <li>White-Glove Architect Consultations</li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', color: '#dfba73', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>
              Editorial Inquiries
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#8e97a6', lineHeight: 1.6 }}>
              For private acquisition representation or bespoke architectural commissions, connect with our curatorial directors.
            </p>
            <button
              onClick={() => setShowGlobalTour(true)}
              className="btn-primary"
              style={{ marginTop: '12px', fontSize: '0.8rem', padding: '8px 14px' }}
            >
              Contact Curators
            </button>
          </div>
        </div>

        <div
          style={{
            maxWidth: '1400px',
            margin: '24px auto 0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.78rem',
            color: '#5c6473',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>© 2026 Haven Realty Architectural Platform. All rights reserved.</div>
          <div className="font-mono">
            34.4367° N, 119.6321° W • 34.9949° N, 135.7850° E • 59.9821° N, 10.6543° E
          </div>
        </div>
      </footer>

      {/* Property Detail Modal */}
      {selectedProperty && (
        <PropertyDetailModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          currency={currency}
          unitSystem={unitSystem}
          onToggleUnit={() => setUnitSystem((u) => (u === 'imperial' ? 'metric' : 'imperial'))}
          isFavorite={favorites.includes(selectedProperty.id)}
          onToggleFavorite={handleToggleFavorite}
          initialTab={detailModalTab}
        />
      )}

      {/* Global Tour Scheduler Modal */}
      {showGlobalTour && (
        <TourSchedulerModal
          property={PROPERTIES[0]}
          onClose={() => setShowGlobalTour(false)}
        />
      )}

      {/* Favorites Drawer */}
      <FavoritesDrawer
        isOpen={showFavoritesDrawer}
        onClose={() => setShowFavoritesDrawer(false)}
        favorites={favoriteProperties}
        onRemoveFavorite={handleToggleFavorite}
        onClearFavorites={() => setFavorites([])}
        onSelectProperty={(p) => openDetailWithTab(p, 'overview')}
        currency={currency}
        unitSystem={unitSystem}
      />
    </div>
  );
};

export default App;
