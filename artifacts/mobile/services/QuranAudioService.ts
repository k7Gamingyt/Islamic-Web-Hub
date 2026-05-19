import { createAudioPlayer, setAudioModeAsync } from "expo-audio";
import type { AudioPlayer, AudioStatus } from "expo-audio";

export type AudioStatusCb = (status: AudioStatus) => void;

const CDN = "https://cdn.islamic.network/quran/audio/128/ar.alafasy";

export function ayahAudioUrl(globalNumber: number): string {
  return `${CDN}/${globalNumber}.mp3`;
}

export interface SurahTrack {
  surahNumber: number;
  surahName: string;
  surahArabicName: string;
  ayahGlobalNumbers: number[];
}

export async function fetchSurahTrack(surahNumber: number): Promise<SurahTrack> {
  const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/ar.alafasy`);
  if (!res.ok) throw new Error("Network error");
  const json = await res.json();
  if (json.status !== "OK") throw new Error("API error");
  const d = json.data;
  return {
    surahNumber: d.number,
    surahName: d.englishName,
    surahArabicName: d.name,
    ayahGlobalNumbers: d.ayahs.map((a: { number: number }) => a.number),
  };
}

class QuranAudioEngine {
  private player: AudioPlayer | null = null;
  private sub: { remove(): void } | null = null;
  private cb: AudioStatusCb | null = null;
  private modeSet = false;

  setCallback(cb: AudioStatusCb | null) {
    this.cb = cb;
    if (this.player) {
      this.sub?.remove();
      this.sub = cb ? this.player.addListener("playbackStatusUpdate", cb) : null;
    }
  }

  private async ensureMode() {
    if (this.modeSet) return;
    try {
      await setAudioModeAsync({ playsInSilentMode: true, interruptionMode: "duckOthers" });
    } catch {
      // Ignore — web doesn't support this
    }
    this.modeSet = true;
  }

  private release() {
    this.sub?.remove();
    this.sub = null;
    if (this.player) {
      try {
        this.player.remove();
      } catch {}
      this.player = null;
    }
  }

  async playUrl(url: string): Promise<void> {
    this.release();
    await this.ensureMode();
    const p = createAudioPlayer({ uri: url }, { updateInterval: 300 });
    if (this.cb) {
      this.sub = p.addListener("playbackStatusUpdate", this.cb);
    }
    this.player = p;
    p.play();
  }

  pause() {
    this.player?.pause();
  }

  resume() {
    this.player?.play();
  }

  async stop() {
    this.release();
  }
}

export const audioEngine = new QuranAudioEngine();
