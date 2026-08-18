export type DistortionType = 'warmth' | 'hard' | 'fuzz' | 'bitcrush';

export interface EqParams {
  enabled: boolean;
  lowGain: number; // -24dB to +24dB
  lowFreq: number; // 80Hz - 250Hz (default 100Hz)
  midGain: number; // -24dB to +24dB
  midFreq: number; // 250Hz - 5000Hz (default 1000Hz)
  midQ: number; // 0.5 - 10.0 (default 1.0)
  highGain: number; // -24dB to +24dB
  highFreq: number; // 5000Hz - 16000Hz (default 8000Hz)
}

export interface FilterParams {
  lowpassEnabled: boolean;
  lowpassCutoff: number; // 20Hz - 20000Hz
  lowpassQ: number; // 0.1 - 18.0
  highpassEnabled: boolean;
  highpassCutoff: number; // 20Hz - 20000Hz
  highpassQ: number; // 0.1 - 18.0
}

export interface ReverbParams {
  enabled: boolean;
  roomSize: number; // 0.1 - 1.0
  decay: number; // 0.2 - 6.0 seconds
  wet: number; // 0.0 - 1.0
  dry: number; // 0.0 - 1.0
  type: 'hall' | 'room' | 'plate' | 'ambient';
}

export interface DistortionParams {
  enabled: boolean;
  drive: number; // 0 - 100
  curveType: DistortionType;
  tone: number; // Lowpass tone filter 1000Hz - 20000Hz
  outputGain: number; // 0.1 - 2.0
}

export interface MasterFxParams {
  eq: EqParams;
  filter: FilterParams;
  reverb: ReverbParams;
  distortion: DistortionParams;
  masterGain: number; // 0.0 - 2.0 (default 1.0)
  stereoPan: number; // -1.0 (Left) to +1.0 (Right)
  pitchShift: number; // -12 to +12 semitones
  bypassAll: boolean;
}
