import { useFonts, PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

const MENU_BAR_HEIGHT = 48;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  menuBar: {
    height: MENU_BAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#00FFFF',
    backgroundColor: '#1a1a2e',
  },
  menuLeft: {
    minWidth: 32,
  },
  menuCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuRight: {
    minWidth: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
});

type ScreenLayoutProps = {
  menuLeft?: React.ReactNode;
  menuCenter?: React.ReactNode;
  menuRight?: React.ReactNode;
  children: React.ReactNode;
  contentStyle?: ViewStyle;
  containerStyle?: ViewStyle;
  menuBarStyle?: ViewStyle;
};

export function ScreenLayout({
  menuLeft,
  menuCenter,
  menuRight,
  children,
  contentStyle,
  containerStyle,
  menuBarStyle,
}: ScreenLayoutProps) {
  const [fontsLoaded] = useFonts({ PressStart2P_400Regular });

  if (!fontsLoaded) return null;

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.menuBar, menuBarStyle]}>
        <View style={styles.menuLeft}>{menuLeft}</View>
        <View style={styles.menuCenter}>{menuCenter}</View>
        <View style={styles.menuRight}>{menuRight}</View>
      </View>
      <View style={[styles.content, contentStyle]}>{children}</View>
    </View>
  );
}

export { MENU_BAR_HEIGHT };
