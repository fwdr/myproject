import type { LevelConfig } from './level1';

export const LEVEL_7: LevelConfig = {
  id: 'level7',
  forceFieldChance: 0.03,
  tunnel: 'horizontal',
  powerups: {
    type: 'big',
    spawnChance: 0.03,
    spawnIntervalMs: 2000,
    durationMs: 12000,
  },
  staticObstacles: [
    { x: 0.3, y: 0.5 },
    { x: 0.7, y: 0.5 },
  ],
  waves: [
    [{ enemyType: 'type3', count: 2 }],
    [{ enemyType: 'type4', count: 6 }],
    [{ enemyType: 'type3', count: 2 }, { enemyType: 'type4', count: 4 }],
  ],
};
