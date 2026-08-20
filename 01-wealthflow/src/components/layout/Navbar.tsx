import React from 'react';
import {
  TrendingUp,
  PieChart,
  Activity,
  Flame,
  FileDown,
  RotateCcw,
  Layers,
} from 'lucide-react';
import { useWealth } from '../../context/useWealth';
import { SUPPORTED_CURRENCIES } from '../../services/storageService';
import { PRESET_PROFILES } from '../../data/presetProfiles';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currency,
    setCurrency,
    loadPreset,
    resetToDefault,
  } = useWealth();

  const navItems = [
    { id: 'portfolio', label: 'Portfolio Tracker', icon: PieChart },
    { id: 'monte-carlo', label: 'Monte Carlo Engine', icon: Activity },
    { id: 'fire', label: 'FIRE Calculator', icon: Flame },
    { id: 'rebalance', label: 'Asset Rebalance', icon: Layers },
    { id: 'export', label: 'Export & Reports', icon: FileDown },
  ];

  return (
    <header className="navbar-top">
      {/* Brand */}
      <div className="brand-logo" onClick={() => setActiveTab('portfolio')}>
        <div className="logo-icon">
          <TrendingUp size={22} />
        </div>
        <div>
          <h1 className="brand-title">WealthFlow</h1>
          <p style={{ fontSize: '0.675rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.04em' }}>
            INSTITUTIONAL WEALTH ENGINE
          </p>
        </div>
      </div>

      {/* Center Nav Tabs */}
      <nav className="nav-tabs">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`nav-tab-btn ${isActive ? 'active' : ''}`}
              style={{ minWidth: 40, minHeight: 40 }}
              title={item.label}
            >
              <Icon size={16} color={isActive ? '#10b981' : 'currentColor'} />
              <span className="nav-label">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Preset Selector */}
        <div style={{ position: 'relative' }}>
          <select
            className="select-input"
            style={{ padding: '6px 12px', fontSize: '0.8rem', width: 'auto', cursor: 'pointer' }}
            onChange={(e) => {
              if (e.target.value) {
                loadPreset(e.target.value);
                e.target.value = '';
              }
            }}
            defaultValue=""
            title="Load Pre-configured Portfolio Profiles"
          >
            <option value="" disabled>
              ⚡ Load Presets...
            </option>
            {PRESET_PROFILES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Currency Switcher */}
        <select
          className="select-input"
          style={{ padding: '6px 10px', fontSize: '0.8rem', width: 'auto', fontWeight: 600, cursor: 'pointer' }}
          value={currency.code}
          onChange={(e) => {
            const found = SUPPORTED_CURRENCIES.find((c) => c.code === e.target.value);
            if (found) setCurrency(found);
          }}
          title="Change Display Currency"
        >
          {SUPPORTED_CURRENCIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.code} ({c.symbol})
            </option>
          ))}
        </select>

        {/* Reset */}
        <button
          className="btn-icon"
          onClick={() => {
            if (window.confirm('Reset all portfolio holdings and simulation parameters to default?')) {
              resetToDefault();
            }
          }}
          title="Reset to Factory Defaults"
        >
          <RotateCcw size={16} />
        </button>
      </div>
    </header>
  );
};
