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
 * Enemy type 2 sprite: tank/drone with treads and turret.
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
      <View style={[styles.tread, styles.treadLeft]} />
      <View style={[styles.tread, styles.treadRight]} />
      <View style={styles.turret} />
      <View style={styles.cannon} />
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
    height: 14,
    backgroundColor: PALETTE.magenta,
    borderWidth: 2,
    borderColor: PALETTE.purple,
  },
  tread: {
    position: 'absolute',
    width: 4,
    height: 16,
    backgroundColor: PALETTE.purple,
    borderWidth: 1,
    borderColor: PALETTE.cyan,
    borderRadius: 1,
  },
  treadLeft: {
    left: 2,
  },
  treadRight: {
    right: 2,
  },
  turret: {
    position: 'absolute',
    width: 12,
    height: 10,
    top: 0,
    backgroundColor: PALETTE.purple,
    borderWidth: 1,
    borderColor: PALETTE.cyan,
  },
  cannon: {
    position: 'absolute',
    width: 4,
    height: 6,
    top: -5,
    backgroundColor: PALETTE.cyan,
    borderWidth: 1,
    borderColor: PALETTE.white,
  },
});
