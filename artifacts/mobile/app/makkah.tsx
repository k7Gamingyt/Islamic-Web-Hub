import { Feather } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GlassCard } from "@/components/GlassCard";
import { useColors } from "@/hooks/useColors";

const LIVE_STREAMS = [
  {
    label: "Masjid al-Haram, Makkah",
    labelAr: "الْمَسْجِدُ الْحَرَام",
    url: "https://www.youtube.com/watch?v=bkzFVmfFf7c",
    description: "Live stream from the Grand Mosque in Makkah",
  },
  {
    label: "Masjid an-Nabawi, Madinah",
    labelAr: "الْمَسْجِدُ النَّبَوِي",
    url: "https://www.youtube.com/watch?v=a6RSSQfQkOE",
    description: "Live stream from the Prophet's Mosque in Madinah",
  },
];

export default function MakkahScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const openStream = async (url: string) => {
    await WebBrowser.openBrowserAsync(url, {
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
    });
  };

  return (
    <LinearGradient colors={["#060A06", "#0A1A10", "#060A06"]} style={styles.gradient}>
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Live Makkah</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={[styles.body, { paddingBottom: bottomPad + 24 }]}>
        <Text style={[styles.arabicTitle, { color: colors.gold }]}>بَيْتُ اللَّهِ الْحَرَام</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Watch the Holy Mosque live streams
        </Text>

        {LIVE_STREAMS.map((stream) => (
          <TouchableOpacity key={stream.url} onPress={() => openStream(stream.url)} activeOpacity={0.85}>
            <LinearGradient
              colors={["rgba(27,94,53,0.85)", "rgba(13,43,26,0.95)"]}
              style={[styles.streamCard, { borderRadius: colors.radius, borderColor: "rgba(201,168,76,0.25)" }]}
            >
              <View style={[styles.playIconContainer, { backgroundColor: "rgba(201,168,76,0.15)" }]}>
                <View style={[styles.playCircle, { borderColor: "rgba(201,168,76,0.4)" }]}>
                  <Feather name="play" size={28} color={colors.gold} />
                </View>
              </View>
              <Text style={[styles.streamArabic, { color: colors.gold }]}>{stream.labelAr}</Text>
              <Text style={[styles.streamLabel, { color: colors.foreground }]}>{stream.label}</Text>
              <Text style={[styles.streamDesc, { color: colors.mutedForeground }]}>{stream.description}</Text>
              <View style={[styles.openBtn, { borderColor: "rgba(201,168,76,0.35)" }]}>
                <Feather name="external-link" size={14} color={colors.gold} />
                <Text style={[styles.openText, { color: colors.gold }]}>Watch Live</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}

        <GlassCard style={styles.infoCard}>
          <Feather name="info" size={16} color={colors.mutedForeground} />
          <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
            Streams open in your browser. Ensure you have a stable internet connection for the best experience.
          </Text>
        </GlassCard>
      </View>
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
    paddingBottom: 12,
  },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  body: { flex: 1, paddingHorizontal: 16, gap: 16, alignItems: "stretch" },
  arabicTitle: { fontSize: 24, fontWeight: "600", textAlign: "center" },
  subtitle: { fontSize: 13, textAlign: "center", marginTop: -8 },
  streamCard: { borderWidth: 1, padding: 24, alignItems: "center", gap: 12 },
  playIconContainer: { width: 100, height: 100, borderRadius: 50, alignItems: "center", justifyContent: "center" },
  playCircle: { width: 72, height: 72, borderRadius: 36, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  streamArabic: { fontSize: 18, fontWeight: "500" },
  streamLabel: { fontSize: 16, fontWeight: "600", textAlign: "center" },
  streamDesc: { fontSize: 13, textAlign: "center" },
  openBtn: { flexDirection: "row", gap: 8, borderWidth: 1, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 24, alignItems: "center", marginTop: 4 },
  openText: { fontSize: 14, fontWeight: "600" },
  infoCard: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  infoText: { fontSize: 12, flex: 1, lineHeight: 18 },
});
