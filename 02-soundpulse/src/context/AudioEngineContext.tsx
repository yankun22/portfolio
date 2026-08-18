import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import type { AudioTrackInfo, AudioRegion, PlayState, VisualizerMode } from '../types/audio';
import type { MasterFxParams } from '../types/fx';
import type { DrumPadInfo, DrumSoundType } from '../types/drumPad';
import { WebAudioEngine } from '../services/webAudioEngine';
import { DrumSynthesizer } from '../services/drumSynthesizer';
import { audioBufferToWavBlob, sliceAudioBuffer } from '../services/wavEncoder';
import { DEMO_TRACKS, generateTestTone } from '../services/demoAudioGenerator';
import { AudioEngineContext } from './AudioEngineCore';

const DEFAULT_DRUM_PADS: DrumPadInfo[] = [
  {
    id: 'pad-1',
    key: 'Q',
    name: '808 Kick',
    category: 'Kick',
    type: 'kick',
    color: '#10b981',
    accentColor: '#34d399',
    pitch: 0,
    gain: 1.0,
    description: 'Deep sub pitch-drop bass drum',
  },
  {
    id: 'pad-2',
    key: 'W',
    name: 'Snare Snap',
    category: 'Snare',
    type: 'snare',
    color: '#06b6d4',
    accentColor: '#22d3ee',
    pitch: 0,
    gain: 1.0,
    description: 'Crisp noise burst + body tone',
  },
  {
    id: 'pad-3',
    key: 'E',
    name: 'Closed Hat',
    category: 'Hat',
    type: 'hihat-closed',
    color: '#3b82f6',
    accentColor: '#60a5fa',
    pitch: 0,
    gain: 0.9,
    description: 'Ultra-fast metallic chirp',
  },
  {
    id: 'pad-4',
    key: 'R',
    name: 'Open Hat',
    category: 'Hat',
    type: 'hihat-open',
    color: '#6366f1',
    accentColor: '#818cf8',
    pitch: 0,
    gain: 0.85,
    description: 'Sustained metallic sizzle',
  },
  {
    id: 'pad-5',
    key: 'A',
    name: 'Wood Clave',
    category: 'Perc',
    type: 'clave',
    color: '#8b5cf6',
    accentColor: '#a78bfa',
    pitch: 0,
    gain: 0.95,
    description: 'High-resonance acoustic click',
  },
  {
    id: 'pad-6',
    key: 'S',
    name: 'Hand Clap',
    category: 'Perc',
    type: 'clap',
    color: '#ec4899',
    accentColor: '#f472b6',
    pitch: 0,
    gain: 1.0,
    description: 'Multi-pulse room reverberation',
  },
  {
    id: 'pad-7',
    key: 'D',
    name: '808 Sub Tom',
    category: 'Kick',
    type: 'tom',
    color: '#f59e0b',
    accentColor: '#fbbf24',
    pitch: 0,
    gain: 1.0,
    description: 'Resonant sine low-frequency punch',
  },
  {
    id: 'pad-8',
    key: 'F',
    name: 'Synth Stab',
    category: 'Synth',
    type: 'synth',
    color: '#f97316',
    accentColor: '#fb923c',
    pitch: 0,
    gain: 0.9,
    description: 'Minor 9th analog supersaw chord',
  },
];

const DEFAULT_FX_PARAMS: MasterFxParams = {
  eq: {
    enabled: true,
    lowGain: 0,
    lowFreq: 100,
    midGain: 0,
    midFreq: 1000,
    midQ: 1.0,
    highGain: 0,
    highFreq: 8000,
  },
  filter: {
    lowpassEnabled: false,
    lowpassCutoff: 18000,
    lowpassQ: 1.0,
    highpassEnabled: false,
    highpassCutoff: 30,
    highpassQ: 1.0,
  },
  reverb: {
    enabled: false,
    roomSize: 0.5,
    decay: 2.2,
    wet: 0.35,
    dry: 0.85,
    type: 'hall',
  },
  distortion: {
    enabled: false,
    drive: 25,
    curveType: 'warmth',
    tone: 8000,
    outputGain: 1.0,
  },
  masterGain: 1.0,
  stereoPan: 0.0,
  pitchShift: 0,
  bypassAll: false,
};

