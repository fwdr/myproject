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

export type PowerupTypeId = 'dual' | 'big' | 'spread';

export type PowerupConfig = {
  type: PowerupTypeId;
  spawnChance: number;
  spawnIntervalMs: number;
  durationMs: number;
};

export type LevelConfig = {
  id: string;
  waves: WaveSpawn[][];
  waveTimeoutMs?: number;
  staticObstacles?: StaticObstacle[];
  tunnel?: TunnelType;
  spawnOrigin?: SpawnOriginType;
  powerups?: PowerupConfig;
};

export const LEVEL_1: LevelConfig = {
  id: 'level1',
  tunnel: 'none',
  waveTimeoutMs: 7000,
  waves: [
    [{ enemyType: 'type1', count: 1 }],
    [{ enemyType: 'type1', count: 1 }],
    [{ enemyType: 'type1', count: 1 }],
    [{ enemyType: 'type1', count: 1 }],
    [{ enemyType: 'type1', count: 1 }],
  ],
};
