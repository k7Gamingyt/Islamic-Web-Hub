import { Feather } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GlassCard } from "@/components/GlassCard";
import { useColors } from "@/hooks/useColors";
import { supabase } from "@/src/lib/supabase";

interface LiveStream {
  id: string;
  url: string;
  label: string;
  labelAr: string;
  description: string;
}

const STREAM_META: Record<string, { label: string; labelAr: string; description: string }> = {
  liveMakkah: {
    label: "Masjid al-Haram, Makkah",
    labelAr: "الْمَسْجِدُ الْحَرَام",
    description: "Live from the Grand Mosque",
  },
  liveMadina: {
    label: "Masjid an-Nabawi, Madinah",
    labelAr: "الْمَسْجِدُ النَّبَوِي",
    description: "Live from the Prophet's Mosque",
  },
};

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /[?&]v=([^&#]+)/,
    /youtu\.be\/([^?&#]+)/,
    /\/live\/([^?&#]+)/,
    /\/embed\/([^?&#]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m?.[1]) return m[1];
  }
  return null;
}

// YouTube iframe embed — works on web via React Native Web DOM passthrough
function YoutubeEmbed({ videoId }: { videoId: string }) {
  if (Platform.OS !== "web") return null;
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`;
  // Use createElement to pass a raw DOM iframe through react-native-web
  const Iframe = "iframe" as unknown as React.ElementType;
  return (
    <View style={styles.iframeWrapper}>
      <Iframe
        src={embedUrl}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          borderRadius: 12,
          background: "#080D08",
        }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Live stream"
      />
    </View>
  );
}

export default function MakkahScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const [streams, setStreams] = useState<LiveStream[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchStreams = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const { data, error: sbError } = await supabase
        .from("settings")
        .select("id, url")
        .in("id", ["liveMakkah", "liveMadina"]);

      if (sbError) throw new Error(sbError.message);

      const mapped: LiveStream[] = (data ?? [])
        .filter((row: { id: string; url: string }) => row.id in STREAM_META && row.url)
        .map((row: { id: string; url: string }) => ({
          id: row.id,
          url: row.url,
          ...STREAM_META[row.id],
        }));
      setStreams(mapped);
    } catch (e: unknown) {
      setFetchError(e instanceof Error ? e.message : "Failed to load streams");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStreams();
  }, [fetchStreams]);

  const openExternal = async (url: string) => {
    try {
      // Try to open in YouTube app first, fall back to browser
      const youtubeApp = url.replace("https://www.youtube.com", "youtube://");
      const canOpen = await Linking.canOpenURL(youtubeApp);
      if (canOpen) {
        await Linking.openURL(youtubeApp);
      } else {
        await WebBrowser.openBrowserAsync(url, {
          presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
        });
      }
    } catch {
      await WebBrowser.openBrowserAsync(url);
    }
  };

  return (
    <LinearGradient colors={["#060A06", "#0A1A10", "#060A06"]} style={styles.gradient}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Live Makkah</Text>
        <TouchableOpacity onPress={fetchStreams}>
          <Feather name="refresh-cw" size={18} color={colors.mutedForeground} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[styles.body, { paddingBottom: bottomPad + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.arabicTitle, { color: colors.gold }]}>بَيْتُ اللَّهِ الْحَرَام</Text>

        {/* Loading */}
        {loading && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.gold} />
            <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>Loading streams...</Text>
          </View>
        )}

        {/* Error */}
        {!loading && fetchError && (
          <GlassCard style={styles.stateCard}>
            <Feather name="wifi-off" size={32} color={colors.mutedForeground} />
            <Text style={[styles.stateTitle, { color: colors.foreground }]}>Connection error</Text>
            <Text style={[styles.stateMsg, { color: colors.mutedForeground }]}>{fetchError}</Text>
            <TouchableOpacity onPress={fetchStreams} style={[styles.retryBtn, { borderColor: colors.gold }]}>
              <Text style={[styles.retryText, { color: colors.gold }]}>Try again</Text>
            </TouchableOpacity>
          </GlassCard>
        )}

        {/* Empty — Supabase table has no rows yet */}
        {!loading && !fetchError && streams.length === 0 && (
          <GlassCard style={styles.stateCard}>
            <Feather name="database" size={32} color={colors.mutedForeground} />
            <Text style={[styles.stateTitle, { color: colors.foreground }]}>No streams configured</Text>
            <Text style={[styles.stateMsg, { color: colors.mutedForeground }]}>
              Add your YouTube URLs to the Supabase{" "}
              <Text style={{ color: colors.gold, fontWeight: "700" }}>settings</Text> table:
            </Text>
            <View style={[styles.setupBox, { borderColor: colors.border, backgroundColor: "rgba(6,10,6,0.6)" }]}>
              <Text style={[styles.setupCode, { color: colors.goldLight }]}>id: liveMakkah</Text>
              <Text style={[styles.setupCode, { color: colors.mutedForeground }]}>
                url: https://youtube.com/watch?v=...
              </Text>
              <View style={[styles.setupDivider, { backgroundColor: colors.border }]} />
              <Text style={[styles.setupCode, { color: colors.goldLight }]}>id: liveMadina</Text>
              <Text style={[styles.setupCode, { color: colors.mutedForeground }]}>
                url: https://youtube.com/watch?v=...
              </Text>
            </View>
            <TouchableOpacity onPress={fetchStreams} style={[styles.retryBtn, { borderColor: colors.gold }]}>
              <Feather name="refresh-cw" size={14} color={colors.gold} />
              <Text style={[styles.retryText, { color: colors.gold }]}>Reload</Text>
            </TouchableOpacity>
          </GlassCard>
        )}

        {/* Streams loaded */}
        {!loading && streams.map((stream) => {
          const videoId = extractYouTubeId(stream.url);
          return (
            <View key={stream.id}>
              {/* Card header */}
              <LinearGradient
                colors={["rgba(27,94,53,0.85)", "rgba(13,43,26,0.95)"]}
                style={[styles.streamHeader, { borderRadius: colors.radius, borderColor: "rgba(201,168,76,0.25)" }]}
              >
                <View style={styles.streamTitleRow}>
                  <View style={styles.liveIndicator}>
                    <View style={[styles.liveDot, { backgroundColor: "#ef4444" }]} />
                    <Text style={[styles.liveText, { color: "#ef4444" }]}>LIVE</Text>
                  </View>
                  <Text style={[styles.streamArabic, { color: colors.gold }]}>{stream.labelAr}</Text>
                </View>
                <Text style={[styles.streamLabel, { color: colors.foreground }]}>{stream.label}</Text>
                <Text style={[styles.streamDesc, { color: colors.mutedForeground }]}>{stream.description}</Text>
              </LinearGradient>

              {/* Embedded player (web only) */}
              {Platform.OS === "web" && videoId && (
                <YoutubeEmbed videoId={videoId} />
              )}

              {/* Open externally button */}
              <TouchableOpacity
                onPress={() => openExternal(stream.url)}
                activeOpacity={0.8}
                style={[styles.watchBtn, { backgroundColor: colors.goldDim, borderColor: "rgba(201,168,76,0.4)" }]}
              >
                <Feather name="external-link" size={16} color={colors.gold} />
                <Text style={[styles.watchText, { color: colors.gold }]}>
                  {Platform.OS === "web" ? "Open in YouTube" : "Watch in YouTube App"}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}

        {/* Info note */}
        {!loading && streams.length > 0 && (
          <GlassCard style={styles.infoCard}>
            <Feather name="info" size={14} color={colors.mutedForeground} />
            <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
              {Platform.OS === "web"
                ? "Videos are embedded above. Use the button to open full-screen in YouTube."
                : "Tap 'Watch in YouTube App' to view the live stream on your device."}
            </Text>
          </GlassCard>
        )}
      </ScrollView>
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
  body: { paddingHorizontal: 16, gap: 14 },
  arabicTitle: { fontSize: 22, fontWeight: "600", textAlign: "center", paddingTop: 4 },
  center: { alignItems: "center", gap: 12, paddingVertical: 40 },
  loadingText: { fontSize: 14 },
  stateCard: { alignItems: "center", gap: 12, paddingVertical: 28 },
  stateTitle: { fontSize: 16, fontWeight: "700" },
  stateMsg: { fontSize: 13, textAlign: "center", lineHeight: 20 },
  setupBox: { width: "100%", borderWidth: 1, borderRadius: 10, padding: 14, gap: 4 },
  setupCode: { fontSize: 12, fontFamily: "monospace" },
  setupDivider: { height: 0.5, marginVertical: 6 },
  retryBtn: {
    flexDirection: "row",
    gap: 6,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 4,
  },
  retryText: { fontSize: 14, fontWeight: "600" },
  streamHeader: {
    borderWidth: 1,
    padding: 18,
    gap: 6,
  },
  streamTitleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  liveIndicator: { flexDirection: "row", alignItems: "center", gap: 5 },
  liveDot: { width: 8, height: 8, borderRadius: 4 },
  liveText: { fontSize: 11, fontWeight: "800", letterSpacing: 1 },
  streamArabic: { fontSize: 16, fontWeight: "500" },
  streamLabel: { fontSize: 15, fontWeight: "600" },
  streamDesc: { fontSize: 12 },
  iframeWrapper: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  watchBtn: {
    flexDirection: "row",
    gap: 8,
    borderWidth: 1,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  watchText: { fontSize: 14, fontWeight: "700" },
  infoCard: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  infoText: { fontSize: 12, flex: 1, lineHeight: 18 },
});
