import type { LevelConfig } from './level1';

export const LEVEL_15: LevelConfig = {
  id: 'level15',
  forceFieldChance: 0.01,
  tunnel: 'horizontal',
  spawnOrigin: 'grouped',
  waves: [
    [{ enemyType: 'type9', count: 2 }],
    [{ enemyType: 'type2', count: 3 }],
    [{ enemyType: 'type9', count: 1 }, { enemyType: 'type2', count: 2 }],
    [{ enemyType: 'type9', count: 2 }, { enemyType: 'type3', count: 2 }],
    [{ enemyType: 'type9', count: 1 }, { enemyType: 'type6', count: 1 }],
  ],
};
