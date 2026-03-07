import { useFonts, PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useGame } from '../context/GameContext';
import { ScreenLayout, MENU_BAR_HEIGHT } from './ScreenLayout';
import { BrickWall } from './BrickWall';
import { useGameLoop } from '../hooks/useGameLoop';
import { getEnemyType } from '../config/enemyTypes';
import { PowerupSprite } from './sprites/PowerupSprite';
import {
  GUN_SIZE,
  MISSILE_SIZE,
  BRICK_W,
  BRICK_H,
  INITIAL_LIVES,
  STATIC_OBSTACLE_RADIUS,
  PALETTE,
} from '../lib/gameConstants';
import type { LevelConfig } from '../config/levels/level1';

type GameScreenProps = {
  config: LevelConfig;
  initialScore: number;
  levelLabel: string;
  backgroundColor: string;
  brickStyle: { backgroundColor: string; borderColor: string };
  borderColor?: string;
  onExit: (score: number) => void;
  nextPath?: string;
};

export function GameScreen({
  config,
  initialScore,
  levelLabel,
  backgroundColor,
  brickStyle,
  borderColor = PALETTE.cyan,
  onExit,
  nextPath,
}: GameScreenProps) {
  const router = useRouter();
  const { setHighScore } = useGame();
  const [dimensions, setDimensions] = useState(() => Dimensions.get('window'));
  useEffect(() => {
    const sub = Dimensions.addEventListener('change', (e) => setDimensions(e.window));
    return () => sub?.remove();
  }, []);

  const playAreaHeight = dimensions.height - MENU_BAR_HEIGHT;
  const innerWidth = dimensions.width - 2 * BRICK_W;
  const innerHeight = playAreaHeight - 2 * BRICK_H;

  const [gameActive, setGameActive] = useState(true);
  const [levelComplete, setLevelComplete] = useState(false);

  const [fontsLoaded] = useFonts({ PressStart2P_400Regular });

  const gameLoop = useGameLoop(
    config,
    innerWidth,
    innerHeight,
    initialScore,
    gameActive,
    levelComplete,
    fontsLoaded,
    {
      onLevelComplete: () => setLevelComplete(true),
      onGameOver: () => setGameActive(false),
    }
  );

  const {
    gun,
    missiles,
    enemies,
    powerups,
    score,
    lives,
    handleTap,
    setGameAreaLayout,
  } = gameLoop;

  const handleEndGame = useCallback(
    (finalScore: number) => {
      setHighScore((prev) => Math.max(prev, finalScore));
      onExit(finalScore);
    },
    [setHighScore, onExit]
  );

  const handleLevelComplete = useCallback(() => {
    setHighScore((prev) => Math.max(prev, score));
    if (nextPath) {
      router.replace({ pathname: nextPath, params: { score: String(score) } });
    } else {
      onExit(score);
    }
  }, [setHighScore, score, nextPath, onExit, router]);

  if (!fontsLoaded) return null;

  return (
    <ScreenLayout
      containerStyle={{ backgroundColor }}
      menuBarStyle={{ backgroundColor, borderBottomColor: borderColor }}
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
          {levelLabel}
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
      contentStyle={styles.content}
    >
      {!gameActive && (
        <View style={styles.overlay}>
          <Text style={[styles.gameOverText, { fontFamily: 'PressStart2P_400Regular' }]}>
            GAME OVER
          </Text>
          <Text style={[styles.scoreLabel, { fontFamily: 'PressStart2P_400Regular' }]}>
            {String(score).padStart(5, '0')}
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => handleEndGame(score)}>
            <Text style={[styles.buttonText, { fontFamily: 'PressStart2P_400Regular' }]}>EXIT</Text>
          </TouchableOpacity>
        </View>
      )}

      {levelComplete && (
        <View style={styles.overlay}>
          <Text style={[styles.completeText, { fontFamily: 'PressStart2P_400Regular' }]}>
            LEVEL COMPLETE
          </Text>
          <Text style={[styles.scoreLabel, { fontFamily: 'PressStart2P_400Regular' }]}>
            {String(score).padStart(5, '0')}
          </Text>
          <TouchableOpacity style={styles.button} onPress={handleLevelComplete}>
            <Text style={[styles.buttonText, { fontFamily: 'PressStart2P_400Regular' }]}>
              {nextPath ? 'NEXT' : 'EXIT'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={[styles.playAreaWrapper, { height: playAreaHeight }]}>
        <BrickWall
          width={dimensions.width}
          innerHeight={innerHeight}
          tunnel={config.tunnel ?? 'none'}
          brickStyle={brickStyle}
        />
        <Pressable
          style={[styles.playArea, { width: innerWidth, height: innerHeight }]}
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
          {powerups.map((p) => (
            <PowerupSprite key={p.id} x={p.x} y={p.y} />
          ))}
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
  content: { paddingHorizontal: 0, flex: 1 },
  closeIcon: { fontSize: 16, color: PALETTE.yellow, letterSpacing: 1 },
  levelText: { fontSize: 12, color: PALETTE.cyan, letterSpacing: 1 },
  scoreText: { fontSize: 14, color: PALETTE.yellow, letterSpacing: 2 },
  livesRow: { flexDirection: 'row', gap: 4 },
  lifeIcon: { fontSize: 12, color: PALETTE.lime },
  lifeLost: { color: PALETTE.maroon },
  overlay: {
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
  completeText: {
    fontSize: 20,
    color: PALETTE.lime,
    marginBottom: 16,
    letterSpacing: 2,
  },
  scoreLabel: {
    fontSize: 18,
    color: PALETTE.yellow,
    marginBottom: 24,
    letterSpacing: 2,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 2,
    borderColor: PALETTE.cyan,
  },
  buttonText: { fontSize: 12, color: PALETTE.cyan, letterSpacing: 1 },
  playAreaWrapper: { flex: 1, width: '100%' },
  playArea: {
    position: 'absolute',
    left: BRICK_W,
    top: BRICK_H,
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
  obstacle: {
    position: 'absolute',
    width: STATIC_OBSTACLE_RADIUS * 2,
    height: STATIC_OBSTACLE_RADIUS * 2,
    borderRadius: STATIC_OBSTACLE_RADIUS,
    backgroundColor: PALETTE.gray,
    borderWidth: 2,
    borderColor: PALETTE.silver,
  },
  missile: {
    position: 'absolute',
    width: MISSILE_SIZE,
    height: MISSILE_SIZE,
    borderRadius: MISSILE_SIZE / 2,
    backgroundColor: PALETTE.yellow,
  },
});
