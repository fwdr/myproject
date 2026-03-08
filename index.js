// Custom entry so web bundle can resolve the app directory (fixes EXPO_ROUTER_APP_ROOT).
import '@expo/metro-runtime';
import './global.css';
import React from 'react';
import { ExpoRoot } from 'expo-router/build/ExpoRoot';
import { renderRootComponent } from 'expo-router/build/renderRootComponent';
import { Head } from 'expo-router/build/head';
import 'expo-router/build/fast-refresh';

// Literal regex required by Metro for require.context (matches route files under ./app)
const ctx = require.context('./app', true, /^\.\/(?!.*(\+api|\+(html|native-intent))).*\.(tsx?|jsx?)$/);

function App() {
  return (
    <Head.Provider>
      <ExpoRoot context={ctx} />
    </Head.Provider>
  );
}

renderRootComponent(App);
