import React from 'react';
import { View, StyleSheet } from 'react-native';

// Retro EGA palette
const PALETTE = {
  magenta: '#FF00FF',
  purple: '#800080',
  cyan: '#00FFFF',
  white: '#FFFFFF',
};

const SIZE = 24;

/**
 * Enemy type 4 sprite: lightweight scout/drone, 1 HP.
 * Small angular shape with sensor eye.
 */
export function Enemy4Sprite({ x, y }: { x: number; y: number }) {
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
      <View style={styles.body} />
      <View style={styles.sensor} />
      <View style={[styles.wing, styles.wingLeft]} />
      <View style={[styles.wing, styles.wingRight]} />
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
  body: {
    width: 14,
    height: 14,
    backgroundColor: PALETTE.magenta,
    borderWidth: 1,
    borderColor: PALETTE.purple,
    transform: [{ rotate: '45deg' }],
  },
  sensor: {
    position: 'absolute',
    width: 4,
    height: 4,
    top: 2,
    borderRadius: 2,
    backgroundColor: PALETTE.cyan,
    borderWidth: 1,
    borderColor: PALETTE.white,
  },
  wing: {
    position: 'absolute',
    width: 6,
    height: 3,
    backgroundColor: PALETTE.purple,
    borderWidth: 1,
    borderColor: PALETTE.magenta,
  },
  wingLeft: {
    left: 2,
    bottom: 6,
    transform: [{ rotate: '-25deg' }],
  },
  wingRight: {
    right: 2,
    bottom: 6,
    transform: [{ rotate: '25deg' }],
  },
});
