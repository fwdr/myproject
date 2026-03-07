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
 * Enemy type 1 sprite: bug-like space invader.
 * Diamond body, antennae, big eyes with pupils.
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
      <View style={styles.body} />
      <View style={[styles.antenna, styles.antennaLeft]} />
      <View style={[styles.antenna, styles.antennaRight]} />
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
    height: 18,
    backgroundColor: PALETTE.red,
    borderWidth: 2,
    borderColor: PALETTE.maroon,
    transform: [{ rotate: '45deg' }],
  },
  antenna: {
    position: 'absolute',
    width: 2,
    height: 6,
    backgroundColor: PALETTE.maroon,
    top: -2,
  },
  antennaLeft: {
    left: 6,
    transform: [{ rotate: '-20deg' }],
  },
  antennaRight: {
    right: 6,
    transform: [{ rotate: '20deg' }],
  },
  eye: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: PALETTE.white,
    borderWidth: 1,
    borderColor: PALETTE.maroon,
    top: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyeLeft: { left: 2 },
  eyeRight: { right: 2 },
  pupil: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: PALETTE.maroon,
  },
  mouth: {
    position: 'absolute',
    bottom: 4,
    width: 6,
    height: 2,
    backgroundColor: PALETTE.maroon,
    borderRadius: 1,
  },
});
