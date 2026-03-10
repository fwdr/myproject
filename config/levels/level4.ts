import type { LevelConfig } from './level1';

export const LEVEL_4: LevelConfig = {
  id: 'level4',
  extraLifeChance: 0.5,
  tunnel: 'vertical',
  spawnOrigin: 'grouped',
  powerups: {
    type: 'big',
    spawnChance: 0.03,
    spawnIntervalMs: 2000,
    durationMs: 12000,
  },
  waves: [
    [{ enemyType: 'type4', count: 3, spawnDelayMs: 2000 }],
    [{ enemyType: 'type4', count: 3, spawnDelayMs: 2000 }],
    [{ enemyType: 'type4', count: 3, spawnDelayMs: 2000 }],
  ],
};
