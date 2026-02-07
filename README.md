# White Noise Generator Ad-Free

A simple, beautiful, and fully offline white noise generator app built with React Native and Expo. No ads, no trackers, no analytics — ever.

## Features

- **6 scientifically-backed noise types**: White, Pink, Brown, Blue, Violet, and Grey noise
- **Programmatic audio generation**: All noise is generated mathematically on-device — no audio files needed
- **Sleep timer**: 15min, 30min, 1h, or infinite playback
- **Background playback**: Audio continues when the app is minimized
- **Dark/Light mode**: Eye-friendly dark theme by default
- **Individual + master volume controls** with preset buttons
- **Fade-in/fade-out transitions** between noise changes
- **Fully offline**: Works without internet connection
- **Zero data collection**: No analytics, no tracking, no permissions beyond audio

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI: `npm install -g eas-cli`
- Android Studio (for local builds) or EAS Build (cloud)

### Installation

```bash
# Install dependencies
npm install

# Install Expo-specific packages
npx expo install expo-av expo-file-system expo-haptics expo-task-manager expo-constants expo-font expo-linking expo-splash-screen expo-status-bar expo-system-ui expo-web-browser expo-router @react-native-community/slider

# Start development server
npx expo start
```

### Running on Android

```bash
# Start with Android
npx expo start --android

# Or scan QR code with Expo Go app
npx expo start
```

## Building for Google Play Store

### 1. Configure EAS

```bash
# Login to Expo account
eas login

# Configure project (first time only)
eas build:configure
```

### 2. Build APK (for testing)

```bash
eas build --platform android --profile preview
```

### 3. Build AAB (for Play Store)

```bash
eas build --platform android --profile production
```

### 4. Submit to Play Store

```bash
# Automatic submission (requires google-services.json)
eas submit --platform android --profile production

# Or manually:
# 1. Download the .aab file from EAS dashboard
# 2. Go to https://play.google.com/console
# 3. Create a new app ($25 one-time developer fee)
# 4. Upload the .aab file under "Production" > "Create new release"
# 5. Fill in store listing (title, description, screenshots)
# 6. Submit for review (typically <1h for new apps)
```

### 5. Play Store Listing Info

- **Title**: White Noise Generator Ad-Free
- **Short description**: Free, offline white noise generator with 6 scientifically-backed noise types for better sleep, focus, and relaxation.
- **Category**: Health & Fitness
- **Content rating**: Everyone
- **Privacy Policy**: This app does not collect, store, or transmit any user data. All audio is generated locally on the device.

## Project Structure

```
├── app/
│   ├── _layout.tsx              # Root layout with theme provider
│   └── (tabs)/
│       ├── _layout.tsx          # Tab navigator
│       ├── index.tsx            # Main noise list screen
│       └── settings.tsx         # Settings & about screen
├── components/
│   ├── NoiseCard.tsx            # Noise card with controls
│   ├── VolumeSlider.tsx         # Volume slider with presets
│   ├── TimerPicker.tsx          # Sleep timer selector
│   └── GlobalControls.tsx       # Master controls bar
├── hooks/
│   └── useNoiseGenerator.ts     # Audio generation & playback logic
├── utils/
│   ├── noises.ts                # Noise metadata & descriptions
│   ├── audioGenerator.ts        # PCM WAV generation algorithms
│   └── theme.ts                 # Theme context
├── constants.ts                 # App constants
├── app.json                     # Expo configuration
├── eas.json                     # EAS Build configuration
└── package.json
```

## Noise Types & Science

| Noise | Spectrum | Benefits | Source |
|-------|----------|----------|--------|
| White | Flat | Masks background noise, improves focus | Frontiers in Psychology (2017) |
| Pink | 1/f | Enhances deep sleep and memory | Nature (2013) |
| Brown | 1/f² | Reduces cortisol, deep relaxation | J. Theoretical Biology (2020) |
| Blue | f | Boosts concentration in visual tasks | Audio Engineering Society |
| Violet | f² | Facilitates meditation, reduces stress | EEG research |
| Grey | Equal-loudness | Soothes tinnitus | American Tinnitus Association |

## Technical Details

- Audio is generated as 16-bit PCM WAV at 44100 Hz (mono, 5-second buffers)
- Buffers are written to cache and looped seamlessly with `expo-av`
- Fade-in/fade-out prevents audio clicks during transitions
- Background audio mode keeps playback active when app is minimized
- App size: <50MB
- Battery-friendly: minimal CPU usage during playback (just audio looping)

## Privacy Policy

This application does not collect, store, or transmit any personal data. No analytics, advertising SDKs, or tracking mechanisms are included. All audio processing occurs entirely on the user's device. No internet connection is required.

## License

MIT
