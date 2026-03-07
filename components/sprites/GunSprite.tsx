import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GUN_SIZE, PALETTE } from '../../lib/gameConstants';

/**
 * Spaceship-shaped gun sprite. Points upward (rotation applied by parent).
 */
export function GunSprite() {
  return (
    <View style={styles.container} pointerEvents="none">
      <View style={styles.fuselage} />
      <View style={[styles.wing, styles.wingLeft]} />
      <View style={[styles.wing, styles.wingRight]} />
      <View style={styles.nose} />
      <View style={styles.cockpit} />
      <View style={styles.engine} />
    </View>
  );
}

const s = GUN_SIZE;
const half = s / 2;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: s,
    height: s,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fuselage: {
    position: 'absolute',
    left: (s - 6) / 2,
    width: 6,
    height: s - 4,
    backgroundColor: PALETTE.lime,
    borderWidth: 1,
    borderColor: PALETTE.yellow,
    top: 2,
  },
  wing: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderTopWidth: 0,
    borderBottomWidth: 8,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopColor: 'transparent',
    borderBottomColor: PALETTE.lime,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  wingLeft: {
    left: half - 12,
    top: half - 2,
    transform: [{ rotate: '-25deg' }],
  },
  wingRight: {
    left: half,
    top: half - 2,
    transform: [{ rotate: '25deg' }],
  },
  nose: {
    position: 'absolute',
    left: (s - 10) / 2,
    width: 0,
    height: 0,
    borderTopWidth: 0,
    borderBottomWidth: 8,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopColor: 'transparent',
    borderBottomColor: PALETTE.yellow,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    top: 0,
  },
  cockpit: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: PALETTE.cyan,
    borderWidth: 1,
    borderColor: PALETTE.white,
    top: half - 6,
  },
  engine: {
    position: 'absolute',
    left: (s - 4) / 2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: PALETTE.yellow,
    bottom: 2,
  },
});
