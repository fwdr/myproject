import {
  useFonts,
  PressStart2P_400Regular,
} from '@expo-google-fonts/press-start-2p';
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
import { ScreenLayout, MENU_BAR_HEIGHT } from '../components/ScreenLayout';
import { LEVEL_1 } from '../config/levels/level1';
import { getEnemyType } from '../config/enemyTypes';
import type { EnemyTypeId } from '../config/enemyTypes';

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
const GAP_HEIGHT = GUN_SIZE * 2;
const INITIAL_LIVES = 3;
const GUN_RADIUS = GUN_SIZE / 2;
let missileId = 0;
let enemyId = 0;

type Gun = { x: number; y: number; rotation: number; vx: number; vy: number };
type Missile = { id: number; x: number; y: number; dx: number; dy: number };
type Enemy = { id: number; typeId: EnemyTypeId; x: number; y: number; health: number };

function BrickWall({
  width,
  height,
  innerHeight,
}: {
  width: number;
  height: number;
  innerHeight: number;
}) {
  const topN = Math.ceil(width / BRICK_W) + 2;
  const sideHeight = innerHeight;
  const sideN = Math.ceil(sideHeight / BRICK_H);
  const gapCenterY = innerHeight / 2;
  const gapTop = gapCenterY - GAP_HEIGHT / 2;
  const bricksAboveGap = Math.floor(gapTop / BRICK_H);
  const bricksInGap = Math.ceil(GAP_HEIGHT / BRICK_H);
  const bricksBelowGap = Math.max(0, sideN - bricksAboveGap - bricksInGap);

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

  const renderSideColumn = (prefix: string) => (
    <View style={[styles.brickStripColInner, { height: sideHeight }]}>
      {Array.from({ length: bricksAboveGap }).map((_, i) =>
        brickVert(`${prefix}-above-${i}`)
      )}
      <View style={styles.gapSpacer} />
      {Array.from({ length: bricksBelowGap }).map((_, i) =>
        brickVert(`${prefix}-below-${i}`)
      )}
    </View>
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
      <View style={[styles.brickStripCol, styles.brickLeft]}>
        {renderSideColumn('l')}
      </View>
      <View style={[styles.brickStripCol, styles.brickRight]}>
        {renderSideColumn('r')}
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
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [currentWaveIndex, setCurrentWaveIndex] = useState(0);
  const [levelComplete, setLevelComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [gameActive, setGameActive] = useState(true);
  const gunRef = useRef<Gun | null>(null);
  const missilesRef = useRef<Missile[]>([]);
  const enemiesRef = useRef<Enemy[]>([]);
  const dimensionsRef = useRef({ width: innerWidth, height: innerHeight });
  const livesRef = useRef(INITIAL_LIVES);
  dimensionsRef.current = { width: innerWidth, height: innerHeight };

  const [fontsLoaded] = useFonts({ PressStart2P_400Regular });

  // Spawn current wave when dimensions ready
  useEffect(() => {
    const w = innerWidth;
    const h = innerHeight;
    if (w <= 0 || h <= 0) return;
    const waves = LEVEL_1.waves;
    if (currentWaveIndex >= waves.length) return;

    const wave = waves[currentWaveIndex];
    const newEnemies: Enemy[] = [];
    const padding = GUN_SIZE + 20;
    for (const spawn of wave) {
      const def = getEnemyType(spawn.enemyType);
      for (let i = 0; i < spawn.count; i++) {
        const x = padding + Math.random() * (w - padding * 2);
        const y = padding + Math.random() * (h - padding * 2);
        newEnemies.push({
          id: ++enemyId,
          typeId: spawn.enemyType,
          x,
          y,
          health: def.health,
        });
      }
    }
    setEnemies(newEnemies);
  }, [innerWidth, innerHeight, currentWaveIndex]);

  const prevEnemiesCountRef = useRef(0);

  // When all enemies destroyed (wave cleared): advance wave or level complete
  useEffect(() => {
    const wasEmpty = prevEnemiesCountRef.current === 0;
    const nowEmpty = enemies.length === 0;
    prevEnemiesCountRef.current = enemies.length;

    if (!wasEmpty && nowEmpty) {
      const waves = LEVEL_1.waves;
      if (currentWaveIndex < waves.length - 1) {
        setCurrentWaveIndex((i) => i + 1);
      } else {
        setLevelComplete(true);
      }
    }
  }, [enemies.length, currentWaveIndex]);

  useEffect(() => {
    enemiesRef.current = enemies;
  }, [enemies]);

  useEffect(() => {
    livesRef.current = lives;
  }, [lives]);

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

  const hitTest = useCallback((ax: number, ay: number, ar: number, bx: number, by: number, br: number) => {
    const dx = ax - bx;
    const dy = ay - by;
    return dx * dx + dy * dy < (ar + br) * (ar + br);
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
    if (!gameActive || levelComplete || !fontsLoaded) return;
    let rafId: number;
    const tick = () => {
      const { width, height } = dimensionsRef.current;
      const obs = enemiesRef.current;
      const g = gunRef.current;

      if (g) {
        const vx = g.vx || 0;
        const vy = g.vy || 0;
        let x = g.x + vx;
        let y = g.y + vy;
        let nextVx = vx;
        const pad = GUN_SIZE / 2;
        const gapCenterY = height / 2;
        const gapTop = gapCenterY - GAP_HEIGHT / 2;
        const gapBottom = gapCenterY + GAP_HEIGHT / 2;
        const inGap = (gy: number) =>
          gy >= gapTop - 4 && gy <= gapBottom + 4;

        y = Math.max(pad, Math.min(height - pad, y));

        if (x < pad) {
          if (inGap(y)) x = width - pad - 1;
          else { x = pad; nextVx = 0; }
        } else if (x > width - pad) {
          if (inGap(y)) x = pad + 1;
          else { x = width - pad; nextVx = 0; }
        }

        let hitEnemy = false;
        for (const e of obs) {
          if (e.health <= 0) continue;
          const r = getEnemyType(e.typeId).radius;
          if (hitTest(x, y, GUN_RADIUS, e.x, e.y, r)) {
            hitEnemy = true;
            const newLives = Math.max(0, livesRef.current - 1);
            livesRef.current = newLives;
            setLives(newLives);
            if (newLives <= 0) setGameActive(false);
            setGun(null);
            gunRef.current = null;
            if (newLives > 0) {
              const padding = GUN_SIZE + 10;
              const nx = padding + Math.random() * (width - padding * 2);
              const ny = padding + Math.random() * (height - padding * 2);
              setTimeout(() => {
                const ng: Gun = { x: nx, y: ny, rotation: 0, vx: 0, vy: 0 };
                gunRef.current = ng;
                setGun(ng);
              }, 500);
            }
            break;
          }
        }
        if (!hitEnemy) {
          const nextGun: Gun = { ...g, x, y, vx: nextVx, vy };
          gunRef.current = nextGun;
          setGun(nextGun);
        }
      }

      let enemiesNext = [...enemiesRef.current];
      let scoreDelta = 0;
      setMissiles((prev) => {
        if (prev.length === 0) return prev;
        const moved = prev.map((m) => ({ ...m, x: m.x + m.dx, y: m.y + m.dy }));
        const survivors = moved.filter((m) => {
          for (let i = 0; i < enemiesNext.length; i++) {
            const e = enemiesNext[i];
            if (e.health <= 0) continue;
            const r = getEnemyType(e.typeId).radius;
            const def = getEnemyType(e.typeId);
            if (hitTest(m.x, m.y, MISSILE_SIZE / 2, e.x, e.y, r)) {
              enemiesNext[i] = { ...e, health: e.health - 1 };
              if (enemiesNext[i].health <= 0) scoreDelta += def.points;
              return false;
            }
          }
          return m.x >= -20 && m.x <= width + 20 && m.y >= -20 && m.y <= height + 20;
        });
        setEnemies(enemiesNext.filter((e) => e.health > 0));
        enemiesRef.current = enemiesNext.filter((e) => e.health > 0);
        if (scoreDelta) setScore((s) => s + scoreDelta);
        missilesRef.current = survivors;
        return survivors;
      });
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [gameActive, levelComplete, fontsLoaded, hitTest]);

  const handleEndGame = (finalScore: number) => {
    setHighScore((prev) => Math.max(prev, finalScore));
    router.replace('/home');
  };

  if (!fontsLoaded) return null;

  return (
    <ScreenLayout
      containerStyle={{ backgroundColor: PALETTE.navy }}
      menuBarStyle={{ backgroundColor: PALETTE.navy, borderBottomColor: PALETTE.cyan }}
      menuLeft={
        <TouchableOpacity
          onPress={() => handleEndGame(score)}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={[styles.closeIcon, { fontFamily: 'PressStart2P_400Regular' }]}>✕</Text>
        </TouchableOpacity>
      }
      menuCenter={
        <Text style={[styles.levelText, { fontFamily: 'PressStart2P_400Regular' }]}>
          L-01
        </Text>
      }
      menuRight={
        <>
          <Text style={[styles.scoreText, { fontFamily: 'PressStart2P_400Regular' }]}>
            {String(score).padStart(5, '0')}
          </Text>
          <View style={styles.livesRow}>
            {Array.from({ length: INITIAL_LIVES }).map((_, i) => (
              <Text
                key={i}
                style={[
                  styles.lifeIcon,
                  i >= lives && styles.lifeLost,
                  { fontFamily: 'PressStart2P_400Regular' },
                ]}
              >
                ●
              </Text>
            ))}
          </View>
        </>
      }
      contentStyle={styles.level1Content}
    >
      {!gameActive && (
        <View style={styles.gameOverOverlay}>
          <Text style={[styles.gameOverText, { fontFamily: 'PressStart2P_400Regular' }]}>
            GAME OVER
          </Text>
          <Text style={[styles.gameOverScore, { fontFamily: 'PressStart2P_400Regular' }]}>
            {String(score).padStart(5, '0')}
          </Text>
          <TouchableOpacity
            style={styles.gameOverButton}
            onPress={() => handleEndGame(score)}
          >
            <Text style={[styles.gameOverButtonText, { fontFamily: 'PressStart2P_400Regular' }]}>
              EXIT
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {levelComplete && (
        <View style={styles.gameOverOverlay}>
          <Text style={[styles.levelCompleteText, { fontFamily: 'PressStart2P_400Regular' }]}>
            LEVEL COMPLETE
          </Text>
          <Text style={[styles.gameOverScore, { fontFamily: 'PressStart2P_400Regular' }]}>
            {String(score).padStart(5, '0')}
          </Text>
          <TouchableOpacity
            style={styles.gameOverButton}
            onPress={() => handleEndGame(score)}
          >
            <Text style={[styles.gameOverButtonText, { fontFamily: 'PressStart2P_400Regular' }]}>
              EXIT
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={[styles.playAreaWrapper, { height: playAreaHeight }]}>
        <BrickWall
          width={dimensions.width}
          height={playAreaHeight}
          innerHeight={innerHeight}
        />
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
          {enemies.map((e) => {
            const def = getEnemyType(e.typeId);
            const Sprite = def.Sprite;
            return <Sprite key={e.id} x={e.x} y={e.y} />;
          })}
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
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  level1Content: {
    paddingHorizontal: 0,
    flex: 1,
  },
  closeIcon: {
    fontSize: 16,
    color: PALETTE.yellow,
    letterSpacing: 1,
  },
  levelText: {
    fontSize: 12,
    color: PALETTE.cyan,
    letterSpacing: 1,
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  scoreText: {
    fontSize: 14,
    color: PALETTE.yellow,
    letterSpacing: 2,
  },
  livesRow: {
    flexDirection: 'row',
    gap: 4,
  },
  lifeIcon: {
    fontSize: 12,
    color: PALETTE.lime,
  },
  lifeLost: {
    color: PALETTE.maroon,
  },
  gameOverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  gameOverText: {
    fontSize: 20,
    color: PALETTE.red,
    marginBottom: 16,
    letterSpacing: 2,
  },
  gameOverScore: {
    fontSize: 18,
    color: PALETTE.yellow,
    marginBottom: 24,
    letterSpacing: 2,
  },
  gameOverButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 2,
    borderColor: PALETTE.cyan,
  },
  gameOverButtonText: {
    fontSize: 12,
    color: PALETTE.cyan,
    letterSpacing: 1,
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
  brickStripColInner: {
    flexDirection: 'column',
  },
  gapSpacer: {
    height: GAP_HEIGHT,
    width: BRICK_W - MORTAR,
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
  obstacle: {
    position: 'absolute',
    width: OBSTACLE_SIZE,
    height: OBSTACLE_SIZE,
    backgroundColor: PALETTE.magenta,
    borderWidth: 2,
    borderColor: PALETTE.white,
  },
});
