import type { LevelConfig } from './level1';

export const LEVEL_10: LevelConfig = {
  id: 'level10',
  tunnel: 'vertical',
  powerups: {
    type: 'big',
    spawnChance: 0.03,
    spawnIntervalMs: 2000,
    durationMs: 12000,
  },
  waves: [
    [{ enemyType: 'type7', count: 2 }],
    [{ enemyType: 'type4', count: 8 }],
    [{ enemyType: 'type7', count: 2 }, { enemyType: 'type4', count: 4 }],
    [{ enemyType: 'type7', count: 1 }, { enemyType: 'type3', count: 2 }],
  ],
};
