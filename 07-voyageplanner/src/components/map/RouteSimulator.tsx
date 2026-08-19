import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, FastForward, Navigation } from 'lucide-react';
import type { Coordinates } from '../../types/itinerary';

interface RouteSimulatorProps {
  waypoints: { name: string; coords: Coordinates; order: number }[];
  onPositionUpdate: (pos: Coordinates | null) => void;
}

export const RouteSimulator: React.FC<RouteSimulatorProps> = ({
  waypoints,
  onPositionUpdate
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<1 | 2 | 5>(2);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setIsPlaying(false);
    setProgress(0);
    onPositionUpdate(null);
  }, [waypoints]);

  useEffect(() => {
    if (!isPlaying || waypoints.length < 2) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 0.005 * speed;
        if (next >= 1) {
          setIsPlaying(false);
          return 1;
        }
        return next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying, speed, waypoints.length]);

  useEffect(() => {
    if (waypoints.length < 2) {
      onPositionUpdate(null);
      return;
    }

    if (!isPlaying && progress === 0) {
      onPositionUpdate(null);
      return;
    }

    const totalSegments = waypoints.length - 1;
    const scaled = progress * totalSegments;
    const segmentIndex = Math.min(Math.floor(scaled), totalSegments - 1);
    const segmentProgress = scaled - segmentIndex;

    const start = waypoints[segmentIndex].coords;
    const end = waypoints[segmentIndex + 1].coords;

    const currentLat = start.lat + (end.lat - start.lat) * segmentProgress;
    const currentLng = start.lng + (end.lng - start.lng) * segmentProgress;

    onPositionUpdate({ lat: currentLat, lng: currentLng });
  }, [progress, isPlaying, waypoints]);

  if (waypoints.length < 2) return null;

  const currentSegment = Math.min(
    Math.floor(progress * (waypoints.length - 1)),
    waypoints.length - 2
  );
  const currentLegName = `${waypoints[currentSegment]?.name || ''} ➔ ${
    waypoints[currentSegment + 1]?.name || ''
  }`;

  return (
    <div className="route-simulator-hud">
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Navigation size={14} color="#3b82f6" />
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--text-primary)'
          }}
        >
          Route Simulation
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <button
          className="btn-icon"
          style={{ width: 28, height: 28 }}
          onClick={() => setIsPlaying(!isPlaying)}
          title={isPlaying ? 'Pause' : 'Play Route Animation'}
        >
          {isPlaying ? <Pause size={13} /> : <Play size={13} />}
        </button>

        <button
          className="btn-icon"
          style={{ width: 28, height: 28 }}
          onClick={() => {
            setIsPlaying(false);
            setProgress(0);
            onPositionUpdate(null);
          }}
          title="Reset Simulation"
        >
          <RotateCcw size={13} />
        </button>

        <button
          className="btn-icon"
          style={{ width: 38, height: 28, fontSize: '0.7rem', fontWeight: 800 }}
          onClick={() => {
            const nextSpeed = speed === 1 ? 2 : speed === 2 ? 5 : 1;
            setSpeed(nextSpeed);
          }}
          title="Toggle playback speed"
        >
          <FastForward size={11} style={{ marginRight: 2 }} />
          {speed}x
        </button>
      </div>

      <div
        style={{
          fontSize: '0.7rem',
          color: 'var(--text-secondary)',
          maxWidth: 180,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}
        title={currentLegName}
      >
        {isPlaying || progress > 0 ? currentLegName : `${waypoints.length} stops ready`}
      </div>

      <div
        style={{
          width: 60,
          height: 4,
          background: 'var(--border-medium)',
          borderRadius: 4,
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            width: `${Math.round(progress * 100)}%`,
            height: '100%',
            background: 'var(--accent-primary)',
            transition: 'width 0.05s linear'
          }}
        />
      </div>
    </div>
  );
};
