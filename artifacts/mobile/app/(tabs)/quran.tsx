import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useColors } from "@/hooks/useColors";
import { type Surah, QuranService } from "@/services/QuranService";

export default function QuranScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");

  const { data: surahs, isLoading, error, refetch } = useQuery({
    queryKey: ["surahList"],
    queryFn: () => QuranService.getSurahList(),
    staleTime: 24 * 60 * 60 * 1000,
  });

  const filtered = surahs
    ? surahs.filter((s) => {
        const q = search.toLowerCase().trim();
        if (!q) return true;
        return (
          s.englishName.toLowerCase().includes(q) ||
          s.name.includes(q) ||
          s.englishNameTranslation.toLowerCase().includes(q) ||
          String(s.number).includes(q)
        );
      })
    : [];

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const renderItem = ({ item }: { item: Surah }) => (
    <TouchableOpacity
      onPress={() => router.push(`/quran/${item.number}`)}
      activeOpacity={0.7}
      style={[styles.item, { borderColor: colors.border }]}
    >
      <View style={[styles.number, { backgroundColor: colors.goldDim }]}>
        <Text style={[styles.numberText, { color: colors.gold }]}>{item.number}</Text>
      </View>
      <View style={styles.itemContent}>
        <Text style={[styles.englishName, { color: colors.foreground }]}>{item.englishName}</Text>
        <Text style={[styles.translation, { color: colors.mutedForeground }]}>
          {item.englishNameTranslation} · {item.numberOfAyahs} Ayahs · {item.revelationType}
        </Text>
      </View>
      <Text style={[styles.arabicName, { color: colors.gold }]}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={["#060A06", "#0A1A10", "#060A06"]} style={styles.gradient}>
      <View style={[styles.container, { paddingTop: topPad }]}>
        {/* Search Bar */}
        <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="search" size={16} color={colors.mutedForeground} />
          <TextInput
            style={[styles.searchInput, { color: colors.foreground }]}
            placeholder="Search Surah..."
            placeholderTextColor={colors.mutedForeground}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Feather name="x" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          )}
        </View>

        {isLoading ? (
          <LoadingSpinner message="Loading Surahs..." />
        ) : error ? (
          <View style={styles.center}>
            <Feather name="wifi-off" size={32} color={colors.mutedForeground} />
            <Text style={[styles.errorText, { color: colors.foreground }]}>Failed to load Quran</Text>
            <TouchableOpacity onPress={() => refetch()} style={[styles.retryBtn, { borderColor: colors.gold }]}>
              <Text style={[styles.retryText, { color: colors.gold }]}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => String(item.number)}
            renderItem={renderItem}
            scrollEnabled={!!filtered.length}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.list,
              { paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 90 },
            ]}
            ListEmptyComponent={
              <View style={styles.center}>
                <Feather name="search" size={32} color={colors.mutedForeground} />
                <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No surahs found</Text>
              </View>
            }
          />
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  searchInput: { flex: 1, fontSize: 15 },
  list: { paddingHorizontal: 16, gap: 1 },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: 0.5,
    gap: 12,
  },
  number: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  numberText: { fontSize: 14, fontWeight: "700" },
  itemContent: { flex: 1 },
  englishName: { fontSize: 16, fontWeight: "600", marginBottom: 2 },
  translation: { fontSize: 12 },
  arabicName: { fontSize: 18, fontWeight: "500" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, paddingTop: 80 },
  errorText: { fontSize: 16 },
  emptyText: { fontSize: 15 },
  retryBtn: { borderWidth: 1, paddingHorizontal: 24, paddingVertical: 8, borderRadius: 8 },
  retryText: { fontSize: 14, fontWeight: "600" },
});
