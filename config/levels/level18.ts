import type { LevelConfig } from './level1';

export const LEVEL_18: LevelConfig = {
  id: 'level18',
  extraLifeChance: 0.5,
  tunnel: 'vertical',
  powerups: {
    type: 'dual',
    spawnChance: 0.035,
    spawnIntervalMs: 2000,
    durationMs: 10000,
  },
  spawnOrigin: 'grouped',
  waves: [
    [{ enemyType: 'type9', count: 2 }, { enemyType: 'type2', count: 2 }],
    [{ enemyType: 'type9', count: 1 }, { enemyType: 'type6', count: 2 }],
    [{ enemyType: 'type9', count: 2 }, { enemyType: 'type8', count: 2 }],
    [{ enemyType: 'type6', count: 2 }, { enemyType: 'type7', count: 2 }],
    [{ enemyType: 'type9', count: 2 }, { enemyType: 'type5', count: 2 }],
  ],
};
