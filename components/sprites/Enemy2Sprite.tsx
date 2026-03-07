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
 * Enemy type 2 sprite: squid-like creature with tentacles and big eyes.
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
      <View style={styles.body} />
      <View style={[styles.tentacle, styles.tentacleLeft]} />
      <View style={[styles.tentacle, styles.tentacleRight]} />
      <View style={[styles.eye, styles.eyeLeft]}>
        <View style={styles.pupil} />
      </View>
      <View style={[styles.eye, styles.eyeRight]}>
        <View style={styles.pupil} />
      </View>
      <View style={styles.mouth} />
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
    width: 18,
    height: 16,
    backgroundColor: PALETTE.magenta,
    borderWidth: 2,
    borderColor: PALETTE.purple,
    borderRadius: 10,
  },
  tentacle: {
    position: 'absolute',
    width: 3,
    height: 8,
    backgroundColor: PALETTE.purple,
    borderWidth: 1,
    borderColor: PALETTE.cyan,
    bottom: -4,
    borderRadius: 2,
  },
  tentacleLeft: { left: 6 },
  tentacleRight: { right: 6 },
  eye: {
    position: 'absolute',
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: PALETTE.white,
    borderWidth: 1,
    borderColor: PALETTE.purple,
    top: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyeLeft: { left: 3 },
  eyeRight: { right: 3 },
  pupil: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: PALETTE.purple,
  },
  mouth: {
    position: 'absolute',
    bottom: 4,
    width: 6,
    height: 2,
    backgroundColor: PALETTE.purple,
    borderRadius: 1,
  },
});
