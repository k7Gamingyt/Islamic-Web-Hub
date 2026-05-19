import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
import { useSettings } from "@/context/SettingsContext";
import { useColors } from "@/hooks/useColors";
import { PrayerService } from "@/services/PrayerService";

const PRAYERS = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;
const PRAYER_ICONS: Record<string, string> = {
  Fajr: "sunrise",
  Sunrise: "sun",
  Dhuhr: "sun",
  Asr: "cloud",
  Maghrib: "sunset",
  Isha: "moon",
};

export default function PrayerScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { settings } = useSettings();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["prayerTimes", settings.city, settings.country],
    queryFn: () => PrayerService.getByCity(settings.city, settings.country, settings.calculationMethod),
    staleTime: 60 * 60 * 1000,
  });

  const nextPrayer = data ? PrayerService.getNextPrayer(data.timings) : null;
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const isCurrentPrayer = (name: string) => nextPrayer?.name === name;

  return (
    <LinearGradient colors={["#060A06", "#0A1A10", "#060A06"]} style={styles.gradient}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: topPad + 12, paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 90 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Location */}
        <View style={styles.locationRow}>
          <Feather name="map-pin" size={14} color={colors.gold} />
          <Text style={[styles.locationText, { color: colors.foreground }]}>
            {settings.city}, {settings.country}
          </Text>
        </View>

        {/* Next Prayer Countdown */}
        {nextPrayer && (
          <LinearGradient
            colors={["rgba(27,94,53,0.9)", "rgba(13,43,26,0.95)"]}
            style={[styles.countdownCard, { borderRadius: colors.radius, borderColor: "rgba(201,168,76,0.3)" }]}
          >
            <Text style={[styles.nextLabel, { color: colors.goldLight }]}>NEXT PRAYER</Text>
            <Text style={[styles.nextName, { color: colors.foreground }]}>{nextPrayer.name}</Text>
            <Text style={[styles.nextTime, { color: colors.gold }]}>
              {PrayerService.formatTime(nextPrayer.time)}
            </Text>
            <View style={[styles.divider, { backgroundColor: "rgba(201,168,76,0.2)" }]} />
            <Text style={[styles.countdown, { color: colors.mutedForeground }]}>
              In {nextPrayer.timeRemaining}
            </Text>
          </LinearGradient>
        )}

        {/* Prayer Times List */}
        {isLoading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.gold} />
            <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>Loading prayer times...</Text>
          </View>
        ) : error ? (
          <View style={styles.center}>
            <Feather name="wifi-off" size={32} color={colors.mutedForeground} />
            <Text style={[styles.errorText, { color: colors.foreground }]}>Could not load prayer times</Text>
            <TouchableOpacity onPress={() => refetch()} style={[styles.retryBtn, { borderColor: colors.gold }]}>
              <Text style={[styles.retryText, { color: colors.gold }]}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : data ? (
          <View style={styles.prayerList}>
            {PRAYERS.map((prayer) => {
              const isCurrent = isCurrentPrayer(prayer);
              return (
                <LinearGradient
                  key={prayer}
                  colors={
                    isCurrent
                      ? ["rgba(27,94,53,0.85)", "rgba(13,43,26,0.9)"]
                      : ["rgba(13,43,26,0.6)", "rgba(6,10,6,0.7)"]
                  }
                  style={[
                    styles.prayerRow,
                    {
                      borderRadius: colors.radius,
                      borderColor: isCurrent ? "rgba(201,168,76,0.4)" : "rgba(201,168,76,0.1)",
                    },
                  ]}
                >
                  <View style={styles.prayerLeft}>
                    <View
                      style={[
                        styles.prayerIconBg,
                        { backgroundColor: isCurrent ? "rgba(201,168,76,0.25)" : "rgba(201,168,76,0.1)" },
                      ]}
                    >
                      <Feather name={PRAYER_ICONS[prayer] as any} size={16} color={colors.gold} />
                    </View>
                    <Text style={[styles.prayerName, { color: isCurrent ? colors.foreground : colors.foreground }]}>
                      {prayer}
                    </Text>
                    {isCurrent && (
                      <View style={[styles.nextBadge, { backgroundColor: colors.goldDim }]}>
                        <Text style={[styles.nextBadgeText, { color: colors.gold }]}>Next</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.prayerTime, { color: isCurrent ? colors.gold : colors.mutedForeground }]}>
                    {PrayerService.formatTime(data.timings[prayer as keyof typeof data.timings] ?? "")}
                  </Text>
                </LinearGradient>
              );
            })}
          </View>
        ) : null}

        {data && (
          <Text style={[styles.dateText, { color: colors.mutedForeground }]}>
            {data.date.readable} · {data.date.hijri.day} {data.date.hijri.month.en} {data.date.hijri.year} AH
          </Text>
        )}

        {/* Banner ad */}
        <AdBanner />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  content: { paddingHorizontal: 16, gap: 12 },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 6, justifyContent: "center" },
  locationText: { fontSize: 16, fontWeight: "600" },
  countdownCard: { borderWidth: 1, padding: 24, alignItems: "center" },
  nextLabel: { fontSize: 11, fontWeight: "700", letterSpacing: 1.5, marginBottom: 8 },
  nextName: { fontSize: 30, fontWeight: "700", marginBottom: 4 },
  nextTime: { fontSize: 22, fontWeight: "600" },
  divider: { height: 1, width: "100%", marginVertical: 12 },
  countdown: { fontSize: 15 },
  center: { alignItems: "center", gap: 12, paddingVertical: 40 },
  loadingText: { fontSize: 14 },
  errorText: { fontSize: 16 },
  retryBtn: { borderWidth: 1, paddingHorizontal: 24, paddingVertical: 8, borderRadius: 8 },
  retryText: { fontSize: 14, fontWeight: "600" },
  prayerList: { gap: 8 },
  prayerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderWidth: 1, padding: 16 },
  prayerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  prayerIconBg: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  prayerName: { fontSize: 16, fontWeight: "500" },
  nextBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  nextBadgeText: { fontSize: 10, fontWeight: "700" },
  prayerTime: { fontSize: 15, fontWeight: "600" },
  dateText: { fontSize: 12, textAlign: "center", paddingVertical: 8 },
});
