import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useGame } from '../context/GameContext';

const GUN_SIZE = 24;
const MISSILE_SIZE = 8;
const MISSILE_SPEED = 6;

export default function Level1Screen() {
  const router = useRouter();
  const { setHighScore } = useGame();

  const [dimensions, setDimensions] = useState(() => Dimensions.get('window'));
  const [gun, setGun] = useState<{ x: number; y: number; rotation: number } | null>(null);
  const [missile, setMissile] = useState<{ x: number; y: number; visible: boolean } | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const { width, height } = dimensions;
    const padding = GUN_SIZE + 20;
    const x = padding + Math.random() * (width - padding * 2);
    const y = padding + 100 + Math.random() * (height - 200 - padding * 2);
    const rotation = Math.floor(Math.random() * 360);
    setGun({ x, y, rotation });

    const rad = (rotation * Math.PI) / 180;
    const dx = Math.sin(rad) * MISSILE_SPEED;
    const dy = -Math.cos(rad) * MISSILE_SPEED;

    setMissile({ x, y, visible: true });

    let mx = x;
    let my = y;

    const tick = () => {
      mx += dx;
      my += dy;
      if (mx < -50 || mx > width + 50 || my < -50 || my > height + 50) {
        setMissile((m) => m && { ...m, visible: false });
        return;
      }
      setMissile({ x: mx, y: my, visible: true });
      animationRef.current = requestAnimationFrame(tick);
    };
    animationRef.current = requestAnimationFrame(tick);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const handleEndGame = (score: number) => {
    setHighScore((prev) => Math.max(prev, score));
    router.back();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => handleEndGame(0)}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Text style={styles.closeIcon}>✕</Text>
      </TouchableOpacity>

      <View style={[styles.gameArea, { width: dimensions.width, height: dimensions.height }]}>
        {gun && (
          <View
            style={[
              styles.gun,
              {
                left: gun.x - GUN_SIZE / 2,
                top: gun.y - GUN_SIZE / 2,
                transform: [{ rotate: `${gun.rotation}deg` }],
              },
            ]}
          />
        )}
        {missile?.visible && (
          <View
            style={[
              styles.missile,
              {
                left: missile.x - MISSILE_SIZE / 2,
                top: missile.y - MISSILE_SIZE / 2,
              },
            ]}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    paddingTop: 50,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 24,
    zIndex: 10,
    padding: 4,
  },
  closeIcon: {
    fontSize: 24,
    color: '#888',
    fontWeight: '300',
  },
  gameArea: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  gun: {
    position: 'absolute',
    width: GUN_SIZE,
    height: GUN_SIZE,
    borderLeftWidth: GUN_SIZE / 2,
    borderRightWidth: GUN_SIZE / 2,
    borderBottomWidth: GUN_SIZE,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#4ade80',
  },
  missile: {
    position: 'absolute',
    width: MISSILE_SIZE,
    height: MISSILE_SIZE,
    borderRadius: MISSILE_SIZE / 2,
    backgroundColor: '#fbbf24',
  },
});
