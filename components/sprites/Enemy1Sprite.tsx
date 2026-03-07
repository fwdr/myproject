import React from 'react';
import { View, StyleSheet } from 'react-native';

// Retro EGA palette
const PALETTE = {
  red: '#FF0000',
  maroon: '#800000',
  yellow: '#FFFF00',
  white: '#FFFFFF',
};

const SIZE = 24;

/**
 * Enemy type 1 sprite: a retro "blob" / bug-like enemy.
 * Diamond body with eyes, EGA style.
 */
export function Enemy1Sprite({ x, y }: { x: number; y: number }) {
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
      {/* Body - diamond/octagon shape */}
      <View style={styles.body} />
      {/* Eyes */}
      <View style={[styles.eye, styles.eyeLeft]} />
      <View style={[styles.eye, styles.eyeRight]} />
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
    width: 20,
    height: 20,
    backgroundColor: PALETTE.red,
    borderWidth: 2,
    borderColor: PALETTE.maroon,
    transform: [{ rotate: '45deg' }],
  },
  eye: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: PALETTE.white,
    borderWidth: 1,
    borderColor: PALETTE.maroon,
    top: 4,
  },
  eyeLeft: {
    left: 2,
  },
  eyeRight: {
    right: 2,
  },
});
