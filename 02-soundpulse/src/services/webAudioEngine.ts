import type { MasterFxParams, DistortionType } from '../types/fx';
import { generateReverbImpulse } from './impulseGenerator';

export class WebAudioEngine {
  public ctx: AudioContext;

  // Nodes in DSP Graph
  public highpassFilter: BiquadFilterNode;
  public lowpassFilter: BiquadFilterNode;

  // 3-Band Parametric EQ
  public eqLow: BiquadFilterNode;
  public eqMid: BiquadFilterNode;
  public eqHigh: BiquadFilterNode;

  // Distortion Unit
  public distortionInput: GainNode;
  public distortionShaper: WaveShaperNode;
  public distortionTone: BiquadFilterNode;
  public distortionWetGain: GainNode;
  public distortionDryGain: GainNode;
  public distortionOutput: GainNode;

  // Reverb Unit
  public reverbInput: GainNode;
  public convolver: ConvolverNode;
  public reverbWetGain: GainNode;
  public reverbDryGain: GainNode;
  public reverbOutput: GainNode;

  // Master Section
  public stereoPanner: StereoPannerNode;
  public masterGain: GainNode;
  public analyser: AnalyserNode;

  // Drum Pad Dedicated Bus
  public drumBus: GainNode;

  // Input Node
  public fxInput: GainNode;

  constructor() {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AudioContextClass({ latencyHint: 'interactive' });

    // 1. Input Node
    this.fxInput = this.ctx.createGain();

    // 2. Highpass & Lowpass Biquad Filters
    this.highpassFilter = this.ctx.createBiquadFilter();
    this.highpassFilter.type = 'highpass';
    this.highpassFilter.frequency.value = 20;
    this.highpassFilter.Q.value = 0.707;

    this.lowpassFilter = this.ctx.createBiquadFilter();
    this.lowpassFilter.type = 'lowpass';
    this.lowpassFilter.frequency.value = 20000;
    this.lowpassFilter.Q.value = 0.707;

    // 3. 3-Band Parametric EQ
    this.eqLow = this.ctx.createBiquadFilter();
    this.eqLow.type = 'lowshelf';
    this.eqLow.frequency.value = 100;
    this.eqLow.gain.value = 0;

    this.eqMid = this.ctx.createBiquadFilter();
    this.eqMid.type = 'peaking';
    this.eqMid.frequency.value = 1000;
    this.eqMid.Q.value = 1.0;
    this.eqMid.gain.value = 0;

    this.eqHigh = this.ctx.createBiquadFilter();
    this.eqHigh.type = 'highshelf';
    this.eqHigh.frequency.value = 8000;
    this.eqHigh.gain.value = 0;

    // 4. Distortion Unit
    this.distortionInput = this.ctx.createGain();
    this.distortionShaper = this.ctx.createWaveShaper();
    this.distortionShaper.oversample = '4x';
    this.distortionTone = this.ctx.createBiquadFilter();
    this.distortionTone.type = 'lowpass';
    this.distortionTone.frequency.value = 12000;
    this.distortionWetGain = this.ctx.createGain();
    this.distortionDryGain = this.ctx.createGain();
    this.distortionOutput = this.ctx.createGain();
    this.distortionWetGain.gain.value = 0;
    this.distortionDryGain.gain.value = 1;

    // 5. Reverb Unit
    this.reverbInput = this.ctx.createGain();
    this.convolver = this.ctx.createConvolver();
    this.convolver.buffer = generateReverbImpulse(this.ctx, 2.5, 2.0, 0.5);
    this.reverbWetGain = this.ctx.createGain();
    this.reverbDryGain = this.ctx.createGain();
    this.reverbOutput = this.ctx.createGain();
    this.reverbWetGain.gain.value = 0;
    this.reverbDryGain.gain.value = 1;

    // 6. Master Section
    this.stereoPanner = this.ctx.createStereoPanner();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 1.0;

    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 2048;
    this.analyser.minDecibels = -90;
    this.analyser.maxDecibels = -10;
    this.analyser.smoothingTimeConstant = 0.82;

    // 7. Drum Bus
    this.drumBus = this.ctx.createGain();
    this.drumBus.gain.value = 1.0;

    this.buildDspGraph();
  }

