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
 * Enemy type 3 sprite: heavy armored creature - bulky, horned, big eyes.
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
      <View style={[styles.horn, styles.hornLeft]} />
      <View style={[styles.horn, styles.hornRight]} />
      <View style={[styles.eye, styles.eyeLeft]}>
        <View style={styles.pupil} />
      </View>
      <View style={[styles.eye, styles.eyeRight]}>
        <View style={styles.pupil} />
      </View>
      <View style={styles.brow} />
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
    width: 20,
    height: 18,
    backgroundColor: PALETTE.olive,
    borderWidth: 2,
    borderColor: PALETTE.yellow,
    borderRadius: 8,
  },
  horn: {
    position: 'absolute',
    width: 4,
    height: 8,
    backgroundColor: PALETTE.yellow,
    borderWidth: 1,
    borderColor: PALETTE.olive,
    top: -2,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  hornLeft: {
    left: 4,
    transform: [{ rotate: '-15deg' }],
  },
  hornRight: {
    right: 4,
    transform: [{ rotate: '15deg' }],
  },
  eye: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: PALETTE.white,
    borderWidth: 1,
    borderColor: PALETTE.olive,
    top: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyeLeft: { left: 3 },
  eyeRight: { right: 3 },
  pupil: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: PALETTE.olive,
  },
  brow: {
    position: 'absolute',
    width: 14,
    height: 2,
    top: 1,
    backgroundColor: PALETTE.olive,
    borderRadius: 1,
  },
  mouth: {
    position: 'absolute',
    bottom: 4,
    width: 8,
    height: 3,
    backgroundColor: PALETTE.olive,
    borderRadius: 1,
  },
});
