import type { LevelConfig } from './level1';

export const LEVEL_13: LevelConfig = {
  id: 'level13',
  forceFieldChance: 0.03,
  tunnel: 'horizontal',
  powerups: {
    type: 'dual',
    spawnChance: 0.04,
    spawnIntervalMs: 2000,
    durationMs: 10000,
  },
  waves: [
    [{ enemyType: 'type6', count: 2 }, { enemyType: 'type10', count: 2 }],
    [{ enemyType: 'type6', count: 2 }, { enemyType: 'type10', count: 4 }],
    [{ enemyType: 'type6', count: 1 }, { enemyType: 'type10', count: 4 }, { enemyType: 'type7', count: 1 }],
    [{ enemyType: 'type6', count: 2 }, { enemyType: 'type8', count: 2 }],
  ],
};
