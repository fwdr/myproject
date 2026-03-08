import React from 'react';
import { View, StyleSheet } from 'react-native';

const PALETTE = {
  lime: '#00FF00',
  green: '#008000',
  white: '#FFFFFF',
  yellow: '#FFFF00',
};

const SIZE = 24;

/**
 * Enemy 6: Blob - amoeba with one giant eye and pseudopods.
 */
export function Enemy6Sprite({ x, y }: { x: number; y: number }) {
  return (
    <View
      style={[styles.container, { left: x - SIZE / 2, top: y - SIZE / 2 }]}
      pointerEvents="none"
    >
      <View style={styles.body} />
      <View style={[styles.pseudopod, styles.pod1]} />
      <View style={[styles.pseudopod, styles.pod2]} />
      <View style={[styles.pseudopod, styles.pod3]} />
      <View style={styles.eye}>
        <View style={styles.pupil} />
      </View>
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
    backgroundColor: PALETTE.lime,
    borderWidth: 2,
    borderColor: PALETTE.green,
    borderRadius: 12,
  },
  pseudopod: {
    position: 'absolute',
    width: 6,
    height: 8,
    backgroundColor: PALETTE.green,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: PALETTE.lime,
  },
  pod1: { bottom: -2, left: 2, transform: [{ rotate: '-30deg' }] },
  pod2: { bottom: -3, right: 2, transform: [{ rotate: '20deg' }] },
  pod3: { top: -2, right: 6, width: 5, height: 6, transform: [{ rotate: '-60deg' }] },
  eye: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: PALETTE.white,
    borderWidth: 2,
    borderColor: PALETTE.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pupil: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: PALETTE.yellow,
  },
});
