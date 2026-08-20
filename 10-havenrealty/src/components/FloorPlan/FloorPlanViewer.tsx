import React, { useState } from 'react';
import {
  Layers,
  Compass,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Eye,
  Info
} from 'lucide-react';
import { FloorLevel, Property, RoomHotspot, UnitSystem } from '../../types/property';
import { formatArea } from '../../utils/formatters';
import { RoomHotspotModal } from './RoomHotspotModal';

interface FloorPlanViewerProps {
  property: Property;
  unitSystem: UnitSystem;
  onToggleUnit: () => void;
}

export const FloorPlanViewer: React.FC<FloorPlanViewerProps> = ({
  property,
  unitSystem,
  onToggleUnit,
}) => {
  const [activeLevelIndex, setActiveLevelIndex] = useState(0);
  const [selectedHotspot, setSelectedHotspot] = useState<RoomHotspot | null>(null);
  const [hoveredHotspot, setHoveredHotspot] = useState<RoomHotspot | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const activeLevel: FloorLevel = property.floors[activeLevelIndex] || property.floors[0];

  return (
    <div className="glass-card" style={{ padding: '24px', position: 'relative' }}>
      {/* Top Controls Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '20px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="gold-badge">
              <Layers size={12} /> Interactive Floor Plan
            </span>
            <span style={{ fontSize: '0.85rem', color: '#8e97a6' }}>
              Level Elevation: <strong style={{ color: '#f8fafc' }}>{activeLevel.elevation}</strong>
            </span>
          </div>
          <h3 style={{ fontSize: '1.25rem', marginTop: '6px', color: '#f8fafc' }}>
            {activeLevel.name}
          </h3>
        </div>

        {/* Floor Switcher & Zoom Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {property.floors.length > 1 && (
            <div
              style={{
                display: 'flex',
                background: 'rgba(255,255,255,0.05)',
                padding: '4px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {property.floors.map((fl, idx) => (
                <button
                  key={fl.id}
                  onClick={() => setActiveLevelIndex(idx)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    background: activeLevelIndex === idx ? '#c5a059' : 'transparent',
                    color: activeLevelIndex === idx ? '#0c0e12' : '#c7cbd3',
                    transition: 'all 0.15s ease',
                  }}
                >
                  Level {fl.levelNumber}
                </button>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '8px' }}>
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.5, z + 0.1))}
              className="btn-ghost"
              style={{ padding: '6px' }}
              title="Zoom In Floor Plan"
            >
              <ZoomIn size={16} />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.1))}
              className="btn-ghost"
              style={{ padding: '6px' }}
              title="Zoom Out Floor Plan"
            >
              <ZoomOut size={16} />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="btn-ghost"
              style={{ padding: '6px' }}
              title="Reset Zoom"
            >
              <RotateCcw size={14} />
            </button>
          </div>

          <button
            onClick={onToggleUnit}
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
          >
            {unitSystem === 'imperial' ? 'Sq Ft' : 'm²'}
          </button>
        </div>
      </div>

      {/* Blueprint Canvas / SVG Container */}
      <div
        className="blueprint-grid"
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '440px',
          background: '#0a0d14',
          borderRadius: '12px',
          border: '1px solid rgba(197, 160, 89, 0.25)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}
      >
        {/* Scale & Compass Overlays */}
        <div
          style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(12, 14, 18, 0.8)',
            padding: '6px 12px',
            borderRadius: '6px',
            border: '1px solid rgba(255,255,255,0.08)',
            fontSize: '0.75rem',
            color: '#c7cbd3',
          }}
        >
          <Compass size={16} color="#dfba73" />
          <span style={{ fontWeight: 600, color: '#f8fafc' }}>NORTH ▲</span>
          <span style={{ color: '#8e97a6' }}>| Scale 1:100</span>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            background: 'rgba(12, 14, 18, 0.8)',
            padding: '6px 12px',
            borderRadius: '6px',
            border: '1px solid rgba(255,255,255,0.08)',
            fontSize: '0.75rem',
            color: '#dfba73',
          }}
        >
          Level Area: <strong>{formatArea(activeLevel.totalAreaSqFt, unitSystem)}</strong>
        </div>

        {/* Blueprint SVG & Hotspots layer */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '780px',
            aspectRatio: '16 / 10',
            transform: `scale(${zoomLevel})`,
            transition: 'transform 0.2s ease-out',
          }}
        >
          {/* Architectural Blueprint Vector Paths */}
          <svg
            viewBox="0 0 800 500"
            style={{
              width: '100%',
              height: '100%',
              stroke: '#3b82f6',
              fill: 'none',
              strokeWidth: 2,
            }}
          >
            {/* Background Subtlety */}
            <rect x="20" y="20" width="760" height="460" fill="rgba(6, 182, 212, 0.02)" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />

            {/* Perimeter Foundation Walls (Thick Architectural Lines) */}
            <rect x="60" y="50" width="680" height="400" stroke="#94a3b8" strokeWidth="4" rx="4" />

            {/* Room Partitions */}
            <line x1="280" y1="50" x2="280" y2="450" stroke="#64748b" strokeWidth="3" strokeDasharray="1 0" />
            <line x1="560" y1="50" x2="560" y2="450" stroke="#64748b" strokeWidth="3" />
            <line x1="280" y1="260" x2="560" y2="260" stroke="#64748b" strokeWidth="2" strokeDasharray="8 4" />
            <line x1="560" y1="280" x2="740" y2="280" stroke="#64748b" strokeWidth="3" />

            {/* Balcony / Cantilever Terrace Outlines */}
            <rect x="280" y="360" width="280" height="90" stroke="#c5a059" strokeWidth="2" strokeDasharray="6 3" fill="rgba(197, 160, 89, 0.05)" />
            <text x="360" y="410" fill="#dfba73" fontSize="12" fontFamily="JetBrains Mono, monospace" letterSpacing="2">
              CANTILEVER DECK
            </text>

            {/* Glass Wall Indicators (Double hairline with cyan tint) */}
            <line x1="60" y1="50" x2="740" y2="50" stroke="#06b6d4" strokeWidth="2" />
            <line x1="60" y1="54" x2="740" y2="54" stroke="#06b6d4" strokeWidth="1" strokeDasharray="20 4" />

            {/* Doors & Swing Arcs */}
            <path d="M 280 200 A 40 40 0 0 1 320 240" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="280" y1="200" x2="280" y2="240" stroke="#e2e8f0" strokeWidth="2" />

            <path d="M 560 200 A 40 40 0 0 0 520 240" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="560" y1="200" x2="560" y2="240" stroke="#e2e8f0" strokeWidth="2" />

            {/* Room Blueprint Labels */}
            <text x="130" y="240" fill="#94a3b8" fontSize="14" fontFamily="Cinzel, serif" textAnchor="middle" letterSpacing="1">
              WEST WING / GALLERY
            </text>
            <text x="420" y="160" fill="#94a3b8" fontSize="16" fontFamily="Cinzel, serif" textAnchor="middle" letterSpacing="1.5" fontWeight="bold">
              CENTRAL ATRIUM & SALON
            </text>
            <text x="650" y="160" fill="#94a3b8" fontSize="14" fontFamily="Cinzel, serif" textAnchor="middle" letterSpacing="1">
              PRIMARY SUITE
            </text>
            <text x="650" y="370" fill="#94a3b8" fontSize="13" fontFamily="Cinzel, serif" textAnchor="middle" letterSpacing="1">
              SPA / BATH
            </text>

            {/* Dimension Lines */}
            <line x1="60" y1="35" x2="740" y2="35" stroke="#475569" strokeWidth="1" />
            <line x1="60" y1="30" x2="60" y2="40" stroke="#475569" strokeWidth="1" />
            <line x1="740" y1="30" x2="740" y2="40" stroke="#475569" strokeWidth="1" />
            <text x="400" y="30" fill="#64748b" fontSize="11" fontFamily="JetBrains Mono, monospace" textAnchor="middle">
              68' - 0" (20.72m)
            </text>
          </svg>

          {/* Clickable Hotspot Pins with Pulsing Radar */}
          {activeLevel.hotspots.map((hotspot) => {
            const isHovered = hoveredHotspot?.id === hotspot.id;
            return (
              <div
                key={hotspot.id}
                id={`hotspot-${hotspot.id}`}
                style={{
                  position: 'absolute',
                  left: `${hotspot.x}%`,
                  top: `${hotspot.y}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 20,
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedHotspot(hotspot)}
                onMouseEnter={() => setHoveredHotspot(hotspot)}
                onMouseLeave={() => setHoveredHotspot(null)}
              >
                {/* Radar Pulse Effect */}
                <div
                  className="hotspot-radar"
                  style={{
                    position: 'absolute',
                    inset: '-8px',
                    borderRadius: '50%',
                    background: 'rgba(197, 160, 89, 0.4)',
                    pointerEvents: 'none',
                  }}
                />

                {/* Hotspot Pin Icon */}
                <div
                  style={{
                    position: 'relative',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: isHovered ? '#dfba73' : '#c5a059',
                    border: '2px solid #0c0e12',
                    boxShadow: '0 0 16px rgba(197, 160, 89, 0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0c0e12',
                    transition: 'all 0.2s ease',
                    transform: isHovered ? 'scale(1.2)' : 'scale(1)',
                  }}
                >
                  <Eye size={16} strokeWidth={2.5} />
                </div>

                {/* Hover Tooltip Card */}
                {isHovered && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '42px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'rgba(14, 18, 25, 0.95)',
                      border: '1px solid #c5a059',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      whiteSpace: 'nowrap',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                      pointerEvents: 'none',
                      zIndex: 30,
                      animation: 'fadeIn 0.15s ease',
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#f8fafc' }}>
                      {hotspot.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#dfba73', marginTop: '2px' }} className="font-mono">
                      {formatArea(hotspot.sqft, unitSystem)} • {hotspot.sunOrientation.facing} Facing
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#8e97a6', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Sparkles size={11} color="#dfba73" /> Click to launch 360° tour & specs
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Hotspots Quick Tray at the bottom */}
      <div style={{ marginTop: '20px' }}>
        <span style={{ fontSize: '0.78rem', color: '#8e97a6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Available Room 360° Hotspots on this level:
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
          {activeLevel.hotspots.map((h) => (
            <button
              key={h.id}
              onClick={() => setSelectedHotspot(h)}
              className="glass-card"
              style={{
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '0.85rem',
                color: '#f8fafc',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#c5a059',
                  boxShadow: '0 0 6px #c5a059',
                }}
              />
              <span style={{ fontWeight: 500 }}>{h.name}</span>
              <span style={{ fontSize: '0.78rem', color: '#8e97a6' }} className="font-mono">
                ({formatArea(h.sqft, unitSystem)})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Room Hotspot Inspection Modal */}
      {selectedHotspot && (
        <RoomHotspotModal
          hotspot={selectedHotspot}
          onClose={() => setSelectedHotspot(null)}
          unitSystem={unitSystem}
          onToggleUnit={onToggleUnit}
        />
      )}
    </div>
  );
};
