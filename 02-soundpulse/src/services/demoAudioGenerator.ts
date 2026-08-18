import { audioBufferToWavBlob } from './wavEncoder';

export interface DemoTrack {
  id: string;
  name: string;
  genre: string;
  duration: number;
  generator: (ctx: AudioContext) => Promise<{ buffer: AudioBuffer; blobUrl: string }>;
}

/**
 * Renders an offline AudioContext session into an AudioBuffer
 */
async function renderOffline(
  sampleRate: number,
  duration: number,
  renderFn: (offlineCtx: OfflineAudioContext) => void
): Promise<AudioBuffer> {
  const offlineCtx = new OfflineAudioContext(2, Math.floor(sampleRate * duration), sampleRate);
  renderFn(offlineCtx);
  return await offlineCtx.startRendering();
}

/**
 * 1. 440Hz Pure Test Tone Generator
 */
export async function generateTestTone(ctx: AudioContext, frequency: number = 440, duration: number = 3.0) {
  const buffer = await renderOffline(ctx.sampleRate, duration, (offline) => {
    const osc = offline.createOscillator();
    const gain = offline.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, 0);

    // Fade in and fade out envelope
    gain.gain.setValueAtTime(0.001, 0);
    gain.gain.exponentialRampToValueAtTime(0.6, 0.05);
    gain.gain.setValueAtTime(0.6, duration - 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, duration);

    osc.connect(gain);
    gain.connect(offline.destination);

    osc.start(0);
    osc.stop(duration);
  });

  const blob = audioBufferToWavBlob(buffer);
  const blobUrl = URL.createObjectURL(blob);
  return { buffer, blobUrl };
}

/**
 * 2. Cyberpunk Synthwave Groove (120 BPM, 4 Bars)
 */
export async function generateSynthwaveLoop(ctx: AudioContext) {
  const bpm = 120;
  const secondsPerBeat = 60 / bpm;
  const totalBars = 4;
  const duration = totalBars * 4 * secondsPerBeat; // 8 seconds

  const buffer = await renderOffline(ctx.sampleRate, duration, (offline) => {
    const sampleRate = offline.sampleRate;

    // Noise buffer for snare & hats
    const noiseLength = Math.floor(sampleRate * 0.5);
    const noiseBuffer = offline.createBuffer(1, noiseLength, sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseLength; i++) noiseData[i] = Math.random() * 2 - 1;

    // Loop through 16 beats (4 bars)
    for (let bar = 0; bar < totalBars; bar++) {
      for (let beat = 0; beat < 4; beat++) {
        const beatTime = (bar * 4 + beat) * secondsPerBeat;

        // 1. Kick on beat 1, 2, 3, 4 (Four-on-the-floor)
        const kickOsc = offline.createOscillator();
        const kickGain = offline.createGain();
        kickOsc.type = 'sine';
        kickOsc.frequency.setValueAtTime(140, beatTime);
        kickOsc.frequency.exponentialRampToValueAtTime(40, beatTime + 0.09);
        kickGain.gain.setValueAtTime(0.8, beatTime);
        kickGain.gain.exponentialRampToValueAtTime(0.001, beatTime + 0.3);
        kickOsc.connect(kickGain);
        kickGain.connect(offline.destination);
        kickOsc.start(beatTime);
        kickOsc.stop(beatTime + 0.35);

        // 2. Snare on beats 2 and 4
        if (beat === 1 || beat === 3) {
          const snareNoise = offline.createBufferSource();
          snareNoise.buffer = noiseBuffer;
          const snareFilter = offline.createBiquadFilter();
          snareFilter.type = 'highpass';
          snareFilter.frequency.setValueAtTime(1200, beatTime);
          const snareGain = offline.createGain();
          snareGain.gain.setValueAtTime(0.6, beatTime);
          snareGain.gain.exponentialRampToValueAtTime(0.001, beatTime + 0.2);
          snareNoise.connect(snareFilter);
          snareFilter.connect(snareGain);
          snareGain.connect(offline.destination);
          snareNoise.start(beatTime);
          snareNoise.stop(beatTime + 0.22);
        }

        // 3. Hi-Hats on 8th notes
        for (let sub = 0; sub < 2; sub++) {
          const hatTime = beatTime + sub * (secondsPerBeat / 2);
          const hatNoise = offline.createBufferSource();
          hatNoise.buffer = noiseBuffer;
          const hatFilter = offline.createBiquadFilter();
          hatFilter.type = 'bandpass';
          hatFilter.frequency.setValueAtTime(9500, hatTime);
          hatFilter.Q.setValueAtTime(4.0, hatTime);
          const hatGain = offline.createGain();
          hatGain.gain.setValueAtTime(sub === 1 ? 0.35 : 0.2, hatTime);
          hatGain.gain.exponentialRampToValueAtTime(0.001, hatTime + 0.04);
          hatNoise.connect(hatFilter);
          hatFilter.connect(hatGain);
          hatGain.connect(offline.destination);
          hatNoise.start(hatTime);
          hatNoise.stop(hatTime + 0.05);
        }
      }
    }

    // 4. Rolling 16th-note Synthwave Bassline (D Minor: D1 - F1 - G1 - A1)
    const bassNotes = [36.71, 43.65, 48.99, 55.0]; // D1, F1, G1, A1
    const total16ths = totalBars * 16;
    const time16th = secondsPerBeat / 4;

    for (let step = 0; step < total16ths; step++) {
      const stepTime = step * time16th;
      const barIdx = Math.floor(step / 16);
      const baseNote = bassNotes[barIdx % bassNotes.length];
      const octJump = step % 2 === 1 ? baseNote * 2 : baseNote;

      const bassOsc = offline.createOscillator();
      bassOsc.type = 'sawtooth';
      bassOsc.frequency.setValueAtTime(octJump, stepTime);

      const bassFilter = offline.createBiquadFilter();
      bassFilter.type = 'lowpass';
      bassFilter.frequency.setValueAtTime(1400, stepTime);
      bassFilter.frequency.exponentialRampToValueAtTime(250, stepTime + time16th * 0.85);
      bassFilter.Q.setValueAtTime(3.0, stepTime);

      const bassGain = offline.createGain();
      bassGain.gain.setValueAtTime(0.4, stepTime);
      bassGain.gain.exponentialRampToValueAtTime(0.001, stepTime + time16th * 0.9);

      bassOsc.connect(bassFilter);
      bassFilter.connect(bassGain);
      bassGain.connect(offline.destination);

      bassOsc.start(stepTime);
      bassOsc.stop(stepTime + time16th);
    }
  });

  const blob = audioBufferToWavBlob(buffer);
  const blobUrl = URL.createObjectURL(blob);
  return { buffer, blobUrl };
}

