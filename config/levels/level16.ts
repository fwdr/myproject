import type { LevelConfig } from './level1';

export const LEVEL_16: LevelConfig = {
  id: 'level16',
  tunnel: 'vertical',
  staticObstacles: [
    { x: 0.35, y: 0.4 },
    { x: 0.65, y: 0.6 },
  ],
  powerups: {
    type: 'big',
    spawnChance: 0.03,
    spawnIntervalMs: 2500,
    durationMs: 11000,
  },
  waves: [
    [{ enemyType: 'type6', count: 2 }, { enemyType: 'type9', count: 1 }],
    [{ enemyType: 'type9', count: 1 }, { enemyType: 'type7', count: 2 }],
    [{ enemyType: 'type6', count: 2 }, { enemyType: 'type8', count: 2 }],
    [{ enemyType: 'type9', count: 2 }, { enemyType: 'type5', count: 1 }],
    [{ enemyType: 'type9', count: 1 }, { enemyType: 'type6', count: 1 }, { enemyType: 'type7', count: 1 }],
  ],
};
