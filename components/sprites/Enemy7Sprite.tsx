import React from 'react';
import { View, StyleSheet } from 'react-native';

const PALETTE = {
  silver: '#C0C0C0',
  gray: '#808080',
  red: '#FF0000',
  yellow: '#FFFF00',
};

const SIZE = 24;

/**
 * Enemy 7: Mechanical drone - gears, antenna, LED eyes.
 */
export function Enemy7Sprite({ x, y }: { x: number; y: number }) {
  return (
    <View
      style={[styles.container, { left: x - SIZE / 2, top: y - SIZE / 2 }]}
      pointerEvents="none"
    >
      <View style={styles.body} />
      <View style={styles.antenna} />
      <View style={[styles.led, styles.ledLeft]} />
      <View style={[styles.led, styles.ledRight]} />
      <View style={styles.gear} />
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
    height: 16,
    backgroundColor: PALETTE.silver,
    borderWidth: 2,
    borderColor: PALETTE.gray,
    borderRadius: 4,
  },
  antenna: {
    position: 'absolute',
    width: 2,
    height: 8,
    backgroundColor: PALETTE.gray,
    top: -4,
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
  },
  led: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: PALETTE.red,
    borderWidth: 1,
    borderColor: PALETTE.yellow,
    top: 3,
  },
  ledLeft: { left: 3 },
  ledRight: { right: 3 },
  gear: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderWidth: 2,
    borderColor: PALETTE.gray,
    borderRadius: 5,
    bottom: 2,
    backgroundColor: PALETTE.silver,
  },
  mouth: {
    position: 'absolute',
    bottom: 4,
    width: 8,
    height: 2,
    backgroundColor: PALETTE.gray,
    borderRadius: 1,
  },
});
