import React from 'react';
import { View } from 'react-native';
import type { ComponentType } from 'react';
import type { Enemy } from '../lib/gameTypes';

type EnemyWithEffectsProps = {
  enemy: Enemy;
  Sprite: ComponentType<{ x: number; y: number }>;
  radius: number;
};

const SPAWN_DURATION_MS = 220;
const DAMAGE_FLASH_DURATION_MS = 120;

export function EnemyWithEffects({ enemy, Sprite, radius }: EnemyWithEffectsProps) {
  const now = Date.now();
  const spawnProgress = enemy.spawnTime
    ? Math.min(1, (now - enemy.spawnTime) / SPAWN_DURATION_MS)
    : 1;
  const damageElapsed = enemy.lastDamageAt ? now - enemy.lastDamageAt : Infinity;
  const showDamageFlash = damageElapsed < DAMAGE_FLASH_DURATION_MS;
  const damageFlashOpacity = showDamageFlash
    ? Math.max(0, 1 - damageElapsed / DAMAGE_FLASH_DURATION_MS) * 0.7
    : 0;

  const scale = spawnProgress < 1 ? 0.3 + 0.7 * spawnProgress : 1;
  const opacity = spawnProgress < 1 ? spawnProgress : 1;

  const size = radius * 2;

  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: enemy.x - radius,
        top: enemy.y - radius,
        width: size,
        height: size,
        opacity,
        transform: [{ scale }],
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Sprite x={radius} y={radius} />
      {showDamageFlash && (
        <View
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: size,
            height: size,
            borderRadius: radius,
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            opacity: damageFlashOpacity,
            borderWidth: 1,
            borderColor: 'rgba(255, 100, 100, 0.8)',
          }}
        />
      )}
    </View>
  );
}
