export type PlayState = 'stopped' | 'playing' | 'paused' | 'recording';

export type VisualizerMode = 'oscilloscope' | 'spectrum' | 'phase';

export interface AudioTrackInfo {
  name: string;
  duration: number;
  sampleRate: number;
  channels: number;
  buffer: AudioBuffer | null;
  blobUrl?: string;
  sourceType: 'demo' | 'upload' | 'mic' | 'synth';
}

export interface AudioRegion {
  id: string;
  start: number;
  end: number;
  color?: string;
  loop?: boolean;
}
