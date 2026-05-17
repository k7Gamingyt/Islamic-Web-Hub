import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export interface Settings {
  city: string;
  country: string;
  language: "en" | "ur" | "ar";
  fontSize: number;
  calculationMethod: number;
}

interface SettingsContextValue {
  settings: Settings;
  updateSettings: (partial: Partial<Settings>) => Promise<void>;
}

const DEFAULT: Settings = {
  city: "Mecca",
  country: "SA",
  language: "en",
  fontSize: 24,
  calculationMethod: 4,
};

const SettingsContext = createContext<SettingsContextValue | null>(null);
const STORAGE_KEY = "settings_v1";

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) setSettings({ ...DEFAULT, ...JSON.parse(raw) });
    });
  }, []);

  const updateSettings = async (partial: Partial<Settings>) => {
    const updated = { ...settings, ...partial };
    setSettings(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return <SettingsContext.Provider value={{ settings, updateSettings }}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be inside SettingsProvider");
  return ctx;
}
