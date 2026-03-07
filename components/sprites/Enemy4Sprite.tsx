import React from 'react';
import { View, StyleSheet } from 'react-native';

// Retro EGA palette
const PALETTE = {
  magenta: '#FF00FF',
  purple: '#800080',
  white: '#FFFFFF',
};

const SIZE = 24;

/**
 * Enemy type 4 sprite: lightweight, 1 HP.
 * Small triangle/diamond, magenta accents.
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
    width: 16,
    height: 16,
    backgroundColor: PALETTE.magenta,
    borderWidth: 1,
    borderColor: PALETTE.purple,
    transform: [{ rotate: '45deg' }],
  },
});
