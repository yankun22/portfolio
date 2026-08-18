import React from 'react';
import {
  Play,
  Pause,
  Square,
  Repeat,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from 'lucide-react';
import { useAudioEngine } from '../../context/useAudioEngine';

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00.00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const millis = Math.floor((seconds % 1) * 100);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${millis.toString().padStart(2, '0')}`;
}

export const TransportControls: React.FC = () => {
  const {
    playState,
    currentTime,
    duration,
    play,
    pause,
    stop,
    isLooping,
    setIsLooping,
    zoomLevel,
    setZoomLevel,
    activeTrack,
  } = useAudioEngine();

  const isPlaying = playState === 'playing';

  return (
    <div className="transport-bar">
      {/* Playback Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Play/Pause */}
        {isPlaying ? (
          <button type="button" className="btn-studio btn-pause" onClick={pause} title="Pause (Space)">
            <Pause size={18} />
            <span>Pause</span>
          </button>
        ) : (
          <button type="button" className="btn-studio btn-play" onClick={play} title="Play (Space)">
            <Play size={18} />
            <span>Play</span>
          </button>
        )}

        {/* Stop */}
        <button type="button" className="btn-studio btn-rack" onClick={stop} title="Stop playback">
          <Square size={16} color="#ef4444" />
          <span>Stop</span>
        </button>

        {/* Loop */}
        <button
          type="button"
          className={`btn-studio btn-rack ${isLooping ? 'active' : ''}`}
          onClick={() => setIsLooping(!isLooping)}
          title="Toggle Continuous Loop"
        >
          <Repeat size={16} />
          <span>Loop</span>
        </button>
      </div>

      {/* Center LCD Time Counter & Track Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div className="time-display">
          <span>{formatTime(currentTime)}</span>
          <span style={{ color: 'var(--text-dim)', fontSize: '1rem', margin: '0 6px' }}>/</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{formatTime(duration)}</span>
        </div>

        {activeTrack && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {activeTrack.name}
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {(activeTrack.duration).toFixed(2)}s • {activeTrack.sampleRate}Hz • {activeTrack.channels === 2 ? 'Stereo' : 'Mono'}
            </span>
          </div>
        )}
      </div>

      {/* Waveform Zoom Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          type="button"
          className="btn-studio btn-rack"
          style={{ padding: '8px 12px' }}
          onClick={() => setZoomLevel(Math.max(10, zoomLevel - 20))}
          title="Zoom Out Waveform"
        >
          <ZoomOut size={16} />
        </button>

        <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', minWidth: '40px', textAlign: 'center' }}>
          {zoomLevel}px
        </span>

        <button
          type="button"
          className="btn-studio btn-rack"
          style={{ padding: '8px 12px' }}
          onClick={() => setZoomLevel(Math.min(300, zoomLevel + 20))}
          title="Zoom In Waveform"
        >
          <ZoomIn size={16} />
        </button>

        <button
          type="button"
          className="btn-studio btn-rack"
          style={{ padding: '8px 12px' }}
          onClick={() => setZoomLevel(50)}
          title="Reset Zoom to Fit"
        >
          <Maximize2 size={16} />
        </button>
      </div>
    </div>
  );
};
