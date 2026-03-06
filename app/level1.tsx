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
const GUN_SPEED = 3; // steady speed, slower than missiles
const BRICK_W = 20;
const BRICK_H = 10;
const MORTAR = 1;
const MENU_BAR_HEIGHT = 48;
const GAP_HEIGHT = GUN_SIZE * 2; // tunnel opening - 2x gun size, centered halfway down
let missileId = 0;

type Gun = { x: number; y: number; rotation: number; vx: number; vy: number };
type Missile = { id: number; x: number; y: number; dx: number; dy: number };

function BrickWall({ width, height }: { width: number; height: number }) {
  const topN = Math.ceil(width / BRICK_W) + 2;
  const sideHeight = height - BRICK_H * 2;
  const sideN = Math.ceil(sideHeight / BRICK_H);
  const numBricksInGap = Math.ceil(GAP_HEIGHT / BRICK_H);
  const gapStartBrick = Math.floor((sideN - numBricksInGap) / 2);
  const gapEndBrick = gapStartBrick + numBricksInGap - 1;
  const inGap = (i: number) => i >= gapStartBrick && i <= gapEndBrick;

  const brickHoriz = (key: string, offset?: number) => (
    <View
      key={key}
      style={[
        styles.brickHorizontal,
        offset !== undefined && { marginLeft: offset },
      ]}
    />
  );

  const brickVert = (key: string) => (
    <View key={key} style={styles.brick} />
  );

  return (
    <>
      <View style={[styles.brickStrip, styles.brickTop, { width }]}>
        {Array.from({ length: topN }).map((_, i) =>
          brickHoriz(`t-${i}`, i % 2 === 1 ? BRICK_W / 2 : 0)
        )}
      </View>
      <View style={[styles.brickStrip, styles.brickBottom, { width }]}>
        {Array.from({ length: topN }).map((_, i) =>
          brickHoriz(`b-${i}`, i % 2 === 0 ? BRICK_W / 2 : 0)
        )}
      </View>
      <View style={[styles.brickStripCol, styles.brickLeft, { height: sideHeight }]}>
        {Array.from({ length: sideN }).map((_, i) =>
          inGap(i) ? null : brickVert(`l-${i}`)
        )}
      </View>
      <View style={[styles.brickStripCol, styles.brickRight, { height: sideHeight }]}>
        {Array.from({ length: sideN }).map((_, i) =>
          inGap(i) ? null : brickVert(`r-${i}`)
        )}
      </View>
    </>
  );
}

export default function Level1Screen() {
  const router = useRouter();
  const { setHighScore } = useGame();

  const [dimensions, setDimensions] = useState(() => Dimensions.get('window'));
  const playAreaHeight = dimensions.height - MENU_BAR_HEIGHT;
  const innerWidth = dimensions.width - 2 * BRICK_W;
  const innerHeight = playAreaHeight - 2 * BRICK_H;
  const [gun, setGun] = useState<Gun | null>(null);
  const [missiles, setMissiles] = useState<Missile[]>([]);
  const gunRef = useRef<Gun | null>(null);
  const missilesRef = useRef<Missile[]>([]);
  const dimensionsRef = useRef({ width: innerWidth, height: innerHeight });
  dimensionsRef.current = { width: innerWidth, height: innerHeight };

  useEffect(() => {
    const w = innerWidth;
    const h = innerHeight;
    const padding = GUN_SIZE + 10;
    const x = padding + Math.random() * (w - padding * 2);
    const y = padding + Math.random() * (h - padding * 2);
    const rotation = Math.floor(Math.random() * 360);
    const g: Gun = { x, y, rotation, vx: 0, vy: 0 };
    setGun(g);
    gunRef.current = g;
  }, [innerWidth, innerHeight]);

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
      if (distance < GUN_SIZE) return; // only change direction when tapping outside the gun

      const rotation = (Math.atan2(dx, -dy) * 180) / Math.PI;
      const invD = 1 / distance;
      const vx = GUN_SPEED * dx * invD;
      const vy = GUN_SPEED * dy * invD;

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
      if (g) {
        const vx = g.vx || 0;
        const vy = g.vy || 0;
        let x = g.x + vx;
        let y = g.y + vy;
        let nextVx = vx;
        const pad = GUN_SIZE / 2;
        const sideN = Math.ceil(height / BRICK_H);
        const numBricksInGap = Math.ceil(GAP_HEIGHT / BRICK_H);
        const gapStartBrick = Math.floor((sideN - numBricksInGap) / 2);
        const gapEndBrick = gapStartBrick + numBricksInGap - 1;
        const gapTop = gapStartBrick * BRICK_H;
        const gapBottom = (gapEndBrick + 1) * BRICK_H - MORTAR;
        const inGap = (gy: number) => gy >= gapTop && gy <= gapBottom;

        y = Math.max(pad, Math.min(height - pad, y));

        if (x < pad) {
          if (inGap(y)) x = width - pad - 1;
          else { x = pad; nextVx = 0; }
        } else if (x > width - pad) {
          if (inGap(y)) x = pad + 1;
          else { x = width - pad; nextVx = 0; }
        }
        const next: Gun = { ...g, x, y, vx: nextVx, vy };
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
      <View style={styles.menuBar}>
        <TouchableOpacity
          onPress={() => handleEndGame(0)}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.closeButton}
        >
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.playAreaWrapper, { height: playAreaHeight }]}>
        <BrickWall width={dimensions.width} height={playAreaHeight} />
        <Pressable
          ref={gameAreaRef}
          style={[
            styles.playArea,
            { width: innerWidth, height: innerHeight },
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PALETTE.navy,
  },
  menuBar: {
    height: MENU_BAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: PALETTE.navy,
    borderBottomWidth: 1,
    borderBottomColor: PALETTE.gray,
  },
  closeButton: {
    padding: 4,
  },
  closeIcon: {
    fontSize: 24,
    color: PALETTE.silver,
    fontWeight: '300',
  },
  playAreaWrapper: {
    flex: 1,
    width: '100%',
  },
  playArea: {
    position: 'absolute',
    left: BRICK_W,
    top: BRICK_H,
  },
  brick: {
    width: BRICK_W - MORTAR,
    height: BRICK_H - MORTAR,
    backgroundColor: PALETTE.red,
    borderWidth: 1,
    borderColor: PALETTE.maroon,
    marginRight: MORTAR,
    marginBottom: MORTAR,
  },
  brickHorizontal: {
    width: BRICK_W - MORTAR,
    height: BRICK_H - MORTAR,
    backgroundColor: PALETTE.red,
    borderWidth: 1,
    borderColor: PALETTE.maroon,
    marginRight: MORTAR,
  },
  brickStrip: {
    position: 'absolute',
    left: 0,
    height: BRICK_H,
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  brickStripCol: {
    position: 'absolute',
    top: BRICK_H,
    flexDirection: 'column',
  },
  brickTop: { top: 0 },
  brickBottom: { bottom: 0 },
  brickLeft: { left: 0 },
  brickRight: { right: 0 },
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
