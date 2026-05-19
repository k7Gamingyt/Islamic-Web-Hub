import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as WebBrowser from "expo-web-browser";
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

import { AdBanner } from "@/components/AdBanner";
import { GlassCard } from "@/components/GlassCard";
import { useColors } from "@/hooks/useColors";
import { supabase } from "@/src/lib/supabase";

const FALLBACK_EMBED_URL = "https://www.youtube.com/embed/nFev59ZkyX8";
const FALLBACK_WATCH_URL = "https://www.youtube.com/watch?v=nFev59ZkyX8";

function extractVideoId(url: string): string | null {
  const patterns = [
    /\/embed\/([^?&#/]+)/,
    /[?&]v=([^&#]+)/,
    /youtu\.be\/([^?&#]+)/,
    /\/live\/([^?&#]+)/,
  ];
  for (const p of patterns) {
    const m = url?.match(p);
    if (m?.[1]) return m[1];
  }
  return null;
}

function YoutubeIframe({ embedUrl }: { embedUrl: string }) {
  if (Platform.OS !== "web") return null;
  const Iframe = "iframe" as unknown as React.ElementType;
  return (
    <View style={styles.iframeWrapper}>
      <Iframe
        src={embedUrl}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          background: "#000",
        }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
        title="Live Makkah"
      />
    </View>
  );
}

export default function MakkahScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [watchUrl, setWatchUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  const fetchStream = useCallback(async () => {
    setLoading(true);
    setUsingFallback(false);
    try {
      const { data, error } = await supabase
        .from("live_stream")
        .select("live_url")
        .eq("id", 1)
        .single();

      if (error || !data?.live_url) throw new Error("No stream data");

      const liveUrl: string = data.live_url;
      const videoId = extractVideoId(liveUrl);

      if (videoId) {
        setEmbedUrl(`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`);
        setWatchUrl(`https://www.youtube.com/watch?v=${videoId}`);
      } else if (liveUrl.includes("embed")) {
        setEmbedUrl(liveUrl);
        setWatchUrl(liveUrl.replace("/embed/", "/watch?v=").split("?")[0]);
      } else {
        setEmbedUrl(liveUrl);
        setWatchUrl(liveUrl);
      }
    } catch {
      setEmbedUrl(FALLBACK_EMBED_URL);
      setWatchUrl(FALLBACK_WATCH_URL);
      setUsingFallback(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStream();
  }, [fetchStream]);

  const openFullscreen = async () => {
    const url = watchUrl ?? FALLBACK_WATCH_URL;
    try {
      const ytApp = url.replace("https://www.youtube.com/watch?v=", "youtube://");
      const canOpen = await Linking.canOpenURL(ytApp);
      if (canOpen) {
        await Linking.openURL(ytApp);
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
        <TouchableOpacity onPress={fetchStream}>
          <Feather name="refresh-cw" size={18} color={colors.mutedForeground} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[styles.body, { paddingBottom: bottomPad + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.arabicTitle, { color: colors.gold }]}>بَيْتُ اللَّهِ الْحَرَام</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Live from Masjid al-Haram</Text>

        {/* Loading */}
        {loading && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.gold} />
            <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>
              Connecting to live stream...
            </Text>
          </View>
        )}

        {/* Player */}
        {!loading && (
          <>
            {/* Stream label */}
            <LinearGradient
              colors={["rgba(27,94,53,0.85)", "rgba(13,43,26,0.95)"]}
              style={[styles.streamHeader, { borderRadius: colors.radius, borderColor: "rgba(201,168,76,0.25)" }]}
            >
              <View style={styles.titleRow}>
                <View style={styles.liveRow}>
                  <View style={[styles.liveDot, { backgroundColor: "#ef4444" }]} />
                  <Text style={[styles.liveLabel, { color: "#ef4444" }]}>LIVE</Text>
                </View>
                {usingFallback && (
                  <View style={[styles.fallbackBadge, { backgroundColor: "rgba(201,168,76,0.15)", borderColor: "rgba(201,168,76,0.3)" }]}>
                    <Text style={[styles.fallbackText, { color: colors.goldLight }]}>Backup stream</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.streamArabic, { color: colors.gold }]}>الْمَسْجِدُ الْحَرَام</Text>
              <Text style={[styles.streamName, { color: colors.foreground }]}>Masjid al-Haram, Makkah</Text>
            </LinearGradient>

            {/* Embedded player — web only */}
            {Platform.OS === "web" && embedUrl && (
              <YoutubeIframe embedUrl={embedUrl} />
            )}

            {/* Full-screen button */}
            <TouchableOpacity
              onPress={openFullscreen}
              activeOpacity={0.8}
              style={[styles.fullscreenBtn, { backgroundColor: colors.goldDim, borderColor: "rgba(201,168,76,0.4)" }]}
            >
              <Feather name="maximize" size={18} color={colors.gold} />
              <Text style={[styles.fullscreenText, { color: colors.gold }]}>
                {Platform.OS === "web" ? "Open Full Screen in YouTube" : "Watch Full Screen"}
              </Text>
            </TouchableOpacity>

            {/* Info */}
            <GlassCard style={styles.infoCard}>
              <Feather name="info" size={14} color={colors.mutedForeground} />
              <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
                {Platform.OS === "web"
                  ? "The live video is embedded above. Tap the button to open full screen."
                  : "Tap the button above to watch the live stream in full screen."}
              </Text>
            </GlassCard>
          </>
        )}

        {/* Ad banner */}
        <AdBanner />
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
  subtitle: { fontSize: 13, textAlign: "center", marginTop: -8 },
  center: { alignItems: "center", gap: 12, paddingVertical: 40 },
  loadingText: { fontSize: 14 },
  streamHeader: { borderWidth: 1, padding: 18, gap: 6 },
  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  liveRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  liveDot: { width: 8, height: 8, borderRadius: 4 },
  liveLabel: { fontSize: 11, fontWeight: "800", letterSpacing: 1 },
  fallbackBadge: { borderWidth: 1, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  fallbackText: { fontSize: 10, fontWeight: "600" },
  streamArabic: { fontSize: 17, fontWeight: "500" },
  streamName: { fontSize: 14, fontWeight: "600" },
  iframeWrapper: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  fullscreenBtn: {
    flexDirection: "row",
    gap: 10,
    borderWidth: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  fullscreenText: { fontSize: 15, fontWeight: "700" },
  infoCard: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  infoText: { fontSize: 12, flex: 1, lineHeight: 18 },
});
