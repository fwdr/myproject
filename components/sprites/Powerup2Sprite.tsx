import React from 'react';
import { View, StyleSheet } from 'react-native';

const PALETTE = {
  magenta: '#FF00FF',
  red: '#FF0000',
  yellow: '#FFFF00',
  white: '#FFFFFF',
};

const SIZE = 24;

/**
 * Powerup2 sprite: big missile pickup.
 * Diamond shape with sharp corners, magenta/red.
 */
export function Powerup2Sprite({ x, y }: { x: number; y: number }) {
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
      <View style={[styles.corner, styles.cornerTop]} />
      <View style={[styles.corner, styles.cornerBottom]} />
      <View style={[styles.corner, styles.cornerLeft]} />
      <View style={[styles.corner, styles.cornerRight]} />
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
    width: 14,
    height: 14,
    backgroundColor: PALETTE.magenta,
    borderWidth: 2,
    borderColor: PALETTE.red,
    transform: [{ rotate: '45deg' }],
  },
  corner: {
    position: 'absolute',
    width: 8,
    height: 8,
    backgroundColor: PALETTE.red,
    borderWidth: 1,
    borderColor: PALETTE.yellow,
    transform: [{ rotate: '45deg' }],
  },
  cornerTop: { top: -3 },
  cornerBottom: { bottom: -3 },
  cornerLeft: { left: -3 },
  cornerRight: { right: -3 },
});
