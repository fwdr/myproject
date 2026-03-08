import { useRouter, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { GameScreen } from '../components/GameScreen';
import { LEVEL_16 } from '../config/levels/level16';
import { PALETTE } from '../lib/gameConstants';

const L16_BG = '#0a1a0a';

export default function Level16Screen() {
  const router = useRouter();
  const { score: scoreParam } = useLocalSearchParams<{ score?: string }>();
  const initialScore = parseInt(scoreParam ?? '0', 10) || 0;

  const onExit = useCallback(
    (_score: number) => {
      router.replace('/home');
    },
    [router]
  );

  return (
    <GameScreen
      config={LEVEL_16}
      initialScore={initialScore}
      levelLabel="L-16"
      levelNumber={16}
      backgroundColor={L16_BG}
      brickStyle={{ backgroundColor: PALETTE.green, borderColor: PALETTE.lime }}
      borderColor={PALETTE.magenta}
      onExit={onExit}
      nextPath="/level17"
    />
  );
}
