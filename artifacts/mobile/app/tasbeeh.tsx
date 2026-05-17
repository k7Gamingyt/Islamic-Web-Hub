import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTasbeeh, ZIKR_OPTIONS, type ZikrOption } from "@/context/TasbeehContext";
import { useColors } from "@/hooks/useColors";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function TasbeehScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { count, selectedZikr, totalToday, increment, reset, setZikr } = useTasbeeh();
  const scale = useSharedValue(1);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const progress = Math.min(count / selectedZikr.target, 1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    increment();
    scale.value = withSpring(0.93, { damping: 15 }, () => {
      scale.value = withSpring(1, { damping: 15 });
    });
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  return (
    <LinearGradient colors={["#060A06", "#0A1A10", "#060A06"]} style={styles.gradient}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Tasbeeh</Text>
        <TouchableOpacity onPress={reset}>
          <Feather name="rotate-ccw" size={18} color={colors.mutedForeground} />
        </TouchableOpacity>
      </View>

      {/* Counter Area */}
      <View style={styles.counterArea}>
        {/* Progress Ring */}
        <View style={[styles.ringContainer]}>
          <View
            style={[
              styles.ringOuter,
              {
                borderColor: "rgba(201,168,76,0.15)",
                backgroundColor: "rgba(13,43,26,0.5)",
              },
            ]}
          >
            <View
              style={[
                styles.ringInner,
                { borderColor: colors.goldDim, backgroundColor: "rgba(6,10,6,0.8)" },
              ]}
            >
              <Text style={[styles.countText, { color: colors.foreground }]}>{count}</Text>
              <Text style={[styles.targetText, { color: colors.mutedForeground }]}>
                / {selectedZikr.target}
              </Text>
            </View>
          </View>
        </View>

        {/* Selected Zikr */}
        <Text style={[styles.zikrArabic, { color: colors.gold }]}>{selectedZikr.arabic}</Text>
        <Text style={[styles.zikrTranslit, { color: colors.mutedForeground }]}>
          {selectedZikr.transliteration}
        </Text>

        {/* Tap Button */}
        <AnimatedPressable onPress={handlePress} style={animStyle}>
          <LinearGradient
            colors={["rgba(27,94,53,0.95)", "rgba(13,43,26,0.98)"]}
            style={[styles.tapBtn, { borderColor: "rgba(201,168,76,0.35)", borderRadius: 80 }]}
          >
            <Text style={[styles.tapText, { color: colors.gold }]}>Tap</Text>
          </LinearGradient>
        </AnimatedPressable>

        <Text style={[styles.totalText, { color: colors.mutedForeground }]}>
          Today total: {totalToday}
        </Text>
      </View>

      {/* Zikr Selector */}
      <View style={[styles.selectorContainer, { borderTopColor: colors.border }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selector}>
          {ZIKR_OPTIONS.map((z: ZikrOption) => {
            const active = z.transliteration === selectedZikr.transliteration;
            return (
              <TouchableOpacity
                key={z.transliteration}
                onPress={() => setZikr(z)}
                style={[
                  styles.zikrChip,
                  {
                    backgroundColor: active ? colors.goldDim : "rgba(13,43,26,0.5)",
                    borderColor: active ? "rgba(201,168,76,0.5)" : colors.border,
                  },
                ]}
              >
                <Text style={[styles.chipArabic, { color: active ? colors.gold : colors.foreground }]}>
                  {z.arabic.split(" ").slice(0, 2).join(" ")}
                </Text>
                <Text style={[styles.chipTranslit, { color: active ? colors.goldLight : colors.mutedForeground }]}>
                  {z.transliteration}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
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
  counterArea: { flex: 1, alignItems: "center", justifyContent: "center", gap: 16, paddingHorizontal: 24 },
  ringContainer: { marginBottom: 8 },
  ringOuter: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  ringInner: {
    width: 168,
    height: 168,
    borderRadius: 84,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  countText: { fontSize: 56, fontWeight: "700", lineHeight: 60 },
  targetText: { fontSize: 16 },
  zikrArabic: { fontSize: 22, textAlign: "center", fontWeight: "500" },
  zikrTranslit: { fontSize: 14, textAlign: "center" },
  tapBtn: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  tapText: { fontSize: 20, fontWeight: "700" },
  totalText: { fontSize: 13 },
  selectorContainer: { borderTopWidth: 0.5, paddingVertical: 12 },
  selector: { paddingHorizontal: 16, gap: 8 },
  zikrChip: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: "center",
    minWidth: 90,
  },
  chipArabic: { fontSize: 14, fontWeight: "500", textAlign: "center" },
  chipTranslit: { fontSize: 11, textAlign: "center", marginTop: 3 },
});
