import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSegments } from "expo-router";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useRef } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { MiniPlayer } from "@/components/MiniPlayer";
import { AudioProvider, useAudio } from "@/context/AudioContext";
import { BookmarksProvider } from "@/context/BookmarksContext";
import { SettingsProvider } from "@/context/SettingsContext";
import { TasbeehProvider } from "@/context/TasbeehContext";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 5 * 60 * 1000 },
  },
});

const SCREEN_OPTIONS = {
  headerShown: false,
  contentStyle: { backgroundColor: "#080D08" },
  animation: "slide_from_right" as const,
};

/** Stops audio automatically when leaving Quran pages */
function AudioStopWatcher() {
  const segments = useSegments();
  const { playState, stop } = useAudio();
  const playStateRef = useRef(playState);
  playStateRef.current = playState;

  const isQuranPage = segments.some((s) => typeof s === "string" && s.includes("quran"));

  useEffect(() => {
    if (!isQuranPage && playStateRef.current !== "idle") {
      stop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isQuranPage]);

  return null;
}

function RootLayoutNav() {
  return (
    <>
      <AudioStopWatcher />
      <Stack screenOptions={SCREEN_OPTIONS}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="quran/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="tasbeeh" options={{ headerShown: false }} />
        <Stack.Screen name="qibla" options={{ headerShown: false }} />
        <Stack.Screen name="calendar" options={{ headerShown: false }} />
        <Stack.Screen name="hadith" options={{ headerShown: false }} />
        <Stack.Screen name="names" options={{ headerShown: false }} />
        <Stack.Screen name="duas" options={{ headerShown: false }} />
        <Stack.Screen name="makkah" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <AudioProvider>
            <SettingsProvider>
              <BookmarksProvider>
                <TasbeehProvider>
                  <GestureHandlerRootView style={{ flex: 1 }}>
                    <KeyboardProvider>
                      <View style={{ flex: 1 }}>
                        <RootLayoutNav />
                        <MiniPlayer />
                      </View>
                    </KeyboardProvider>
                  </GestureHandlerRootView>
                </TasbeehProvider>
              </BookmarksProvider>
            </SettingsProvider>
          </AudioProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
