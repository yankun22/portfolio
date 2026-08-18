export type DrumSoundType =
  | 'kick'
  | 'snare'
  | 'hihat-closed'
  | 'hihat-open'
  | 'clave'
  | 'clap'
  | 'tom'
  | 'synth';

export interface DrumPadInfo {
  id: string;
  key: string;
  name: string;
  category: 'Kick' | 'Snare' | 'Hat' | 'Perc' | 'Synth';
  type: DrumSoundType;
  color: string;
  accentColor: string;
  pitch: number; // tuning semitones -12 to +12
  gain: number; // volume 0.0 to 1.5
  description: string;
}
