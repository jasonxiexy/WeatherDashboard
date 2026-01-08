import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { weatherCodeInfo } from "../utils/weatherCode";
import { formatTorontoTime } from "../utils/time";
import { cardTones } from "../styles/theme";

export default function WeatherCard({ weather, theme }) {
    const city = weather?.city ?? "—";
    const country = weather?.country ?? "";
    const temp = Number.isFinite(weather?.temperature) ? weather.temperature : null;
    const code = Number.isFinite(weather?.weatherCode) ? weather.weatherCode : null;

    const info = weatherCodeInfo(code ?? -1);
    const tone = cardTones[info.tone] ?? cardTones.neutral;

    return (
        <View style={[styles.card, { borderColor: theme.cardBorder }]}>
            {/* “Glow” layers */}
            <View style={[styles.glowTop, { backgroundColor: tone.a }]} />
            <View style={[styles.glowBottom, { backgroundColor: tone.b }]} />

            <View style={styles.headerRow}>
                <View>
                    <Text style={[styles.city, { color: theme.text }]} numberOfLines={1}>
                        {city}
                    </Text>
                    <Text style={[styles.country, { color: theme.muted }]} numberOfLines={1}>
                        {country}
                    </Text>
                </View>

                <Text style={[styles.icon, { color: theme.text }]}>{info.icon}</Text>
            </View>

            <View style={styles.midRow}>
                <Text style={[styles.temp, { color: theme.text }]}>
                    {temp === null ? "—" : `${temp.toFixed(1)}°C`}
                </Text>
                <Text style={[styles.label, { color: theme.muted }]}>{info.label}</Text>
            </View>

            <Text style={[styles.updated, { color: theme.muted }]}>
                Updated (Toronto): {formatTorontoTime(weather?.updatedAt)}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        position: "relative",
        overflow: "hidden",
        borderWidth: 1,
        borderRadius: 22,
        padding: 16,
        minHeight: 140,
        backgroundColor: "rgba(255,255,255,0.02)",
    },
    glowTop: {
        position: "absolute",
        top: -40,
        left: -30,
        right: -30,
        height: 110,
        borderRadius: 999,
    },
    glowBottom: {
        position: "absolute",
        bottom: -50,
        left: -30,
        right: -30,
        height: 120,
        borderRadius: 999,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    city: { fontSize: 18, fontWeight: "700" },
    country: { marginTop: 2, fontSize: 12, fontWeight: "600" },
    icon: { fontSize: 28 },
    midRow: { marginTop: 16 },
    temp: { fontSize: 28, fontWeight: "800" },
    label: { marginTop: 6, fontSize: 13, fontWeight: "600" },
    updated: { marginTop: 12, fontSize: 12, fontWeight: "600" },
});
