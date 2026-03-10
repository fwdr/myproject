import type { LevelConfig } from './level1';

export const LEVEL_17: LevelConfig = {
  id: 'level17',
  forceFieldChance: 0.03,
  tunnel: 'horizontal',
  staticObstacles: [
    { x: 0.25, y: 0.25 },
    { x: 0.75, y: 0.25 },
    { x: 0.5, y: 0.5 },
    { x: 0.25, y: 0.75 },
    { x: 0.75, y: 0.75 },
  ],
  spawnOrigin: 'scattered',
  waves: [
    [{ enemyType: 'type9', count: 2 }, { enemyType: 'type4', count: 4 }],
    [{ enemyType: 'type8', count: 3 }, { enemyType: 'type6', count: 1 }],
    [{ enemyType: 'type9', count: 1 }, { enemyType: 'type7', count: 2 }, { enemyType: 'type5', count: 1 }],
    [{ enemyType: 'type6', count: 2 }, { enemyType: 'type10', count: 3 }],
    [{ enemyType: 'type9', count: 2 }, { enemyType: 'type3', count: 1 }],
  ],
};
