export const SAMPLE_RATE = 44100;
export const BUFFER_DURATION_SECONDS = 30;
export const NUM_SAMPLES = SAMPLE_RATE * BUFFER_DURATION_SECONDS;
export const BITS_PER_SAMPLE = 16;
export const NUM_CHANNELS = 1;

export const TIMER_OPTIONS = [
  { label: '15 min', value: 15 * 60 * 1000 },
  { label: '30 min', value: 30 * 60 * 1000 },
  { label: '1 hour', value: 60 * 60 * 1000 },
  { label: '∞', value: 0 },
] as const;

export const VOLUME_PRESETS = [
  { label: 'Quiet', value: 0.25 },
  { label: 'Medium', value: 0.5 },
  { label: 'Loud', value: 0.85 },
] as const;

export const Colors = {
  dark: {
    background: '#0D0D0D',
    surface: '#1A1A2E',
    surfaceLight: '#252540',
    primary: '#7B68EE',
    primaryLight: '#9D8FFF',
    text: '#EAEAEA',
    textSecondary: '#A0A0B0',
    textMuted: '#6B6B80',
    accent: '#00D4AA',
    error: '#FF6B6B',
    border: '#2A2A40',
    cardBg: '#16162A',
  },
  light: {
    background: '#F5F5FA',
    surface: '#FFFFFF',
    surfaceLight: '#F0F0F8',
    primary: '#6C5CE7',
    primaryLight: '#A29BFE',
    text: '#1A1A2E',
    textSecondary: '#555570',
    textMuted: '#8888A0',
    accent: '#00B894',
    error: '#E74C3C',
    border: '#E0E0F0',
    cardBg: '#FFFFFF',
  },
} as const;

export type ThemeMode = 'dark' | 'light';
export type ColorScheme = typeof Colors.dark;
