import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  NativeTouchEvent,
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
const MAX_GUN_SPEED = 14;
const DEAD_ZONE = 12; // pixels from center - tap here to stop gun
const GUN_SPEED_SCALE = 0.25; // speed = distance * scale, capped at max
let missileId = 0;

type Gun = { x: number; y: number; rotation: number; vx: number; vy: number };
type Missile = { id: number; x: number; y: number; dx: number; dy: number };

export default function Level1Screen() {
  const router = useRouter();
  const { setHighScore } = useGame();

  const [dimensions, setDimensions] = useState(() => Dimensions.get('window'));
  const [gun, setGun] = useState<Gun | null>(null);
  const [missiles, setMissiles] = useState<Missile[]>([]);
  const gunRef = useRef<Gun | null>(null);
  const missilesRef = useRef<Missile[]>([]);
  const dimensionsRef = useRef(dimensions);
  dimensionsRef.current = dimensions;

  useEffect(() => {
    const { width, height } = dimensions;
    const padding = GUN_SIZE + 20;
    const x = padding + Math.random() * (width - padding * 2);
    const y = padding + 100 + Math.random() * (height - 200 - padding * 2);
    const rotation = Math.floor(Math.random() * 360);
    const g: Gun = { x, y, rotation, vx: 0, vy: 0 };
    setGun(g);
    gunRef.current = g;
  }, []);

  const gameAreaRef = useRef<View>(null);
  const [gameAreaLayout, setGameAreaLayout] = useState({ x: 0, y: 0 });

  const handleTap = useCallback(
    (e: NativeSyntheticEvent<NativeTouchEvent>) => {
      const g = gunRef.current;
      if (!g) return;
      const ne = e.nativeEvent as NativeTouchEvent & { pageX?: number; pageY?: number };
      let tapX: number, tapY: number;
      if (typeof ne.locationX === 'number' && typeof ne.locationY === 'number') {
        tapX = ne.locationX;
        tapY = ne.locationY;
      } else if (typeof ne.pageX === 'number' && typeof ne.pageY === 'number') {
        tapX = ne.pageX - gameAreaLayout.x;
        tapY = ne.pageY - gameAreaLayout.y;
      } else {
        return;
      }
      const dx = tapX - g.x;
      const dy = tapY - g.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      let vx = 0;
      let vy = 0;
      let rotation = g.rotation;

      if (distance < DEAD_ZONE) {
        vx = 0;
        vy = 0;
      } else {
        const speed = Math.min(distance * GUN_SPEED_SCALE, MAX_GUN_SPEED);
        const invD = 1 / distance;
        vx = speed * dx * invD;
        vy = speed * dy * invD;
        rotation = (Math.atan2(dx, -dy) * 180) / Math.PI;
      }

      const next: Gun = { ...g, rotation, vx, vy };
      gunRef.current = next;
      setGun(next);

      // Fire missile in new direction
      const rad = (rotation * Math.PI) / 180;
      const mdx = Math.sin(rad) * MISSILE_SPEED;
      const mdy = -Math.cos(rad) * MISSILE_SPEED;
      const m: Missile = { id: ++missileId, x: g.x, y: g.y, dx: mdx, dy: mdy };
      setMissiles((prev) => {
        const nextM = [...prev, m];
        missilesRef.current = nextM;
        return nextM;
      });
    },
    [gameAreaLayout.x, gameAreaLayout.y]
  );

  useEffect(() => {
    let rafId: number;
    const tick = () => {
      const { width, height } = dimensionsRef.current;
      const g = gunRef.current;
      if (g && (g.vx !== 0 || g.vy !== 0)) {
        let x = g.x + g.vx;
        let y = g.y + g.vy;
        x = Math.max(GUN_SIZE / 2, Math.min(width - GUN_SIZE / 2, x));
        y = Math.max(GUN_SIZE / 2, Math.min(height - GUN_SIZE / 2, y));
        const next: Gun = { ...g, x, y };
        gunRef.current = next;
        setGun(next);
      }
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
        ref={gameAreaRef}
        style={[
          styles.gameArea,
          { width: dimensions.width, height: dimensions.height },
        ]}
        onPress={handleTap}
        onLayout={(e) => {
          const { layout } = e.nativeEvent;
          setGameAreaLayout({ x: layout.x, y: layout.y });
        }}
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
