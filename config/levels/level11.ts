import type { LevelConfig } from './level1';

export const LEVEL_11: LevelConfig = {
  id: 'level11',
  forceFieldChance: 0.01,
  tunnel: 'none',
  staticObstacles: [
    { x: 0.25, y: 0.35 },
    { x: 0.75, y: 0.35 },
    { x: 0.5, y: 0.7 },
  ],
  spawnOrigin: 'scattered',
  waves: [
    [{ enemyType: 'type1', count: 2 }, { enemyType: 'type8', count: 2 }],
    [{ enemyType: 'type8', count: 3 }, { enemyType: 'type2', count: 1 }],
    [{ enemyType: 'type8', count: 3 }, { enemyType: 'type5', count: 2 }],
    [{ enemyType: 'type8', count: 2 }, { enemyType: 'type6', count: 1 }],
  ],
};
