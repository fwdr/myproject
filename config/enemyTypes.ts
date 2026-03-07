import type { ComponentType } from 'react';
import { Enemy1Sprite } from '../components/sprites/Enemy1Sprite';
import { Enemy2Sprite } from '../components/sprites/Enemy2Sprite';
import { Enemy3Sprite } from '../components/sprites/Enemy3Sprite';

export type EnemyTypeId = 'type1' | 'type2' | 'type3';

export type EnemyTypeDef = {
  id: EnemyTypeId;
  health: number;
  points: number;
  radius: number;
  Sprite: ComponentType<{ x: number; y: number }>;
};

export const ENEMY_TYPES: Record<EnemyTypeId, EnemyTypeDef> = {
  type1: {
    id: 'type1',
    health: 3,
    points: 10,
    radius: 12,
    Sprite: Enemy1Sprite,
  },
  type2: {
    id: 'type2',
    health: 3,
    points: 15,
    radius: 12,
    Sprite: Enemy2Sprite,
  },
  type3: {
    id: 'type3',
    health: 5,
    points: 20,
    radius: 12,
    Sprite: Enemy3Sprite,
  },
};

export function getEnemyType(id: EnemyTypeId): EnemyTypeDef {
  return ENEMY_TYPES[id];
}
