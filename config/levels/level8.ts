import type { LevelConfig } from './level1';

export const LEVEL_8: LevelConfig = {
  id: 'level8',
  tunnel: 'none',
  powerups: {
    type: 'dual',
    spawnChance: 0.035,
    spawnIntervalMs: 2500,
    durationMs: 10000,
  },
  waves: [
    [{ enemyType: 'type5', count: 3 }],
    [{ enemyType: 'type5', count: 2 }, { enemyType: 'type1', count: 2 }],
    [{ enemyType: 'type5', count: 3 }, { enemyType: 'type2', count: 1 }],
  ],
};
