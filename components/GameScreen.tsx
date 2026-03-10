import { useFonts, PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';
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
import { useBackgroundMusic } from '../hooks/useBackgroundMusic';
import { ScreenLayout, MENU_BAR_HEIGHT } from './ScreenLayout';
import { BrickWall } from './BrickWall';
import { getBrickStyleForLevel } from '../config/brickStyles';
import { AmbientParticles, getParticleStyleForLevel } from './AmbientParticles';
import { useMissileSound } from '../hooks/useMissileSound';
import { useGameOverMusic } from '../hooks/useGameOverMusic';
import { useGameLoop } from '../hooks/useGameLoop';
import { getEnemyType } from '../config/enemyTypes';
import { EnemyWithEffects } from './EnemyWithEffects';
import { ObstacleSprite } from './ObstacleSprite';
import { LevelIntro } from './LevelIntro';
import { PowerupSprite } from './sprites/PowerupSprite';
import { Powerup2Sprite } from './sprites/Powerup2Sprite';
import { Powerup3Sprite } from './sprites/Powerup3Sprite';
import { ExtraLifeSprite } from './sprites/ExtraLifeSprite';
import { GunSprite } from './sprites/GunSprite';
import {
  GUN_SIZE,
  MISSILE_SIZE,
  BRICK_W,
  BRICK_H,
  INITIAL_LIVES,
  PALETTE,
} from '../lib/gameConstants';
import type { LevelConfig } from '../config/levels/level1';

type GameScreenProps = {
  config: LevelConfig;
  initialScore: number;
  levelLabel: string;
  levelNumber: number;
  backgroundColor: string;
  brickStyle?: { backgroundColor: string; borderColor: string };
  borderColor?: string;
  onExit: (score: number) => void;
  nextPath?: string;
};

export function GameScreen({
  config,
  initialScore,
  levelLabel,
  levelNumber,
  backgroundColor,
  brickStyle: brickStyleProp,
  borderColor = PALETTE.cyan,
  onExit,
  nextPath,
}: GameScreenProps) {
  const brickStyle = brickStyleProp ?? getBrickStyleForLevel(levelNumber);
  const router = useRouter();
  const { setHighScore, recordLevelComplete, soundEnabled, soundEffectsEnabled } = useGame();
  const [gameActive, setGameActive] = useState(true);
  const [levelComplete, setLevelComplete] = useState(false);
  useBackgroundMusic(soundEnabled, levelNumber, gameActive);
  useGameOverMusic(soundEnabled, gameActive);
  const playMissileSound = useMissileSound(soundEffectsEnabled);
  const [dimensions, setDimensions] = useState(() => Dimensions.get('window'));
  useEffect(() => {
    const sub = Dimensions.addEventListener('change', (e) => setDimensions(e.window));
    return () => sub?.remove();
  }, []);

  const playAreaHeight = dimensions.height - MENU_BAR_HEIGHT;
  const innerWidth = dimensions.width - 2 * BRICK_W;
  const innerHeight = playAreaHeight - 2 * BRICK_H;
  const playAreaRef = useRef<View>(null);
  const [fontsLoaded] = useFonts({ PressStart2P_400Regular });

  const gameLoop = useGameLoop(
    config,
    innerWidth,
    innerHeight,
    initialScore,
    gameActive,
    levelComplete,
    fontsLoaded,
    levelNumber,
    {
      onLevelComplete: () => setLevelComplete(true),
      onGameOver: () => setGameActive(false),
      onMissileFired: playMissileSound,
    }
  );

  const {
    gun,
    missiles,
    enemies,
    powerups,
    obstaclePositions,
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
    recordLevelComplete(levelNumber);
    if (nextPath) {
      router.replace({ pathname: nextPath, params: { score: String(score) } });
    } else {
      onExit(score);
    }
  }, [setHighScore, recordLevelComplete, levelNumber, score, nextPath, onExit, router]);

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
      <LevelIntro levelNumber={levelNumber} />
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
        <View style={[styles.particleLayer, { width: innerWidth, height: innerHeight }]}>
          <AmbientParticles
            styleId={getParticleStyleForLevel(levelNumber)}
            width={innerWidth}
            height={innerHeight}
          />
        </View>
        <BrickWall
          width={dimensions.width}
          innerHeight={innerHeight}
          tunnel={config.tunnel ?? 'none'}
          brickStyle={brickStyle}
        />
        <Pressable
          ref={playAreaRef}
          style={[styles.playArea, { width: innerWidth, height: innerHeight }]}
          onPress={handleTap}
          onLayout={() => {
            playAreaRef.current?.measureInWindow((x, y) => {
              setGameAreaLayout({ x, y });
            });
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
            >
              <GunSprite />
            </View>
          )}
          {enemies.map((e) => {
            const def = getEnemyType(e.typeId);
            return (
              <EnemyWithEffects
                key={e.id}
                enemy={e}
                Sprite={def.Sprite}
                radius={def.radius}
              />
            );
          })}
          {powerups.map((p) =>
            p.typeId === 'big' ? (
              <Powerup2Sprite key={p.id} x={p.x} y={p.y} />
            ) : p.typeId === 'spread' ? (
              <Powerup3Sprite key={p.id} x={p.x} y={p.y} />
            ) : p.typeId === 'extraLife' ? (
              <ExtraLifeSprite key={p.id} x={p.x} y={p.y} />
            ) : (
              <PowerupSprite key={p.id} x={p.x} y={p.y} />
            )
          )}
          {obstaclePositions.map((o, i) => (
            <ObstacleSprite key={i} x={o.x} y={o.y} index={i} />
          ))}
          {missiles.flatMap((m) => {
            const size = m.size ?? MISSILE_SIZE;
            const trailSteps = [3, 6, 9, 12];
            const trailOpacity = [0.5, 0.35, 0.2, 0.08];
            const speed = Math.hypot(m.dx, m.dy) || 1;
            const maxDist =
              m.spawnX != null && m.spawnY != null
                ? Math.hypot(m.x - m.spawnX, m.y - m.spawnY)
                : Infinity;
            const trails = trailSteps
              .filter((step) => step * speed < maxDist)
              .map((step, i) => (
                <View
                  key={`${m.id}-trail-${i}`}
                  style={[
                    styles.missileTrail,
                    {
                      left: m.x - size / 2 - m.dx * step,
                      top: m.y - size / 2 - m.dy * step,
                      width: size,
                      height: size,
                      borderRadius: size / 2,
                      opacity: trailOpacity[i],
                    },
                  ]}
                />
              ));
            return [
              ...trails,
              <View
                key={m.id}
                style={[
                  styles.missile,
                  {
                    left: m.x - size / 2,
                    top: m.y - size / 2,
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                  },
                ]}
              />,
            ];
          })}
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
  playAreaWrapper: { flex: 1, width: '100%', position: 'relative' },
  particleLayer: {
    position: 'absolute',
    left: BRICK_W,
    top: BRICK_H,
    zIndex: 1,
    pointerEvents: 'none',
  },
  playArea: {
    position: 'absolute',
    left: BRICK_W,
    top: BRICK_H,
  },
  gun: {
    position: 'absolute',
    width: GUN_SIZE,
    height: GUN_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  missile: {
    position: 'absolute',
    width: MISSILE_SIZE,
    height: MISSILE_SIZE,
    borderRadius: MISSILE_SIZE / 2,
    backgroundColor: PALETTE.yellow,
  },
  missileTrail: {
    position: 'absolute',
    backgroundColor: PALETTE.yellow,
  },
});
