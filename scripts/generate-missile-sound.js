#!/usr/bin/env node
/**
 * Generates a short "pew" laser/missile sound effect as WAV.
 * Output: assets/missile.wav
 */
const fs = require('fs');
const path = require('path');

const SAMPLE_RATE = 44100;
const DURATION_SEC = 0.08;
const NUM_SAMPLES = Math.floor(SAMPLE_RATE * DURATION_SEC);

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

  // Generate "pew" - short chirp: 1200Hz -> 400Hz with envelope
  for (let i = 0; i < NUM_SAMPLES; i++) {
    const t = i / SAMPLE_RATE;
    const progress = i / NUM_SAMPLES;
    const freq = 1200 - 800 * progress; // descending
    const env = Math.exp(-12 * progress); // quick decay
    const sample = Math.sin(2 * Math.PI * freq * t) * env * 0.4;
    const s16 = Math.max(-32768, Math.min(32767, Math.round(sample * 32767)));
    buffer.writeInt16LE(s16, 44 + i * 2);
  }

  return buffer;
}

const outPath = path.join(__dirname, '..', 'assets', 'missile.wav');
fs.writeFileSync(outPath, createWavBuffer());
console.log('Generated', outPath);
