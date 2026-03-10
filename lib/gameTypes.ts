import type { EnemyTypeId } from '../config/enemyTypes';
import type { PowerupTypeId } from '../config/levels/level1';

export type Gun = { x: number; y: number; rotation: number; vx: number; vy: number };
export type Missile = {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  damage?: number;
  hitRadius?: number;
  size?: number;
  spawnX?: number;
  spawnY?: number;
};
export type Enemy = {
  id: number;
  typeId: EnemyTypeId;
  x: number;
  y: number;
  health: number;
  spawnTime?: number;
  lastDamageAt?: number;
};
export type Powerup = { id: number; x: number; y: number; typeId: PowerupTypeId; spawnTime?: number };
