import type { ComponentType } from 'react';
import { Enemy1Sprite } from '../components/sprites/Enemy1Sprite';
import { Enemy2Sprite } from '../components/sprites/Enemy2Sprite';
import { Enemy3Sprite } from '../components/sprites/Enemy3Sprite';
import { Enemy4Sprite } from '../components/sprites/Enemy4Sprite';
import { Enemy5Sprite } from '../components/sprites/Enemy5Sprite';
import { Enemy6Sprite } from '../components/sprites/Enemy6Sprite';
import { Enemy7Sprite } from '../components/sprites/Enemy7Sprite';
import { Enemy8Sprite } from '../components/sprites/Enemy8Sprite';
import { Enemy9Sprite } from '../components/sprites/Enemy9Sprite';
import { Enemy10Sprite } from '../components/sprites/Enemy10Sprite';

export type EnemyTypeId =
  | 'type1'
  | 'type2'
  | 'type3'
  | 'type4'
  | 'type5'
  | 'type6'
  | 'type7'
  | 'type8'
  | 'type9'
  | 'type10';

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
    health: 5,
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
  type4: {
    id: 'type4',
    health: 1,
    points: 5,
    radius: 10,
    Sprite: Enemy4Sprite,
  },
  type5: {
    id: 'type5',
    health: 4,
    points: 25,
    radius: 12,
    Sprite: Enemy5Sprite,
  },
  type6: {
    id: 'type6',
    health: 6,
    points: 30,
    radius: 12,
    Sprite: Enemy6Sprite,
  },
  type7: {
    id: 'type7',
    health: 5,
    points: 28,
    radius: 12,
    Sprite: Enemy7Sprite,
  },
  type8: {
    id: 'type8',
    health: 4,
    points: 22,
    radius: 12,
    Sprite: Enemy8Sprite,
  },
  type9: {
    id: 'type9',
    health: 8,
    points: 50,
    radius: 12,
    Sprite: Enemy9Sprite,
  },
  type10: {
    id: 'type10',
    health: 3,
    points: 35,
    radius: 12,
    Sprite: Enemy10Sprite,
  },
};

export function getEnemyType(id: EnemyTypeId): EnemyTypeDef {
  return ENEMY_TYPES[id];
}
