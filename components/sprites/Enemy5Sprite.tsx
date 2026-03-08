import React from 'react';
import { View, StyleSheet } from 'react-native';

const PALETTE = {
  cyan: '#00FFFF',
  teal: '#008080',
  white: '#FFFFFF',
};

const SIZE = 24;

/**
 * Enemy 5: Crystalline entity - geometric facets, floating shard.
 */
export function Enemy5Sprite({ x, y }: { x: number; y: number }) {
  return (
    <View
      style={[styles.container, { left: x - SIZE / 2, top: y - SIZE / 2 }]}
      pointerEvents="none"
    >
      <View style={styles.core} />
      <View style={[styles.facet, styles.facet1]} />
      <View style={[styles.facet, styles.facet2]} />
      <View style={[styles.facet, styles.facet3]} />
      <View style={styles.gleam} />
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
  core: {
    width: 16,
    height: 16,
    backgroundColor: PALETTE.cyan,
    borderWidth: 2,
    borderColor: PALETTE.teal,
    transform: [{ rotate: '45deg' }],
  },
  facet: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderTopWidth: 0,
    borderBottomWidth: 6,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopColor: 'transparent',
    borderBottomColor: PALETTE.teal,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  facet1: { top: -3, transform: [{ rotate: '0deg' }] },
  facet2: { left: -8, top: 6, transform: [{ rotate: '90deg' }] },
  facet3: { right: -8, left: undefined, top: 6, transform: [{ rotate: '-90deg' }] },
  gleam: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: PALETTE.white,
    transform: [{ rotate: '45deg' }],
    top: 4,
  },
});
