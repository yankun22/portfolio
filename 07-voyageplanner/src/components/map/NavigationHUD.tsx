import React, { useState } from 'react';
import type { RouteLeg, TransportMode } from '../../types/routing';
import {
  Navigation,
  Footprints,
  Train,
  Car,
  Bike,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ListOrdered,
  X,
  MapPin,
  Clock,
  Route
} from 'lucide-react';

interface NavigationHUDProps {
  legs: RouteLeg[];
  activeLegIndex: number;
  onSelectLegIndex: (index: number) => void;
  selectedMode: TransportMode;
  onChangeMode: (mode: TransportMode) => void;
  onCloseDirections: () => void;
  isLoading?: boolean;
}

export const NavigationHUD: React.FC<NavigationHUDProps> = ({
  legs,
  activeLegIndex,
  onSelectLegIndex,
  selectedMode,
  onChangeMode,
  onCloseDirections,
  isLoading = false
}) => {
  const [showStepList, setShowStepList] = useState(true);

  if (!legs || legs.length === 0) return null;

  const currentLeg = legs[activeLegIndex] || legs[0];
  const totalDayDistance = Math.round(legs.reduce((acc, l) => acc + l.distanceKm, 0) * 10) / 10;
  const totalDayDuration = legs.reduce((acc, l) => acc + l.durationMinutes, 0);

  const MODES: { id: TransportMode; label: string; icon: React.ReactNode }[] = [
    { id: 'walking', label: 'Walk', icon: <Footprints size={14} /> },
    { id: 'transit', label: 'Transit', icon: <Train size={14} /> },
    { id: 'driving', label: 'Drive', icon: <Car size={14} /> },
    { id: 'cycling', label: 'Bike', icon: <Bike size={14} /> }
  ];

  return (
    <div className="navigation-directions-hud">
      {/* HUD Header */}
      <div className="nav-hud-top">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="nav-hud-icon-badge">
            <Navigation size={15} />
          </div>
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Turn-by-Turn Navigation
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              Leg {activeLegIndex + 1} of {legs.length} • Real Street Geometry
            </div>
          </div>
        </div>

        <button
          className="btn-icon"
          style={{ width: 26, height: 26 }}
          onClick={onCloseDirections}
          title="Exit Directions & Return to Overview"
        >
          <X size={14} />
        </button>
      </div>

      {/* Transport Mode Switcher (Google Maps style) */}
      <div className="nav-mode-tabs">
        {MODES.map((m) => (
          <button
            key={m.id}
            className={`nav-mode-pill ${selectedMode === m.id ? 'active' : ''}`}
            onClick={() => onChangeMode(m.id)}
            disabled={isLoading}
          >
            {m.icon}
            <span>{m.label}</span>
          </button>
        ))}
      </div>

      {/* Leg Step Navigation (From -> To) */}
      <div className="nav-leg-selector">
        <button
          className="btn-icon"
          style={{ width: 28, height: 28 }}
          disabled={activeLegIndex <= 0}
          onClick={() => onSelectLegIndex(Math.max(0, activeLegIndex - 1))}
          title="Previous Leg"
        >
          <ChevronLeft size={14} />
        </button>

        <div style={{ flex: 1, minWidth: 0, textAlign: 'center' }}>
          <div
            style={{
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {currentLeg.fromActivity.title} ➔ {currentLeg.toActivity.title}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
            Stop {activeLegIndex + 1} to Stop {activeLegIndex + 2}
          </div>
        </div>

        <button
          className="btn-icon"
          style={{ width: 28, height: 28 }}
          disabled={activeLegIndex >= legs.length - 1}
          onClick={() => onSelectLegIndex(Math.min(legs.length - 1, activeLegIndex + 1))}
          title="Next Leg"
        >
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Leg Summary Metric Row */}
      <div className="nav-summary-row">
        <div className="nav-stat-chip">
          <Clock size={13} color="var(--accent-primary)" />
          <span>
            <strong>{currentLeg.durationMinutes} min</strong> ({selectedMode})
          </span>
        </div>

        <div className="nav-stat-chip">
          <Route size={13} color="#10b981" />
          <span>
            <strong>{currentLeg.distanceKm} km</strong>
          </span>
        </div>

        <a
          href={currentLeg.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="nav-google-maps-link"
          title="Open live route in Google Maps Directions"
        >
          <ExternalLink size={12} />
          <span>Google Maps</span>
        </a>
      </div>

      {/* Transit Line Details Badge (if transit mode) */}
      {currentLeg.transitDetails && (
        <div className="nav-transit-badge">
          <Train size={14} color="#f59e0b" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-primary)' }}>
              {currentLeg.transitDetails.lineName}
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
              {currentLeg.transitDetails.boardingStation} ➔ {currentLeg.transitDetails.destinationStation} ({currentLeg.transitDetails.stopsCount} stops)
            </div>
          </div>
        </div>
      )}

      {/* Collapsible Turn-by-Turn Steps */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
        <button
          type="button"
          className="nav-toggle-steps-btn"
          onClick={() => setShowStepList(!showStepList)}
        >
          <ListOrdered size={13} />
          <span>{showStepList ? 'Hide Turn Steps' : `Show ${currentLeg.steps.length} Turn Steps`}</span>
        </button>

        <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
          Total Day: {totalDayDistance} km • ~{totalDayDuration}m
        </span>
      </div>

      {showStepList && (
        <div className="nav-steps-list">
          {currentLeg.steps.map((step, idx) => (
            <div key={step.id || idx} className="nav-step-item">
              <div className="nav-step-bullet">
                {step.maneuverType === 'depart' ? (
                  <MapPin size={11} color="var(--accent-primary)" />
                ) : step.maneuverType === 'arrive' ? (
                  '🏁'
                ) : step.maneuverType === 'board-transit' ? (
                  '🚆'
                ) : step.maneuverType === 'turn-left' ? (
                  '↰'
                ) : step.maneuverType === 'turn-right' ? (
                  '↱'
                ) : (
                  '↑'
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-primary)', lineHeight: 1.3 }}>
                  {step.instruction}
                </div>
                {step.distanceMeters > 0 && (
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 2 }}>
                    {step.distanceMeters >= 1000
                      ? `${(step.distanceMeters / 1000).toFixed(1)} km`
                      : `${step.distanceMeters} m`}
                    {step.durationSeconds > 0 && ` • ~${Math.round(step.durationSeconds / 60)} min`}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
