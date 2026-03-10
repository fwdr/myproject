import type { LevelConfig } from './level1';

export const LEVEL_14: LevelConfig = {
  id: 'level14',
  extraLifeChance: 0.5,
  tunnel: 'vertical',
  staticObstacles: [
    { x: 0.2, y: 0.3 },
    { x: 0.8, y: 0.3 },
    { x: 0.2, y: 0.7 },
    { x: 0.8, y: 0.7 },
  ],
  spawnOrigin: 'scattered',
  waves: [
    [{ enemyType: 'type5', count: 3 }],
    [{ enemyType: 'type7', count: 2 }, { enemyType: 'type5', count: 1 }],
    [{ enemyType: 'type5', count: 3 }, { enemyType: 'type7', count: 2 }],
    [{ enemyType: 'type7', count: 2 }, { enemyType: 'type6', count: 2 }],
  ],
};
