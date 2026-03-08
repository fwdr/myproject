import type { LevelConfig } from './level1';

export const LEVEL_7: LevelConfig = {
  id: 'level7',
  tunnel: 'horizontal',
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
