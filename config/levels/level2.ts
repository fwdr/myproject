import type { LevelConfig } from './level1';

export const LEVEL_2: LevelConfig = {
  id: 'level2',
  tunnel: 'horizontal',
  staticObstacles: [
    { x: 0.35, y: 0.4 },
    { x: 0.65, y: 0.6 },
  ],
  waves: [
    [{ enemyType: 'type2', count: 1 }],
    [{ enemyType: 'type2', count: 1 }],
    [{ enemyType: 'type2', count: 1 }],
  ],
};
