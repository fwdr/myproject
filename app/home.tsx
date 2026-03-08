import { useFonts, PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ScreenLayout } from '../components/ScreenLayout';
import { useGame } from '../context/GameContext';
import { ENEMY_TYPES } from '../config/enemyTypes';
import type { EnemyTypeId } from '../config/enemyTypes';

const ORBIT_SIZE = 320;
const ORBIT_RADIUS_MIN = 90;
const ORBIT_RADIUS_MAX = 130;
const ENEMY_COUNT = 8;
const ORBIT_SPEED = 0.4;
const PULSE_SPEED = 2;

export default function HomeScreen() {
  const router = useRouter();
  const { highScore, startLevel } = useGame();
  const [fontsLoaded] = useFonts({ PressStart2P_400Regular });
  const [angle, setAngle] = useState(0);
  const [radius, setRadius] = useState(ORBIT_RADIUS_MIN);
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<number>(0);
  const totalTimeRef = useRef<number>(0);

  useEffect(() => {
    const tick = (now: number) => {
      const dt = (now - lastRef.current) / 1000;
      lastRef.current = now;
      totalTimeRef.current += dt;
      setAngle((a) => (a + ORBIT_SPEED * dt) % (Math.PI * 2));
      const pulse = 0.5 + 0.5 * Math.sin(totalTimeRef.current * PULSE_SPEED);
      const r = ORBIT_RADIUS_MIN + pulse * (ORBIT_RADIUS_MAX - ORBIT_RADIUS_MIN);
      setRadius(r);
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
      menuCenter={
        <Text style={[styles.menuTitle, { fontFamily: 'PressStart2P_400Regular' }]}>
          HOME
        </Text>
      }
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
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => router.push(`/level${startLevel}`)}
            activeOpacity={0.8}
          >
            <Text style={[styles.startButtonText, { fontFamily: 'PressStart2P_400Regular' }]}>
              START
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: 24,
    alignItems: 'center',
    justifyContent: 'center',
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
  startButton: {
    width: 140,
    paddingVertical: 16,
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
