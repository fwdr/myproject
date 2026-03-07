import type { LevelConfig } from './level1';

export const LEVEL_3: LevelConfig = {
  id: 'level3',
  tunnel: 'horizontal',
  powerups: {
    type: 'dual',
    spawnChance: 0.04,
    spawnIntervalMs: 2000,
    durationMs: 10000,
  },
  waves: [
    [{ enemyType: 'type3', count: 3, spawnDelayMs: 2000 }],
    [{ enemyType: 'type3', count: 3, spawnDelayMs: 2000 }],
    [{ enemyType: 'type3', count: 3, spawnDelayMs: 2000 }],
  ],
};
