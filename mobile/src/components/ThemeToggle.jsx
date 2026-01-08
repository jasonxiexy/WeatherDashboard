import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";

export default function ThemeToggle({ mode, onToggle, theme }) {
  return (
    <Pressable
      onPress={onToggle}
      style={({ pressed }) => [
        styles.btn,
        { borderColor: theme.cardBorder, opacity: pressed ? 0.8 : 1 },
      ]}
    >
      <Text style={[styles.text, { color: theme.text }]}>
        {mode === "dark" ? "🌙 Dark" : "☀️ Light"}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  text: { fontWeight: "800" },
});
