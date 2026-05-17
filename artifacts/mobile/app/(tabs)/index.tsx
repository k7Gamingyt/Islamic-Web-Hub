import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GlassCard } from "@/components/GlassCard";
import { useSettings } from "@/context/SettingsContext";
import { getDailyHadith } from "@/constants/hadiths";
import { useColors } from "@/hooks/useColors";
import { PrayerService } from "@/services/PrayerService";
import { QuranService } from "@/services/QuranService";
import { toHijri } from "@/utils/hijriCalendar";

const PRAYER_ICONS: Record<string, string> = {
  Fajr: "sunrise",
  Dhuhr: "sun",
  Asr: "cloud",
  Maghrib: "sunset",
  Isha: "moon",
};

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { settings } = useSettings();
  const [now, setNow] = useState(new Date());
  const dailyHadith = getDailyHadith();
  const hijri = toHijri(now);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const { data: prayerData } = useQuery({
    queryKey: ["prayerTimes", settings.city, settings.country],
    queryFn: () => PrayerService.getByCity(settings.city, settings.country, settings.calculationMethod),
    staleTime: 1000 * 60 * 60,
  });

  const { data: lastRead } = useQuery({
    queryKey: ["lastRead"],
    queryFn: () => QuranService.getLastRead(),
  });

  const nextPrayer = prayerData ? PrayerService.getNextPrayer(prayerData.timings) : null;

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const quickActions = [
    { icon: "rotate-cw", label: "Tasbeeh", route: "/tasbeeh" },
    { icon: "navigation", label: "Qibla", route: "/qibla" },
    { icon: "calendar", label: "Calendar", route: "/calendar" },
    { icon: "video", label: "Makkah", route: "/makkah" },
  ];

  return (
    <LinearGradient colors={["#060A06", "#0A1A10", "#060A06"]} style={styles.gradient}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingTop: topPad + 12, paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 90 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.bismillah, { color: colors.gold }]}>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</Text>
          <Text style={[styles.hijriDate, { color: colors.mutedForeground }]}>
            {hijri.day} {hijri.monthName} {hijri.year} AH
          </Text>
          <Text style={[styles.gregorianDate, { color: colors.mutedForeground }]}>
            {now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </Text>
        </View>

        {/* Next Prayer Card */}
        {nextPrayer ? (
          <TouchableOpacity onPress={() => router.push("/(tabs)/prayer")} activeOpacity={0.8}>
            <LinearGradient
              colors={["rgba(27,94,53,0.9)", "rgba(13,43,26,0.95)"]}
              style={[styles.prayerCard, { borderRadius: colors.radius, borderColor: "rgba(201,168,76,0.3)" }]}
            >
              <View style={styles.prayerHeader}>
                <Text style={[styles.nextPrayerLabel, { color: colors.goldLight }]}>Next Prayer</Text>
                <Feather name={PRAYER_ICONS[nextPrayer.name] as any ?? "clock"} size={20} color={colors.gold} />
              </View>
              <Text style={[styles.prayerName, { color: colors.foreground }]}>{nextPrayer.name}</Text>
              <Text style={[styles.prayerTime, { color: colors.gold }]}>
                {PrayerService.formatTime(nextPrayer.time)}
              </Text>
              <View style={[styles.divider, { backgroundColor: "rgba(201,168,76,0.2)" }]} />
              <Text style={[styles.countdown, { color: colors.mutedForeground }]}>
                In {nextPrayer.timeRemaining}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => router.push("/(tabs)/prayer")} activeOpacity={0.8}>
            <GlassCard style={styles.prayerCardPlaceholder}>
              <Text style={[styles.prayerName, { color: colors.foreground }]}>Prayer Times</Text>
              <Text style={[styles.prayerSubtext, { color: colors.mutedForeground }]}>
                Tap to view prayer times
              </Text>
            </GlassCard>
          </TouchableOpacity>
        )}

        {/* Continue Reading */}
        <TouchableOpacity
          onPress={() => router.push(lastRead ? `/quran/${lastRead.surahNumber}` : "/(tabs)/quran")}
          activeOpacity={0.85}
        >
          <GlassCard style={styles.continueCard}>
            <View style={styles.row}>
              <View style={styles.flex1}>
                <Text style={[styles.sectionLabel, { color: colors.goldLight }]}>Continue Reading</Text>
                {lastRead ? (
                  <>
                    <Text style={[styles.surahName, { color: colors.foreground }]}>
                      Surah {lastRead.surahNumber}
                    </Text>
                    <Text style={[styles.ayahNum, { color: colors.mutedForeground }]}>
                      Ayah {lastRead.ayahNumber}
                    </Text>
                  </>
                ) : (
                  <Text style={[styles.surahName, { color: colors.foreground }]}>Start Reading</Text>
                )}
              </View>
              <View style={[styles.iconCircle, { backgroundColor: colors.goldDim }]}>
                <Feather name="book-open" size={22} color={colors.gold} />
              </View>
            </View>
          </GlassCard>
        </TouchableOpacity>

        {/* Quick Actions */}
        <View style={styles.quickGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.route}
              onPress={() => router.push(action.route as any)}
              activeOpacity={0.8}
              style={styles.quickItem}
            >
              <LinearGradient
                colors={["rgba(13,43,26,0.9)", "rgba(6,10,6,0.95)"]}
                style={[styles.quickCard, { borderRadius: colors.radius, borderColor: "rgba(201,168,76,0.15)" }]}
              >
                <View style={[styles.quickIconBg, { backgroundColor: colors.goldDim }]}>
                  <Feather name={action.icon as any} size={20} color={colors.gold} />
                </View>
                <Text style={[styles.quickLabel, { color: colors.foreground }]}>{action.label}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Daily Hadith */}
        <TouchableOpacity onPress={() => router.push("/hadith")} activeOpacity={0.85}>
          <GlassCard style={styles.hadithCard}>
            <View style={styles.hadithHeader}>
              <View style={[styles.hadithBadge, { backgroundColor: colors.goldDim }]}>
                <Text style={[styles.hadithBadgeText, { color: colors.gold }]}>Daily Hadith</Text>
              </View>
              <Text style={[styles.hadithSource, { color: colors.mutedForeground }]}>{dailyHadith.source}</Text>
            </View>
            <Text style={[styles.hadithArabic, { color: colors.gold }]}>{dailyHadith.arabic}</Text>
            <Text style={[styles.hadithText, { color: colors.foreground }]} numberOfLines={3}>
              {dailyHadith.text}
            </Text>
            <Text style={[styles.readMore, { color: colors.gold }]}>Read more</Text>
          </GlassCard>
        </TouchableOpacity>

        {/* City info */}
        <Pressable onPress={() => router.push("/settings")} style={styles.cityRow}>
          <Feather name="map-pin" size={12} color={colors.mutedForeground} />
          <Text style={[styles.cityText, { color: colors.mutedForeground }]}>
            {settings.city}, {settings.country}
          </Text>
          <Feather name="settings" size={12} color={colors.mutedForeground} />
        </Pressable>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, gap: 12 },
  header: { alignItems: "center", paddingVertical: 8 },
  bismillah: { fontSize: 22, fontWeight: "600", textAlign: "center", marginBottom: 6 },
  hijriDate: { fontSize: 15, textAlign: "center" },
  gregorianDate: { fontSize: 13, textAlign: "center" },
  prayerCard: { borderWidth: 1, padding: 20, marginVertical: 4 },
  prayerCardPlaceholder: { marginVertical: 4 },
  prayerHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  nextPrayerLabel: { fontSize: 12, fontWeight: "600", letterSpacing: 1, textTransform: "uppercase" },
  prayerName: { fontSize: 28, fontWeight: "700", marginBottom: 2 },
  prayerTime: { fontSize: 20, fontWeight: "600" },
  prayerSubtext: { fontSize: 14, marginTop: 4 },
  divider: { height: 1, marginVertical: 12 },
  countdown: { fontSize: 14 },
  continueCard: { marginVertical: 4 },
  row: { flexDirection: "row", alignItems: "center" },
  flex1: { flex: 1 },
  sectionLabel: { fontSize: 11, fontWeight: "600", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 },
  surahName: { fontSize: 18, fontWeight: "600" },
  ayahNum: { fontSize: 13, marginTop: 2 },
  iconCircle: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center" },
  quickGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginVertical: 4 },
  quickItem: { width: "47%" },
  quickCard: { borderWidth: 1, padding: 16, alignItems: "center", gap: 10 },
  quickIconBg: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  quickLabel: { fontSize: 13, fontWeight: "600" },
  hadithCard: { marginVertical: 4 },
  hadithHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  hadithBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  hadithBadgeText: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5 },
  hadithSource: { fontSize: 12 },
  hadithArabic: { fontSize: 16, textAlign: "right", lineHeight: 28, marginBottom: 8 },
  hadithText: { fontSize: 14, lineHeight: 22 },
  readMore: { fontSize: 13, fontWeight: "600", marginTop: 8, textAlign: "right" },
  cityRow: { flexDirection: "row", alignItems: "center", gap: 6, justifyContent: "center", paddingVertical: 8 },
  cityText: { fontSize: 12 },
});
