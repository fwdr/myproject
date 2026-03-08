import { useRouter, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { GameScreen } from '../components/GameScreen';
import { LEVEL_14 } from '../config/levels/level14';
import { PALETTE } from '../lib/gameConstants';

const L14_BG = '#1a1a0a';

export default function Level14Screen() {
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
      config={LEVEL_14}
      initialScore={initialScore}
      levelLabel="L-14"
      levelNumber={14}
      backgroundColor={L14_BG}
      borderColor={PALETTE.yellow}
      onExit={onExit}
      nextPath="/level15"
    />
  );
}