export const AudioEngineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Stable AudioEngine instance using useMemo
  const engine = useMemo(() => new WebAudioEngine(), []);

  const [playState, setPlayState] = useState<PlayState>('stopped');
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [activeTrack, setActiveTrack] = useState<AudioTrackInfo | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<AudioRegion | null>(null);
  const [visualizerMode, setVisualizerMode] = useState<VisualizerMode>('oscilloscope');
  const [fxParams, setFxParams] = useState<MasterFxParams>(DEFAULT_FX_PARAMS);
  const [drumPads, setDrumPads] = useState<DrumPadInfo[]>(DEFAULT_DRUM_PADS);
  const [zoomLevel, setZoomLevel] = useState<number>(50);
  const [isLooping, setIsLoopingState] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: 'info' | 'success' | 'warning' } | null>(null);

  // Playback buffer nodes & tracking refs
  const currentSourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const playbackStartedAtRef = useRef<number>(0);
  const playbackOffsetRef = useRef<number>(0);
  const currentTimeRef = useRef<number>(0);

  useEffect(() => {
    currentTimeRef.current = currentTime;
  }, [currentTime]);

  // Mic recording state
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const showToast = useCallback((message: string, type: 'info' | 'success' | 'warning' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Synchronize FX params with WebAudioEngine
  useEffect(() => {
    engine.applyFxParams(fxParams);
  }, [engine, fxParams]);

  // Dynamically update playback rate when pitchShift changes while playing
  useEffect(() => {
    if (currentSourceNodeRef.current && engine.ctx.state === 'running') {
      const pitchRate = Math.pow(2, fxParams.pitchShift / 12);
      try {
        currentSourceNodeRef.current.playbackRate.setValueAtTime(pitchRate, engine.ctx.currentTime);
        playbackOffsetRef.current = currentTimeRef.current;
        playbackStartedAtRef.current = engine.ctx.currentTime;
      } catch {
        // Ignored if node ended
      }
    }
  }, [fxParams.pitchShift, engine.ctx]);

  // Stop active playback source
  const stopBufferSource = useCallback(() => {
    if (currentSourceNodeRef.current) {
      try {
        currentSourceNodeRef.current.onended = null;
        currentSourceNodeRef.current.stop();
        currentSourceNodeRef.current.disconnect();
      } catch {
        // Source already ended
      }
      currentSourceNodeRef.current = null;
    }
  }, []);

  // Configure loop parameters on active AudioBufferSourceNode
  const configureSourceLoop = useCallback(
    (source: AudioBufferSourceNode, looping: boolean, region: AudioRegion | null, trackDuration: number) => {
      source.loop = looping;
      if (looping) {
        if (region && region.end > region.start) {
          source.loopStart = Math.max(0, region.start);
          source.loopEnd = Math.min(trackDuration, region.end);
        } else if (trackDuration > 0) {
          source.loopStart = 0;
          source.loopEnd = trackDuration;
        }
      }
    },
    []
  );

  // Set isLooping with live synchronization to running source
  const setIsLooping = useCallback(
    (looping: boolean) => {
      setIsLoopingState(looping);
      if (currentSourceNodeRef.current && activeTrack?.buffer) {
        configureSourceLoop(currentSourceNodeRef.current, looping, selectedRegion, activeTrack.buffer.duration);
        playbackOffsetRef.current = currentTimeRef.current;
        playbackStartedAtRef.current = engine.ctx.currentTime;
      }
    },
    [activeTrack, configureSourceLoop, selectedRegion, engine.ctx]
  );

  // Update loop bounds when selectedRegion changes while playing
  useEffect(() => {
    if (currentSourceNodeRef.current && isLooping && activeTrack?.buffer) {
      configureSourceLoop(currentSourceNodeRef.current, isLooping, selectedRegion, activeTrack.buffer.duration);
      playbackOffsetRef.current = currentTimeRef.current;
      playbackStartedAtRef.current = engine.ctx.currentTime;
    }
  }, [selectedRegion, isLooping, activeTrack, configureSourceLoop, engine.ctx]);

  // Real-time playback clock loop with loop calculation
  useEffect(() => {
    if (playState !== 'playing') return;

    let animId: number;

    const tick = () => {
      const elapsed = (engine.ctx.currentTime - playbackStartedAtRef.current) * Math.pow(2, fxParams.pitchShift / 12);

      let curr = playbackOffsetRef.current + elapsed;

      if (isLooping) {
        if (selectedRegion && selectedRegion.end > selectedRegion.start) {
          const loopLen = selectedRegion.end - selectedRegion.start;
          const loopOffset = playbackOffsetRef.current - selectedRegion.start;
          curr = selectedRegion.start + (((loopOffset + elapsed) % loopLen) + loopLen) % loopLen;
        } else if (duration > 0) {
          curr = (((playbackOffsetRef.current + elapsed) % duration) + duration) % duration;
        }
      } else {
        if (duration > 0 && curr >= duration) {
          stopBufferSource();
          setPlayState('stopped');
          setCurrentTime(0);
          playbackOffsetRef.current = 0;
          return;
        }
      }

      setCurrentTime(Math.max(0, curr));
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [playState, engine.ctx, fxParams.pitchShift, selectedRegion, isLooping, duration, stopBufferSource]);

  // 1. Play
  const play = useCallback(async () => {
    if (!activeTrack || !activeTrack.buffer) {
      showToast('Please load or generate an audio track first', 'info');
      return;
    }

    await engine.ensureRunning();
    stopBufferSource();

    const pitchRate = Math.pow(2, fxParams.pitchShift / 12);
    const source = engine.ctx.createBufferSource();
    source.buffer = activeTrack.buffer;
    source.playbackRate.value = pitchRate;

    let startTime = currentTime;
    if (selectedRegion && (currentTime < selectedRegion.start || currentTime >= selectedRegion.end)) {
      startTime = selectedRegion.start;
    }

    // Configure native Web Audio looping
    configureSourceLoop(source, isLooping, selectedRegion, activeTrack.buffer.duration);

    // Connect source to DSP FX input
    source.connect(engine.fxInput);

    playbackOffsetRef.current = startTime;
    playbackStartedAtRef.current = engine.ctx.currentTime;

    source.onended = () => {
      // Only stop when loop is false
      if (!source.loop) {
        setPlayState('stopped');
        setCurrentTime(0);
        playbackOffsetRef.current = 0;
      }
    };

    source.start(0, startTime);
    currentSourceNodeRef.current = source;
    setPlayState('playing');
  }, [activeTrack, engine, fxParams.pitchShift, currentTime, selectedRegion, isLooping, configureSourceLoop, showToast, stopBufferSource]);

  // 2. Pause
  const pause = useCallback(() => {
    if (playState === 'playing') {
      stopBufferSource();
      setPlayState('paused');
    }
  }, [playState, stopBufferSource]);

  // 3. Stop
  const stop = useCallback(() => {
    stopBufferSource();
    setPlayState('stopped');
    setCurrentTime(selectedRegion ? selectedRegion.start : 0);
    playbackOffsetRef.current = selectedRegion ? selectedRegion.start : 0;
  }, [selectedRegion, stopBufferSource]);

  // 4. Seek To
  const seekTo = useCallback(
    (timeSeconds: number) => {
      const clamped = Math.max(0, Math.min(duration, timeSeconds));
      playbackOffsetRef.current = clamped;
      playbackStartedAtRef.current = engine.ctx.currentTime;
      setCurrentTime(clamped);

      if (playState === 'playing') {
        play();
      }
    },
    [duration, engine.ctx.currentTime, playState, play]
  );

  // 5. Load Track from AudioBuffer
  const loadTrackFromBuffer = useCallback(
    (buffer: AudioBuffer, name: string, sourceType: 'demo' | 'upload' | 'mic' | 'synth' = 'upload') => {
      stopBufferSource();
      const blob = audioBufferToWavBlob(buffer);
      const blobUrl = URL.createObjectURL(blob);

      const trackInfo: AudioTrackInfo = {
        name,
        duration: buffer.duration,
        sampleRate: buffer.sampleRate,
        channels: buffer.numberOfChannels,
        buffer,
        blobUrl,
        sourceType,
      };

      setActiveTrack(trackInfo);
      setDuration(buffer.duration);
      setCurrentTime(0);
      playbackOffsetRef.current = 0;
      setSelectedRegion(null);
      setPlayState('stopped');
      showToast(`Loaded "${name}" (${buffer.duration.toFixed(1)}s, ${buffer.sampleRate}Hz)`);
    },
    [stopBufferSource, showToast]
  );

  // 6. Load Track from File Blob
  const loadTrackFromBlob = useCallback(
    async (blob: Blob, name: string) => {
      await engine.ensureRunning();
      try {
        const arrayBuffer = await blob.arrayBuffer();
        const decoded = await engine.ctx.decodeAudioData(arrayBuffer);
        loadTrackFromBuffer(decoded, name, 'upload');
      } catch (e) {
        console.error('Failed to decode audio file:', e);
        showToast('Unsupported or corrupted audio format', 'warning');
      }
    },
    [engine, loadTrackFromBuffer, showToast]
  );

  // 7. Load Built-In Demo Track
  const loadDemoTrack = useCallback(
    async (trackId: string) => {
      await engine.ensureRunning();
      const demo = DEMO_TRACKS.find((d) => d.id === trackId) || DEMO_TRACKS[0];
      try {
        const { buffer } = await demo.generator(engine.ctx);
        loadTrackFromBuffer(buffer, demo.name, 'demo');
      } catch (e) {
        console.error('Failed to generate demo track:', e);
      }
    },
    [engine, loadTrackFromBuffer]
  );

  // 8. Generate Pure Test Tone
  const generateTestToneTrack = useCallback(
    async (frequency: number = 440) => {
      await engine.ensureRunning();
      const { buffer } = await generateTestTone(engine.ctx, frequency, 3.0);
      loadTrackFromBuffer(buffer, `Test Tone ${frequency}Hz`, 'synth');
    },
    [engine, loadTrackFromBuffer]
  );

  // 9. Mic Recording
  const startMicRecording = useCallback(async () => {
    await engine.ensureRunning();
    stop();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      recordedChunksRef.current = [];

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'audio/webm' });
        await loadTrackFromBlob(blob, `Mic Recording (${new Date().toLocaleTimeString()})`);
        stream.getTracks().forEach((t) => t.stop());
        micStreamRef.current = null;
      };

      recorder.start();
      setPlayState('recording');
      showToast('Recording microphone input...', 'info');
    } catch (e) {
      console.error('Microphone access denied:', e);
      showToast('Microphone access was denied or unavailable', 'warning');
    }
  }, [engine, stop, loadTrackFromBlob, showToast]);

  const stopMicRecording = useCallback(async () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setPlayState('stopped');
    }
  }, []);

  // 10. Trim Audio Buffer to Selected Region
  const trimToRegion = useCallback(() => {
    if (!activeTrack || !activeTrack.buffer || !selectedRegion) {
      showToast('Please select a waveform region to trim', 'info');
      return;
    }

    const sliced = sliceAudioBuffer(engine.ctx, activeTrack.buffer, selectedRegion.start, selectedRegion.end);
    loadTrackFromBuffer(sliced, `${activeTrack.name} (Trimmed)`, 'synth');
    showToast(`Trimmed to ${(selectedRegion.end - selectedRegion.start).toFixed(2)}s region`);
  }, [activeTrack, selectedRegion, engine.ctx, loadTrackFromBuffer, showToast]);

  // 11. Export Raw Trimmed WAV Blob
  const exportTrimmedWav = useCallback(() => {
    if (!activeTrack || !activeTrack.buffer) {
      showToast('No audio buffer available for export', 'warning');
      return;
    }

    let bufferToExport = activeTrack.buffer;
    let exportName = activeTrack.name.replace(/[^a-zA-Z0-9_-]/g, '_');

    if (selectedRegion) {
      bufferToExport = sliceAudioBuffer(engine.ctx, activeTrack.buffer, selectedRegion.start, selectedRegion.end);
      exportName += `_slice_${selectedRegion.start.toFixed(1)}s_${selectedRegion.end.toFixed(1)}s`;
    }

    const wavBlob = audioBufferToWavBlob(bufferToExport);
    const url = URL.createObjectURL(wavBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${exportName}.wav`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Exported ${exportName}.wav (${(wavBlob.size / 1024).toFixed(0)} KB)`);
  }, [activeTrack, selectedRegion, engine.ctx, showToast]);

  // 12. Export Processed Audio with All Active FX Rack Effects Baked In
  const exportProcessedWav = useCallback(
    async (includeRegionOnly: boolean = false) => {
      if (!activeTrack || !activeTrack.buffer) {
        showToast('No audio buffer available for export', 'warning');
        return;
      }

      setIsExporting(true);
      showToast('Rendering audio through DSP FX Rack...', 'info');

      try {
        const regionToRender = includeRegionOnly && selectedRegion ? selectedRegion : null;
        const renderedBuffer = await WebAudioEngine.renderAudioWithFx(
          activeTrack.buffer,
          fxParams,
          regionToRender
        );

        let exportName = activeTrack.name.replace(/[^a-zA-Z0-9_-]/g, '_');
        if (regionToRender) {
          exportName += `_FX_slice_${regionToRender.start.toFixed(1)}s_${regionToRender.end.toFixed(1)}s`;
        } else {
          exportName += '_master_FX';
        }

        const wavBlob = audioBufferToWavBlob(renderedBuffer);
        const url = URL.createObjectURL(wavBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${exportName}.wav`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        showToast(
          `Exported FX Master "${exportName}.wav" (${renderedBuffer.duration.toFixed(1)}s, ${(wavBlob.size / 1024).toFixed(0)} KB)`
        );
      } catch (e) {
        console.error('Failed to export audio with FX:', e);
        showToast('Failed to render audio with FX', 'warning');
      } finally {
        setIsExporting(false);
      }
    },
    [activeTrack, fxParams, selectedRegion, showToast]
  );

  // 13. Trigger Drum Sound
  const triggerDrumSoundDirect = useCallback(
    (soundType: DrumSoundType, pitch: number = 0, gain: number = 1.0) => {
      DrumSynthesizer.trigger(engine.ctx, engine.drumBus, soundType, pitch, gain);
    },
    [engine]
  );

  const triggerDrumPad = useCallback(
    (padId: string) => {
      const pad = drumPads.find((p) => p.id === padId);
      if (pad) {
        triggerDrumSoundDirect(pad.type, pad.pitch, pad.gain);
      }
    },
    [drumPads, triggerDrumSoundDirect]
  );

  // 14. Pitch Shift
  const setPitchShift = useCallback((semitones: number) => {
    setFxParams((prev) => ({ ...prev, pitchShift: semitones }));
  }, []);

  // Keyboard Hotkey Listener for Drum Pads (Q, W, E, R, A, S, D, F)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      const key = e.key.toUpperCase();
      const matchPad = drumPads.find((p) => p.key === key);
      if (matchPad && !e.repeat) {
        triggerDrumSoundDirect(matchPad.type, matchPad.pitch, matchPad.gain);

        // Visual flash event dispatch
        window.dispatchEvent(new CustomEvent('drum-pad-trigger', { detail: { padId: matchPad.id } }));
      }

      // Spacebar toggles Play/Pause
      if (e.code === 'Space') {
        e.preventDefault();
        if (playState === 'playing') pause();
        else play();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [drumPads, triggerDrumSoundDirect, playState, play, pause]);

  // Initial load of synthwave track
  useEffect(() => {
    let active = true;
    DEMO_TRACKS[0].generator(engine.ctx).then(({ buffer }) => {
      if (active) {
        loadTrackFromBuffer(buffer, DEMO_TRACKS[0].name, 'demo');
      }
    });
    return () => {
      active = false;
    };
  }, [engine.ctx, loadTrackFromBuffer]);

  return (
    <AudioEngineContext.Provider
      value={{
        engine,
        playState,
        currentTime,
        duration,
        activeTrack,
        selectedRegion,
        visualizerMode,
        setVisualizerMode,
        fxParams,
        setFxParams,
        drumPads,
        setDrumPads,
        zoomLevel,
        setZoomLevel,
        isLooping,
        setIsLooping,
        isExporting,
        play,
        pause,
        stop,
        seekTo,
        loadTrackFromBuffer,
        loadTrackFromBlob,
        loadDemoTrack,
        generateTestToneTrack,
        startMicRecording,
        stopMicRecording,
        setSelectedRegion,
        trimToRegion,
        exportTrimmedWav,
        exportProcessedWav,
        triggerDrumPad,
        triggerDrumSoundDirect,
        setPitchShift,
        toast,
        showToast,
      }}
    >
      {children}
    </AudioEngineContext.Provider>
  );
};
