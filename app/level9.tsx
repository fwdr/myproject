import { useRouter, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { GameScreen } from '../components/GameScreen';
import { LEVEL_9 } from '../config/levels/level9';
import { PALETTE } from '../lib/gameConstants';

const L9_BG = '#1a0a1a';

export default function Level9Screen() {
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
      config={LEVEL_9}
      initialScore={initialScore}
      levelLabel="L-09"
      levelNumber={9}
      backgroundColor={L9_BG}
      borderColor={PALETTE.magenta}
      onExit={onExit}
      nextPath="/level10"
    />
  );
}
