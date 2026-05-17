import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import { FlatList, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GlassCard } from "@/components/GlassCard";
import { HADITHS, HADITH_CATEGORIES, getDailyHadith, type Hadith } from "@/constants/hadiths";
import { useColors } from "@/hooks/useColors";

export default function HadithScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expanded, setExpanded] = useState<number | null>(getDailyHadith().id);

  const daily = getDailyHadith();
  const filtered = selectedCategory === "All"
    ? HADITHS
    : HADITHS.filter((h) => h.category === selectedCategory);

  const renderHadith = ({ item }: { item: Hadith }) => {
    const isExpanded = expanded === item.id;
    const isDaily = item.id === daily.id;
    return (
      <TouchableOpacity
        onPress={() => setExpanded(isExpanded ? null : item.id)}
        activeOpacity={0.8}
      >
        <GlassCard style={[styles.hadithCard, isDaily && { borderColor: "rgba(201,168,76,0.4)" }]}>
          {isDaily && (
            <View style={[styles.dailyBadge, { backgroundColor: colors.goldDim }]}>
              <Text style={[styles.dailyBadgeText, { color: colors.gold }]}>Daily Hadith</Text>
            </View>
          )}
          <View style={styles.hadithHeader}>
            <View style={[styles.catBadge, { backgroundColor: "rgba(27,94,53,0.5)" }]}>
              <Text style={[styles.catText, { color: colors.greenLight }]}>{item.category}</Text>
            </View>
            <Text style={[styles.source, { color: colors.mutedForeground }]}>{item.source}</Text>
          </View>
          <Text style={[styles.arabicText, { color: colors.gold }]} numberOfLines={isExpanded ? undefined : 2}>
            {item.arabic}
          </Text>
          {isExpanded && (
            <Text style={[styles.hadithText, { color: colors.foreground }]}>{item.text}</Text>
          )}
          {!isExpanded && (
            <Text style={[styles.tapHint, { color: colors.mutedForeground }]}>Tap to read</Text>
          )}
        </GlassCard>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient colors={["#060A06", "#0A1A10", "#060A06"]} style={styles.gradient}>
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Hadith</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* Category Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categories}>
        {HADITH_CATEGORIES.map((cat) => {
          const active = cat === selectedCategory;
          return (
            <TouchableOpacity
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              style={[
                styles.catChip,
                {
                  backgroundColor: active ? colors.goldDim : "rgba(13,43,26,0.5)",
                  borderColor: active ? "rgba(201,168,76,0.5)" : colors.border,
                },
              ]}
            >
              <Text style={[styles.catChipText, { color: active ? colors.gold : colors.mutedForeground }]}>
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderHadith}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.list, { paddingBottom: bottomPad + 24 }]}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  categories: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  catChip: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7 },
  catChipText: { fontSize: 13, fontWeight: "600" },
  list: { paddingHorizontal: 16, gap: 10 },
  hadithCard: { gap: 10 },
  dailyBadge: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, marginBottom: 4 },
  dailyBadgeText: { fontSize: 11, fontWeight: "700" },
  hadithHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  catBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  catText: { fontSize: 11, fontWeight: "600" },
  source: { fontSize: 12 },
  arabicText: { fontSize: 16, textAlign: "right", lineHeight: 28 },
  hadithText: { fontSize: 14, lineHeight: 22, marginTop: 4 },
  tapHint: { fontSize: 11, textAlign: "right" },
});
