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
 * Enemy type 2 sprite: a retro hexagonal/tank-like enemy.
 * Hexagon body, cyan accents, EGA style.
 */
export function Enemy2Sprite({ x, y }: { x: number; y: number }) {
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
      {/* Body - hexagon via rotated square with clipped corners */}
      <View style={styles.body} />
      {/* Core / turret */}
      <View style={styles.core} />
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
    width: 22,
    height: 22,
    backgroundColor: PALETTE.magenta,
    borderWidth: 2,
    borderColor: PALETTE.purple,
    transform: [{ rotate: '45deg' }],
  },
  core: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: PALETTE.cyan,
    borderWidth: 1,
    borderColor: PALETTE.white,
  },
});
