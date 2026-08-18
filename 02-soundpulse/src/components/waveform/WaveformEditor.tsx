import React, { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.esm.js';
import { useAudioEngine } from '../../context/useAudioEngine';
import { RegionSliceToolbar } from './RegionSliceToolbar';

export const WaveformEditor: React.FC = () => {
  const {
    activeTrack,
    currentTime,
    duration,
    seekTo,
    zoomLevel,
    setSelectedRegion,
  } = useAudioEngine();

  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const regionsPluginRef = useRef<any>(null);
  const isAudioReadyRef = useRef<boolean>(false);

  const zoomLevelRef = useRef(zoomLevel);
  const seekToRef = useRef(seekTo);
  const setSelectedRegionRef = useRef(setSelectedRegion);

  useEffect(() => {
    zoomLevelRef.current = zoomLevel;
    seekToRef.current = seekTo;
    setSelectedRegionRef.current = setSelectedRegion;
  }, [zoomLevel, seekTo, setSelectedRegion]);

  // Initialize WaveSurfer instance
  useEffect(() => {
    if (!containerRef.current) return;

    const regions = RegionsPlugin.create();
    regionsPluginRef.current = regions;

    const timeline = TimelinePlugin.create({
      container: timelineRef.current || undefined,
      primaryLabelInterval: 1,
      secondaryLabelInterval: 0.5,
      style: {
        fontSize: '10px',
        color: '#64748b',
      },
    });

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: 'rgba(6, 182, 212, 0.45)',
      progressColor: '#22d3ee',
      cursorColor: '#10b981',
      cursorWidth: 2,
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
      height: 140,
      minPxPerSec: 50,
      plugins: [regions, timeline],
      autoCenter: true,
      fillParent: true,
      normalize: true,
    });

    wavesurferRef.current = ws;

    ws.on('ready', () => {
      isAudioReadyRef.current = true;
      try {
        ws.zoom(zoomLevelRef.current);
      } catch {
        // Ignore zoom failure
      }
    });

    // Enable drag selection for creating regions
    regions.enableDragSelection({
      color: 'rgba(6, 182, 212, 0.25)',
    });

    regions.on('region-created', (region: any) => {
      // Clear previous regions so only one active selection exists
      regions.getRegions().forEach((r: any) => {
        if (r.id !== region.id) r.remove();
      });
      setSelectedRegionRef.current({
        id: region.id,
        start: region.start,
        end: region.end,
      });
    });

    regions.on('region-updated', (region: any) => {
      setSelectedRegionRef.current({
        id: region.id,
        start: region.start,
        end: region.end,
      });
    });

    regions.on('region-clicked', (region: any, e: MouseEvent) => {
      e.stopPropagation();
      setSelectedRegionRef.current({
        id: region.id,
        start: region.start,
        end: region.end,
      });
    });

    ws.on('click', (relativeX: number) => {
      try {
        if (ws.getDuration() > 0) {
          const time = relativeX * ws.getDuration();
          seekToRef.current(time);
        }
      } catch {
        // Ignore click if duration not yet ready
      }
    });

    return () => {
      try {
        ws.destroy();
      } catch {
        // Ignore destroy error
      }
      wavesurferRef.current = null;
      isAudioReadyRef.current = false;
    };
  }, []);

  // Update audio source when activeTrack changes
  useEffect(() => {
    const ws = wavesurferRef.current;
    if (!ws || !activeTrack?.blobUrl) return;

    isAudioReadyRef.current = false;
    try {
      ws.load(activeTrack.blobUrl);
    } catch (e) {
      console.warn('Wavesurfer load error:', e);
    }

    if (regionsPluginRef.current) {
      try {
        regionsPluginRef.current.clearRegions();
      } catch {
        // Ignore
      }
    }
  }, [activeTrack?.blobUrl]);

  // Update zoom safely
  useEffect(() => {
    const ws = wavesurferRef.current;
    if (ws && isAudioReadyRef.current) {
      try {
        ws.zoom(zoomLevel);
      } catch {
        // Ignore if audio is not decoded yet
      }
    }
  }, [zoomLevel]);

  // Synchronize playhead cursor position safely
  useEffect(() => {
    const ws = wavesurferRef.current;
    if (!ws || duration <= 0 || !isAudioReadyRef.current) return;
    try {
      ws.setTime(currentTime);
    } catch {
      // Ignore if not ready
    }
  }, [currentTime, duration]);

  return (
    <div className="rack-chassis">
      <div className="rack-header">
        <h2 className="rack-title">
          <span>Waveform Slicer & Audio Visualizer</span>
        </h2>

        {/* Region Slice & Export Toolbar */}
        <RegionSliceToolbar />
      </div>

      <div className="rack-body" style={{ padding: '16px 20px' }}>
        {/* Waveform Viewport */}
        <div
          style={{
            background: '#0a0d14',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            padding: '12px 14px 4px 14px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Wavesurfer Waveform Container */}
          <div ref={containerRef} style={{ width: '100%' }} />

          {/* Wavesurfer Timeline Container */}
          <div ref={timelineRef} style={{ width: '100%', marginTop: '6px' }} />
        </div>
      </div>
    </div>
  );
};
