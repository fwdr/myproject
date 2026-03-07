import type { LevelConfig } from './level1';

export const LEVEL_3: LevelConfig = {
  id: 'level3',
  tunnel: 'horizontal',
  waves: [
    [{ enemyType: 'type3', count: 3, spawnDelayMs: 2000 }],
  ],
};
