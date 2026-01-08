import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import WeatherCard from "../components/WeatherCard";
import ThemeToggle from "../components/ThemeToggle";
import { themes } from "../styles/theme";
import { fetchWeather, refreshWeather } from "../api/weatherApi";

const FIXED_CITIES = ["Toronto", "New York", "London", "Vancouver"];

function mergeFixedCities(rows) {
    const map = new Map((rows ?? []).map((r) => [r.city, r]));
    return FIXED_CITIES.map((name) => map.get(name) ?? { city: name });
}

export default function Dashboard() {
    const [mode, setMode] = useState("dark");
    const theme = themes[mode];

    const [items, setItems] = useState(mergeFixedCities([]));
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const timerRef = useRef(null);

    async function loadInitial() {
        setError("");
        try {
            const data = await fetchWeather();
            setItems(mergeFixedCities(data));
        } catch (e) {
            setError(e.message || "Failed to load weather");
            setItems(mergeFixedCities([])); // still show placeholders
        } finally {
            setLoading(false);
        }
    }

    async function doRefresh() {
        setError("");
        setRefreshing(true);
        try {
            const updated = await refreshWeather();
            setItems(mergeFixedCities(updated));
        } catch (e) {
            setError(e.message || "Failed to refresh");
        } finally {
            setRefreshing(false);
        }
    }

    useEffect(() => {
        loadInitial();

        // auto refresh every 10 min
        timerRef.current = setInterval(() => {
            doRefresh();
        }, 10 * 60 * 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    return (
        <View style={[styles.page, { backgroundColor: theme.bg }]}>
            <View style={styles.topRow}>
                <View>
                    <Text style={[styles.title, { color: theme.text }]}>Weather Dashboard</Text>
                    <Text style={[styles.subtitle, { color: theme.muted }]}>
                        4-city snapshot • Auto refresh every 10 minutes
                    </Text>
                </View>
                <ThemeToggle
                    mode={mode}
                    onToggle={() => setMode((m) => (m === "dark" ? "light" : "dark"))}
                    theme={theme}
                />
            </View>

            <View style={styles.actionsRow}>
                <Pressable
                    onPress={doRefresh}
                    disabled={refreshing}
                    style={({ pressed }) => [
                        styles.refreshBtn,
                        {
                            borderColor: theme.cardBorder,
                            opacity: pressed || refreshing ? 0.8 : 1,
                        },
                    ]}
                >
                    {refreshing ? (
                        <ActivityIndicator />
                    ) : (
                        <Text style={[styles.refreshText, { color: theme.text }]}>Refresh now</Text>
                    )}
                </Pressable>

                {error ? (
                    <Text style={[styles.error, { color: mode === "dark" ? "#FFB4B4" : "#B00020" }]}>
                        {error}
                    </Text>
                ) : null}
            </View>

            <View style={styles.grid}>
                {items.map((w) => (
                    <View key={w.city} style={styles.cell}>
                        <WeatherCard weather={w} theme={theme} />
                    </View>
                ))}
            </View>

            {loading ? (
                <Text style={[styles.loadingHint, { color: theme.muted }]}>
                    Loading…
                </Text>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    page: { flex: 1, paddingTop: 54, paddingHorizontal: 18 },
    topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    title: { fontSize: 22, fontWeight: "900" },
    subtitle: { marginTop: 4, fontSize: 12, fontWeight: "600" },

    actionsRow: { marginTop: 18 },
    refreshBtn: {
        borderWidth: 1,
        borderRadius: 16,
        paddingVertical: 12,
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.04)",
    },
    refreshText: { fontWeight: "900", fontSize: 14 },
    error: { marginTop: 10, fontWeight: "700" },

    grid: { marginTop: 16, flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
    cell: { width: "48%", marginBottom: 14 },

    loadingHint: { marginTop: 6, fontWeight: "700" },
});
