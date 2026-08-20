import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  Maximize2,
  Sparkles,
  Layers,
  TrendingUp,
  X,
  Eye,
  Calendar
} from 'lucide-react';
import { CurrencyCode, Property, UnitSystem } from '../../types/property';
import { formatCurrency, formatArea } from '../../utils/formatters';

interface InteractiveMapProps {
  properties: Property[];
  selectedProperty: Property | null;
  onSelectProperty: (property: Property) => void;
  currency: CurrencyCode;
  unitSystem: UnitSystem;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  properties,
  selectedProperty,
  onSelectProperty,
  currency,
  unitSystem,
}) => {
  const [hoveredProperty, setHoveredProperty] = useState<Property | null>(null);
  const [mapTheme, setMapTheme] = useState<'blueprint' | 'dark'>('blueprint');

  // Convert lat/lng to normalized 2D map coordinates (Mercator-like bounding box)
  // Lat: 30 to 65 N, Lng: -130 to 140 E
  const minLat = 30;
  const maxLat = 65;
  const minLng = -130;
  const maxLng = 145;

  const projectCoords = (lat: number, lng: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100;
    return {
      x: Math.max(5, Math.min(95, x)),
      y: Math.max(8, Math.min(92, y)),
    };
  };

  return (
    <div
      className="glass-card"
      style={{
        position: 'relative',
        width: '100%',
        height: '620px',
        background: '#090c12',
        overflow: 'hidden',
        border: '1px solid rgba(197, 160, 89, 0.3)',
      }}
    >
      {/* Top Map HUD Controls */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          zIndex: 30,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <div
          style={{
            background: 'rgba(14, 18, 25, 0.85)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            padding: '6px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.8rem',
            color: '#f8fafc',
          }}
        >
          <Compass size={16} color="#dfba73" />
          <span>Global Architectural Coordinates</span>
        </div>

        <div
          style={{
            background: 'rgba(14, 18, 25, 0.85)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            padding: '4px',
            display: 'flex',
            gap: '4px',
          }}
        >
          <button
            onClick={() => setMapTheme('blueprint')}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '0.75rem',
              background: mapTheme === 'blueprint' ? '#c5a059' : 'transparent',
              color: mapTheme === 'blueprint' ? '#0c0e12' : '#c7cbd3',
              fontWeight: 600,
            }}
          >
            Blueprint Grid
          </button>
          <button
            onClick={() => setMapTheme('dark')}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '0.75rem',
              background: mapTheme === 'dark' ? '#c5a059' : 'transparent',
              color: mapTheme === 'dark' ? '#0c0e12' : '#c7cbd3',
              fontWeight: 600,
            }}
          >
            Obsidian Vector
          </button>
        </div>
      </div>

      {/* Map Canvas / SVG Projection */}
      <div
        className={mapTheme === 'blueprint' ? 'blueprint-grid' : ''}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          background: mapTheme === 'dark' ? '#07090e' : '#0a0e17',
        }}
      >
        {/* World Grid & Continental Silhouette SVGs */}
        <svg
          viewBox="0 0 1000 600"
          style={{ width: '100%', height: '100%', opacity: 0.25, pointerEvents: 'none' }}
        >
          {/* Latitude / Longitude lines */}
          <line x1="0" y1="150" x2="1000" y2="150" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="6 6" />
          <line x1="0" y1="300" x2="1000" y2="300" stroke="#c5a059" strokeWidth="0.8" />
          <line x1="0" y1="450" x2="1000" y2="450" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="6 6" />

          <line x1="250" y1="0" x2="250" y2="600" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="6 6" />
          <line x1="500" y1="0" x2="500" y2="600" stroke="#c5a059" strokeWidth="0.8" />
          <line x1="750" y1="0" x2="750" y2="600" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="6 6" />

          {/* Abstract landmass geometry */}
          {/* North America */}
          <path
            d="M 120 160 Q 180 120 280 140 T 320 280 Q 240 380 180 440 T 130 320 Z"
            fill="rgba(255,255,255,0.06)"
            stroke="#94a3b8"
            strokeWidth="1"
          />
          {/* Europe & Scandinavia */}
          <path
            d="M 480 120 Q 560 90 620 130 T 590 280 Q 520 320 470 240 Z"
            fill="rgba(255,255,255,0.06)"
            stroke="#94a3b8"
            strokeWidth="1"
          />
          {/* East Asia / Japan */}
          <path
            d="M 780 180 Q 860 140 920 220 T 870 360 Q 800 320 770 260 Z"
            fill="rgba(255,255,255,0.06)"
            stroke="#94a3b8"
            strokeWidth="1"
          />
        </svg>

        {/* Property Map Pins */}
        {properties.map((prop) => {
          const { x, y } = projectCoords(prop.location.lat, prop.location.lng);
          const isSelected = selectedProperty?.id === prop.id;
          const isHovered = hoveredProperty?.id === prop.id;

          return (
            <div
              key={prop.id}
              id={`map-pin-${prop.id}`}
              style={{
                position: 'absolute',
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: isSelected || isHovered ? 40 : 20,
                cursor: 'pointer',
              }}
              onClick={() => onSelectProperty(prop)}
              onMouseEnter={() => setHoveredProperty(prop)}
              onMouseLeave={() => setHoveredProperty(null)}
            >
              {/* Radar pulse for active */}
              <div
                className="hotspot-radar"
                style={{
                  position: 'absolute',
                  inset: '-10px',
                  borderRadius: '50%',
                  background: 'rgba(197, 160, 89, 0.5)',
                  pointerEvents: 'none',
                }}
              />

              {/* Pin Icon / Label */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 10px',
                  background: isSelected ? '#c5a059' : '#141822',
                  color: isSelected ? '#0c0e12' : '#f8fafc',
                  borderRadius: '20px',
                  border: isSelected ? '2px solid #dfba73' : '1px solid rgba(197, 160, 89, 0.4)',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.6)',
                  fontWeight: 600,
                  fontSize: '0.78rem',
                  transition: 'all 0.2s ease',
                  transform: isHovered || isSelected ? 'scale(1.1)' : 'scale(1)',
                }}
              >
                <MapPin size={14} color={isSelected ? '#0c0e12' : '#dfba73'} />
                <span className="font-mono">{prop.location.city}</span>
              </div>
            </div>
          );
        })}

        {/* Hover / Active Preview Popover Card */}
        {(hoveredProperty || selectedProperty) && (
          <div
            style={{
              position: 'absolute',
              bottom: '24px',
              right: '24px',
              zIndex: 50,
              width: '320px',
              background: 'rgba(14, 18, 25, 0.95)',
              backdropFilter: 'blur(16px)',
              border: '1px solid #c5a059',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 12px 32px rgba(0,0,0,0.8)',
              animation: 'scaleUp 0.2s ease',
            }}
          >
            {(() => {
              const active = hoveredProperty || selectedProperty!;
              return (
                <div>
                  <img
                    src={active.heroImage}
                    alt={active.title}
                    style={{ width: '100%', height: '140px', objectFit: 'cover' }}
                  />
                  <div style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span className="gold-badge" style={{ fontSize: '0.65rem' }}>
                        {active.style}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#dfba73' }} className="font-mono">
                        {active.location.lat.toFixed(4)}° N, {active.location.lng.toFixed(4)}° W
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1.05rem', color: '#f8fafc', fontWeight: 600, marginTop: '8px' }}>
                      {active.title}
                    </h4>
                    <p style={{ fontSize: '0.78rem', color: '#8e97a6' }}>
                      {active.location.city}, {active.location.stateOrCountry} • {active.location.elevation}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: '#8e97a6' }}>PURCHASE</span>
                        <div style={{ fontSize: '1.05rem', color: '#f8fafc', fontWeight: 700 }} className="font-mono">
                          {formatCurrency(active.purchasePrice, currency)}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.7rem', color: '#8e97a6' }}>STAY RATE</span>
                        <div style={{ fontSize: '0.95rem', color: '#dfba73', fontWeight: 600 }} className="font-mono">
                          {formatCurrency(active.nightlyRate, currency)}/nt
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectProperty(active)}
                      className="btn-primary"
                      style={{ width: '100%', padding: '8px', fontSize: '0.82rem', marginTop: '12px' }}
                    >
                      <Eye size={14} /> Open Masterpiece Detail & Floor Plan
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};