/**
 * 3. Ambient Lo-Fi Chill Chord Progression
 */
export async function generateAmbientLofiLoop(ctx: AudioContext) {
  const duration = 6.0;

  const buffer = await renderOffline(ctx.sampleRate, duration, (offline) => {
    // Chords: Dmaj7 (D3, F#3, A3, C#4) -> Bmin7 (B2, D3, F#3, A3)
    const chords = [
      { time: 0.0, dur: 2.8, freqs: [146.83, 185.0, 220.0, 277.18] },
      { time: 3.0, dur: 2.8, freqs: [123.47, 146.83, 185.0, 220.0] },
    ];

    chords.forEach((chord) => {
      chord.freqs.forEach((freq, idx) => {
        const osc = offline.createOscillator();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, chord.time);

        const filter = offline.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1800, chord.time);

        const gain = offline.createGain();
        gain.gain.setValueAtTime(0.001, chord.time);
        gain.gain.exponentialRampToValueAtTime(0.2, chord.time + 0.3);
        gain.gain.setValueAtTime(0.18, chord.time + chord.dur - 0.4);
        gain.gain.exponentialRampToValueAtTime(0.001, chord.time + chord.dur);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(offline.destination);

        osc.start(chord.time);
        osc.stop(chord.time + chord.dur);
      });
    });
  });

  const blob = audioBufferToWavBlob(buffer);
  const blobUrl = URL.createObjectURL(blob);
  return { buffer, blobUrl };
}

export const DEMO_TRACKS: DemoTrack[] = [
  {
    id: 'synthwave',
    name: '⚡ Cyberpunk Synthwave (120 BPM)',
    genre: 'Synthwave / Retro Electro',
    duration: 8.0,
    generator: generateSynthwaveLoop,
  },
  {
    id: 'lofi',
    name: '☕ Lo-Fi Ambient Dream (Chords)',
    genre: 'Lo-Fi / Ambient',
    duration: 6.0,
    generator: generateAmbientLofiLoop,
  },
  {
    id: 'test-tone',
    name: '🎯 440 Hz Sine Calibration Tone',
    genre: 'DSP Test Tone',
    duration: 3.0,
    generator: (ctx) => generateTestTone(ctx, 440, 3.0),
  },
];
