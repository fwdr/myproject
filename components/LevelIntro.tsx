import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { PALETTE } from '../lib/gameConstants';

type LevelIntroProps = {
  levelNumber: number;
  onComplete?: () => void;
};

const HOLD_MS = 600;
const FADE_MS = 900;

export function LevelIntro({ levelNumber, onComplete }: LevelIntroProps) {
  const opacity = useRef(new Animated.Value(1)).current;
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: FADE_MS,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          setVisible(false);
          onComplete?.();
        }
      });
    }, HOLD_MS);
    return () => clearTimeout(timer);
  }, [opacity, onComplete]);

  if (!visible) return null;

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.container, { opacity }]}
    >
      <View style={styles.badge}>
        <Text style={[styles.text, { fontFamily: 'PressStart2P_400Regular' }]}>
          LEVEL {levelNumber}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 15,
  },
  badge: {
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderWidth: 3,
    borderColor: PALETTE.cyan,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  text: {
    fontSize: 18,
    color: PALETTE.yellow,
    letterSpacing: 3,
  },
});
