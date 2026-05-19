/**
 * AdBanner — AdMob banner integration
 *
 * App ID  : ca-app-pub-9371252778444267~4004121936
 * Unit ID : ca-app-pub-9371252778444267/8690454945
 *
 * In Expo Go: shows a subtle placeholder (native module unavailable).
 * In an EAS production build: replace this component body with the real
 * react-native-google-mobile-ads <BannerAd> implementation.
 *
 * To go live:
 *   1. pnpm add react-native-google-mobile-ads
 *   2. Add plugin to app.json (see below)
 *   3. Replace placeholder with BannerAd component
 *   4. Run: eas build --platform android  (or ios)
 *
 * app.json plugin entry:
 *   ["react-native-google-mobile-ads", {
 *     "androidAppId": "ca-app-pub-9371252778444267~4004121936",
 *     "iosAppId":     "ca-app-pub-9371252778444267~4004121936"
 *   }]
 */

import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const ADMOB_APP_ID = "ca-app-pub-9371252778444267~4004121936";
export const ADMOB_BANNER_ID = "ca-app-pub-9371252778444267/8690454945";

export function AdBanner() {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Advertisement</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(13,43,26,0.4)",
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: "rgba(201,168,76,0.12)",
  },
  label: {
    fontSize: 10,
    color: "rgba(201,168,76,0.35)",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
});
