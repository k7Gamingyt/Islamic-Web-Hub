import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GlassCard } from "@/components/GlassCard";
import { useColors } from "@/hooks/useColors";
import {
  toHijri,
  HIJRI_MONTHS,
  ISLAMIC_EVENTS,
  getRamadanCountdown,
} from "@/utils/hijriCalendar";

export default function CalendarScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [date] = useState(new Date());
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const hijri = toHijri(date);
  const ramadanDays = getRamadanCountdown(hijri);

  const upcomingEvents = ISLAMIC_EVENTS.filter((e) => {
    if (e.month > hijri.month) return true;
    if (e.month === hijri.month && e.day >= hijri.day) return true;
    return false;
  }).slice(0, 4);

  const daysInMonth = hijri.month % 2 === 1 ? 30 : 29;
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <LinearGradient colors={["#060A06", "#0A1A10", "#060A06"]} style={styles.gradient}>
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Islamic Calendar</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: bottomPad + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Current Hijri Date */}
        <LinearGradient
          colors={["rgba(27,94,53,0.9)", "rgba(13,43,26,0.95)"]}
          style={[styles.hijriCard, { borderRadius: colors.radius, borderColor: "rgba(201,168,76,0.3)" }]}
        >
          <Text style={[styles.hijriMonthAr, { color: colors.gold }]}>{hijri.monthNameAr}</Text>
          <Text style={[styles.hijriDay, { color: colors.foreground }]}>{hijri.day}</Text>
          <Text style={[styles.hijriMonthEn, { color: colors.goldLight }]}>
            {hijri.monthName} {hijri.year} AH
          </Text>
          <View style={[styles.divider, { backgroundColor: "rgba(201,168,76,0.2)" }]} />
          <Text style={[styles.gregorianDate, { color: colors.mutedForeground }]}>
            {date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </Text>
        </LinearGradient>

        {/* Month Calendar Grid */}
        <GlassCard>
          <Text style={[styles.sectionTitle, { color: colors.goldLight }]}>
            {hijri.monthName} {hijri.year}
          </Text>
          <View style={styles.weekDays}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <Text key={d} style={[styles.weekDay, { color: colors.mutedForeground }]}>
                {d}
              </Text>
            ))}
          </View>
          <View style={styles.daysGrid}>
            {days.map((d) => {
              const isToday = d === hijri.day;
              const hasEvent = ISLAMIC_EVENTS.some((e) => e.month === hijri.month && e.day === d);
              return (
                <View
                  key={d}
                  style={[
                    styles.dayCell,
                    isToday && { backgroundColor: colors.goldDim, borderRadius: 20 },
                  ]}
                >
                  <Text
                    style={[
                      styles.dayNum,
                      { color: isToday ? colors.gold : hasEvent ? colors.goldLight : colors.foreground },
                    ]}
                  >
                    {d}
                  </Text>
                  {hasEvent && <View style={[styles.eventDot, { backgroundColor: colors.gold }]} />}
                </View>
              );
            })}
          </View>
        </GlassCard>

        {/* Ramadan Countdown */}
        {ramadanDays > 0 ? (
          <GlassCard
            gradient={["rgba(40,20,5,0.9)", "rgba(20,10,3,0.95)"]}
            style={{ borderColor: "rgba(201,168,76,0.25)" } as any}
          >
            <View style={styles.ramadanRow}>
              <View>
                <Text style={[styles.sectionTitle, { color: colors.goldLight }]}>Ramadan Countdown</Text>
                <Text style={[styles.ramadanDays, { color: colors.gold }]}>{ramadanDays} days</Text>
                <Text style={[styles.ramadanSub, { color: colors.mutedForeground }]}>until the blessed month</Text>
              </View>
              <Text style={[styles.moonEmoji, { color: colors.gold }]}>رمضان</Text>
            </View>
          </GlassCard>
        ) : (
          <GlassCard gradient={["rgba(40,20,5,0.9)", "rgba(20,10,3,0.95)"] as any}>
            <Text style={[styles.sectionTitle, { color: colors.gold }]}>Ramadan Mubarak!</Text>
            <Text style={[styles.ramadanSub, { color: colors.mutedForeground }]}>It is the blessed month of Ramadan</Text>
          </GlassCard>
        )}

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <View>
            <Text style={[styles.sectionLabel, { color: colors.goldLight }]}>Upcoming Events</Text>
            {upcomingEvents.map((event) => (
              <GlassCard key={`${event.month}-${event.day}`} style={styles.eventCard}>
                <View style={styles.eventRow}>
                  <View style={[styles.eventDateBadge, { backgroundColor: colors.goldDim }]}>
                    <Text style={[styles.eventDay, { color: colors.gold }]}>{event.day}</Text>
                    <Text style={[styles.eventMonthShort, { color: colors.gold }]}>
                      {HIJRI_MONTHS[event.month - 1].slice(0, 3)}
                    </Text>
                  </View>
                  <View style={styles.eventInfo}>
                    <Text style={[styles.eventName, { color: colors.foreground }]}>{event.name}</Text>
                    <Text style={[styles.eventArabic, { color: colors.gold }]}>{event.arabic}</Text>
                  </View>
                </View>
              </GlassCard>
            ))}
          </View>
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
  content: { paddingHorizontal: 16, gap: 12 },
  hijriCard: { borderWidth: 1, padding: 24, alignItems: "center" },
  hijriMonthAr: { fontSize: 20, fontWeight: "500" },
  hijriDay: { fontSize: 64, fontWeight: "700", lineHeight: 72 },
  hijriMonthEn: { fontSize: 18, fontWeight: "600" },
  divider: { height: 1, width: "80%", marginVertical: 12 },
  gregorianDate: { fontSize: 13, textAlign: "center" },
  sectionTitle: { fontSize: 14, fontWeight: "700", letterSpacing: 0.5, marginBottom: 12 },
  sectionLabel: { fontSize: 13, fontWeight: "700", letterSpacing: 0.5, marginBottom: 8, marginTop: 4 },
  weekDays: { flexDirection: "row", justifyContent: "space-around", marginBottom: 8 },
  weekDay: { width: 36, textAlign: "center", fontSize: 11, fontWeight: "600" },
  daysGrid: { flexDirection: "row", flexWrap: "wrap" },
  dayCell: { width: "14.28%", alignItems: "center", paddingVertical: 6 },
  dayNum: { fontSize: 14, fontWeight: "500" },
  eventDot: { width: 4, height: 4, borderRadius: 2, marginTop: 2 },
  ramadanRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  ramadanDays: { fontSize: 32, fontWeight: "700" },
  ramadanSub: { fontSize: 13 },
  moonEmoji: { fontSize: 22, fontWeight: "600" },
  eventCard: { marginBottom: 8 },
  eventRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  eventDateBadge: { width: 52, height: 52, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  eventDay: { fontSize: 20, fontWeight: "700", lineHeight: 24 },
  eventMonthShort: { fontSize: 10, fontWeight: "600" },
  eventInfo: { flex: 1 },
  eventName: { fontSize: 15, fontWeight: "600" },
  eventArabic: { fontSize: 13, marginTop: 2 },
});
