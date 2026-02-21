import * as SplashScreen from 'expo-splash-screen';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useGame } from '../context/GameContext';

if (Platform.OS !== 'web') {
  SplashScreen.preventAutoHideAsync();
}

const SPLASH_DURATION_MS = 2000;

export default function SplashScreenPage() {
  const router = useRouter();
  const { isLoading } = useGame();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isLoading) return;

    const goHome = () => {
      if (Platform.OS !== 'web') SplashScreen.hideAsync();
      router.replace('/home');
    };

    timeoutRef.current = setTimeout(goHome, SPLASH_DURATION_MS);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isLoading, router]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mobile Game</Text>
      <Text style={styles.subtitle}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#eee',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
  },
});
