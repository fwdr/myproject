import React from 'react';
import { View, StyleSheet } from 'react-native';

// Retro EGA palette
const PALETTE = {
  lime: '#00FF00',
  green: '#008000',
  yellow: '#FFFF00',
  white: '#FFFFFF',
};

const SIZE = 20;

/**
 * Powerup sprite: dual-missile pickup.
 * Star/diamond shape, lime green.
 */
export function PowerupSprite({ x, y }: { x: number; y: number }) {
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
      <View style={[styles.point, styles.pointTop]} />
      <View style={[styles.point, styles.pointBottom]} />
      <View style={[styles.point, styles.pointLeft]} />
      <View style={[styles.point, styles.pointRight]} />
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
    width: 12,
    height: 12,
    backgroundColor: PALETTE.lime,
    borderWidth: 2,
    borderColor: PALETTE.yellow,
    transform: [{ rotate: '45deg' }],
  },
  point: {
    position: 'absolute',
    width: 6,
    height: 6,
    backgroundColor: PALETTE.yellow,
    borderWidth: 1,
    borderColor: PALETTE.lime,
    transform: [{ rotate: '45deg' }],
  },
  pointTop: { top: -2 },
  pointBottom: { bottom: -2 },
  pointLeft: { left: -2 },
  pointRight: { right: -2 },
});
