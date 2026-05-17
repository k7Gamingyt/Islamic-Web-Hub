import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GlassCard } from "@/components/GlassCard";
import { useSettings, type Settings } from "@/context/SettingsContext";
import { useColors } from "@/hooks/useColors";

const CALC_METHODS = [
  { id: 1, name: "Muslim World League" },
  { id: 2, name: "Islamic Society of North America" },
  { id: 3, name: "Egyptian General Authority" },
  { id: 4, name: "Umm Al-Qura (Makkah)" },
  { id: 5, name: "University of Islamic Sciences, Karachi" },
];

const LANGUAGES: Array<{ code: Settings["language"]; label: string }> = [
  { code: "en", label: "English" },
  { code: "ur", label: "اردو (Urdu)" },
  { code: "ar", label: "العربية (Arabic)" },
];

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { settings, updateSettings } = useSettings();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const [city, setCity] = useState(settings.city);
  const [country, setCountry] = useState(settings.country);

  const saveLocation = () => {
    updateSettings({ city: city.trim(), country: country.trim() });
  };

  return (
    <LinearGradient colors={["#060A06", "#0A1A10", "#060A06"]} style={styles.gradient}>
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Settings</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: bottomPad + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Location */}
        <GlassCard>
          <Text style={[styles.sectionTitle, { color: colors.goldLight }]}>Prayer Location</Text>
          <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>City</Text>
          <TextInput
            style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: "rgba(6,10,6,0.5)" }]}
            value={city}
            onChangeText={setCity}
            placeholder="e.g. Mecca, London, New York"
            placeholderTextColor={colors.mutedForeground}
            onBlur={saveLocation}
          />
          <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Country Code</Text>
          <TextInput
            style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: "rgba(6,10,6,0.5)" }]}
            value={country}
            onChangeText={setCountry}
            placeholder="e.g. SA, GB, US, PK"
            placeholderTextColor={colors.mutedForeground}
            maxLength={3}
            autoCapitalize="characters"
            onBlur={saveLocation}
          />
          <TouchableOpacity
            onPress={saveLocation}
            style={[styles.saveBtn, { backgroundColor: colors.goldDim, borderColor: "rgba(201,168,76,0.4)" }]}
          >
            <Text style={[styles.saveBtnText, { color: colors.gold }]}>Save Location</Text>
          </TouchableOpacity>
        </GlassCard>

        {/* Calculation Method */}
        <GlassCard>
          <Text style={[styles.sectionTitle, { color: colors.goldLight }]}>Calculation Method</Text>
          {CALC_METHODS.map((method) => {
            const active = settings.calculationMethod === method.id;
            return (
              <TouchableOpacity
                key={method.id}
                onPress={() => updateSettings({ calculationMethod: method.id })}
                style={[
                  styles.optionRow,
                  { borderColor: active ? "rgba(201,168,76,0.4)" : colors.border },
                  active && { backgroundColor: colors.goldDim },
                ]}
              >
                <Text style={[styles.optionText, { color: active ? colors.gold : colors.foreground }]}>
                  {method.name}
                </Text>
                {active && <Feather name="check" size={16} color={colors.gold} />}
              </TouchableOpacity>
            );
          })}
        </GlassCard>

        {/* Language */}
        <GlassCard>
          <Text style={[styles.sectionTitle, { color: colors.goldLight }]}>Quran Translation</Text>
          <View style={styles.langRow}>
            {LANGUAGES.map((lang) => {
              const active = settings.language === lang.code;
              return (
                <TouchableOpacity
                  key={lang.code}
                  onPress={() => updateSettings({ language: lang.code })}
                  style={[
                    styles.langChip,
                    {
                      backgroundColor: active ? colors.goldDim : "rgba(13,43,26,0.5)",
                      borderColor: active ? "rgba(201,168,76,0.5)" : colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.langText, { color: active ? colors.gold : colors.mutedForeground }]}>
                    {lang.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </GlassCard>

        {/* Font Size */}
        <GlassCard>
          <Text style={[styles.sectionTitle, { color: colors.goldLight }]}>Quran Font Size</Text>
          <View style={styles.fontSizeRow}>
            <TouchableOpacity
              onPress={() => updateSettings({ fontSize: Math.max(16, settings.fontSize - 2) })}
              style={[styles.fontBtn, { borderColor: colors.border }]}
            >
              <Text style={[styles.fontBtnText, { color: colors.gold }]}>A-</Text>
            </TouchableOpacity>
            <Text style={[styles.fontSizeText, { color: colors.foreground }]}>{settings.fontSize}pt</Text>
            <Text style={[styles.previewText, { color: colors.gold, fontSize: settings.fontSize }]}>
              بِسْمِ اللَّه
            </Text>
            <TouchableOpacity
              onPress={() => updateSettings({ fontSize: Math.min(40, settings.fontSize + 2) })}
              style={[styles.fontBtn, { borderColor: colors.border }]}
            >
              <Text style={[styles.fontBtnText, { color: colors.gold }]}>A+</Text>
            </TouchableOpacity>
          </View>
        </GlassCard>

        {/* About */}
        <GlassCard style={styles.aboutCard}>
          <Text style={[styles.bismillah, { color: colors.gold }]}>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</Text>
          <Text style={[styles.appName, { color: colors.foreground }]}>Quran Kareem</Text>
          <Text style={[styles.version, { color: colors.mutedForeground }]}>Version 1.0.0</Text>
          <Text style={[styles.aboutText, { color: colors.mutedForeground }]}>
            Your spiritual companion for Quran, Prayer Times, Qibla, and more.
          </Text>
        </GlassCard>
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
  sectionTitle: { fontSize: 13, fontWeight: "700", letterSpacing: 0.5, marginBottom: 12, textTransform: "uppercase" },
  fieldLabel: { fontSize: 12, fontWeight: "600", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 12,
  },
  saveBtn: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 4,
  },
  saveBtnText: { fontSize: 14, fontWeight: "700" },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 8,
  },
  optionText: { fontSize: 14, flex: 1 },
  langRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  langChip: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  langText: { fontSize: 13, fontWeight: "600" },
  fontSizeRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  fontBtn: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  fontBtnText: { fontSize: 14, fontWeight: "700" },
  fontSizeText: { fontSize: 14 },
  previewText: { flex: 1, textAlign: "center" },
  aboutCard: { alignItems: "center", gap: 6 },
  bismillah: { fontSize: 18, fontWeight: "500" },
  appName: { fontSize: 20, fontWeight: "700" },
  version: { fontSize: 13 },
  aboutText: { fontSize: 13, textAlign: "center", lineHeight: 20 },
});
