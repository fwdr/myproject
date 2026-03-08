import { PALETTE } from '../lib/gameConstants';

export type BrickStyleConfig = {
  backgroundColor: string;
  borderColor: string;
  borderWidth?: number;
  glowColor?: string;
  glowRadius?: number;
  glowOpacity?: number;
};

const BRICK_STYLES: BrickStyleConfig[] = [
  { backgroundColor: PALETTE.red, borderColor: PALETTE.maroon, borderWidth: 1, glowColor: PALETTE.red, glowRadius: 2, glowOpacity: 0.5 },
  { backgroundColor: PALETTE.teal, borderColor: PALETTE.cyan, borderWidth: 2, glowColor: PALETTE.cyan, glowRadius: 4, glowOpacity: 0.4 },
  { backgroundColor: PALETTE.teal, borderColor: PALETTE.cyan, borderWidth: 1, glowColor: PALETTE.teal, glowRadius: 1, glowOpacity: 0.3 },
  { backgroundColor: PALETTE.magenta, borderColor: PALETTE.purple, borderWidth: 2, glowColor: PALETTE.magenta, glowRadius: 3, glowOpacity: 0.5 },
  { backgroundColor: PALETTE.red, borderColor: PALETTE.maroon, borderWidth: 2, glowColor: '#ff4444', glowRadius: 2, glowOpacity: 0.4 },
  { backgroundColor: PALETTE.olive, borderColor: PALETTE.lime, borderWidth: 1, glowColor: PALETTE.lime, glowRadius: 3, glowOpacity: 0.35 },
  { backgroundColor: PALETTE.blue, borderColor: PALETTE.cyan, borderWidth: 2, glowColor: PALETTE.blue, glowRadius: 4, glowOpacity: 0.5 },
  { backgroundColor: PALETTE.purple, borderColor: PALETTE.magenta, borderWidth: 1, glowColor: PALETTE.magenta, glowRadius: 5, glowOpacity: 0.45 },
  { backgroundColor: PALETTE.green, borderColor: PALETTE.lime, borderWidth: 2, glowColor: PALETTE.green, glowRadius: 2, glowOpacity: 0.3 },
  { backgroundColor: PALETTE.maroon, borderColor: PALETTE.red, borderWidth: 1, glowColor: PALETTE.red, glowRadius: 2, glowOpacity: 0.4 },
  { backgroundColor: PALETTE.cyan, borderColor: PALETTE.blue, borderWidth: 2, glowColor: PALETTE.cyan, glowRadius: 6, glowOpacity: 0.4 },
  { backgroundColor: PALETTE.olive, borderColor: PALETTE.yellow, borderWidth: 1, glowColor: PALETTE.yellow, glowRadius: 3, glowOpacity: 0.35 },
  { backgroundColor: PALETTE.magenta, borderColor: PALETTE.purple, borderWidth: 2, glowColor: '#ff66ff', glowRadius: 4, glowOpacity: 0.5 },
  { backgroundColor: PALETTE.gray, borderColor: PALETTE.silver, borderWidth: 2, glowColor: PALETTE.silver, glowRadius: 2, glowOpacity: 0.3 },
  { backgroundColor: PALETTE.teal, borderColor: PALETTE.green, borderWidth: 1, glowColor: PALETTE.teal, glowRadius: 3, glowOpacity: 0.4 },
  { backgroundColor: PALETTE.red, borderColor: PALETTE.yellow, borderWidth: 2, glowColor: PALETTE.yellow, glowRadius: 4, glowOpacity: 0.45 },
  { backgroundColor: PALETTE.purple, borderColor: PALETTE.blue, borderWidth: 1, glowColor: PALETTE.purple, glowRadius: 5, glowOpacity: 0.5 },
  { backgroundColor: PALETTE.lime, borderColor: PALETTE.green, borderWidth: 2, glowColor: PALETTE.lime, glowRadius: 2, glowOpacity: 0.35 },
  { backgroundColor: PALETTE.cyan, borderColor: PALETTE.teal, borderWidth: 1, glowColor: PALETTE.cyan, glowRadius: 6, glowOpacity: 0.5 },
  { backgroundColor: PALETTE.maroon, borderColor: PALETTE.magenta, borderWidth: 2, glowColor: PALETTE.magenta, glowRadius: 3, glowOpacity: 0.4 },
];

export function getBrickStyleForLevel(levelNumber: number): BrickStyleConfig {
  const idx = (levelNumber - 1) % BRICK_STYLES.length;
  return { ...BRICK_STYLES[idx] };
}
