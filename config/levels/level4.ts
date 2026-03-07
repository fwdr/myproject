import type { LevelConfig } from './level1';

export const LEVEL_4: LevelConfig = {
  id: 'level4',
  tunnel: 'vertical',
  spawnOrigin: 'grouped',
  waves: [
    [{ enemyType: 'type4', count: 3, spawnDelayMs: 2000 }],
    [{ enemyType: 'type4', count: 3, spawnDelayMs: 2000 }],
    [{ enemyType: 'type4', count: 3, spawnDelayMs: 2000 }],
  ],
};
