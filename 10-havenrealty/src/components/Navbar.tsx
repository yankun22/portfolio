import React from 'react';
import {
  Compass,
  Heart,
  Calendar,
  Sun,
  Moon,
  Video,
  Sparkles,
  Sliders,
  DollarSign,
  Layers
} from 'lucide-react';
import { CurrencyCode, UnitSystem } from '../types/property';

interface NavbarProps {
  currency: CurrencyCode;
  onChangeCurrency: (c: CurrencyCode) => void;
  unitSystem: UnitSystem;
  onToggleUnit: () => void;
  favoritesCount: number;
  onOpenFavorites: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenGlobalTour: () => void;
  onScrollToCatalog: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currency,
  onChangeCurrency,
  unitSystem,
  onToggleUnit,
  favoritesCount,
  onOpenFavorites,
  theme,
  onToggleTheme,
  onOpenGlobalTour,
  onScrollToCatalog,
}) => {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(12, 14, 18, 0.94)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '12px 16px',
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        {/* Brand Logomark */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', flexShrink: 0 }}
        >
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #c5a059, #9e7d38)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(197, 160, 89, 0.4)',
            }}
          >
            <Compass size={18} color="#0c0e12" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontFamily: 'Cinzel, serif', fontSize: '1.15rem', fontWeight: 700, letterSpacing: '0.1em', color: '#f8fafc' }}>
              HAVEN<span style={{ color: '#c5a059' }}>REALTY</span>
            </div>
            <div style={{ fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#8e97a6', marginTop: '-2px' }}>
              Architectural Masterpieces
            </div>
          </div>
        </div>

        {/* Center Quick Navigation (Desktop Only) */}
        <nav className="haven-nav-links">
          <button
            onClick={onScrollToCatalog}
            className="btn-ghost"
            style={{ fontSize: '0.85rem', fontWeight: 500 }}
          >
            Curated Catalog
          </button>
          <button
            onClick={onScrollToCatalog}
            className="btn-ghost"
            style={{ fontSize: '0.85rem', fontWeight: 500 }}
          >
            360° Blueprints
          </button>
          <button
            onClick={onScrollToCatalog}
            className="btn-ghost"
            style={{ fontSize: '0.85rem', fontWeight: 500 }}
          >
            Yield ROI Engine
          </button>
        </nav>

        {/* Right Utility Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* Currency Switcher */}
          <select
            id="currency-selector"
            value={currency}
            onChange={(e) => onChangeCurrency(e.target.value as CurrencyCode)}
            className="input-luxury"
            style={{
              width: 'auto',
              padding: '6px 8px',
              fontSize: '0.78rem',
              fontWeight: 600,
              background: 'rgba(255,255,255,0.05)',
              cursor: 'pointer',
            }}
            aria-label="Currency Selector"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="JPY">JPY</option>
            <option value="CAD">CAD</option>
          </select>

          {/* Unit System Toggle */}
          <button
            onClick={onToggleUnit}
            className="btn-secondary"
            style={{ padding: '6px 10px', fontSize: '0.75rem', fontWeight: 600 }}
            title="Toggle between Square Feet and Square Meters"
          >
            {unitSystem === 'imperial' ? 'Sq Ft' : 'm²'}
          </button>

          {/* Favorites Drawer Toggle */}
          <button
            id="btn-favorites-drawer"
            onClick={onOpenFavorites}
            className="btn-ghost"
            style={{
              position: 'relative',
              padding: '6px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.05)',
            }}
            title="Saved Masterpieces"
            aria-label="Saved Masterpieces"
          >
            <Heart size={16} color={favoritesCount > 0 ? '#f43f5e' : '#c7cbd3'} fill={favoritesCount > 0 ? '#f43f5e' : 'none'} />
            {favoritesCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: '#c5a059',
                  color: '#0c0e12',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="btn-ghost"
            style={{ padding: '6px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}
            title="Toggle Architectural Theme"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={16} color="#dfba73" /> : <Moon size={16} />}
          </button>

          {/* Virtual Tour CTA */}
          <button
            id="btn-nav-schedule-tour"
            onClick={onOpenGlobalTour}
            className="btn-primary"
            style={{ padding: '7px 12px', fontSize: '0.8rem' }}
          >
            <Video size={14} /> <span>Tour</span>
          </button>
        </div>
      </div>
    </header>
  );
};
