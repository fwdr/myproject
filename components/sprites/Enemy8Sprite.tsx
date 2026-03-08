import React from 'react';
import { View, StyleSheet } from 'react-native';

const PALETTE = {
  purple: '#800080',
  magenta: '#FF00FF',
  lime: '#00FF00',
  white: '#FFFFFF',
};

const SIZE = 24;

/**
 * Enemy 8: Fungal creature - spore head, roots, vine tendrils.
 */
export function Enemy8Sprite({ x, y }: { x: number; y: number }) {
  return (
    <View
      style={[styles.container, { left: x - SIZE / 2, top: y - SIZE / 2 }]}
      pointerEvents="none"
    >
      <View style={styles.cap} />
      <View style={styles.stem} />
      <View style={[styles.root, styles.rootLeft]} />
      <View style={[styles.root, styles.rootRight]} />
      <View style={[styles.spore, styles.spore1]} />
      <View style={[styles.spore, styles.spore2]} />
      <View style={styles.eye} />
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
  cap: {
    width: 18,
    height: 10,
    backgroundColor: PALETTE.purple,
    borderWidth: 2,
    borderColor: PALETTE.magenta,
    borderRadius: 12,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    top: 0,
    position: 'absolute',
  },
  stem: {
    position: 'absolute',
    width: 8,
    height: 12,
    backgroundColor: PALETTE.magenta,
    borderWidth: 1,
    borderColor: PALETTE.purple,
    top: 8,
    borderRadius: 2,
  },
  root: {
    position: 'absolute',
    width: 3,
    height: 8,
    backgroundColor: PALETTE.purple,
    bottom: -2,
    borderRadius: 1,
  },
  rootLeft: { left: 6, transform: [{ rotate: '-25deg' }] },
  rootRight: { right: 6, transform: [{ rotate: '25deg' }] },
  spore: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: PALETTE.lime,
    borderWidth: 1,
    borderColor: PALETTE.white,
  },
  spore1: { top: 2, left: 2 },
  spore2: { top: 4, right: 4 },
  eye: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: PALETTE.white,
    borderWidth: 1,
    borderColor: PALETTE.purple,
    top: 4,
  },
});
