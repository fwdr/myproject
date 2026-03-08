import React from 'react';
import { View, StyleSheet } from 'react-native';

const PALETTE = {
  yellow: '#FFFF00',
  olive: '#808000',
  white: '#FFFFFF',
  maroon: '#800000',
};

const SIZE = 24;

/**
 * Enemy 10: Floating pyramid - mysterious geometric entity with eye.
 */
export function Enemy10Sprite({ x, y }: { x: number; y: number }) {
  return (
    <View
      style={[styles.container, { left: x - SIZE / 2, top: y - SIZE / 2 }]}
      pointerEvents="none"
    >
      <View style={styles.pyramid} />
      <View style={styles.base} />
      <View style={styles.eye} />
      <View style={[styles.ring, styles.ring1]} />
      <View style={[styles.ring, styles.ring2]} />
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
  pyramid: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 14,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: PALETTE.yellow,
    position: 'absolute',
    top: 2,
  },
  base: {
    position: 'absolute',
    width: 18,
    height: 4,
    backgroundColor: PALETTE.olive,
    borderWidth: 1,
    borderColor: PALETTE.yellow,
    bottom: 0,
    borderRadius: 2,
  },
  eye: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: PALETTE.white,
    borderWidth: 2,
    borderColor: PALETTE.maroon,
    top: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: PALETTE.olive,
    borderRadius: 20,
  },
  ring1: { width: 22, height: 22, top: 0 },
  ring2: { width: 26, height: 26, top: -2, borderColor: PALETTE.yellow, opacity: 0.6 },
});
