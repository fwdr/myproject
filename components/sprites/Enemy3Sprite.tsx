import React from 'react';
import { View, StyleSheet } from 'react-native';

// Retro EGA palette
const PALETTE = {
  yellow: '#FFFF00',
  olive: '#808000',
  white: '#FFFFFF',
};

const SIZE = 24;

/**
 * Enemy type 3 sprite: a retro heavy/tank enemy.
 * Square body, yellow accents, EGA style.
 */
export function Enemy3Sprite({ x, y }: { x: number; y: number }) {
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
      <View style={styles.stripe} />
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
    backgroundColor: PALETTE.olive,
    borderWidth: 2,
    borderColor: PALETTE.yellow,
  },
  stripe: {
    position: 'absolute',
    width: 14,
    height: 4,
    backgroundColor: PALETTE.yellow,
    borderRadius: 2,
  },
});
