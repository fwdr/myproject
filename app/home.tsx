import { useFonts, PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ScreenLayout } from '../components/ScreenLayout';
import { useGame } from '../context/GameContext';
import { ENEMY_TYPES } from '../config/enemyTypes';
import type { EnemyTypeId } from '../config/enemyTypes';

const ORBIT_SIZE = 320;
const ORBIT_RADIUS_MIN = 138;
const ORBIT_RADIUS_MAX = 153;
const ENEMY_COUNT = 8;
const ORBIT_SPEED = 0.4;
const PULSE_SPEED = 2;

export default function HomeScreen() {
  const router = useRouter();
  const { highScore, startLevel } = useGame();
  const [fontsLoaded] = useFonts({ PressStart2P_400Regular });
  const [angle, setAngle] = useState(0);
  const [radius, setRadius] = useState(ORBIT_RADIUS_MIN);
  const [parallaxOffset, setParallaxOffset] = useState({ l1: { x: 0, y: 0 }, l2: { x: 0, y: 0 }, l3: { x: 0, y: 0 } });
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<number>(0);
  const totalTimeRef = useRef<number>(0);

  useEffect(() => {
    const tick = (now: number) => {
      const dt = (now - lastRef.current) / 1000;
      lastRef.current = now;
      totalTimeRef.current += dt;
      const t = totalTimeRef.current;
      setAngle((a) => (a + ORBIT_SPEED * dt) % (Math.PI * 2));
      const pulse = 0.5 + 0.5 * Math.sin(t * PULSE_SPEED);
      const r = ORBIT_RADIUS_MIN + pulse * (ORBIT_RADIUS_MAX - ORBIT_RADIUS_MIN);
      setRadius(r);
      setParallaxOffset({
        l1: { x: 25 * Math.sin(t * 0.25), y: 18 * Math.cos(t * 0.2) },
        l2: { x: 45 * Math.sin(t * 0.4), y: 35 * Math.cos(t * 0.35) },
        l3: { x: 65 * Math.sin(t * 0.55), y: 50 * Math.cos(t * 0.5) },
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    lastRef.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (!fontsLoaded) return null;

  const center = ORBIT_SIZE / 2;
  const enemyIds: EnemyTypeId[] = ['type1', 'type2', 'type3', 'type4', 'type5', 'type6', 'type7', 'type8'];

  return (
    <ScreenLayout
      menuCenter={<View />}
      menuRight={
        <>
          <Text style={[styles.menuScore, { fontFamily: 'PressStart2P_400Regular' }]}>
            {String(highScore).padStart(5, '0')}
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/settings')}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text style={styles.cogIcon}>⚙️</Text>
          </TouchableOpacity>
        </>
      }
      contentStyle={styles.content}
    >
      <View style={styles.parallaxWrapper}>
        <View style={[styles.parallaxLayer, styles.parallaxLayer1, { transform: [{ translateX: parallaxOffset.l1.x }, { translateY: parallaxOffset.l1.y }] }]}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={[styles.parallaxDot, styles.parallaxDotLarge, { left: 20 + i * 45 + (i % 2) * 80, top: 60 + i * 70 }]} />
          ))}
        </View>
        <View style={[styles.parallaxLayer, styles.parallaxLayer2, { transform: [{ translateX: parallaxOffset.l2.x }, { translateY: parallaxOffset.l2.y }] }]}>
          {[0, 1, 2, 3, 4].map((i) => (
            <View key={i} style={[styles.parallaxDot, styles.parallaxDotMed, { left: 50 + (i * 67) % 200, top: 40 + (i * 89) % 250 }]} />
          ))}
        </View>
        <View style={[styles.parallaxLayer, styles.parallaxLayer3, { transform: [{ translateX: parallaxOffset.l3.x }, { translateY: parallaxOffset.l3.y }] }]}>
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <View key={i} style={[styles.parallaxDot, styles.parallaxDotSmall, { left: 30 + (i * 53) % 220, top: 80 + (i * 71) % 200 }]} />
          ))}
        </View>
      </View>
      <View style={styles.orbitContainer}>
        <View style={styles.orbitArea}>
          {enemyIds.slice(0, ENEMY_COUNT).map((typeId, i) => {
            const offset = (Math.PI * 2 * i) / ENEMY_COUNT;
            const a = angle + offset;
            const x = center + radius * Math.cos(a);
            const y = center + radius * Math.sin(a);
            const def = ENEMY_TYPES[typeId];
            const Sprite = def.Sprite;
            return (
              <View
                key={i}
                pointerEvents="none"
                style={[styles.orbitEnemy, { left: x - 12, top: y - 12 }]}
              >
                <Sprite x={12} y={12} />
              </View>
            );
          })}
          <View style={styles.logoContainer}>
            <Text style={[styles.logoText, { fontFamily: 'PressStart2P_400Regular' }]}>
              PIXEL
            </Text>
            <Text style={[styles.logoText, styles.logoTextAccent, { fontFamily: 'PressStart2P_400Regular' }]}>
              DOGFIGHT
            </Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={styles.startButton}
        onPress={() => router.push(`/level${startLevel}`)}
        activeOpacity={0.8}
      >
        <Text style={[styles.startButtonText, { fontFamily: 'PressStart2P_400Regular' }]}>
          START
        </Text>
      </TouchableOpacity>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: 24,
    paddingBottom: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  parallaxWrapper: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  parallaxLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  parallaxLayer1: { zIndex: 0 },
  parallaxLayer2: { zIndex: 1 },
  parallaxLayer3: { zIndex: 2 },
  parallaxDot: {
    position: 'absolute',
    borderRadius: 999,
  },
  parallaxDotLarge: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(0, 255, 255, 0.04)',
  },
  parallaxDotMed: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255, 255, 0, 0.05)',
  },
  parallaxDotSmall: {
    width: 24,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  orbitContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orbitArea: {
    width: ORBIT_SIZE,
    height: ORBIT_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbitEnemy: {
    position: 'absolute',
    width: 24,
    height: 24,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoText: {
    fontSize: 22,
    color: '#00FFFF',
    letterSpacing: 4,
    textShadowColor: 'rgba(0, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  logoTextAccent: {
    color: '#FFFF00',
    letterSpacing: 3,
    textShadowColor: 'rgba(255, 255, 0, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  startButton: {
    width: 160,
    paddingVertical: 14,
    paddingHorizontal: 28,
    backgroundColor: '#4ade80',
    borderWidth: 3,
    borderColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonText: {
    fontSize: 18,
    color: '#1a1a2e',
    letterSpacing: 2,
  },
  menuTitle: {
    fontSize: 12,
    color: '#00FFFF',
    letterSpacing: 1,
  },
  menuScore: {
    fontSize: 12,
    color: '#f0c14b',
    letterSpacing: 2,
  },
  cogIcon: {
    fontSize: 24,
  },
});
