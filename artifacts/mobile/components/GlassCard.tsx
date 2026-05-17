import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, ViewStyle } from "react-native";

import { useColors } from "@/hooks/useColors";

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  gradient?: readonly [string, string, ...string[]];
  padding?: number;
  onPress?: () => void;
}

export function GlassCard({ children, style, gradient, padding = 16 }: GlassCardProps) {
  const colors = useColors();
  const grad: readonly [string, string] = gradient ?? [
    "rgba(13,43,26,0.85)",
    "rgba(6,10,6,0.92)",
  ];

  return (
    <LinearGradient
      colors={grad}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.card,
        {
          borderColor: "rgba(201,168,76,0.18)",
          borderRadius: colors.radius,
          padding,
        },
        style,
      ]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    overflow: "hidden",
  },
});
