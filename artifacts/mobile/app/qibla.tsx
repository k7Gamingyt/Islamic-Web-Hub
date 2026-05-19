import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GlassCard } from "@/components/GlassCard";
import { useColors } from "@/hooks/useColors";
import { getDeviceLocation } from "@/hooks/useLocation";
import { QiblaService } from "@/services/QiblaService";

export default function QiblaScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["qibla"],
    queryFn: async () => {
      const coords = await getDeviceLocation();
      if (!coords) throw new Error("Location permission denied");
      return QiblaService.getQibla(coords.latitude, coords.longitude);
    },
    retry: 1,
  });

  const arrowStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: withTiming(`${data?.direction ?? 0}deg`, { duration: 1000 }) }],
  }));

  return (
    <LinearGradient colors={["#060A06", "#0A1A10", "#060A06"]} style={styles.gradient}>
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Qibla Direction</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.body}>
        {isLoading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.gold} />
            <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>
              Detecting location...
            </Text>
          </View>
        ) : error ? (
          <View style={styles.center}>
            <Feather name="map-pin" size={40} color={colors.mutedForeground} />
            <Text style={[styles.errorText, { color: colors.foreground }]}>Location unavailable</Text>
            <Text style={[styles.errorSub, { color: colors.mutedForeground }]}>
              Please allow location access
            </Text>
            <TouchableOpacity onPress={() => refetch()} style={[styles.retryBtn, { borderColor: colors.gold }]}>
              <Text style={[styles.retryText, { color: colors.gold }]}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : data ? (
          <>
            {/* Compass */}
            <View style={styles.compassContainer}>
              <View
                style={[
                  styles.compassOuter,
                  { borderColor: "rgba(201,168,76,0.25)", backgroundColor: "rgba(13,43,26,0.4)" },
                ]}
              >
                {["N", "E", "S", "W"].map((dir, i) => (
                  <Text
                    key={dir}
                    style={[
                      styles.compassLabel,
                      { color: dir === "N" ? colors.gold : colors.mutedForeground },
                      {
                        position: "absolute",
                        top: i === 0 ? 8 : i === 2 ? "auto" : "47%",
                        bottom: i === 2 ? 8 : undefined,
                        left: i === 3 ? 8 : i === 1 ? "auto" : "47%",
                        right: i === 1 ? 8 : undefined,
                      },
                    ]}
                  >
                    {dir}
                  </Text>
                ))}

                <Animated.View style={[styles.arrowWrapper, arrowStyle]}>
                  <View style={[styles.arrowUp, { borderBottomColor: colors.gold }]} />
                  <View style={[styles.arrowDot, { backgroundColor: colors.gold }]} />
                  <View style={[styles.arrowDown, { borderTopColor: "rgba(201,168,76,0.3)" }]} />
                </Animated.View>
              </View>
            </View>

            {/* Info Cards */}
            <View style={styles.infoRow}>
              <GlassCard style={styles.infoCard}>
                <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>Direction</Text>
                <Text style={[styles.infoValue, { color: colors.gold }]}>
                  {Math.round(data.direction)}°
                </Text>
              </GlassCard>
              <GlassCard style={styles.infoCard}>
                <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>Distance</Text>
                <Text style={[styles.infoValue, { color: colors.gold }]}>
                  {data.distanceKm.toLocaleString()} km
                </Text>
              </GlassCard>
            </View>

            <GlassCard style={styles.coordCard}>
              <Text style={[styles.kaabaTxt, { color: colors.gold }]}>الْكَعْبَةُ الْمُشَرَّفَة</Text>
              <Text style={[styles.kaabaEn, { color: colors.foreground }]}>Masjid al-Haram, Makkah</Text>
              <Text style={[styles.coordText, { color: colors.mutedForeground }]}>
                Lat: {data.latitude.toFixed(4)}° · Lng: {data.longitude.toFixed(4)}°
              </Text>
            </GlassCard>
          </>
        ) : null}
      </View>
      <View style={{ height: bottomPad + 16 }} />
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
  body: { flex: 1, alignItems: "center", justifyContent: "center", gap: 24, paddingHorizontal: 20 },
  center: { alignItems: "center", gap: 12 },
  loadingText: { fontSize: 14 },
  errorText: { fontSize: 16, fontWeight: "600" },
  errorSub: { fontSize: 13, textAlign: "center" },
  retryBtn: { borderWidth: 1, paddingHorizontal: 24, paddingVertical: 8, borderRadius: 8, marginTop: 4 },
  retryText: { fontSize: 14, fontWeight: "600" },
  compassContainer: { alignItems: "center" },
  compassOuter: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  compassLabel: { fontSize: 14, fontWeight: "700" },
  arrowWrapper: { alignItems: "center" },
  arrowUp: { width: 0, height: 0, borderLeftWidth: 10, borderRightWidth: 10, borderBottomWidth: 40, borderLeftColor: "transparent", borderRightColor: "transparent" },
  arrowDot: { width: 14, height: 14, borderRadius: 7 },
  arrowDown: { width: 0, height: 0, borderLeftWidth: 10, borderRightWidth: 10, borderTopWidth: 40, borderLeftColor: "transparent", borderRightColor: "transparent" },
  infoRow: { flexDirection: "row", gap: 12, width: "100%" },
  infoCard: { flex: 1, alignItems: "center", gap: 4 },
  infoLabel: { fontSize: 11, fontWeight: "600", letterSpacing: 0.5, textTransform: "uppercase" },
  infoValue: { fontSize: 22, fontWeight: "700" },
  coordCard: { width: "100%", alignItems: "center", gap: 6 },
  kaabaTxt: { fontSize: 20, fontWeight: "500" },
  kaabaEn: { fontSize: 14, fontWeight: "500" },
  coordText: { fontSize: 12 },
});
