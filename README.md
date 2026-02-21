# Mobile Game Framework

A simple cross-platform (iOS & Android) mobile game shell built with **Expo** and **React Native**. One codebase, one stack.

## What’s included

- **Splash screen** → auto-navigates to Home after ~2 seconds (after saved settings load).
- **Home screen**
  - High score at the top (persisted).
  - Centered area for your game graphic/logo.
  - “Play Level 1” button.
  - Cog (⚙️) for Settings.
- **Settings screen**
  - Sound on/off toggle.
  - Settings saved with AsyncStorage and restored between sessions.
- **Level 1**
  - Placeholder screen; add your game logic and call `setHighScore` when the game ends.

## Setup

```bash
npm install
```

## Run

- **iOS:** `npm run ios`
- **Android:** `npm run android`
- **Dev server (choose device in terminal):** `npm start`

## Project layout

- `app/` – Expo Router (file-based) screens:
  - `index.tsx` – Splash
  - `home.tsx` – Home
  - `settings.tsx` – Settings
  - `level1.tsx` – Level 1 (placeholder)
- `context/GameContext.tsx` – Global state: `soundEnabled`, `highScore`, persisted via AsyncStorage.

## Customization

- **Home graphic:** Replace the placeholder in `app/home.tsx` (e.g. use `<Image source={...} />` or your own component).
- **High score:** Update from Level 1 (or any screen) with `useGame().setHighScore(newScore)` or `setHighScore(prev => Math.max(prev, score))`.
- **Sound:** Read `useGame().soundEnabled` where you play audio; toggle in Settings.

## Optional: app icon & splash image

Add to `app.json` when you have assets:

- `icon`: e.g. `./assets/icon.png`
- `splash.image`: e.g. `./assets/splash.png`
- Android `adaptiveIcon.foregroundImage`: e.g. `./assets/adaptive-icon.png`

Then add those files under `assets/`.
