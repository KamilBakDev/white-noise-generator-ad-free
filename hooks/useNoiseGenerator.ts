import { useState, useRef, useCallback, useEffect } from 'react';
import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import { File, Paths } from 'expo-file-system/next';
import { generateNoiseSamples, encodeWav } from '../utils/audioGenerator';
import type { NoiseType } from '../utils/noises';

interface NoisePlayerState {
  isPlaying: boolean;
  volume: number;
  isLoading: boolean;
}

interface NoiseGeneratorReturn {
  players: Record<NoiseType, NoisePlayerState>;
  masterVolume: number;
  masterPlaying: boolean;
  timerMs: number;
  timerRemaining: number | null;
  play: (noiseType: NoiseType) => Promise<void>;
  pause: (noiseType: NoiseType) => void;
  toggle: (noiseType: NoiseType) => Promise<void>;
  setVolume: (noiseType: NoiseType, volume: number) => void;
  setMasterVolume: (volume: number) => void;
  masterToggle: () => Promise<void>;
  stopAll: () => void;
  setTimer: (ms: number) => void;
}

const NOISE_TYPES: NoiseType[] = ['white', 'pink', 'brown', 'blue', 'violet', 'grey'];
const FADE_DURATION_MS = 400;
const FADE_STEPS = 16;

