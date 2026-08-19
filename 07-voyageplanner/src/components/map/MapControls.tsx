import React from 'react';
import { Layers, Maximize2, Route, Eye, Navigation } from 'lucide-react';

export type TileLayerType = 'dark' | 'standard' | 'voyager';

interface MapControlsProps {
  currentLayer: TileLayerType;
  onLayerChange: (layer: TileLayerType) => void;
  showPolylines: boolean;
  onTogglePolylines: () => void;
  filterDayOnly: boolean;
  onToggleFilterDay: () => void;
  onFitBounds: () => void;
  showDirections: boolean;
  onToggleDirections: () => void;
  hasMultipleActivities: boolean;
}

export const MapControls: React.FC<MapControlsProps> = ({
  currentLayer,
  onLayerChange,
  showPolylines,
  onTogglePolylines,
  filterDayOnly,
  onToggleFilterDay,
  onFitBounds,
  showDirections,
  onToggleDirections,
  hasMultipleActivities
}) => {
  return (
    <div className="map-hud-controls">
      {hasMultipleActivities && (
        <button
          className="map-hud-btn"
          onClick={onToggleDirections}
          style={{
            background: showDirections ? 'var(--accent-primary)' : 'rgba(18, 24, 38, 0.85)',
            color: showDirections ? '#ffffff' : 'var(--text-primary)',
            borderColor: showDirections ? 'var(--accent-primary)' : 'var(--border-medium)',
            fontWeight: 700
          }}
          title="Toggle Google Maps-style turn-by-turn road navigation"
        >
          <Navigation size={13} />
          <span>{showDirections ? 'Directions On' : 'Get Directions'}</span>
        </button>
      )}

      <button
        className="map-hud-btn"
        onClick={onFitBounds}
        title="Fit map to all destinations"
      >
        <Maximize2 size={13} />
        <span>Fit Bounds</span>
      </button>

      <div style={{ position: 'relative' }}>
        <button
          className="map-hud-btn"
          onClick={() => {
            const nextLayer: TileLayerType =
              currentLayer === 'dark'
                ? 'voyager'
                : currentLayer === 'voyager'
                ? 'standard'
                : 'dark';
            onLayerChange(nextLayer);
          }}
          title="Switch map theme"
        >
          <Layers size={13} />
          <span style={{ textTransform: 'capitalize' }}>Map: {currentLayer}</span>
        </button>
      </div>

      <button
        className="map-hud-btn"
        onClick={onTogglePolylines}
        style={{
          borderColor: showPolylines ? 'var(--accent-primary)' : 'var(--border-medium)',
          color: showPolylines ? 'var(--accent-primary)' : 'var(--text-secondary)'
        }}
        title="Toggle route line display"
      >
        <Route size={13} />
        <span>{showPolylines ? 'Lines On' : 'Lines Off'}</span>
      </button>

      <button
        className="map-hud-btn"
        onClick={onToggleFilterDay}
        style={{
          borderColor: filterDayOnly ? 'var(--accent-primary)' : 'var(--border-medium)',
          color: filterDayOnly ? 'var(--accent-primary)' : 'var(--text-secondary)'
        }}
        title="Filter markers to selected day or show entire trip"
      >
        <Eye size={13} />
        <span>{filterDayOnly ? 'Day Markers' : 'All Markers'}</span>
      </button>
    </div>
  );
};
