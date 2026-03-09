#!/usr/bin/env node
/**
 * Generates a short space-laser "pew" sound effect as WAV.
 * Output: assets/missile.wav
 */
const fs = require('fs');
const path = require('path');

const SAMPLE_RATE = 44100;
const DURATION_SEC = 0.07;
const NUM_SAMPLES = Math.floor(SAMPLE_RATE * DURATION_SEC);

// Simple seeded random for reproducible noise
function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function createWavBuffer() {
  const dataSize = NUM_SAMPLES * 2; // 16-bit = 2 bytes per sample
  const buffer = Buffer.alloc(44 + dataSize);
  let offset = 0;

  const write = (buf) => {
    buf.copy(buffer, offset);
    offset += buf.length;
  };

  const writeU32 = (n) => write(Buffer.from(new Uint32Array([n]).buffer));
  const writeU16 = (n) => write(Buffer.from(new Uint16Array([n]).buffer));

  // RIFF header
  write(Buffer.from('RIFF'));
  writeU32(36 + dataSize);
  write(Buffer.from('WAVE'));

  // fmt chunk
  write(Buffer.from('fmt '));
  writeU32(16);
  writeU16(1); // PCM
  writeU16(1); // mono
  writeU32(SAMPLE_RATE);
  writeU32(SAMPLE_RATE * 2); // byte rate
  writeU16(2); // block align
  writeU16(16); // bits per sample

  // data chunk
  write(Buffer.from('data'));
  writeU32(dataSize);

  const rand = mulberry32(12345);
  let phase = 0;

  for (let i = 0; i < NUM_SAMPLES; i++) {
    const t = i / SAMPLE_RATE;
    const progress = i / NUM_SAMPLES;

    // Snappy envelope: instant attack, fast exponential decay
    const env = Math.exp(-18 * progress);

    // Main sweep: 4kHz -> 1.8kHz (classic laser "pew" descent)
    const freq = 4000 - 2200 * progress;
    phase += (2 * Math.PI * freq) / SAMPLE_RATE;
    const sweep = Math.sin(phase);

    // Add 2nd harmonic for more electronic/phaser feel
    const harmonic = Math.sin(phase * 2) * 0.25;

    // Short burst of filtered noise for "sizzle" (first 40% only)
    let noise = 0;
    if (progress < 0.4) {
      noise = (rand() * 2 - 1) * (1 - progress / 0.4);
    }

    const sample = (sweep * 0.5 + harmonic + noise * 0.15) * env * 0.45;
    const s16 = Math.max(-32768, Math.min(32767, Math.round(sample * 32767)));
    buffer.writeInt16LE(s16, 44 + i * 2);
  }

  return buffer;
}

const outPath = path.join(__dirname, '..', 'assets', 'missile.wav');
fs.writeFileSync(outPath, createWavBuffer());
console.log('Generated', outPath);
