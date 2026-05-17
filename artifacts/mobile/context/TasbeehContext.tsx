import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

export interface ZikrOption {
  arabic: string;
  transliteration: string;
  target: number;
}

export const ZIKR_OPTIONS: ZikrOption[] = [
  { arabic: "سُبْحَانَ اللَّهِ", transliteration: "SubhanAllah", target: 33 },
  { arabic: "الْحَمْدُ لِلَّهِ", transliteration: "Alhamdulillah", target: 33 },
  { arabic: "اللَّهُ أَكْبَرُ", transliteration: "Allahu Akbar", target: 34 },
  { arabic: "لاَ إِلَهَ إِلاَّ اللَّهُ", transliteration: "La ilaha illallah", target: 100 },
  { arabic: "أَسْتَغْفِرُ اللَّهَ", transliteration: "Astaghfirullah", target: 100 },
  { arabic: "صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ", transliteration: "Salawat", target: 100 },
];

interface TasbeehContextValue {
  count: number;
  selectedZikr: ZikrOption;
  totalToday: number;
  increment: () => void;
  reset: () => void;
  setZikr: (zikr: ZikrOption) => void;
}

const TasbeehContext = createContext<TasbeehContextValue | null>(null);
const STORAGE_KEY = "tasbeeh_v1";

interface StoredTasbeeh {
  count: number;
  selectedZikrIndex: number;
  totalToday: number;
  lastDate: string;
}

export function TasbeehProvider({ children }: { children: React.ReactNode }) {
  const [count, setCount] = useState(0);
  const [selectedZikr, setSelectedZikr] = useState<ZikrOption>(ZIKR_OPTIONS[0]);
  const [totalToday, setTotalToday] = useState(0);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (!raw) return;
      const stored: StoredTasbeeh = JSON.parse(raw);
      const today = new Date().toDateString();
      if (stored.lastDate === today) {
        setCount(stored.count);
        setTotalToday(stored.totalToday);
      }
      setSelectedZikr(ZIKR_OPTIONS[stored.selectedZikrIndex] ?? ZIKR_OPTIONS[0]);
    });
  }, []);

  const save = useCallback(
    async (newCount: number, newTotal: number, zikrIndex: number) => {
      const stored: StoredTasbeeh = {
        count: newCount,
        selectedZikrIndex: zikrIndex,
        totalToday: newTotal,
        lastDate: new Date().toDateString(),
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    },
    []
  );

  const increment = useCallback(() => {
    const newCount = count + 1;
    const newTotal = totalToday + 1;
    setCount(newCount);
    setTotalToday(newTotal);
    save(newCount, newTotal, ZIKR_OPTIONS.indexOf(selectedZikr));
  }, [count, totalToday, selectedZikr, save]);

  const reset = useCallback(() => {
    setCount(0);
    save(0, totalToday, ZIKR_OPTIONS.indexOf(selectedZikr));
  }, [totalToday, selectedZikr, save]);

  const setZikr = useCallback(
    (zikr: ZikrOption) => {
      setSelectedZikr(zikr);
      setCount(0);
      save(0, totalToday, ZIKR_OPTIONS.indexOf(zikr));
    },
    [totalToday, save]
  );

  return (
    <TasbeehContext.Provider value={{ count, selectedZikr, totalToday, increment, reset, setZikr }}>
      {children}
    </TasbeehContext.Provider>
  );
}

export function useTasbeeh(): TasbeehContextValue {
  const ctx = useContext(TasbeehContext);
  if (!ctx) throw new Error("useTasbeeh must be inside TasbeehProvider");
  return ctx;
}
