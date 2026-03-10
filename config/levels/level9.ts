import type { LevelConfig } from './level1';

export const LEVEL_9: LevelConfig = {
  id: 'level9',
  forceFieldChance: 0.01,
  tunnel: 'horizontal',
  spawnOrigin: 'grouped',
  waves: [
    [{ enemyType: 'type2', count: 2 }],
    [{ enemyType: 'type6', count: 2 }],
    [{ enemyType: 'type2', count: 2 }, { enemyType: 'type6', count: 1 }],
    [{ enemyType: 'type6', count: 2 }],
  ],
};
