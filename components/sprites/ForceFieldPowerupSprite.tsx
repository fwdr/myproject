import React from 'react';
import { View, StyleSheet } from 'react-native';

const PALETTE = {
  cyan: '#00FFFF',
  blue: '#0080FF',
  white: '#FFFFFF',
  dark: '#004466',
};

const SIZE = 24;

/**
 * Force-field powerup: shield/bubble icon.
 */
export function ForceFieldPowerupSprite({ x, y }: { x: number; y: number }) {
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
      <View style={styles.outer} />
      <View style={styles.mid} />
      <View style={styles.inner} />
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
  outer: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: PALETTE.cyan,
    backgroundColor: 'transparent',
  },
  mid: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: PALETTE.blue,
    backgroundColor: 'rgba(0, 255, 255, 0.15)',
  },
  inner: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(0, 255, 255, 0.25)',
  },
});
