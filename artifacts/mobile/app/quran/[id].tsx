import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAudio } from "@/context/AudioContext";
import { useBookmarks } from "@/context/BookmarksContext";
import { useSettings } from "@/context/SettingsContext";
import { useColors } from "@/hooks/useColors";
import { QuranService, type Ayah } from "@/services/QuranService";

interface AyahPair {
  numberInSurah: number;
  arabic: string;
  english: string;
}

export default function SurahScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const surahNumber = parseInt(id ?? "1", 10);
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { settings } = useSettings();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const [fontSize, setFontSize] = useState(settings.fontSize);

  const {
    playState,
    track,
    ayahIndex: activeAyahIndex,
    playSurah,
    playAyah,
    togglePlayPause,
    stop,
  } = useAudio();

  const isThisSurah = track?.surahNumber === surahNumber;
  const surahIsActive = isThisSurah && playState !== "idle";
  const surahIsPlaying = isThisSurah && playState === "playing";
  const surahIsLoading = isThisSurah && playState === "loading";

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["surah", surahNumber, settings.language],
    queryFn: async () => {
      const editions = await QuranService.getSurah(
        surahNumber,
        settings.language === "ur" ? "ur.jalandhry" : "en.sahih"
      );
      await QuranService.saveLastRead(surahNumber, 1);
      return editions;
    },
  });

  const ayahPairs: AyahPair[] = data
    ? data.arabic.ayahs.map((ayah: Ayah, i: number) => ({
        numberInSurah: ayah.numberInSurah,
        arabic: ayah.text,
        english: data.english.ayahs[i]?.text ?? "",
      }))
    : [];

  const handleAyahLongPress = useCallback(
    (pair: AyahPair) => {
      toggleBookmark({
        surahNumber,
        surahName: data?.arabic.englishName ?? `Surah ${surahNumber}`,
        ayahNumber: pair.numberInSurah,
        ayahText: pair.arabic,
        savedAt: Date.now(),
      });
    },
    [surahNumber, data, toggleBookmark]
  );

  const handleSurahPlayPress = useCallback(async () => {
    if (surahIsActive) {
      await togglePlayPause();
    } else {
      await playSurah(surahNumber);
    }
  }, [surahIsActive, surahNumber, playSurah, togglePlayPause]);

  const handleAyahPlayPress = useCallback(
    async (idx: number) => {
      const isThisAyahPlaying = isThisSurah && activeAyahIndex === idx && playState !== "idle";
      if (isThisAyahPlaying) {
        await togglePlayPause();
      } else {
        await playAyah(surahNumber, idx);
      }
    },
    [isThisSurah, activeAyahIndex, playState, surahNumber, playAyah, togglePlayPause]
  );

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const miniPlayerOffset = playState !== "idle" ? 90 : 0;

  const renderAyah = ({ item, index }: { item: AyahPair; index: number }) => {
    const bookmarked = isBookmarked(surahNumber, item.numberInSurah);
    const isThisAyahActive = isThisSurah && activeAyahIndex === index;
    const isThisAyahPlaying = isThisAyahActive && playState === "playing";
    const isThisAyahLoading = isThisAyahActive && playState === "loading";

    return (
      <Pressable
        onLongPress={() => handleAyahLongPress(item)}
        style={[
          styles.ayahContainer,
          {
            borderColor: isThisAyahActive
              ? "rgba(201,168,76,0.35)"
              : colors.border,
            backgroundColor: isThisAyahActive
              ? "rgba(201,168,76,0.05)"
              : "transparent",
          },
        ]}
      >
        <View style={styles.ayahHeader}>
          <View style={styles.ayahHeaderLeft}>
            <View style={[styles.ayahNumBadge, { backgroundColor: isThisAyahActive ? colors.goldDim : "rgba(201,168,76,0.08)" }]}>
              <Text style={[styles.ayahNumText, { color: colors.gold }]}>
                {item.numberInSurah}
              </Text>
            </View>
            {bookmarked && (
              <Feather name="bookmark" size={14} color={colors.gold} />
            )}
          </View>

          {/* Ayah play button */}
          <TouchableOpacity
            onPress={() => handleAyahPlayPress(index)}
            hitSlop={8}
            style={[
              styles.ayahPlayBtn,
              {
                backgroundColor: isThisAyahActive
                  ? colors.goldDim
                  : "rgba(201,168,76,0.07)",
                borderColor: isThisAyahActive
                  ? "rgba(201,168,76,0.5)"
                  : "rgba(201,168,76,0.18)",
              },
            ]}
          >
            {isThisAyahLoading ? (
              <ActivityIndicator size="small" color={colors.gold} />
            ) : (
              <Feather
                name={isThisAyahPlaying ? "pause" : "play"}
                size={12}
                color={colors.gold}
              />
            )}
          </TouchableOpacity>
        </View>

        <Text
          style={[
            styles.arabicText,
            { color: colors.foreground, fontSize: fontSize },
          ]}
        >
          {item.arabic}
        </Text>
        <Text style={[styles.englishText, { color: colors.mutedForeground }]}>
          {item.english}
        </Text>
      </Pressable>
    );
  };

  return (
    <LinearGradient
      colors={["#060A06", "#0A1A10", "#060A06"]}
      style={styles.gradient}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={[styles.surahTitle, { color: colors.foreground }]}>
            {data ? data.arabic.englishName : `Surah ${surahNumber}`}
          </Text>
          {data && (
            <Text style={[styles.surahSub, { color: colors.mutedForeground }]}>
              {data.arabic.numberOfAyahs} Ayahs · {data.arabic.revelationType}
            </Text>
          )}
        </View>

        <View style={styles.headerRight}>
          {/* Font controls */}
          <View style={styles.fontControls}>
            <TouchableOpacity
              onPress={() => setFontSize((f) => Math.max(16, f - 2))}
              style={[styles.fontBtn, { borderColor: colors.border }]}
            >
              <Text style={[styles.fontBtnText, { color: colors.gold }]}>A-</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setFontSize((f) => Math.min(40, f + 2))}
              style={[styles.fontBtn, { borderColor: colors.border }]}
            >
              <Text style={[styles.fontBtnText, { color: colors.gold }]}>A+</Text>
            </TouchableOpacity>
          </View>

          {/* Surah play button */}
          <TouchableOpacity
            onPress={handleSurahPlayPress}
            style={[
              styles.surahPlayBtn,
              {
                backgroundColor: surahIsActive ? colors.goldDim : "rgba(201,168,76,0.1)",
                borderColor: "rgba(201,168,76,0.35)",
              },
            ]}
          >
            {surahIsLoading ? (
              <ActivityIndicator size="small" color={colors.gold} />
            ) : (
              <Feather
                name={surahIsPlaying ? "pause" : "play"}
                size={16}
                color={colors.gold}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Bismillah */}
      {surahNumber !== 1 && surahNumber !== 9 && (
        <Text style={[styles.bismillah, { color: colors.gold }]}>
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
        </Text>
      )}

      {/* Audio error banner */}
      {playState === "error" && isThisSurah && (
        <View style={[styles.errorBanner, { backgroundColor: "rgba(239,68,68,0.12)", borderColor: "rgba(239,68,68,0.3)" }]}>
          <Feather name="alert-circle" size={14} color="#ef4444" />
          <Text style={[styles.errorBannerText, { color: "#ef4444" }]}>
            Unable to play recitation. Check your connection and try again.
          </Text>
          <TouchableOpacity onPress={() => playSurah(surahNumber)}>
            <Text style={[styles.retryLink, { color: colors.gold }]}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.gold} />
          <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>
            Loading surah...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Feather name="wifi-off" size={32} color={colors.mutedForeground} />
          <Text style={[styles.errorText, { color: colors.foreground }]}>
            Failed to load surah
          </Text>
          <TouchableOpacity
            onPress={() => refetch()}
            style={[styles.retryBtn, { borderColor: colors.gold }]}
          >
            <Text style={[styles.retryText, { color: colors.gold }]}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={ayahPairs}
          keyExtractor={(item) => String(item.numberInSurah)}
          renderItem={renderAyah}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.list,
            {
              paddingBottom:
                (Platform.OS === "web" ? 34 : insets.bottom + 24) +
                miniPlayerOffset,
            },
          ]}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 8,
  },
  backBtn: { padding: 4 },
  headerCenter: { flex: 1 },
  surahTitle: { fontSize: 17, fontWeight: "700" },
  surahSub: { fontSize: 11, marginTop: 1 },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  fontControls: { flexDirection: "row", gap: 4 },
  fontBtn: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  fontBtnText: { fontSize: 12, fontWeight: "700" },
  surahPlayBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  bismillah: {
    fontSize: 22,
    textAlign: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  errorBannerText: { fontSize: 12, flex: 1 },
  retryLink: { fontSize: 12, fontWeight: "700" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  loadingText: { fontSize: 14 },
  errorText: { fontSize: 16 },
  retryBtn: {
    borderWidth: 1,
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryText: { fontSize: 14, fontWeight: "600" },
  list: { paddingHorizontal: 16 },
  ayahContainer: {
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    gap: 10,
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  ayahHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ayahHeaderLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  ayahNumBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  ayahNumText: { fontSize: 12, fontWeight: "700" },
  ayahPlayBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  arabicText: { textAlign: "right", lineHeight: 44, fontWeight: "400" },
  englishText: { fontSize: 14, lineHeight: 22 },
});
