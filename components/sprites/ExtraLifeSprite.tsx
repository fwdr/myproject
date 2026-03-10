import React from 'react';
import { View, StyleSheet } from 'react-native';

const PALETTE = {
  red: '#E53935',
  dark: '#B71C1C',
  highlight: '#FFCDD2',
};

const SIZE = 24;

/**
 * Extra-life powerup: heart/life icon (two lobes + point).
 */
export function ExtraLifeSprite({ x, y }: { x: number; y: number }) {
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
      <View style={styles.heart}>
        <View style={[styles.lobe, styles.lobeLeft]} />
        <View style={[styles.lobe, styles.lobeRight]} />
        <View style={styles.point} />
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
  heart: {
    width: 20,
    height: 18,
    position: 'relative',
  },
  lobe: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: PALETTE.red,
    borderWidth: 1.5,
    borderColor: PALETTE.dark,
  },
  lobeLeft: {
    left: -1,
    top: 0,
  },
  lobeRight: {
    right: -1,
    top: 0,
  },
  point: {
    position: 'absolute',
    left: 6,
    top: 8,
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: PALETTE.red,
  },
});
