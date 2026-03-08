import { useRouter, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { GameScreen } from '../components/GameScreen';
import { LEVEL_7 } from '../config/levels/level7';
import { PALETTE } from '../lib/gameConstants';

const L7_BG = '#0a1a1a';

export default function Level7Screen() {
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
      config={LEVEL_7}
      initialScore={initialScore}
      levelLabel="L-07"
      levelNumber={7}
      backgroundColor={L7_BG}
      borderColor={PALETTE.red}
      onExit={onExit}
      nextPath="/level8"
    />
  );
}
