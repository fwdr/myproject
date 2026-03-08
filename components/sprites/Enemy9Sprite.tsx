import React from 'react';
import { View, StyleSheet } from 'react-native';

const PALETTE = {
  navy: '#000080',
  blue: '#0000FF',
  magenta: '#FF00FF',
  white: '#FFFFFF',
};

const SIZE = 24;

/**
 * Enemy 9: Eldritch horror - many eyes, writhing tendrils.
 */
export function Enemy9Sprite({ x, y }: { x: number; y: number }) {
  return (
    <View
      style={[styles.container, { left: x - SIZE / 2, top: y - SIZE / 2 }]}
      pointerEvents="none"
    >
      <View style={styles.core} />
      <View style={[styles.tendril, styles.tendril1]} />
      <View style={[styles.tendril, styles.tendril2]} />
      <View style={[styles.tendril, styles.tendril3]} />
      <View style={[styles.tendril, styles.tendril4]} />
      <View style={[styles.eye, styles.eye1]} />
      <View style={[styles.eye, styles.eye2]} />
      <View style={[styles.eye, styles.eye3]} />
      <View style={[styles.eye, styles.eye4]} />
      <View style={[styles.eye, styles.eyeCenter]} />
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
    backgroundColor: PALETTE.navy,
    borderWidth: 2,
    borderColor: PALETTE.magenta,
    borderRadius: 8,
  },
  tendril: {
    position: 'absolute',
    width: 2,
    height: 6,
    backgroundColor: PALETTE.magenta,
    borderRadius: 1,
  },
  tendril1: { top: -2, left: 8, transform: [{ rotate: '-10deg' }] },
  tendril2: { top: 4, left: -2, transform: [{ rotate: '70deg' }] },
  tendril3: { top: 4, right: -2, transform: [{ rotate: '-70deg' }] },
  tendril4: { bottom: -2, left: 10, transform: [{ rotate: '10deg' }] },
  eye: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: PALETTE.white,
    borderWidth: 1,
    borderColor: PALETTE.blue,
  },
  eye1: { top: 2, left: 4 },
  eye2: { top: 2, right: 4 },
  eye3: { bottom: 4, left: 2 },
  eye4: { bottom: 4, right: 2 },
  eyeCenter: {
    width: 6,
    height: 6,
    borderRadius: 3,
    top: 8,
  },
});
