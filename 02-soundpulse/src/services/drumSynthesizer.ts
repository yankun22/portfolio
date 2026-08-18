import type { DrumSoundType } from '../types/drumPad';

/**
 * Generates white noise buffer on the fly
 */
function createNoiseBuffer(ctx: AudioContext, duration: number = 1): AudioBuffer {
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

export class DrumSynthesizer {
  private static noiseBufferCache: AudioBuffer | null = null;

  private static getNoiseBuffer(ctx: AudioContext): AudioBuffer {
    if (!this.noiseBufferCache || this.noiseBufferCache.sampleRate !== ctx.sampleRate) {
      this.noiseBufferCache = createNoiseBuffer(ctx, 1.5);
    }
    return this.noiseBufferCache;
  }

  /**
   * Triggers a synthesized drum sound through destinationNode with sub-millisecond latency
   */
  public static trigger(
    ctx: AudioContext,
    destination: AudioNode,
    soundType: DrumSoundType,
    pitchSemitones: number = 0,
    volume: number = 1.0
  ): void {
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;
    const pitchRatio = Math.pow(2, pitchSemitones / 12);

    switch (soundType) {
      case 'kick':
        this.playKick(ctx, destination, now, pitchRatio, volume);
        break;
      case 'snare':
        this.playSnare(ctx, destination, now, pitchRatio, volume);
        break;
      case 'hihat-closed':
        this.playHiHat(ctx, destination, now, pitchRatio, volume, false);
        break;
      case 'hihat-open':
        this.playHiHat(ctx, destination, now, pitchRatio, volume, true);
        break;
      case 'clave':
        this.playClave(ctx, destination, now, pitchRatio, volume);
        break;
      case 'clap':
        this.playClap(ctx, destination, now, pitchRatio, volume);
        break;
      case 'tom':
        this.playTom(ctx, destination, now, pitchRatio, volume);
        break;
      case 'synth':
        this.playSynthStab(ctx, destination, now, pitchRatio, volume);
        break;
    }
  }

  // 1. Kick Drum (808 style pitch-drop + punch transient)
  private static playKick(
    ctx: AudioContext,
    dest: AudioNode,
    now: number,
    pitchRatio: number,
    volume: number
  ): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const startFreq = 160 * pitchRatio;
    const endFreq = 36 * pitchRatio;

    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(25, now + 0.35);

    gain.gain.setValueAtTime(1.2 * volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    // Transient click click
    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();
    clickOsc.type = 'triangle';
    clickOsc.frequency.setValueAtTime(300 * pitchRatio, now);
    clickGain.gain.setValueAtTime(0.6 * volume, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

    clickOsc.connect(clickGain);
    clickGain.connect(dest);
    clickOsc.start(now);
    clickOsc.stop(now + 0.025);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(now);
    osc.stop(now + 0.48);
  }

  // 2. Snare Drum (Tonal body + filtered noise snap)
  private static playSnare(
    ctx: AudioContext,
    dest: AudioNode,
    now: number,
    pitchRatio: number,
    volume: number
  ): void {
    // Tonal body
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220 * pitchRatio, now);
    osc.frequency.exponentialRampToValueAtTime(130 * pitchRatio, now + 0.07);
    oscGain.gain.setValueAtTime(0.7 * volume, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    osc.connect(oscGain);
    oscGain.connect(dest);
    osc.start(now);
    osc.stop(now + 0.18);

    // Noise burst
    const noise = ctx.createBufferSource();
    noise.buffer = this.getNoiseBuffer(ctx);

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.setValueAtTime(1200 * pitchRatio, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.9 * volume, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(dest);

    noise.start(now);
    noise.stop(now + 0.24);
  }

  // 3 & 4. Hi-Hats (Closed & Open)
  private static playHiHat(
    ctx: AudioContext,
    dest: AudioNode,
    now: number,
    pitchRatio: number,
    volume: number,
    isOpen: boolean
  ): void {
    const duration = isOpen ? 0.35 : 0.05;
    const noise = ctx.createBufferSource();
    noise.buffer = this.getNoiseBuffer(ctx);

    // Bandpass + Highpass combo for metallic chime
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(9000 * pitchRatio, now);
    bandpass.Q.setValueAtTime(3.5, now);

    const highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.setValueAtTime(7500 * pitchRatio, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.85 * volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(bandpass);
    bandpass.connect(highpass);
    highpass.connect(gain);
    gain.connect(dest);

    noise.start(now);
    noise.stop(now + duration + 0.02);
  }

  // 5. Clave / Rimshot (High-Q resonant wooden click)
  private static playClave(
    ctx: AudioContext,
    dest: AudioNode,
    now: number,
    pitchRatio: number,
    volume: number
  ): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(2450 * pitchRatio, now);

    gain.gain.setValueAtTime(0.9 * volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  // 6. Hand Clap (Multi-pulse micro-envelope noise burst)
  private static playClap(
    ctx: AudioContext,
    dest: AudioNode,
    now: number,
    pitchRatio: number,
    volume: number
  ): void {
    const noise = ctx.createBufferSource();
    noise.buffer = this.getNoiseBuffer(ctx);

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400 * pitchRatio, now);
    filter.Q.setValueAtTime(2.0, now);

    const gain = ctx.createGain();

    // 3 rapid trigger pulses simulating hand reverberations
    const v = 0.8 * volume;
    gain.gain.setValueAtTime(0, now);
    gain.gain.setValueAtTime(v, now + 0.005);
    gain.gain.setValueAtTime(0.05, now + 0.012);
    gain.gain.setValueAtTime(v, now + 0.024);
    gain.gain.setValueAtTime(0.05, now + 0.035);
    gain.gain.setValueAtTime(v, now + 0.048);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    noise.start(now);
    noise.stop(now + 0.25);
  }

  // 7. Low 808 Sub Tom (Resonant pitch punch)
  private static playTom(
    ctx: AudioContext,
    dest: AudioNode,
    now: number,
    pitchRatio: number,
    volume: number
  ): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(120 * pitchRatio, now);
    osc.frequency.exponentialRampToValueAtTime(55 * pitchRatio, now + 0.18);

    gain.gain.setValueAtTime(1.0 * volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(now);
    osc.stop(now + 0.38);
  }

  // 8. Synth Chord Stab (Polyphonic supersaw with envelope sweep)
  private static playSynthStab(
    ctx: AudioContext,
    dest: AudioNode,
    now: number,
    pitchRatio: number,
    volume: number
  ): void {
    // Minor 9th chord frequencies: F3 (174.61), Ab3 (207.65), C4 (261.63), Eb4 (311.13), G4 (392.00)
    const baseFreqs = [174.61, 207.65, 261.63, 311.13, 392.00];

    const masterChordGain = ctx.createGain();
    masterChordGain.gain.setValueAtTime(0.4 * volume, now);
    masterChordGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(4500 * pitchRatio, now);
    filter.frequency.exponentialRampToValueAtTime(600 * pitchRatio, now + 0.4);
    filter.Q.setValueAtTime(4.0, now);

    baseFreqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      osc.type = idx % 2 === 0 ? 'sawtooth' : 'square';
      osc.frequency.setValueAtTime(freq * pitchRatio, now);
      // Subtle detune for analog warmth
      osc.detune.setValueAtTime((idx - 2) * 8, now);

      osc.connect(filter);
      osc.start(now);
      osc.stop(now + 0.48);
    });

    filter.connect(masterChordGain);
    masterChordGain.connect(dest);
  }
}
