// Custom entry so web bundle can resolve the app directory (fixes EXPO_ROUTER_APP_ROOT).
import '@expo/metro-runtime';
import React from 'react';
import { ExpoRoot } from 'expo-router/build/ExpoRoot';
import { renderRootComponent } from 'expo-router/build/renderRootComponent';
import { Head } from 'expo-router/build/head';
import 'expo-router/build/fast-refresh';

// Match route files under ./app (exclude +api and +(html|native-intent))
const routeRegex = /^\.\/(?!.*(\+api|\+(html|native-intent))).*\.(tsx?|jsx?)$/;
const ctx = require.context('./app', true, routeRegex);

function App() {
  return (
    <Head.Provider>
      <ExpoRoot context={ctx} />
    </Head.Provider>
  );
}

renderRootComponent(App);
