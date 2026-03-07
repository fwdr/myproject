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
 * Enemy type 4 sprite: small bat-like creature, 1 HP.
 * Tiny body, big eyes, wing ears.
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
      <View style={[styles.ear, styles.earLeft]} />
      <View style={[styles.ear, styles.earRight]} />
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
    width: 14,
    height: 14,
    backgroundColor: PALETTE.magenta,
    borderWidth: 1,
    borderColor: PALETTE.purple,
    borderRadius: 8,
  },
  ear: {
    position: 'absolute',
    width: 5,
    height: 8,
    backgroundColor: PALETTE.purple,
    borderWidth: 1,
    borderColor: PALETTE.magenta,
    top: -1,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  earLeft: {
    left: 2,
    transform: [{ rotate: '-25deg' }],
  },
  earRight: {
    right: 2,
    transform: [{ rotate: '25deg' }],
  },
  eye: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: PALETTE.white,
    borderWidth: 1,
    borderColor: PALETTE.purple,
    top: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyeLeft: { left: 3 },
  eyeRight: { right: 3 },
  pupil: {
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: PALETTE.purple,
  },
  mouth: {
    position: 'absolute',
    bottom: 5,
    width: 4,
    height: 1,
    backgroundColor: PALETTE.purple,
    borderRadius: 1,
  },
});
