import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  DollarSign,
  CloudSun,
  CheckSquare,
  Printer,
  Plus,
  Moon,
  Sun,
  Download,
  Upload,
  ChevronDown,
  MoreVertical,
  Layers
} from 'lucide-react';
import type { Trip } from '../../types/itinerary';
import { POPULAR_CURRENCIES } from '../../data/currencies';

export type ActiveTab = 'itinerary' | 'budget' | 'weather' | 'packing' | 'print';

interface HeaderProps {
  trips: Trip[];
  activeTrip: Trip;
  onSelectTrip: (tripId: string) => void;
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  selectedCurrency: string;
  onCurrencyChange: (code: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenAddActivity: () => void;
  onOpenExportModal: () => void;
  onOpenNewTripModal: () => void;
  onExportPDF: () => void;
  mobileActiveSubView?: 'timeline' | 'map';
  onToggleMobileSubView?: (view: 'timeline' | 'map') => void;
}

export const Header: React.FC<HeaderProps> = ({
  trips,
  activeTrip,
  onSelectTrip,
  activeTab,
  onTabChange,
  selectedCurrency,
  onCurrencyChange,
  isDarkMode,
  onToggleDarkMode,
  onOpenAddActivity,
  onOpenExportModal,
  onOpenNewTripModal,
  onExportPDF,
  mobileActiveSubView = 'timeline',
  onToggleMobileSubView
}) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <>
      {/* Top Application Header */}
      <header className="app-header">
        <div className="brand-section">
          <div className="brand-logo-icon">
            <Compass size={22} />
          </div>
          <div className="brand-text-block">
            <div className="brand-title">VoyagePlanner</div>
            <div className="brand-subtitle">Smart Itinerary & Routing</div>
          </div>

