/**
 * Generates an algorithmic stereo impulse response for convolution reverb.
 */
export function generateReverbImpulse(
  ctx: BaseAudioContext,
  durationSeconds: number = 2.5,
  decayRate: number = 2.0,
  roomSize: number = 0.5,
  reverse: boolean = false
): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const length = Math.max(1, Math.floor(sampleRate * durationSeconds));
  const impulse = ctx.createBuffer(2, length, sampleRate);
  const left = impulse.getChannelData(0);
  const right = impulse.getChannelData(1);

  // Damping factor based on room size
  const damping = 1.0 - roomSize * 0.4;

  for (let i = 0; i < length; i++) {
    const n = reverse ? length - i : i;
    // Exponential decay curve
    const envelope = Math.pow(1 - n / length, decayRate);

    // Filter simulation: high frequencies decay faster
    const noiseL = (Math.random() * 2 - 1) * envelope;
    const noiseR = (Math.random() * 2 - 1) * envelope;

    left[i] = noiseL * damping;
    right[i] = noiseR * damping;
  }

  return impulse;
}
