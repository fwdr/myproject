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
 * Enemy type 3 sprite: heavy armored tank, bulkier design.
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
      <View style={styles.armorPlate} />
      <View style={[styles.tread, styles.treadLeft]} />
      <View style={[styles.tread, styles.treadRight]} />
      <View style={styles.turret} />
      <View style={styles.barrel} />
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
    width: 22,
    height: 16,
    backgroundColor: PALETTE.olive,
    borderWidth: 2,
    borderColor: PALETTE.yellow,
  },
  armorPlate: {
    position: 'absolute',
    width: 18,
    height: 6,
    top: 4,
    backgroundColor: PALETTE.yellow,
    borderWidth: 1,
    borderColor: PALETTE.olive,
  },
  tread: {
    position: 'absolute',
    width: 5,
    height: 18,
    bottom: 0,
    backgroundColor: PALETTE.olive,
    borderWidth: 1,
    borderColor: PALETTE.yellow,
    borderRadius: 2,
  },
  treadLeft: { left: 1 },
  treadRight: { right: 1 },
  turret: {
    position: 'absolute',
    width: 14,
    height: 12,
    top: -2,
    backgroundColor: PALETTE.olive,
    borderWidth: 2,
    borderColor: PALETTE.yellow,
  },
  barrel: {
    position: 'absolute',
    width: 6,
    height: 8,
    top: -7,
    backgroundColor: PALETTE.yellow,
    borderWidth: 1,
    borderColor: PALETTE.olive,
  },
});
