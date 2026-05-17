import { Feather } from "@expo/vector-icons";
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

import { ALLAH_NAMES, type AllaName } from "@/constants/names";
import { useColors } from "@/hooks/useColors";

export default function NamesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const filtered = search.trim()
    ? ALLAH_NAMES.filter(
        (n) =>
          n.transliteration.toLowerCase().includes(search.toLowerCase()) ||
          n.meaning.toLowerCase().includes(search.toLowerCase()) ||
          n.arabic.includes(search)
      )
    : ALLAH_NAMES;

  const toggleFav = (id: number) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const renderName = ({ item }: { item: AllaName }) => {
    const isFav = favorites.has(item.id);
    return (
      <LinearGradient
        colors={["rgba(13,43,26,0.7)", "rgba(6,10,6,0.8)"]}
        style={[styles.nameCard, { borderRadius: colors.radius, borderColor: "rgba(201,168,76,0.12)" }]}
      >
        <TouchableOpacity style={styles.favBtn} onPress={() => toggleFav(item.id)}>
          <Feather name={isFav ? "heart" : "heart"} size={14} color={isFav ? colors.gold : colors.mutedForeground} />
        </TouchableOpacity>
        <View style={[styles.numBadge, { backgroundColor: "rgba(201,168,76,0.1)" }]}>
          <Text style={[styles.numText, { color: colors.mutedForeground }]}>{item.id}</Text>
        </View>
        <Text style={[styles.arabic, { color: colors.gold }]}>{item.arabic}</Text>
        <Text style={[styles.translit, { color: colors.foreground }]}>{item.transliteration}</Text>
        <Text style={[styles.meaning, { color: colors.mutedForeground }]} numberOfLines={2}>
          {item.meaning}
        </Text>
      </LinearGradient>
    );
  };

  return (
    <LinearGradient colors={["#060A06", "#0A1A10", "#060A06"]} style={styles.gradient}>
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>99 Names of Allah</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Feather name="search" size={14} color={colors.mutedForeground} />
        <TextInput
          style={[styles.searchInput, { color: colors.foreground }]}
          placeholder="Search names..."
          placeholderTextColor={colors.mutedForeground}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Feather name="x" size={14} color={colors.mutedForeground} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderName}
        numColumns={2}
        columnWrapperStyle={styles.row}
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
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 14 },
  list: { paddingHorizontal: 10 },
  row: { gap: 8, paddingHorizontal: 6, marginBottom: 8 },
  nameCard: {
    flex: 1,
    borderWidth: 1,
    padding: 14,
    alignItems: "center",
    gap: 6,
    position: "relative",
    minHeight: 130,
    justifyContent: "center",
  },
  favBtn: { position: "absolute", top: 8, right: 8 },
  numBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  numText: { fontSize: 11, fontWeight: "600" },
  arabic: { fontSize: 18, fontWeight: "600", textAlign: "center" },
  translit: { fontSize: 12, fontWeight: "600", textAlign: "center" },
  meaning: { fontSize: 11, textAlign: "center", lineHeight: 16 },
});
