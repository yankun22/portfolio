/**
 * Encodes an AudioBuffer into a standard 16-bit linear PCM RIFF WAV Blob.
 */
export function audioBufferToWavBlob(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;

  const numSamples = buffer.length;
  const dataByteLength = numSamples * blockAlign;
  const bufferByteLength = 44 + dataByteLength;

  const arrayBuffer = new ArrayBuffer(bufferByteLength);
  const view = new DataView(arrayBuffer);

  function writeString(offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  /* RIFF identifier */
  writeString(0, 'RIFF');
  /* RIFF chunk length */
  view.setUint32(4, 36 + dataByteLength, true);
  /* RIFF type */
  writeString(8, 'WAVE');
  /* format chunk identifier */
  writeString(12, 'fmt ');
  /* format chunk length */
  view.setUint32(16, 16, true);
  /* sample format (raw) */
  view.setUint16(20, format, true);
  /* channel count */
  view.setUint16(22, numChannels, true);
  /* sample rate */
  view.setUint32(24, sampleRate, true);
  /* byte rate (sample rate * block align) */
  view.setUint32(28, sampleRate * blockAlign, true);
  /* block align (channel count * bytes per sample) */
  view.setUint16(32, blockAlign, true);
  /* bits per sample */
  view.setUint16(34, bitDepth, true);
  /* data chunk identifier */
  writeString(36, 'data');
  /* data chunk length */
  view.setUint32(40, dataByteLength, true);

  // Interleave and quantize channel data into 16-bit signed integers
  let offset = 44;
  const channelData: Float32Array[] = [];
  for (let ch = 0; ch < numChannels; ch++) {
    channelData.push(buffer.getChannelData(ch));
  }

  for (let i = 0; i < numSamples; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      let sample = channelData[ch][i];
      // Clamp to [-1.0, 1.0]
      sample = Math.max(-1, Math.min(1, sample));
      // Convert float sample to 16-bit PCM integer
      const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(offset, intSample, true);
      offset += 2;
    }
  }

  return new Blob([view], { type: 'audio/wav' });
}

/**
 * Trims an AudioBuffer to specified start and end timestamps (in seconds).
 */
export function sliceAudioBuffer(
  ctx: AudioContext,
  originalBuffer: AudioBuffer,
  startTimeSeconds: number,
  endTimeSeconds: number
): AudioBuffer {
  const sampleRate = originalBuffer.sampleRate;
  const numChannels = originalBuffer.numberOfChannels;

  const startSample = Math.max(0, Math.floor(startTimeSeconds * sampleRate));
  const endSample = Math.min(originalBuffer.length, Math.floor(endTimeSeconds * sampleRate));
  const sliceLength = Math.max(1, endSample - startSample);

  const slicedBuffer = ctx.createBuffer(numChannels, sliceLength, sampleRate);

  for (let ch = 0; ch < numChannels; ch++) {
    const originalData = originalBuffer.getChannelData(ch);
    const slicedData = slicedBuffer.getChannelData(ch);
    for (let i = 0; i < sliceLength; i++) {
      slicedData[i] = originalData[startSample + i];
    }
  }

  return slicedBuffer;
}
