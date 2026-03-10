import type { LevelConfig } from './level1';

export const LEVEL_19: LevelConfig = {
  id: 'level19',
  forceFieldChance: 0.03,
  tunnel: 'horizontal',
  staticObstacles: [
    { x: 0.3, y: 0.35 },
    { x: 0.7, y: 0.35 },
    { x: 0.3, y: 0.65 },
    { x: 0.7, y: 0.65 },
  ],
  powerups: {
    type: 'big',
    spawnChance: 0.03,
    spawnIntervalMs: 2200,
    durationMs: 12000,
  },
  spawnOrigin: 'scattered',
  waves: [
    [{ enemyType: 'type9', count: 2 }, { enemyType: 'type6', count: 1 }],
    [{ enemyType: 'type9', count: 1 }, { enemyType: 'type7', count: 2 }, { enemyType: 'type8', count: 1 }],
    [{ enemyType: 'type9', count: 2 }, { enemyType: 'type4', count: 8 }],
    [{ enemyType: 'type6', count: 2 }, { enemyType: 'type9', count: 1 }, { enemyType: 'type5', count: 1 }],
    [{ enemyType: 'type9', count: 2 }, { enemyType: 'type3', count: 2 }],
    [{ enemyType: 'type9', count: 1 }, { enemyType: 'type10', count: 4 }],
  ],
};
