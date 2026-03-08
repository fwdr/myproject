import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PALETTE, STATIC_OBSTACLE_RADIUS } from '../lib/gameConstants';

const R = STATIC_OBSTACLE_RADIUS;

const OBSTACLE_VARIANTS = [
  { base: PALETTE.gray, rim: PALETTE.silver, highlight: '#b0b0b0' },
  { base: '#5a4a3a', rim: '#8b7355', highlight: '#c4a574' },
  { base: '#3a4a5a', rim: '#5a7390', highlight: '#7a9ab8' },
  { base: '#4a3a5a', rim: '#735590', highlight: '#9a7ab8' },
  { base: '#3a5a4a', rim: '#559073', highlight: '#7ab89a' },
];

type ObstacleSpriteProps = {
  x: number;
  y: number;
  index: number;
};

export function ObstacleSprite({ x, y, index }: ObstacleSpriteProps) {
  const v = OBSTACLE_VARIANTS[index % OBSTACLE_VARIANTS.length];

  return (
    <View
      pointerEvents="none"
      style={[styles.container, { left: x - R, top: y - R }]}
    >
      <View style={[styles.outer, { backgroundColor: v.base, borderColor: v.rim }]} />
      <View style={[styles.inner, { backgroundColor: v.base }]} />
      <View style={[styles.highlight, { backgroundColor: v.highlight }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outer: {
    position: 'absolute',
    width: R * 2,
    height: R * 2,
    borderRadius: R,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 4,
  },
  inner: {
    position: 'absolute',
    width: R * 1.6,
    height: R * 1.6,
    borderRadius: R * 0.8,
  },
  highlight: {
    position: 'absolute',
    width: R * 0.5,
    height: R * 0.5,
    borderRadius: R * 0.25,
    top: R * 0.25,
    left: R * 0.3,
    opacity: 0.5,
  },
});