          <div className="trip-picker-wrapper">
            <select
              className="trip-picker-btn"
              value={activeTrip.id}
              onChange={(e) => {
                if (e.target.value === '__NEW__') {
                  onOpenNewTripModal();
                } else {
                  onSelectTrip(e.target.value);
                }
              }}
            >
              <optgroup label="Saved Itineraries">
                {trips.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </optgroup>
              <option value="__NEW__">+ Create New Trip...</option>
            </select>
            <ChevronDown size={14} className="trip-picker-arrow" />
          </div>
        </div>

        {/* Desktop View Navigation Tabs */}
        <nav className="view-tabs desktop-only-tabs">
          <button
            className={`tab-btn ${activeTab === 'itinerary' ? 'active' : ''}`}
            onClick={() => onTabChange('itinerary')}
          >
            <MapPin size={15} />
            <span>Itinerary & Map</span>
          </button>

          <button
            className={`tab-btn ${activeTab === 'budget' ? 'active' : ''}`}
            onClick={() => onTabChange('budget')}
          >
            <DollarSign size={15} />
            <span>Budget & Splitter</span>
          </button>

          <button
            className={`tab-btn ${activeTab === 'weather' ? 'active' : ''}`}
            onClick={() => onTabChange('weather')}
          >
            <CloudSun size={15} />
            <span>Weather</span>
          </button>

          <button
            className={`tab-btn ${activeTab === 'packing' ? 'active' : ''}`}
            onClick={() => onTabChange('packing')}
          >
            <CheckSquare size={15} />
            <span>Checklist</span>
          </button>

          <button
            className={`tab-btn ${activeTab === 'print' ? 'active' : ''}`}
            onClick={() => onTabChange('print')}
          >
            <Printer size={15} />
            <span>Print Sheet</span>
          </button>
        </nav>

        {/* Header Action Buttons */}
        <div className="header-actions">
          {/* Mobile sub-view toggle (Timeline vs Map) when on Itinerary Tab */}
          {activeTab === 'itinerary' && onToggleMobileSubView && (
            <div className="mobile-view-toggle-pill mobile-only-inline">
              <button
                className={`mobile-view-btn ${mobileActiveSubView === 'timeline' ? 'active' : ''}`}
                onClick={() => onToggleMobileSubView('timeline')}
              >
                Timeline
              </button>
              <button
                className={`mobile-view-btn ${mobileActiveSubView === 'map' ? 'active' : ''}`}
                onClick={() => onToggleMobileSubView('map')}
              >
                Map
              </button>
            </div>
          )}

          <select
            className="form-select currency-picker-header desktop-only-btn"
            value={selectedCurrency}
            onChange={(e) => onCurrencyChange(e.target.value)}
            title="Change base currency display"
            style={{ appearance: 'none', WebkitAppearance: 'none', padding: '5px 10px', fontSize: '0.8rem', minWidth: 80 }}
          >
            {POPULAR_CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} ({c.symbol})
              </option>
            ))}
          </select>

          <button
            className="btn-primary add-activity-btn-header"
            onClick={onOpenAddActivity}
            title="Add Destination Activity"
          >
            <Plus size={15} />
            <span className="btn-text-desktop">Add Activity</span>
          </button>

          <button
            className="btn-secondary desktop-only-btn"
            onClick={onExportPDF}
            title="Download printable PDF itinerary"
          >
            <Download size={15} />
            <span>PDF</span>
          </button>

          <button
            className="btn-icon desktop-only-btn"
            onClick={onOpenExportModal}
            title="Backup & Restore JSON"
          >
            <Upload size={16} />
          </button>

          <button
            className="btn-icon"
            onClick={onToggleDarkMode}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Mobile Overflow Menu Button */}
          <button
            className="btn-icon mobile-only-btn"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            title="More Options"
          >
            <MoreVertical size={16} />
          </button>
        </div>
      </header>

      {/* Mobile Overflow Dropdown Drawer */}
      {showMobileMenu && (
        <div
          className="mobile-menu-drawer"
          onClick={() => setShowMobileMenu(false)}
        >
          <div className="mobile-menu-card" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <span style={{ fontWeight: 800, fontSize: '0.875rem' }}>Options & Tools</span>
              <button
                className="btn-icon"
                style={{ width: 28, height: 28 }}
                onClick={() => setShowMobileMenu(false)}
              >
                ✕
              </button>
            </div>

            <div className="mobile-menu-body">
              {/* Currency Selector for mobile */}
              <div className="mobile-menu-currency-row">
                <DollarSign size={16} style={{ flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: '0.875rem', fontWeight: 600 }}>Display Currency</span>
                <select
                  className="form-select"
                  value={selectedCurrency}
                  onChange={(e) => { onCurrencyChange(e.target.value); }}
                  style={{ appearance: 'none', WebkitAppearance: 'none', padding: '4px 8px', fontSize: '0.8rem', minWidth: 90, background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)' }}
                >
                  {POPULAR_CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>
                  ))}
                </select>
              </div>

              <button
                className="mobile-menu-item"
                onClick={() => {
                  setShowMobileMenu(false);
                  onExportPDF();
                }}
              >
                <Download size={16} />
                <span>Export PDF Itinerary</span>
              </button>

              <button
                className="mobile-menu-item"
                onClick={() => {
                  setShowMobileMenu(false);
                  onOpenExportModal();
                }}
              >
                <Upload size={16} />
                <span>Backup & Import JSON</span>
              </button>

              <button
                className="mobile-menu-item"
                onClick={() => {
                  setShowMobileMenu(false);
                  onOpenNewTripModal();
                }}
              >
                <Layers size={16} />
                <span>Create New Itinerary</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar (iOS / Android App Style) */}
      <nav className="mobile-bottom-nav">
        <button
          className={`mobile-bottom-btn ${activeTab === 'itinerary' ? 'active' : ''}`}
          onClick={() => onTabChange('itinerary')}
        >
          <MapPin size={18} />
          <span>Itinerary</span>
        </button>

        <button
          className={`mobile-bottom-btn ${activeTab === 'budget' ? 'active' : ''}`}
          onClick={() => onTabChange('budget')}
        >
          <DollarSign size={18} />
          <span>Budget</span>
        </button>

        <button
          className={`mobile-bottom-btn ${activeTab === 'weather' ? 'active' : ''}`}
          onClick={() => onTabChange('weather')}
        >
          <CloudSun size={18} />
          <span>Weather</span>
        </button>

        <button
          className={`mobile-bottom-btn ${activeTab === 'packing' ? 'active' : ''}`}
          onClick={() => onTabChange('packing')}
        >
          <CheckSquare size={18} />
          <span>Packing</span>
        </button>

        <button
          className={`mobile-bottom-btn ${activeTab === 'print' ? 'active' : ''}`}
          onClick={() => onTabChange('print')}
        >
          <Printer size={18} />
          <span>Print</span>
        </button>
      </nav>
    </>
  );
};
