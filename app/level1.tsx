import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useGame } from '../context/GameContext';

// Retro 16-color EGA palette
const PALETTE = {
  black: '#000000',
  navy: '#000080',
  green: '#008000',
  teal: '#008080',
  maroon: '#800000',
  purple: '#800080',
  olive: '#808000',
  silver: '#C0C0C0',
  gray: '#808080',
  blue: '#0000FF',
  lime: '#00FF00',
  cyan: '#00FFFF',
  red: '#FF0000',
  magenta: '#FF00FF',
  yellow: '#FFFF00',
  white: '#FFFFFF',
};

const GUN_SIZE = 24;
const MISSILE_SIZE = 4;
const MISSILE_SPEED = 8;
let missileId = 0;

type Missile = { id: number; x: number; y: number; dx: number; dy: number };

export default function Level1Screen() {
  const router = useRouter();
  const { setHighScore } = useGame();

  const [dimensions, setDimensions] = useState(() => Dimensions.get('window'));
  const [gun, setGun] = useState<{ x: number; y: number; rotation: number } | null>(null);
  const [missiles, setMissiles] = useState<Missile[]>([]);
  const missilesRef = useRef<Missile[]>([]);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const { width, height } = dimensions;
    const padding = GUN_SIZE + 20;
    const x = padding + Math.random() * (width - padding * 2);
    const y = padding + 100 + Math.random() * (height - 200 - padding * 2);
    const rotation = Math.floor(Math.random() * 360);
    setGun({ x, y, rotation });
  }, []);

  const dimensionsRef = useRef(dimensions);
  dimensionsRef.current = dimensions;

  const fire = useCallback(() => {
    if (!gun) return;
    const rad = (gun.rotation * Math.PI) / 180;
    const dx = Math.sin(rad) * MISSILE_SPEED;
    const dy = -Math.cos(rad) * MISSILE_SPEED;
    const m: Missile = {
      id: ++missileId,
      x: gun.x,
      y: gun.y,
      dx,
      dy,
    };
    setMissiles((prev) => {
      const next = [...prev, m];
      missilesRef.current = next;
      return next;
    });
  }, [gun]);

  useEffect(() => {
    let rafId: number;
    const tick = () => {
      const { width, height } = dimensionsRef.current;
      setMissiles((prev) => {
        if (prev.length === 0) return prev;
        const next = prev
          .map((m) => ({ ...m, x: m.x + m.dx, y: m.y + m.dy }))
          .filter(
            (m) =>
              m.x >= -20 &&
              m.x <= width + 20 &&
              m.y >= -20 &&
              m.y <= height + 20
          );
        missilesRef.current = next;
        return next;
      });
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const handleEndGame = (score: number) => {
    setHighScore((prev) => Math.max(prev, score));
    router.replace('/home');
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

      <Pressable
        style={[styles.gameArea, { width: dimensions.width, height: dimensions.height }]}
        onPress={fire}
      >
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
        {missiles.map((m) => (
          <View
            key={m.id}
            style={[
              styles.missile,
              {
                left: m.x - MISSILE_SIZE / 2,
                top: m.y - MISSILE_SIZE / 2,
              },
            ]}
          />
        ))}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PALETTE.navy,
    paddingTop: 50,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    left: 24,
    zIndex: 10,
    padding: 4,
  },
  closeIcon: {
    fontSize: 24,
    color: PALETTE.silver,
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
    borderBottomColor: PALETTE.lime,
  },
  missile: {
    position: 'absolute',
    width: MISSILE_SIZE,
    height: MISSILE_SIZE,
    borderRadius: MISSILE_SIZE / 2,
    backgroundColor: PALETTE.yellow,
  },
});
