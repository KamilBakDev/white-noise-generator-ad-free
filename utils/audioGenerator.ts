import {
  SAMPLE_RATE,
  NUM_SAMPLES,
  BITS_PER_SAMPLE,
  NUM_CHANNELS,
} from '../constants';
import type { NoiseType } from './noises';

function generateWhiteNoise(samples: Float32Array): void {
  for (let i = 0; i < samples.length; i++) {
    samples[i] = Math.random() * 2 - 1;
  }
}

function generatePinkNoise(samples: Float32Array): void {
  // Voss-McCartney algorithm
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  for (let i = 0; i < samples.length; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.96900 * b2 + white * 0.1538520;
    b3 = 0.86650 * b3 + white * 0.3104856;
    b4 = 0.55000 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.0168980;
    const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
    b6 = white * 0.115926;
    samples[i] = pink * 0.11;
  }
}

function generateBrownNoise(samples: Float32Array): void {
  let lastOut = 0;
  for (let i = 0; i < samples.length; i++) {
    const white = Math.random() * 2 - 1;
    lastOut = (lastOut + 0.02 * white) / 1.02;
    samples[i] = lastOut * 3.5;
  }
}

function generateBlueNoise(samples: Float32Array): void {
  let lastSample = Math.random() * 2 - 1;
  for (let i = 0; i < samples.length; i++) {
    const white = Math.random() * 2 - 1;
    samples[i] = white - lastSample;
    lastSample = white;
  }
  // Normalize
  let max = 0;
  for (let i = 0; i < samples.length; i++) {
    const abs = Math.abs(samples[i]);
    if (abs > max) max = abs;
  }
  if (max > 0) {
    const scale = 0.8 / max;
    for (let i = 0; i < samples.length; i++) {
      samples[i] *= scale;
    }
  }
}

function generateVioletNoise(samples: Float32Array): void {
  let prev1 = Math.random() * 2 - 1;
  let prev2 = Math.random() * 2 - 1;
  for (let i = 0; i < samples.length; i++) {
    const white = Math.random() * 2 - 1;
    const blue = white - prev1;
    samples[i] = blue - (prev1 - prev2);
    prev2 = prev1;
    prev1 = white;
  }
  // Normalize
  let max = 0;
  for (let i = 0; i < samples.length; i++) {
    const abs = Math.abs(samples[i]);
    if (abs > max) max = abs;
  }
  if (max > 0) {
    const scale = 0.7 / max;
    for (let i = 0; i < samples.length; i++) {
      samples[i] *= scale;
    }
  }
}

function generateGreyNoise(samples: Float32Array): void {
  // Grey noise: white noise shaped by inverse A-weighting approximation
  // We apply a simple equal-loudness shaping filter
  // Using a simplified approach: generate white noise and apply a bandpass-like shaping
  let b0 = 0, b1 = 0;
  for (let i = 0; i < samples.length; i++) {
    const white = Math.random() * 2 - 1;
    // Simple shaping: boost mids, attenuate lows and highs
    // Two-pole bandpass approximation centered around 3-4kHz
    const shaped = white * 0.5 + b0 * 0.3 - b1 * 0.15;
    b1 = b0;
    b0 = white;
    samples[i] = shaped;
  }
  // Normalize
  let max = 0;
  for (let i = 0; i < samples.length; i++) {
    const abs = Math.abs(samples[i]);
    if (abs > max) max = abs;
  }
  if (max > 0) {
    const scale = 0.8 / max;
    for (let i = 0; i < samples.length; i++) {
      samples[i] *= scale;
    }
  }
}

export function generateNoiseSamples(type: NoiseType): Float32Array {
  const samples = new Float32Array(NUM_SAMPLES);

  switch (type) {
    case 'white':
      generateWhiteNoise(samples);
      break;
    case 'pink':
      generatePinkNoise(samples);
      break;
    case 'brown':
      generateBrownNoise(samples);
      break;
    case 'blue':
      generateBlueNoise(samples);
      break;
    case 'violet':
      generateVioletNoise(samples);
      break;
    case 'grey':
      generateGreyNoise(samples);
      break;
  }

  // Apply fade-in and fade-out to avoid clicks when looping
  const fadeSamples = Math.floor(SAMPLE_RATE * 0.05); // 50ms fade
  for (let i = 0; i < fadeSamples; i++) {
    const gain = i / fadeSamples;
    samples[i] *= gain;
    samples[samples.length - 1 - i] *= gain;
  }

  return samples;
}

export function encodeWav(samples: Float32Array): ArrayBuffer {
  const numSamples = samples.length;
  const byteRate = SAMPLE_RATE * NUM_CHANNELS * (BITS_PER_SAMPLE / 8);
  const blockAlign = NUM_CHANNELS * (BITS_PER_SAMPLE / 8);
  const dataSize = numSamples * NUM_CHANNELS * (BITS_PER_SAMPLE / 8);
  const bufferSize = 44 + dataSize;

  const buffer = new ArrayBuffer(bufferSize);
  const view = new DataView(buffer);

  // RIFF header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, bufferSize - 8, true);
  writeString(view, 8, 'WAVE');

  // fmt sub-chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // sub-chunk size
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, NUM_CHANNELS, true);
  view.setUint32(24, SAMPLE_RATE, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, BITS_PER_SAMPLE, true);

  // data sub-chunk
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  // Write PCM samples
  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    let sample = Math.max(-1, Math.min(1, samples[i]));
    const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
    view.setInt16(offset, intSample, true);
    offset += 2;
  }

  return buffer;
}

function writeString(view: DataView, offset: number, str: string): void {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunkSize = 8192;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    for (let j = 0; j < chunk.length; j++) {
      binary += String.fromCharCode(chunk[j]);
    }
  }
  // Use btoa if available (React Native has it via hermes)
  if (typeof btoa !== 'undefined') {
    return btoa(binary);
  }
  // Fallback manual base64
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let result = '';
  let i = 0;
  while (i < binary.length) {
    const a = binary.charCodeAt(i++);
    const b = i < binary.length ? binary.charCodeAt(i++) : 0;
    const c = i < binary.length ? binary.charCodeAt(i++) : 0;
    const triplet = (a << 16) | (b << 8) | c;
    result += chars[(triplet >> 18) & 0x3F];
    result += chars[(triplet >> 12) & 0x3F];
    result += i - 2 < binary.length ? chars[(triplet >> 6) & 0x3F] : '=';
    result += i - 1 < binary.length ? chars[triplet & 0x3F] : '=';
  }
  return result;
}
