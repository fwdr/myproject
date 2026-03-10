import type { LevelConfig } from './level1';

export const LEVEL_5: LevelConfig = {
  id: 'level5',
  forceFieldChance: 0.01,
  tunnel: 'none',
  waves: [
    [{ enemyType: 'type1', count: 3, spawnOrigin: 'grouped' }],
    [{ enemyType: 'type2', count: 3, spawnOrigin: 'scattered' }],
  ],
};
