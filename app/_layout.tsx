import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GameProvider } from '../context/GameContext';

export default function RootLayout() {
  return (
    <GameProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#1a1a2e' },
          animation: 'slide_from_right',
          freezeOnBlur: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="home" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="level1" />
        <Stack.Screen name="level2" />
        <Stack.Screen name="level3" />
        <Stack.Screen name="level4" />
        <Stack.Screen name="level5" />
        <Stack.Screen name="level6" />
        <Stack.Screen name="level7" />
        <Stack.Screen name="level8" />
        <Stack.Screen name="level9" />
        <Stack.Screen name="level10" />
        <Stack.Screen name="level11" />
        <Stack.Screen name="level12" />
        <Stack.Screen name="level13" />
        <Stack.Screen name="level14" />
        <Stack.Screen name="level15" />
        <Stack.Screen name="level16" />
        <Stack.Screen name="level17" />
        <Stack.Screen name="level18" />
        <Stack.Screen name="level19" />
        <Stack.Screen name="level20" />
      </Stack>
    </GameProvider>
  );
}
