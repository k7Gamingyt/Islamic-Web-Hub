import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import { FlatList, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GlassCard } from "@/components/GlassCard";
import { DUAS, DUA_CATEGORIES, type Dua } from "@/constants/duas";
import { useColors } from "@/hooks/useColors";

export default function DuasScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const filtered = selectedCategory === "All"
    ? DUAS
    : DUAS.filter((d) => d.category === selectedCategory);

  const toggleFav = (id: number) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const renderDua = ({ item }: { item: Dua }) => {
    const isExpanded = expanded === item.id;
    const isFav = favorites.has(item.id);
    return (
      <TouchableOpacity onPress={() => setExpanded(isExpanded ? null : item.id)} activeOpacity={0.85}>
        <GlassCard style={styles.duaCard}>
          <View style={styles.duaHeader}>
            <Text style={[styles.duaTitle, { color: colors.foreground }]}>{item.title}</Text>
            <View style={styles.duaActions}>
              <TouchableOpacity onPress={() => toggleFav(item.id)}>
                <Feather name="heart" size={16} color={isFav ? colors.gold : colors.mutedForeground} />
              </TouchableOpacity>
              <Feather
                name={isExpanded ? "chevron-up" : "chevron-down"}
                size={16}
                color={colors.mutedForeground}
              />
            </View>
          </View>
          <Text style={[styles.duaArabic, { color: colors.gold }]} numberOfLines={isExpanded ? undefined : 2}>
            {item.arabic}
          </Text>
          {isExpanded && (
            <>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <Text style={[styles.duaLabel, { color: colors.goldLight }]}>Transliteration</Text>
              <Text style={[styles.translitText, { color: colors.foreground }]}>{item.transliteration}</Text>
              <Text style={[styles.duaLabel, { color: colors.goldLight }]}>Translation</Text>
              <Text style={[styles.translationText, { color: colors.mutedForeground }]}>{item.translation}</Text>
            </>
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
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Duas</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categories}>
        {DUA_CATEGORIES.map((cat) => {
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
              <Text style={[styles.catText, { color: active ? colors.gold : colors.mutedForeground }]}>
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderDua}
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
  catText: { fontSize: 13, fontWeight: "600" },
  list: { paddingHorizontal: 16, gap: 10 },
  duaCard: { gap: 10 },
  duaHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  duaTitle: { fontSize: 15, fontWeight: "600", flex: 1 },
  duaActions: { flexDirection: "row", gap: 12, alignItems: "center" },
  duaArabic: { fontSize: 16, textAlign: "right", lineHeight: 28 },
  divider: { height: 0.5, marginVertical: 4 },
  duaLabel: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5, textTransform: "uppercase" },
  translitText: { fontSize: 14, lineHeight: 20, fontStyle: "italic" },
  translationText: { fontSize: 13, lineHeight: 20 },
});
