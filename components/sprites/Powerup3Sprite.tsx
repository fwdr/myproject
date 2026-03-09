import React from 'react';
import { View, StyleSheet } from 'react-native';

const PALETTE = {
  cyan: '#00FFFF',
  blue: '#0080FF',
  yellow: '#FFFF00',
  white: '#FFFFFF',
};

const SIZE = 22;

/**
 * Powerup3 sprite: spread missile pickup (3-way shot at 45°, 0°, -45°).
 * Triple-arrow / fan shape, cyan/blue.
 */
export function Powerup3Sprite({ x, y }: { x: number; y: number }) {
  return (
    <View
      style={[
        styles.container,
        {
          left: x - SIZE / 2,
          top: y - SIZE / 2,
        },
      ]}
      pointerEvents="none"
    >
      <View style={styles.core} />
      <View style={[styles.ray, styles.rayCenter]} />
      <View style={[styles.ray, styles.rayLeft]} />
      <View style={[styles.ray, styles.rayRight]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  core: {
    width: 10,
    height: 10,
    backgroundColor: PALETTE.cyan,
    borderWidth: 2,
    borderColor: PALETTE.blue,
    transform: [{ rotate: '45deg' }],
  },
  ray: {
    position: 'absolute',
    width: 4,
    height: 12,
    backgroundColor: PALETTE.cyan,
    borderWidth: 1,
    borderColor: PALETTE.yellow,
  },
  rayCenter: { top: -2 },
  rayLeft: { top: 2, left: -4, transform: [{ rotate: '-45deg' }] },
  rayRight: { top: 2, right: -4, transform: [{ rotate: '45deg' }] },
});
