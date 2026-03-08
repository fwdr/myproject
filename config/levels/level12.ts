import type { LevelConfig } from './level1';

export const LEVEL_12: LevelConfig = {
  id: 'level12',
  tunnel: 'vertical',
  spawnOrigin: 'grouped',
  waves: [
    [{ enemyType: 'type9', count: 2 }],
    [{ enemyType: 'type3', count: 3 }],
    [{ enemyType: 'type9', count: 1 }, { enemyType: 'type3', count: 2 }],
    [{ enemyType: 'type9', count: 2 }, { enemyType: 'type4', count: 6 }],
  ],
};
