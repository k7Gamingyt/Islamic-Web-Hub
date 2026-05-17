import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "https://api.alquran.cloud/v1";
const CACHE_PREFIX = "quran_v1_";
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: "Meccan" | "Medinan";
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  page: number;
}

export interface SurahWithAyahs {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
  ayahs: Ayah[];
}

export interface SurahEditions {
  arabic: SurahWithAyahs;
  english: SurahWithAyahs;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

async function getCached<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const entry: CacheEntry<T> = JSON.parse(raw);
    if (Date.now() - entry.timestamp > CACHE_TTL) {
      await AsyncStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

async function setCache<T>(key: string, data: T): Promise<void> {
  try {
    const entry: CacheEntry<T> = { data, timestamp: Date.now() };
    await AsyncStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
  } catch {
    // ignore storage errors
  }
}

export const QuranService = {
  async getSurahList(): Promise<Surah[]> {
    const cached = await getCached<Surah[]>("surah_list");
    if (cached) return cached;

    const res = await fetch(`${BASE_URL}/surah`);
    if (!res.ok) throw new Error("Failed to fetch surah list");
    const data = await res.json();
    const surahs: Surah[] = data.data;
    await setCache("surah_list", surahs);
    return surahs;
  },

  async getSurah(number: number, edition = "en.sahih"): Promise<SurahEditions> {
    const cacheKey = `surah_${number}_${edition}`;
    const cached = await getCached<SurahEditions>(cacheKey);
    if (cached) return cached;

    const res = await fetch(`${BASE_URL}/surah/${number}/editions/quran-simple,${edition}`);
    if (!res.ok) throw new Error(`Failed to fetch surah ${number}`);
    const data = await res.json();
    const result: SurahEditions = {
      arabic: data.data[0],
      english: data.data[1],
    };
    await setCache(cacheKey, result);
    return result;
  },

  async searchSurah(query: string, surahs: Surah[]): Promise<Surah[]> {
    const q = query.toLowerCase().trim();
    if (!q) return surahs;
    return surahs.filter(
      (s) =>
        s.englishName.toLowerCase().includes(q) ||
        s.name.includes(q) ||
        s.englishNameTranslation.toLowerCase().includes(q) ||
        String(s.number).includes(q)
    );
  },

  async saveLastRead(surahNumber: number, ayahNumber: number): Promise<void> {
    await AsyncStorage.setItem("last_read", JSON.stringify({ surahNumber, ayahNumber, timestamp: Date.now() }));
  },

  async getLastRead(): Promise<{ surahNumber: number; ayahNumber: number; timestamp: number } | null> {
    try {
      const raw = await AsyncStorage.getItem("last_read");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
};
