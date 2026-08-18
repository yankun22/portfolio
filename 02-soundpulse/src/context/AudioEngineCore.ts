import { createContext } from 'react';
import type { AudioTrackInfo, AudioRegion, PlayState, VisualizerMode } from '../types/audio';
import type { MasterFxParams } from '../types/fx';
import type { DrumPadInfo, DrumSoundType } from '../types/drumPad';
import type { WebAudioEngine } from '../services/webAudioEngine';

export interface AudioEngineContextType {
  engine: WebAudioEngine;
  playState: PlayState;
  currentTime: number;
  duration: number;
  activeTrack: AudioTrackInfo | null;
  selectedRegion: AudioRegion | null;
  visualizerMode: VisualizerMode;
  setVisualizerMode: (mode: VisualizerMode) => void;
  fxParams: MasterFxParams;
  setFxParams: React.Dispatch<React.SetStateAction<MasterFxParams>>;
  drumPads: DrumPadInfo[];
  setDrumPads: React.Dispatch<React.SetStateAction<DrumPadInfo[]>>;
  zoomLevel: number;
  setZoomLevel: (z: number) => void;
  isLooping: boolean;
  setIsLooping: (l: boolean) => void;
  isExporting: boolean;

  // Actions
  play: () => Promise<void>;
  pause: () => void;
  stop: () => void;
  seekTo: (timeSeconds: number) => void;
  loadTrackFromBuffer: (buffer: AudioBuffer, name: string, sourceType?: 'demo' | 'upload' | 'mic' | 'synth') => void;
  loadTrackFromBlob: (blob: Blob, name: string) => Promise<void>;
  loadDemoTrack: (trackId: string) => Promise<void>;
  generateTestToneTrack: (frequency?: number) => Promise<void>;
  startMicRecording: () => Promise<void>;
  stopMicRecording: () => Promise<void>;
  setSelectedRegion: (region: AudioRegion | null) => void;
  trimToRegion: () => void;
  exportTrimmedWav: () => void;
  exportProcessedWav: (includeRegionOnly?: boolean) => Promise<void>;
  triggerDrumPad: (padId: string) => void;
  triggerDrumSoundDirect: (soundType: DrumSoundType, pitch?: number, gain?: number) => void;
  setPitchShift: (semitones: number) => void;
  toast: { message: string; type: 'info' | 'success' | 'warning' } | null;
  showToast: (message: string, type?: 'info' | 'success' | 'warning') => void;
}

export const AudioEngineContext = createContext<AudioEngineContextType | undefined>(undefined);
