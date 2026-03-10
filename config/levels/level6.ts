import type { LevelConfig } from './level1';

export const LEVEL_6: LevelConfig = {
  id: 'level6',
  extraLifeChance: 0.5,
  tunnel: 'vertical',
  spawnOrigin: 'scattered',
  waves: [
    [{ enemyType: 'type1', count: 2 }],
    [{ enemyType: 'type2', count: 2 }],
    [{ enemyType: 'type1', count: 2 }, { enemyType: 'type2', count: 1 }],
  ],
};
