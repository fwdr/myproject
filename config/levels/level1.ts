import type { EnemyTypeId } from '../enemyTypes';

export type WaveSpawn = {
  enemyType: EnemyTypeId;
  count: number;
};

export type StaticObstacle = { x: number; y: number }; // fractional 0-1
export type LevelConfig = {
  id: string;
  waves: WaveSpawn[][];
  staticObstacles?: StaticObstacle[];
};

export const LEVEL_1: LevelConfig = {
  id: 'level1',
  waves: [
    [{ enemyType: 'type1', count: 1 }],
    [{ enemyType: 'type1', count: 1 }],
    [{ enemyType: 'type1', count: 1 }],
    [{ enemyType: 'type1', count: 1 }],
    [{ enemyType: 'type1', count: 1 }],
  ],
};
