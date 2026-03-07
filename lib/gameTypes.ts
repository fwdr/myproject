import type { EnemyTypeId } from '../config/enemyTypes';

export type Gun = { x: number; y: number; rotation: number; vx: number; vy: number };
export type Missile = { id: number; x: number; y: number; dx: number; dy: number };
export type Enemy = { id: number; typeId: EnemyTypeId; x: number; y: number; health: number };
export type Powerup = { id: number; x: number; y: number };
