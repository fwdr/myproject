import type { NativeSyntheticEvent, NativeTouchEvent } from 'react-native';
import { Platform } from 'react-native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  GUN_SIZE,
  MISSILE_HIT_RADIUS,
  MISSILE_SPEED,
  GUN_SPEED,
  GAP_HEIGHT,
  INITIAL_LIVES,
  GUN_RADIUS,
  ENEMY_SPEED,
  STATIC_OBSTACLE_RADIUS,
  POWERUP_RADIUS,
  DUAL_MISSILE_OFFSET,
  WAVE_TIMEOUT_MS,
  BIG_MISSILE_SIZE,
  BIG_MISSILE_HIT_RADIUS,
} from '../lib/gameConstants';
import type { Gun, Missile, Enemy, Powerup } from '../lib/gameTypes';
import type { LevelConfig } from '../config/levels/level1';
import { getEnemyType } from '../config/enemyTypes';

type GameLoopCallbacks = {
  onLevelComplete: () => void;
  onGameOver: () => void;
};

export function useGameLoop(
  config: LevelConfig,
  innerWidth: number,
  innerHeight: number,
  initialScore: number,
  gameActive: boolean,
  levelComplete: boolean,
  fontsLoaded: boolean,
  callbacks: GameLoopCallbacks
) {
  const { onLevelComplete, onGameOver } = callbacks;
  const [gun, setGun] = useState<Gun | null>(null);
  const [missiles, setMissiles] = useState<Missile[]>([]);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [powerups, setPowerups] = useState<Powerup[]>([]);
  const [dualMissileUntil, setDualMissileUntil] = useState(0);
  const [bigMissileUntil, setBigMissileUntil] = useState(0);
  const [currentWaveIndex, setCurrentWaveIndex] = useState(0);
  const [score, setScore] = useState(initialScore);
  const [lives, setLives] = useState(INITIAL_LIVES);

  const gunRef = useRef<Gun | null>(null);
  const missilesRef = useRef<Missile[]>([]);
  const enemiesRef = useRef<Enemy[]>([]);
  const powerupsRef = useRef<Powerup[]>([]);
  const dualMissileUntilRef = useRef(0);
  const bigMissileUntilRef = useRef(0);
  const dimensionsRef = useRef({ width: innerWidth, height: innerHeight });
  const livesRef = useRef(INITIAL_LIVES);
  const gunTargetRef = useRef({ x: innerWidth / 2, y: innerHeight / 2 });
  const missileIdRef = useRef(0);
  const enemyIdRef = useRef(0);
  const powerupIdRef = useRef(0);
  const prevEnemiesCountRef = useRef(0);
  const onLevelCompleteRef = useRef(onLevelComplete);
  const currentWaveIndexRef = useRef(currentWaveIndex);
  const levelStartTimeRef = useRef<number>(0);
  onLevelCompleteRef.current = onLevelComplete;
  currentWaveIndexRef.current = currentWaveIndex;

  dimensionsRef.current = { width: innerWidth, height: innerHeight };

  const isMobileWeb =
    Platform.OS === 'web' && (innerWidth < 500 || innerHeight < 500);
  const calmFactor = isMobileWeb ? 0.75 : 1;
  const enemySpeed = ENEMY_SPEED * calmFactor;
  const missileSpeed = MISSILE_SPEED * calmFactor;
  const gunSpeedBase = GUN_SPEED * calmFactor;
  const waveTimeoutMultiplier = isMobileWeb ? 1.33 : 1;

  const obstaclePositions = useMemo(() => {
    const obs = config.staticObstacles ?? [];
    return obs.map((o) => ({
      x: o.x * innerWidth,
      y: o.y * innerHeight,
    }));
  }, [config.staticObstacles, innerWidth, innerHeight]);

  const obstaclesRef = useRef(obstaclePositions);
  obstaclesRef.current = obstaclePositions;

  useEffect(() => {
    enemiesRef.current = enemies;
  }, [enemies]);

  useEffect(() => {
    powerupsRef.current = powerups;
  }, [powerups]);

  useEffect(() => {
    dualMissileUntilRef.current = dualMissileUntil;
  }, [dualMissileUntil]);

  useEffect(() => {
    bigMissileUntilRef.current = bigMissileUntil;
  }, [bigMissileUntil]);

  useEffect(() => {
    livesRef.current = lives;
  }, [lives]);

  // Spawn wave
  useEffect(() => {
    if (levelComplete) return;
    const w = innerWidth;
    const h = innerHeight;
    if (w <= 0 || h <= 0) return;
    const waves = config.waves;
    if (currentWaveIndex >= waves.length) return;

    const wave = waves[currentWaveIndex];
    const margin = 8;
    const spawnAtEdge = () => {
      const side = Math.floor(Math.random() * 4);
      if (side === 0) return { x: margin + Math.random() * (w - margin * 2), y: 0 };
      if (side === 1) return { x: w, y: margin + Math.random() * (h - margin * 2) };
      if (side === 2) return { x: margin + Math.random() * (w - margin * 2), y: h };
      return { x: 0, y: margin + Math.random() * (h - margin * 2) };
    };

    const hasStaggeredSpawn = wave.some((s) => (s.spawnDelayMs ?? 0) > 0);

    if (hasStaggeredSpawn) {
      const timeouts: ReturnType<typeof setTimeout>[] = [];
      for (const spawn of wave) {
        const def = getEnemyType(spawn.enemyType);
        const delayMs = spawn.spawnDelayMs ?? 0;
        const spawnOrigin = spawn.spawnOrigin ?? config.spawnOrigin ?? 'scattered';
        const waveOrigin = spawnOrigin === 'grouped' ? spawnAtEdge() : null;
        for (let i = 0; i < spawn.count; i++) {
          const delay = i * delayMs;
          const { x, y } = waveOrigin ?? spawnAtEdge();
          const newEnemy: Enemy = {
            id: ++enemyIdRef.current,
            typeId: spawn.enemyType,
            x,
            y,
            health: def.health,
          };
          if (delay === 0) {
            setEnemies((prev) => [...prev, newEnemy]);
          } else {
            timeouts.push(setTimeout(() => setEnemies((prev) => [...prev, newEnemy]), delay));
          }
        }
      }
      return () => timeouts.forEach((t) => clearTimeout(t));
    }

    const newEnemies: Enemy[] = [];
    for (const spawn of wave) {
      const def = getEnemyType(spawn.enemyType);
      const spawnOrigin = spawn.spawnOrigin ?? config.spawnOrigin ?? 'scattered';
      const waveOrigin = spawnOrigin === 'grouped' ? spawnAtEdge() : null;
      for (let i = 0; i < spawn.count; i++) {
        const { x, y } = waveOrigin ?? spawnAtEdge();
        newEnemies.push({
          id: ++enemyIdRef.current,
          typeId: spawn.enemyType,
          x,
          y,
          health: def.health,
        });
      }
    }
    setEnemies((prev) => [...prev, ...newEnemies]);
  }, [innerWidth, innerHeight, currentWaveIndex, config.waves, config.spawnOrigin, levelComplete]);

  // Wave advance (on wave completion)
  useEffect(() => {
    const wasEmpty = prevEnemiesCountRef.current === 0;
    const nowEmpty = enemies.length === 0;
    prevEnemiesCountRef.current = enemies.length;
    if (!wasEmpty && nowEmpty) {
      const waves = config.waves;
      if (currentWaveIndex < waves.length - 1) {
        setCurrentWaveIndex((i) => i + 1);
      } else {
        onLevelComplete();
      }
    }
  }, [enemies.length, currentWaveIndex, config.waves, onLevelComplete]);

  // Gun init
  useEffect(() => {
    const w = innerWidth;
    const h = innerHeight;
    const padding = GUN_SIZE + 10;
    const x = padding + Math.random() * (w - padding * 2);
    const y = padding + Math.random() * (h - padding * 2);
    const g: Gun = { x, y, rotation: 0, vx: 0, vy: 0 };
    setGun(g);
    gunRef.current = g;
    gunTargetRef.current = { x, y };
  }, [innerWidth, innerHeight]);

  // Powerup spawn
  const powerupConfig = config.powerups;
  useEffect(() => {
    if (!gameActive || levelComplete || !powerupConfig) return;
    const w = innerWidth;
    const h = innerHeight;
    if (w <= 0 || h <= 0) return;
    const margin = 40;
    const interval = setInterval(() => {
      if (Math.random() >= powerupConfig.spawnChance) return;
      const x = margin + Math.random() * (w - margin * 2);
      const y = margin + Math.random() * (h - margin * 2);
      setPowerups((prev) => [
        ...prev,
        { id: ++powerupIdRef.current, x, y, typeId: powerupConfig.type },
      ]);
    }, powerupConfig.spawnIntervalMs);
    return () => clearInterval(interval);
  }, [gameActive, levelComplete, powerupConfig, innerWidth, innerHeight]);

  const hitTest = useCallback((ax: number, ay: number, ar: number, bx: number, by: number, br: number) => {
    const dx = ax - bx;
    const dy = ay - by;
    return dx * dx + dy * dy < (ar + br) * (ar + br);
  }, []);

  // Game tick
  const tunnelType = config.tunnel ?? 'none';
  const hasObstacles = (config.staticObstacles?.length ?? 0) > 0;

  useEffect(() => {
    if (!gameActive || levelComplete || !fontsLoaded) return;
    if (levelStartTimeRef.current === 0) levelStartTimeRef.current = Date.now();
    let rafId: number;
    const waves = config.waves;
    const tick = () => {
      const { width, height } = dimensionsRef.current;
      const g = gunRef.current;

      const idx = currentWaveIndexRef.current;
      if (idx < waves.length) {
        const elapsed = Date.now() - levelStartTimeRef.current;
        const waveTimeoutMs =
          (config.waveTimeoutMs ?? WAVE_TIMEOUT_MS) * waveTimeoutMultiplier;
        const timeBasedWave = Math.floor(elapsed / waveTimeoutMs);
        const targetWave = Math.min(timeBasedWave, waves.length - 1);
        if (idx < targetWave) {
          setCurrentWaveIndex((i) => i + 1);
          currentWaveIndexRef.current = idx + 1;
        }
      }
      const target = g ? { x: g.x, y: g.y } : gunTargetRef.current;
      if (g) gunTargetRef.current = { x: g.x, y: g.y };

      let enemiesNext = enemiesRef.current.map((e) => {
        if (e.health <= 0) return e;
        const dx = target.x - e.x;
        const dy = target.y - e.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 0.01) return e;
        const vx = (dx / dist) * enemySpeed;
        const vy = (dy / dist) * enemySpeed;
        const r = getEnemyType(e.typeId).radius;
        const pad = r + 2;
        let nx = e.x + vx;
        let ny = e.y + vy;
        nx = Math.max(pad, Math.min(width - pad, nx));
        ny = Math.max(pad, Math.min(height - pad, ny));
        return { ...e, x: nx, y: ny };
      });
      enemiesRef.current = enemiesNext;

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
        const inHorizontalGap = (gy: number) => gy >= gapTop - 4 && gy <= gapBottom + 4;
        const gapCenterX = width / 2;
        const gapLeft = gapCenterX - GAP_HEIGHT / 2;
        const gapRight = gapCenterX + GAP_HEIGHT / 2;
        const inVerticalGap = (gx: number) => gx >= gapLeft - 4 && gx <= gapRight + 4;

        if (tunnelType === 'none') {
          x = Math.max(pad, Math.min(width - pad, x));
          y = Math.max(pad, Math.min(height - pad, y));
          nextVx = x <= pad || x >= width - pad ? 0 : vx;
        } else if (tunnelType === 'horizontal') {
          y = Math.max(pad, Math.min(height - pad, y));
          if (x < pad) {
            if (inHorizontalGap(y)) x = width - pad - 1;
            else { x = pad; nextVx = 0; }
          } else if (x > width - pad) {
            if (inHorizontalGap(y)) x = pad + 1;
            else { x = width - pad; nextVx = 0; }
          }
        } else {
          x = Math.max(pad, Math.min(width - pad, x));
          if (y < pad) {
            if (inVerticalGap(x)) y = height - pad - 1;
            else { y = pad; }
          } else if (y > height - pad) {
            if (inVerticalGap(x)) y = pad + 1;
            else { y = height - pad; }
          }
        }

        let hitEnemy = false;
        if (hasObstacles) {
          for (const o of obstaclesRef.current) {
            if (hitTest(x, y, GUN_RADIUS, o.x, o.y, STATIC_OBSTACLE_RADIUS)) {
              hitEnemy = true;
              break;
            }
          }
        }
        if (!hitEnemy && powerupConfig) {
          for (const p of powerupsRef.current) {
            if (hitTest(x, y, GUN_RADIUS, p.x, p.y, POWERUP_RADIUS)) {
              setPowerups((prev) => prev.filter((pu) => pu.id !== p.id));
              const until = Date.now() + powerupConfig.durationMs;
              if (p.typeId === 'dual') {
                setDualMissileUntil(until);
                dualMissileUntilRef.current = until;
              } else {
                setBigMissileUntil(until);
                bigMissileUntilRef.current = until;
              }
              break;
            }
          }
        }
        if (!hitEnemy) {
          for (const e of enemiesRef.current) {
            if (e.health <= 0) continue;
            const r = getEnemyType(e.typeId).radius;
            if (hitTest(x, y, GUN_RADIUS, e.x, e.y, r)) {
              hitEnemy = true;
              const newLives = Math.max(0, livesRef.current - 1);
              livesRef.current = newLives;
              setLives(newLives);
              if (newLives <= 0) onGameOver();
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
        }
        if (!hitEnemy) {
          gunRef.current = { ...g, x, y, vx: nextVx, vy };
          setGun({ ...g, x, y, vx: nextVx, vy });
        }
      }

      let scoreDelta = 0;
      const prevMissiles = missilesRef.current;
      let enemiesAfterHits = enemiesNext;
      const movedMissiles = prevMissiles.map((m) => ({ ...m, x: m.x + m.dx, y: m.y + m.dy }));
      const survivingMissiles = movedMissiles.filter((m) => {
        const hitRadius = m.hitRadius ?? MISSILE_HIT_RADIUS;
        const damage = m.damage ?? 1;
        if (hasObstacles) {
          for (const o of obstaclesRef.current) {
            if (hitTest(m.x, m.y, hitRadius, o.x, o.y, STATIC_OBSTACLE_RADIUS)) return false;
          }
        }
        for (let i = 0; i < enemiesAfterHits.length; i++) {
          const e = enemiesAfterHits[i];
          if (e.health <= 0) continue;
          const r = getEnemyType(e.typeId).radius;
          const def = getEnemyType(e.typeId);
          if (hitTest(m.x, m.y, hitRadius, e.x, e.y, r)) {
            const damaged = { ...e, health: Math.max(0, e.health - damage) };
            if (damaged.health <= 0) scoreDelta += def.points;
            enemiesAfterHits = [
              ...enemiesAfterHits.slice(0, i),
              damaged,
              ...enemiesAfterHits.slice(i + 1),
            ];
            return false;
          }
        }
        return m.x >= -20 && m.x <= width + 20 && m.y >= -20 && m.y <= height + 20;
      });
      const aliveEnemies = enemiesAfterHits.filter((e) => e.health > 0);
      if (scoreDelta) setScore((s) => s + scoreDelta);
      setMissiles(survivingMissiles);
      missilesRef.current = survivingMissiles;
      if (prevMissiles.length > 0 || enemiesNext.length > 0) {
        setEnemies((prev) => {
          const processedIds = new Set(enemiesNext.map((e) => e.id));
          const newlySpawned = prev.filter((e) => !processedIds.has(e.id));
          const merged = [...aliveEnemies, ...newlySpawned];
          enemiesRef.current = merged;
          return merged;
        });
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [gameActive, levelComplete, fontsLoaded, hitTest, tunnelType, hasObstacles, powerupConfig, onGameOver]);

  const [gameAreaLayout, setGameAreaLayout] = useState({ x: 0, y: 0 });
  const gameAreaLayoutRef = useRef({ x: 0, y: 0 });
  gameAreaLayoutRef.current = { x: gameAreaLayout.x, y: gameAreaLayout.y };

  const handleTap = useCallback(
    (e: NativeSyntheticEvent<NativeTouchEvent>) => {
      const g = gunRef.current;
      if (!g) return;
      const ne = e.nativeEvent as NativeTouchEvent & { pageX?: number; pageY?: number };
      let tapX: number, tapY: number;
      const layout = gameAreaLayoutRef.current;
      if (typeof ne.pageX === 'number' && typeof ne.pageY === 'number') {
        tapX = ne.pageX - layout.x;
        tapY = ne.pageY - layout.y;
      } else if (typeof ne.locationX === 'number' && typeof ne.locationY === 'number') {
        tapX = ne.locationX;
        tapY = ne.locationY;
      } else return;
      const dx = tapX - g.x;
      const dy = tapY - g.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < GUN_SIZE) return;
      const rotation = (Math.atan2(dx, -dy) * 180) / Math.PI;
      const invD = 1 / distance;
      const minDim = Math.min(innerWidth, innerHeight);
      const gunSpeed = gunSpeedBase * Math.min(1, minDim / 450);
      const vx = gunSpeed * dx * invD;
      const vy = gunSpeed * dy * invD;
      gunRef.current = { ...g, rotation, vx, vy };
      setGun({ ...g, rotation, vx, vy });
      const mdx = dx * invD * missileSpeed;
      const mdy = dy * invD * missileSpeed;
      const dualMode = Date.now() < dualMissileUntilRef.current;
      const bigMode = Date.now() < bigMissileUntilRef.current;
      const baseMissile = (ox: number, oy: number): Missile =>
        bigMode
          ? {
              id: ++missileIdRef.current,
              x: g.x + ox,
              y: g.y + oy,
              dx: mdx,
              dy: mdy,
              damage: 3,
              hitRadius: BIG_MISSILE_HIT_RADIUS,
              size: BIG_MISSILE_SIZE,
            }
          : { id: ++missileIdRef.current, x: g.x + ox, y: g.y + oy, dx: mdx, dy: mdy };
      if (dualMode) {
        const perpX = -dy * invD * DUAL_MISSILE_OFFSET;
        const perpY = dx * invD * DUAL_MISSILE_OFFSET;
        const m1 = baseMissile(-perpX, -perpY);
        const m2 = baseMissile(perpX, perpY);
        setMissiles((prev) => {
          const next = [...prev, m1, m2];
          missilesRef.current = next;
          return next;
        });
      } else {
        const m = baseMissile(0, 0);
        setMissiles((prev) => {
          const next = [...prev, m];
          missilesRef.current = next;
          return next;
        });
      }
    },
    [powerupConfig, innerWidth, innerHeight]
  );

  return {
    gun,
    setGun,
    gunRef,
    missiles,
    enemies,
    powerups,
    obstaclePositions,
    dualMissileUntilRef,
    score,
    lives,
    gunTargetRef,
    dimensionsRef,
    hitTest,
    handleTap,
    gameAreaLayout,
    setGameAreaLayout,
  };
}
