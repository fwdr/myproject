import type { EnemyTypeId } from '../enemyTypes';

/** scattered = each enemy from different random edge; grouped = all in wave from same point */
export type SpawnOriginType = 'scattered' | 'grouped';

export type WaveSpawn = {
  enemyType: EnemyTypeId;
  count: number;
  spawnDelayMs?: number;
  spawnOrigin?: SpawnOriginType;
};

export type StaticObstacle = { x: number; y: number }; // fractional 0-1
export type TunnelType = 'none' | 'horizontal' | 'vertical';

export type LevelConfig = {
  id: string;
  waves: WaveSpawn[][];
  staticObstacles?: StaticObstacle[];
  tunnel?: TunnelType;
  spawnOrigin?: SpawnOriginType;
};

export const LEVEL_1: LevelConfig = {
  id: 'level1',
  tunnel: 'none',
  waves: [
    [{ enemyType: 'type1', count: 1 }],
  ],
};
