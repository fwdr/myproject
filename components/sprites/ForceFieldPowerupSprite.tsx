import React from 'react';
import { View, StyleSheet } from 'react-native';

const PALETTE = {
  silver: '#C0C0C0',
  white: '#E8E8E8',
  blue: '#00BFFF',
  dark: '#4682B4',
};

const SIZE = 24;

/**
 * Force-field powerup: dome/bubble icon (silver + steel blue, distinct from other powerups).
 */
export function ForceFieldPowerupSprite({ x, y }: { x: number; y: number }) {
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
      <View style={styles.dome} />
      <View style={styles.arc} />
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
  dome: {
    width: 20,
    height: 12,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: PALETTE.silver,
    borderWidth: 1.5,
    borderColor: PALETTE.blue,
    borderBottomWidth: 0,
  },
  arc: {
    position: 'absolute',
    bottom: 4,
    width: 14,
    height: 2,
    borderRadius: 1,
    backgroundColor: PALETTE.blue,
  },
});
