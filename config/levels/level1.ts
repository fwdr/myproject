import type { EnemyTypeId } from '../enemyTypes';

export type WaveSpawn = {
  enemyType: EnemyTypeId;
  count: number;
};

export type LevelConfig = {
  id: string;
  waves: WaveSpawn[][];
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
