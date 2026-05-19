import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { AudioStatus } from "expo-audio";

import {
  audioEngine,
  ayahAudioUrl,
  fetchSurahTrack,
  type SurahTrack,
} from "@/services/QuranAudioService";

export type PlayState = "idle" | "loading" | "playing" | "paused" | "error";

interface AudioContextValue {
  playState: PlayState;
  track: SurahTrack | null;
  ayahIndex: number | null;
  isContinuous: boolean;
  progress: number;
  position: number;
  duration: number;
  error: string | null;
  playSurah: (surahNumber: number) => Promise<void>;
  playAyah: (surahNumber: number, ayahIndex: number) => Promise<void>;
  togglePlayPause: () => Promise<void>;
  stop: () => Promise<void>;
  toggleContinuous: () => void;
}

const Ctx = createContext<AudioContextValue | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [playState, setPlayState] = useState<PlayState>("idle");
  const [track, setTrack] = useState<SurahTrack | null>(null);
  const [ayahIndex, setAyahIndex] = useState<number | null>(null);
  const [isContinuous, setIsContinuous] = useState(true);
  const [progress, setProgress] = useState(0);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const trackRef = useRef<SurahTrack | null>(null);
  const ayahIndexRef = useRef<number | null>(null);
  const continuousRef = useRef(true);
  const playStateRef = useRef<PlayState>("idle");
  trackRef.current = track;
  ayahIndexRef.current = ayahIndex;
  continuousRef.current = isContinuous;
  playStateRef.current = playState;

  // Stable status callback set once on mount
  const statusCbRef = useRef<((s: AudioStatus) => void) | null>(null);
  useEffect(() => {
    statusCbRef.current = (status: AudioStatus) => {
      if (!status.isLoaded) return;

      const pos = status.currentTime ?? 0;
      const dur = status.duration ?? 0;
      setPosition(pos);
      setDuration(dur);
      setProgress(dur > 0 ? Math.min(pos / dur, 1) : 0);

      if (status.playing && playStateRef.current !== "playing") {
        setPlayState("playing");
      }

      if (status.didJustFinish) {
        const t = trackRef.current;
        const idx = ayahIndexRef.current;
        if (continuousRef.current && t && idx !== null) {
          const nextIdx = idx + 1;
          if (nextIdx < t.ayahGlobalNumbers.length) {
            setAyahIndex(nextIdx);
            ayahIndexRef.current = nextIdx;
            audioEngine.playUrl(ayahAudioUrl(t.ayahGlobalNumbers[nextIdx])).catch(() => {
              setError("Could not play next ayah.");
              setPlayState("error");
            });
          } else {
            setPlayState("idle");
            setAyahIndex(null);
            setProgress(0);
          }
        } else {
          setPlayState("idle");
          setAyahIndex(null);
          setProgress(0);
        }
      }
    };

    audioEngine.setCallback((s) => statusCbRef.current?.(s));
    return () => audioEngine.setCallback(null);
  }, []);

  const loadTrack = useCallback(async (surahNumber: number): Promise<SurahTrack> => {
    if (trackRef.current?.surahNumber === surahNumber) return trackRef.current;
    const t = await fetchSurahTrack(surahNumber);
    setTrack(t);
    trackRef.current = t;
    return t;
  }, []);

  const playSurah = useCallback(
    async (surahNumber: number) => {
      setError(null);
      setPlayState("loading");
      try {
        const t = await loadTrack(surahNumber);
        setAyahIndex(0);
        ayahIndexRef.current = 0;
        await audioEngine.playUrl(ayahAudioUrl(t.ayahGlobalNumbers[0]));
        setPlayState("playing");
      } catch {
        setError("Could not load recitation. Check your connection.");
        setPlayState("error");
      }
    },
    [loadTrack]
  );

  const playAyah = useCallback(
    async (surahNumber: number, idx: number) => {
      setError(null);
      setPlayState("loading");
      try {
        const t = await loadTrack(surahNumber);
        setAyahIndex(idx);
        ayahIndexRef.current = idx;
        await audioEngine.playUrl(ayahAudioUrl(t.ayahGlobalNumbers[idx]));
        setPlayState("playing");
      } catch {
        setError("Could not play this ayah.");
        setPlayState("error");
      }
    },
    [loadTrack]
  );

  const togglePlayPause = useCallback(async () => {
    if (playStateRef.current === "playing") {
      audioEngine.pause();
      setPlayState("paused");
    } else if (playStateRef.current === "paused") {
      audioEngine.resume();
      setPlayState("playing");
    }
  }, []);

  const stop = useCallback(async () => {
    await audioEngine.stop();
    setPlayState("idle");
    setAyahIndex(null);
    setProgress(0);
    setPosition(0);
    setDuration(0);
    setError(null);
  }, []);

  const toggleContinuous = useCallback(() => setIsContinuous((v) => !v), []);

  return (
    <Ctx.Provider
      value={{
        playState,
        track,
        ayahIndex,
        isContinuous,
        progress,
        position,
        duration,
        error,
        playSurah,
        playAyah,
        togglePlayPause,
        stop,
        toggleContinuous,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAudio(): AudioContextValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAudio must be inside AudioProvider");
  return ctx;
}
