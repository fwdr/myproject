import { useFonts, PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';
import { useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ScreenLayout } from '../components/ScreenLayout';
import { useGame } from '../context/GameContext';

export default function HomeScreen() {
  const router = useRouter();
  const { highScore } = useGame();
  const [fontsLoaded] = useFonts({ PressStart2P_400Regular });

  if (!fontsLoaded) return null;

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
      <View style={styles.graphicContainer}>
        <View style={styles.graphicPlaceholder}>
          <Text style={[styles.graphicText, { fontFamily: 'PressStart2P_400Regular' }]}>
            Your graphic here
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.playButton}
        onPress={() => router.push('/level1')}
        activeOpacity={0.8}
      >
        <Text style={[styles.playButtonText, { fontFamily: 'PressStart2P_400Regular' }]}>
          PLAY
        </Text>
      </TouchableOpacity>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 24,
  },
  graphicContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  graphicPlaceholder: {
    width: '100%',
    aspectRatio: 1,
    maxWidth: 280,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  graphicText: {
    fontSize: 10,
    color: '#666',
    letterSpacing: 1,
  },
  playButton: {
    backgroundColor: '#4ade80',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderWidth: 3,
    borderColor: '#22c55e',
    alignItems: 'center',
    marginBottom: 24,
  },
  playButtonText: {
    fontSize: 16,
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
