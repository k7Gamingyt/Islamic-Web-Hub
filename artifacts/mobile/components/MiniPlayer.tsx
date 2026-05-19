import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAudio } from "@/context/AudioContext";
import { useColors } from "@/hooks/useColors";

export function MiniPlayer() {
  const { playState, track, ayahIndex, isContinuous, progress, togglePlayPause, stop, toggleContinuous } =
    useAudio();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  if (playState === "idle" || !track) return null;

  const isPlaying = playState === "playing";
  const isLoading = playState === "loading";
  const ayahDisplay = ayahIndex !== null ? ayahIndex + 1 : "–";
  const totalAyahs = track.ayahGlobalNumbers.length;
  const pct = `${Math.round(progress * 100)}%`;
  const bottomOffset = Platform.OS === "web" ? 48 : insets.bottom + 56;

  return (
    <Animated.View
      entering={FadeInDown.duration(300)}
      exiting={FadeOutDown.duration(200)}
      style={[styles.wrapper, { bottom: bottomOffset }]}
    >
      <BlurView intensity={90} tint="dark" style={styles.blur}>
        {/* Gold top border glow */}
        <View style={[styles.topBorder, { backgroundColor: colors.gold }]} />

        {/* Progress bar */}
        <View style={[styles.progressTrack, { backgroundColor: "rgba(201,168,76,0.12)" }]}>
          <View style={[styles.progressFill, { width: pct as `${number}%`, backgroundColor: colors.gold }]} />
        </View>

        <View style={styles.row}>
          {/* Info */}
          <View style={styles.info}>
            <Text style={[styles.surahName, { color: colors.foreground }]} numberOfLines={1}>
              {track.surahName}
            </Text>
            <Text style={[styles.ayahInfo, { color: colors.mutedForeground }]}>
              {isLoading ? "Loading…" : `Ayah ${ayahDisplay} / ${totalAyahs}`}
            </Text>
          </View>

          {/* Controls */}
          <View style={styles.controls}>
            {/* Continuous play toggle */}
            <TouchableOpacity onPress={toggleContinuous} style={styles.iconBtn} hitSlop={8}>
              <Feather
                name="repeat"
                size={15}
                color={isContinuous ? colors.gold : colors.mutedForeground}
              />
            </TouchableOpacity>

            {/* Play / Pause */}
            <TouchableOpacity
              onPress={togglePlayPause}
              disabled={isLoading}
              style={[styles.playBtn, { backgroundColor: colors.gold }]}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={colors.background} />
              ) : (
                <Feather
                  name={isPlaying ? "pause" : "play"}
                  size={18}
                  color={colors.background}
                />
              )}
            </TouchableOpacity>

            {/* Stop */}
            <TouchableOpacity onPress={stop} style={styles.iconBtn} hitSlop={8}>
              <Feather name="square" size={15} color={colors.mutedForeground} />
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 12,
    right: 12,
    zIndex: 999,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  blur: { borderRadius: 16 },
  topBorder: { height: 1.5, opacity: 0.6 },
  progressTrack: { height: 3, width: "100%" },
  progressFill: { height: 3 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  info: { flex: 1, gap: 2 },
  surahName: { fontSize: 14, fontWeight: "700" },
  ayahInfo: { fontSize: 12 },
  controls: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  playBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
