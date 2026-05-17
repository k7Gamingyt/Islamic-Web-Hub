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

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const renderAyah = ({ item }: { item: AyahPair }) => {
    const bookmarked = isBookmarked(surahNumber, item.numberInSurah);
    return (
      <Pressable
        onLongPress={() => handleAyahLongPress(item)}
        style={[styles.ayahContainer, { borderColor: colors.border }]}
      >
        <View style={styles.ayahHeader}>
          <View style={[styles.ayahNumBadge, { backgroundColor: colors.goldDim }]}>
            <Text style={[styles.ayahNumText, { color: colors.gold }]}>{item.numberInSurah}</Text>
          </View>
          {bookmarked && <Feather name="bookmark" size={16} color={colors.gold} />}
        </View>
        <Text style={[styles.arabicText, { color: colors.foreground, fontSize: fontSize }]}>
          {item.arabic}
        </Text>
        <Text style={[styles.englishText, { color: colors.mutedForeground }]}>{item.english}</Text>
      </Pressable>
    );
  };

  return (
    <LinearGradient colors={["#060A06", "#0A1A10", "#060A06"]} style={styles.gradient}>
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
      </View>

      {/* Bismillah */}
      {surahNumber !== 1 && surahNumber !== 9 && (
        <Text style={[styles.bismillah, { color: colors.gold }]}>
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
        </Text>
      )}

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.gold} />
          <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>Loading surah...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Feather name="wifi-off" size={32} color={colors.mutedForeground} />
          <Text style={[styles.errorText, { color: colors.foreground }]}>Failed to load surah</Text>
          <TouchableOpacity onPress={() => refetch()} style={[styles.retryBtn, { borderColor: colors.gold }]}>
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
            { paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 24 },
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
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
  },
  backBtn: { padding: 4 },
  headerCenter: { flex: 1 },
  surahTitle: { fontSize: 18, fontWeight: "700" },
  surahSub: { fontSize: 12, marginTop: 2 },
  fontControls: { flexDirection: "row", gap: 8 },
  fontBtn: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  fontBtnText: { fontSize: 13, fontWeight: "700" },
  bismillah: { fontSize: 22, textAlign: "center", paddingVertical: 16, paddingHorizontal: 16 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  loadingText: { fontSize: 14 },
  errorText: { fontSize: 16 },
  retryBtn: { borderWidth: 1, paddingHorizontal: 24, paddingVertical: 8, borderRadius: 8 },
  retryText: { fontSize: 14, fontWeight: "600" },
  list: { paddingHorizontal: 16 },
  ayahContainer: { paddingVertical: 16, borderBottomWidth: 0.5, gap: 12 },
  ayahHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  ayahNumBadge: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  ayahNumText: { fontSize: 13, fontWeight: "700" },
  arabicText: { textAlign: "right", lineHeight: 44, fontWeight: "400" },
  englishText: { fontSize: 14, lineHeight: 22 },
});