export function useNoiseGenerator(): NoiseGeneratorReturn {
  const playerRefs = useRef<Partial<Record<NoiseType, AudioPlayer>>>({});
  const fileCache = useRef<Partial<Record<NoiseType, string>>>({});

  const [players, setPlayers] = useState<Record<NoiseType, NoisePlayerState>>(() => {
    const initial: Record<string, NoisePlayerState> = {};
    for (const type of NOISE_TYPES) {
      initial[type] = { isPlaying: false, volume: 0.5, isLoading: false };
    }
    return initial as Record<NoiseType, NoisePlayerState>;
  });

  const [masterVolume, setMasterVolumeState] = useState(0.7);
  const [masterPlaying, setMasterPlaying] = useState(false);
  const [timerMs, setTimerMs] = useState(0);
  const [timerRemaining, setTimerRemaining] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerEndRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const masterVolumeRef = useRef(0.7);
  const playersRef = useRef(players);
  playersRef.current = players;

  // Configure audio mode on mount
  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      interruptionMode: 'duckOthers',
    });

    return () => {
      // Cleanup all players on unmount
      for (const player of Object.values(playerRefs.current)) {
        if (player) {
          try { player.remove(); } catch {}
        }
      }
      if (timerRef.current) clearInterval(timerRef.current);
      if (timerEndRef.current) clearTimeout(timerEndRef.current);
    };
  }, []);

  const getOrCreateWavFile = useCallback(async (type: NoiseType): Promise<string> => {
    if (fileCache.current[type]) {
      return fileCache.current[type]!;
    }

    const file = new File(Paths.cache, `noise_${type}.wav`);

    if (file.exists) {
      fileCache.current[type] = file.uri;
      return file.uri;
    }

    const samples = generateNoiseSamples(type);
    const wavBuffer = encodeWav(samples);
    const bytes = new Uint8Array(wavBuffer);

    file.create();
    file.write(bytes);

    fileCache.current[type] = file.uri;
    return file.uri;
  }, []);

  const fadeVolume = useCallback(
    async (player: AudioPlayer, fromVol: number, toVol: number) => {
      const stepDuration = FADE_DURATION_MS / FADE_STEPS;
      const stepSize = (toVol - fromVol) / FADE_STEPS;

      for (let i = 1; i <= FADE_STEPS; i++) {
        const vol = fromVol + stepSize * i;
        try {
          player.volume = Math.max(0, Math.min(1, vol));
        } catch {
          break;
        }
        await new Promise<void>((resolve) => setTimeout(resolve, stepDuration));
      }
    },
    []
  );

  const play = useCallback(
    async (noiseType: NoiseType) => {
      setPlayers((prev) => ({
        ...prev,
        [noiseType]: { ...prev[noiseType], isLoading: true },
      }));

      try {
        let player = playerRefs.current[noiseType];

        if (!player) {
          const fileUri = await getOrCreateWavFile(noiseType);
          player = createAudioPlayer(fileUri);
          player.loop = true;
          player.volume = 0;
          playerRefs.current[noiseType] = player;
          player.play();
        } else {
          player.volume = 0;
          player.seekTo(0);
          player.play();
        }

        const targetVol = playersRef.current[noiseType].volume * masterVolumeRef.current;
        await fadeVolume(player, 0, targetVol);

        setPlayers((prev) => ({
          ...prev,
          [noiseType]: { ...prev[noiseType], isPlaying: true, isLoading: false },
        }));
        setMasterPlaying(true);
      } catch (error) {
        console.error(`Error playing ${noiseType}:`, error);
        setPlayers((prev) => ({
          ...prev,
          [noiseType]: { ...prev[noiseType], isLoading: false },
        }));
      }
    },
    [getOrCreateWavFile, fadeVolume]
  );

  const pause = useCallback(
    (noiseType: NoiseType) => {
      const player = playerRefs.current[noiseType];
      if (player) {
        try { player.pause(); } catch {}
      }

      setPlayers((prev) => {
        const next = {
          ...prev,
          [noiseType]: { ...prev[noiseType], isPlaying: false },
        };
        const anyPlaying = NOISE_TYPES.some(
          (t) => t !== noiseType && next[t].isPlaying
        );
        if (!anyPlaying) {
          setMasterPlaying(false);
        }
        return next;
      });
    },
    []
  );

  const toggle = useCallback(
    async (noiseType: NoiseType) => {
      if (playersRef.current[noiseType].isPlaying) {
        pause(noiseType);
      } else {
        await play(noiseType);
      }
    },
    [play, pause]
  );

  const setVolume = useCallback(
    (noiseType: NoiseType, volume: number) => {
      setPlayers((prev) => ({
        ...prev,
        [noiseType]: { ...prev[noiseType], volume },
      }));

      const player = playerRefs.current[noiseType];
      if (player && playersRef.current[noiseType].isPlaying) {
        try {
          player.volume = volume * masterVolumeRef.current;
        } catch {}
      }
    },
    []
  );

  const setMasterVolume = useCallback(
    (volume: number) => {
      setMasterVolumeState(volume);
      masterVolumeRef.current = volume;

      for (const type of NOISE_TYPES) {
        const player = playerRefs.current[type];
        if (player && playersRef.current[type].isPlaying) {
          try {
            player.volume = playersRef.current[type].volume * volume;
          } catch {}
        }
      }
    },
    []
  );

  const masterToggle = useCallback(async () => {
    if (masterPlaying) {
      for (const type of NOISE_TYPES) {
        if (playersRef.current[type].isPlaying) {
          pause(type);
        }
      }
    } else {
      const wasPlaying = NOISE_TYPES.filter((t) => playersRef.current[t].isPlaying);
      if (wasPlaying.length > 0) {
        for (const type of wasPlaying) {
          await play(type);
        }
      } else {
        await play('white');
      }
    }
  }, [masterPlaying, play, pause]);

  const stopAll = useCallback(() => {
    for (const type of NOISE_TYPES) {
      const player = playerRefs.current[type];
      if (player) {
        try {
          player.pause();
          player.seekTo(0);
        } catch {}
      }
    }
    setPlayers((prev) => {
      const next = { ...prev };
      for (const type of NOISE_TYPES) {
        next[type] = { ...next[type], isPlaying: false };
      }
      return next;
    });
    setMasterPlaying(false);
  }, []);

  const setTimer = useCallback(
    (ms: number) => {
      // Clear existing timer
      if (timerRef.current) clearInterval(timerRef.current);
      if (timerEndRef.current) clearTimeout(timerEndRef.current);
      setTimerMs(ms);

      if (ms === 0) {
        setTimerRemaining(null);
        return;
      }

      const endTime = Date.now() + ms;
      setTimerRemaining(ms);

      timerRef.current = setInterval(() => {
        const remaining = endTime - Date.now();
        if (remaining <= 0) {
          setTimerRemaining(0);
          if (timerRef.current) clearInterval(timerRef.current);
        } else {
          setTimerRemaining(remaining);
        }
      }, 1000);

      timerEndRef.current = setTimeout(() => {
        stopAll();
        setTimerRemaining(null);
        setTimerMs(0);
        if (timerRef.current) clearInterval(timerRef.current);
      }, ms);
    },
    [stopAll]
  );

  return {
    players,
    masterVolume,
    masterPlaying,
    timerMs,
    timerRemaining,
    play,
    pause,
    toggle,
    setVolume,
    setMasterVolume,
    masterToggle,
    stopAll,
    setTimer,
  };
}