  private buildDspGraph(): void {
    // FX Input -> Highpass -> Lowpass -> EQ Low -> EQ Mid -> EQ High
    this.fxInput.connect(this.highpassFilter);
    this.highpassFilter.connect(this.lowpassFilter);
    this.lowpassFilter.connect(this.eqLow);
    this.eqLow.connect(this.eqMid);
    this.eqMid.connect(this.eqHigh);

    // EQ High -> Distortion Unit (Split Dry/Wet)
    this.eqHigh.connect(this.distortionInput);
    // Dry path
    this.distortionInput.connect(this.distortionDryGain);
    this.distortionDryGain.connect(this.distortionOutput);
    // Wet path
    this.distortionInput.connect(this.distortionShaper);
    this.distortionShaper.connect(this.distortionTone);
    this.distortionTone.connect(this.distortionWetGain);
    this.distortionWetGain.connect(this.distortionOutput);

    // Distortion Output -> Reverb Unit (Split Dry/Wet)
    this.distortionOutput.connect(this.reverbInput);
    // Dry path
    this.reverbInput.connect(this.reverbDryGain);
    this.reverbDryGain.connect(this.reverbOutput);
    // Wet path
    this.reverbInput.connect(this.convolver);
    this.convolver.connect(this.reverbWetGain);
    this.reverbWetGain.connect(this.reverbOutput);

    // Reverb Output -> Stereo Panner -> Master Gain
    this.reverbOutput.connect(this.stereoPanner);
    this.stereoPanner.connect(this.masterGain);

    // Drum Bus connects directly to Master Gain
    this.drumBus.connect(this.masterGain);

    // Master Gain -> Analyser -> Speakers
    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);
  }

  public async ensureRunning(): Promise<void> {
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
  }

  /**
   * Updates all parameters across the audio graph smoothly without clicks
   */
  public applyFxParams(params: MasterFxParams): void {
    const now = this.ctx.currentTime;
    const isBypass = params.bypassAll;

    // 1. Filters
    const hpCutoff = isBypass || !params.filter.highpassEnabled ? 20 : params.filter.highpassCutoff;
    this.highpassFilter.frequency.setTargetAtTime(hpCutoff, now, 0.02);
    this.highpassFilter.Q.setTargetAtTime(params.filter.highpassQ, now, 0.02);

    const lpCutoff = isBypass || !params.filter.lowpassEnabled ? 20000 : params.filter.lowpassCutoff;
    this.lowpassFilter.frequency.setTargetAtTime(lpCutoff, now, 0.02);
    this.lowpassFilter.Q.setTargetAtTime(params.filter.lowpassQ, now, 0.02);

    // 2. 3-Band Parametric EQ
    const lowGain = isBypass || !params.eq.enabled ? 0 : params.eq.lowGain;
    const midGain = isBypass || !params.eq.enabled ? 0 : params.eq.midGain;
    const highGain = isBypass || !params.eq.enabled ? 0 : params.eq.highGain;

    this.eqLow.gain.setTargetAtTime(lowGain, now, 0.02);
    this.eqLow.frequency.setTargetAtTime(params.eq.lowFreq, now, 0.02);

    this.eqMid.gain.setTargetAtTime(midGain, now, 0.02);
    this.eqMid.frequency.setTargetAtTime(params.eq.midFreq, now, 0.02);
    this.eqMid.Q.setTargetAtTime(params.eq.midQ, now, 0.02);

    this.eqHigh.gain.setTargetAtTime(highGain, now, 0.02);
    this.eqHigh.frequency.setTargetAtTime(params.eq.highFreq, now, 0.02);

    // 3. Distortion
    if (isBypass || !params.distortion.enabled || params.distortion.drive === 0) {
      this.distortionWetGain.gain.setTargetAtTime(0, now, 0.02);
      this.distortionDryGain.gain.setTargetAtTime(1, now, 0.02);
    } else {
      const wet = Math.min(1.0, params.distortion.drive / 60);
      const dry = 1.0 - wet * 0.5;
      this.distortionWetGain.gain.setTargetAtTime(wet * params.distortion.outputGain, now, 0.02);
      this.distortionDryGain.gain.setTargetAtTime(dry, now, 0.02);
      this.distortionTone.frequency.setTargetAtTime(params.distortion.tone, now, 0.02);
      this.distortionShaper.curve = WebAudioEngine.makeDistortionCurve(params.distortion.drive, params.distortion.curveType) as any;
    }

    // 4. Reverb
    if (isBypass || !params.reverb.enabled) {
      this.reverbWetGain.gain.setTargetAtTime(0, now, 0.02);
      this.reverbDryGain.gain.setTargetAtTime(1, now, 0.02);
    } else {
      this.reverbWetGain.gain.setTargetAtTime(params.reverb.wet, now, 0.02);
      this.reverbDryGain.gain.setTargetAtTime(params.reverb.dry, now, 0.02);
    }

    // 5. Master Section
    this.masterGain.gain.setTargetAtTime(params.masterGain, now, 0.02);
    this.stereoPanner.pan.setTargetAtTime(params.stereoPan, now, 0.02);
  }

  /**
   * Reloads reverb impulse response with new room size and decay
   */
  public updateReverbImpulse(roomSize: number, decaySeconds: number): void {
    this.convolver.buffer = generateReverbImpulse(this.ctx, decaySeconds, 2.0, roomSize);
  }

  /**
   * Computes distortion wave shaping curve
   */
  public static makeDistortionCurve(amount: number, type: DistortionType): Float32Array {
    const k = typeof amount === 'number' ? amount : 50;
    const nSamples = 44100;
    const buffer = new ArrayBuffer(nSamples * 4);
    const curve = new Float32Array(buffer);
    const deg = Math.PI / 180;

    for (let i = 0; i < nSamples; ++i) {
      const x = (i * 2) / nSamples - 1;

      switch (type) {
        case 'warmth':
          // Soft tube saturation
          curve[i] = ((3 + k / 10) * x * 20 * deg) / (Math.PI + (k / 10) * Math.abs(x));
          break;
        case 'hard':
          // Hard clipping
          const threshold = Math.max(0.05, 1 - k / 120);
          if (x > threshold) curve[i] = threshold;
          else if (x < -threshold) curve[i] = -threshold;
          else curve[i] = x;
          break;
        case 'fuzz':
          // Symmetrical high-gain fuzz
          curve[i] = Math.tanh(x * (1 + k / 5));
          break;
        case 'bitcrush':
          // Stepped bit-depth reduction
          const steps = Math.max(2, Math.floor(64 - (k / 100) * 58));
          curve[i] = Math.round(x * steps) / steps;
          break;
      }
    }
    return curve;
  }

  /**
   * Offline DSP Rendering: Renders an AudioBuffer through the full Web Audio DSP FX Rack
   */
  public static async renderAudioWithFx(
    inputBuffer: AudioBuffer,
    fxParams: MasterFxParams,
    region?: { start: number; end: number } | null
  ): Promise<AudioBuffer> {
    const pitchRate = Math.pow(2, fxParams.pitchShift / 12);
    const start = region ? Math.max(0, region.start) : 0;
    const end = region ? Math.min(inputBuffer.duration, region.end) : inputBuffer.duration;
    const sourceDuration = Math.max(0.01, end - start);
    const playbackDuration = sourceDuration / pitchRate;

    // Tail for reverb decay
    const reverbTail =
      !fxParams.bypassAll && fxParams.reverb.enabled ? Math.max(0.5, fxParams.reverb.decay) : 0.05;
    const totalDuration = playbackDuration + reverbTail;

    const sampleRate = inputBuffer.sampleRate;
    const totalSamples = Math.ceil(totalDuration * sampleRate);

    // Create OfflineAudioContext
    const offlineCtx = new OfflineAudioContext(2, totalSamples, sampleRate);

    // 1. Source Node
    const source = offlineCtx.createBufferSource();
    source.buffer = inputBuffer;
    source.playbackRate.value = pitchRate;

    // 2. Highpass & Lowpass Filters
    const hpFilter = offlineCtx.createBiquadFilter();
    hpFilter.type = 'highpass';
    hpFilter.frequency.value =
      fxParams.bypassAll || !fxParams.filter.highpassEnabled ? 20 : fxParams.filter.highpassCutoff;
    hpFilter.Q.value = fxParams.filter.highpassQ;

    const lpFilter = offlineCtx.createBiquadFilter();
    lpFilter.type = 'lowpass';
    lpFilter.frequency.value =
      fxParams.bypassAll || !fxParams.filter.lowpassEnabled ? 20000 : fxParams.filter.lowpassCutoff;
    lpFilter.Q.value = fxParams.filter.lowpassQ;

    // 3. 3-Band Parametric EQ
    const eqLow = offlineCtx.createBiquadFilter();
    eqLow.type = 'lowshelf';
    eqLow.frequency.value = fxParams.eq.lowFreq;
    eqLow.gain.value = fxParams.bypassAll || !fxParams.eq.enabled ? 0 : fxParams.eq.lowGain;

    const eqMid = offlineCtx.createBiquadFilter();
    eqMid.type = 'peaking';
    eqMid.frequency.value = fxParams.eq.midFreq;
    eqMid.Q.value = fxParams.eq.midQ;
    eqMid.gain.value = fxParams.bypassAll || !fxParams.eq.enabled ? 0 : fxParams.eq.midGain;

    const eqHigh = offlineCtx.createBiquadFilter();
    eqHigh.type = 'highshelf';
    eqHigh.frequency.value = fxParams.eq.highFreq;
    eqHigh.gain.value = fxParams.bypassAll || !fxParams.eq.enabled ? 0 : fxParams.eq.highGain;

    // 4. Distortion Unit
    const distortionInput = offlineCtx.createGain();
    const distortionDryGain = offlineCtx.createGain();
    const distortionWetGain = offlineCtx.createGain();
    const distortionOutput = offlineCtx.createGain();
    const distortionShaper = offlineCtx.createWaveShaper();
    const distortionTone = offlineCtx.createBiquadFilter();
    distortionTone.type = 'lowpass';
    distortionTone.frequency.value = fxParams.distortion.tone;

    if (fxParams.bypassAll || !fxParams.distortion.enabled || fxParams.distortion.drive === 0) {
      distortionWetGain.gain.value = 0;
      distortionDryGain.gain.value = 1;
    } else {
      const wet = Math.min(1.0, fxParams.distortion.drive / 60);
      const dry = 1.0 - wet * 0.5;
      distortionWetGain.gain.value = wet * fxParams.distortion.outputGain;
      distortionDryGain.gain.value = dry;
      distortionShaper.curve = WebAudioEngine.makeDistortionCurve(
        fxParams.distortion.drive,
        fxParams.distortion.curveType
      ) as any;
    }

    // 5. Reverb Unit
    const reverbInput = offlineCtx.createGain();
    const reverbDryGain = offlineCtx.createGain();
    const reverbWetGain = offlineCtx.createGain();
    const reverbOutput = offlineCtx.createGain();
    const convolver = offlineCtx.createConvolver();

    if (fxParams.bypassAll || !fxParams.reverb.enabled) {
      reverbWetGain.gain.value = 0;
      reverbDryGain.gain.value = 1;
    } else {
      convolver.buffer = generateReverbImpulse(
        offlineCtx,
        fxParams.reverb.decay,
        2.0,
        fxParams.reverb.roomSize
      );
      reverbWetGain.gain.value = fxParams.reverb.wet;
      reverbDryGain.gain.value = fxParams.reverb.dry;
    }

    // 6. Master Stereo Panner & Gain
    const stereoPanner = offlineCtx.createStereoPanner();
    stereoPanner.pan.value = fxParams.stereoPan;

    const masterGain = offlineCtx.createGain();
    masterGain.gain.value = fxParams.masterGain;

    // Connect DSP Graph
    source.connect(hpFilter);
    hpFilter.connect(lpFilter);
    lpFilter.connect(eqLow);
    eqLow.connect(eqMid);
    eqMid.connect(eqHigh);

    eqHigh.connect(distortionInput);
    distortionInput.connect(distortionDryGain);
    distortionDryGain.connect(distortionOutput);
    distortionInput.connect(distortionShaper);
    distortionShaper.connect(distortionTone);
    distortionTone.connect(distortionWetGain);
    distortionWetGain.connect(distortionOutput);

    distortionOutput.connect(reverbInput);
    reverbInput.connect(reverbDryGain);
    reverbDryGain.connect(reverbOutput);
    reverbInput.connect(convolver);
    convolver.connect(reverbWetGain);
    reverbWetGain.connect(reverbOutput);

    reverbOutput.connect(stereoPanner);
    stereoPanner.connect(masterGain);
    masterGain.connect(offlineCtx.destination);

    // Schedule audio playback
    source.start(0, start, sourceDuration);

    return await offlineCtx.startRendering();
  }
}
