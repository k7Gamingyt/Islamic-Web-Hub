import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

interface Feature {
  icon: string;
  label: string;
  sublabel: string;
  route: string;
  gradient: readonly [string, string];
}

const FEATURES: Feature[] = [
  {
    icon: "rotate-cw",
    label: "Tasbeeh",
    sublabel: "Digital counter",
    route: "/tasbeeh",
    gradient: ["rgba(27,94,53,0.9)", "rgba(13,43,26,0.95)"],
  },
  {
    icon: "navigation",
    label: "Qibla",
    sublabel: "Find direction",
    route: "/qibla",
    gradient: ["rgba(30,90,50,0.9)", "rgba(13,43,26,0.95)"],
  },
  {
    icon: "calendar",
    label: "Islamic Calendar",
    sublabel: "Hijri dates & events",
    route: "/calendar",
    gradient: ["rgba(20,60,40,0.9)", "rgba(13,43,26,0.95)"],
  },
  {
    icon: "book",
    label: "Hadith",
    sublabel: "Daily & collections",
    route: "/hadith",
    gradient: ["rgba(25,75,45,0.9)", "rgba(13,43,26,0.95)"],
  },
  {
    icon: "star",
    label: "99 Names",
    sublabel: "Asma ul Husna",
    route: "/names",
    gradient: ["rgba(27,94,53,0.9)", "rgba(13,43,26,0.95)"],
  },
  {
    icon: "heart",
    label: "Duas",
    sublabel: "Daily supplications",
    route: "/duas",
    gradient: ["rgba(30,80,50,0.9)", "rgba(13,43,26,0.95)"],
  },
  {
    icon: "video",
    label: "Live Makkah",
    sublabel: "Masjid al-Haram",
    route: "/makkah",
    gradient: ["rgba(40,30,10,0.9)", "rgba(20,15,5,0.95)"],
  },
  {
    icon: "settings",
    label: "Settings",
    sublabel: "Preferences",
    route: "/settings",
    gradient: ["rgba(15,35,20,0.9)", "rgba(8,12,8,0.95)"],
  },
];

export default function MoreScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <LinearGradient colors={["#060A06", "#0A1A10", "#060A06"]} style={styles.gradient}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: topPad + 12, paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 90 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: colors.gold }]}>Features</Text>
        <View style={styles.grid}>
          {FEATURES.map((f) => (
            <TouchableOpacity
              key={f.route}
              onPress={() => router.push(f.route as any)}
              activeOpacity={0.8}
              style={styles.gridItem}
            >
              <LinearGradient
                colors={f.gradient}
                style={[styles.card, { borderRadius: colors.radius, borderColor: "rgba(201,168,76,0.18)" }]}
              >
                <View style={[styles.iconBg, { backgroundColor: "rgba(201,168,76,0.12)" }]}>
                  <Feather name={f.icon as any} size={22} color={colors.gold} />
                </View>
                <Text style={[styles.cardLabel, { color: colors.foreground }]}>{f.label}</Text>
                <Text style={[styles.cardSub, { color: colors.mutedForeground }]}>{f.sublabel}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  content: { paddingHorizontal: 16, gap: 16 },
  title: { fontSize: 24, fontWeight: "700", textAlign: "center", paddingVertical: 4 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  gridItem: { width: "47%" },
  card: {
    borderWidth: 1,
    padding: 18,
    alignItems: "center",
    gap: 8,
    minHeight: 120,
    justifyContent: "center",
  },
  iconBg: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center" },
  cardLabel: { fontSize: 14, fontWeight: "600", textAlign: "center" },
  cardSub: { fontSize: 11, textAlign: "center" },
});
