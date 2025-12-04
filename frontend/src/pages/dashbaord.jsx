// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { fetchWeather, refreshWeather } from "../api/weather";
import WeatherCard from "../components/WeatherCard";

export default function Dashboard() {
    const [weather, setWeather] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [themeMode, setThemeMode] = useState("dark"); // 'dark' | 'light'
    const CITY_LIST = ["Toronto", "New York", "London", "Vancouver"];

    async function loadWeather(options = { showLoader: true }) {
        try {
            if (options.showLoader) setLoading(true);
            setError("");
            const list = await fetchWeather();
            setWeather(list);
        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to load weather");
        } finally {
            if (options.showLoader) setLoading(false);
        }
    }

    // helper: refresh + load into state
    async function doRefresh({ showLoaderForGet = false, setRefreshingFlag = false } = {}) {
        try {
            if (setRefreshingFlag) setRefreshing(true);
            setError("");

            // call POST /api/weather/update
            const updated = await refreshWeather(); // returns array of rows (data.results)

            if (Array.isArray(updated) && updated.length > 0) {
                setWeather(updated);
            } else {
                // fallback: if backend ever returns empty, just hit GET
                await loadWeather({ showLoader: showLoaderForGet });
            }
        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to refresh weather");
        } finally {
            if (setRefreshingFlag) setRefreshing(false);
        }
    }

    async function handleRefreshClick() {
        // manual refresh -> show spinner on button, no full page loader
        await doRefresh({ showLoaderForGet: false, setRefreshingFlag: true });
    }

    function toggleTheme() {
        setThemeMode((prev) => (prev === "dark" ? "light" : "dark"));
    }

    useEffect(() => {
        loadWeather();

        // every 10 minutes to reload the data
        const intervalId = setInterval(() => {
            // don’t show spinner for background refreshes
            doRefresh({ showLoaderForGet: false, setRefreshingFlag: false });
        }, 10 * 60 * 1000); // 10 minutes

        return () => clearInterval(intervalId);
    }, []);

    const isDark = themeMode === "dark";

    const backgroundStyle = isDark
        ? "radial-gradient(circle at top left, #1d4ed8 0, #020617 40%, #000000 100%)"
        : "radial-gradient(circle at top left, #e0f2fe 0, #f9fafb 45%, #e5e7eb 100%)";

    const textColor = isDark ? "#e5e7eb" : "#0f172a";

    const weatherMap = new Map(
        (weather || []).map((item) => [item.city, item])
    );

    return (
        <div
            style={{
                minHeight: "100vh",
                minWidth: "215vh",
                background: backgroundStyle,
                color: textColor,
                fontFamily:
                    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                transition: "background 0.3s ease, color 0.3s ease",
            }}
        >
            <div
                style={{
                    maxWidth: 1200,
                    margin: "0 auto",
                    padding: "30px 20px 40px",
                }}
            >
                {/* Header row */}
                <header
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 16,
                        marginBottom: 180,
                    }}
                >
                    <div>
                        <h1
                            style={{
                                margin: 0,
                                fontSize: 28,
                                letterSpacing: 0.5,
                            }}
                        >
                            Weather Dashboard
                        </h1>
                        <p
                            style={{
                                margin: "4px 0 0",
                                fontSize: 13,
                                opacity: 0.8,
                            }}
                        >
                            Live conditions for Toronto, New York, London, and Vancouver.
                        </p>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                        }}
                    >
                        {/* Theme toggle */}
                        <button
                            onClick={toggleTheme}
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: "999px",
                                border: "none",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                fontSize: 18,
                                backgroundColor: isDark ? "#0f172a" : "#e5e7eb",
                                color: isDark ? "#facc15" : "#0f172a",
                                boxShadow: isDark
                                    ? "0 6px 16px rgba(15,23,42,0.7)"
                                    : "0 6px 16px rgba(148,163,184,0.7)",
                                transition:
                                    "background-color 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease",
                            }}
                            onMouseDown={(e) => {
                                e.currentTarget.style.transform = "scale(0.95)";
                            }}
                            onMouseUp={(e) => {
                                e.currentTarget.style.transform = "scale(1)";
                            }}
                            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
                        >
                            {isDark ? "🌞" : "🌙"}
                        </button>

                        {/* Refresh button */}
                        <button
                            onClick={handleRefreshClick}
                            disabled={refreshing}
                            style={{
                                padding: "8px 16px",
                                borderRadius: 999,
                                border: "none",
                                cursor: refreshing ? "default" : "pointer",
                                fontSize: 13,
                                fontWeight: 500,
                                background: isDark
                                    ? "linear-gradient(135deg, #38bdf8, #3b82f6)"
                                    : "linear-gradient(135deg, #22c55e, #16a34a)",
                                color: "white",
                                boxShadow: isDark
                                    ? "0 10px 25px rgba(15,23,42,0.7)"
                                    : "0 10px 25px rgba(148,163,184,0.7)",
                                opacity: refreshing ? 0.75 : 1,
                                transition:
                                    "transform 0.1s ease, box-shadow 0.1s ease, opacity 0.1s ease",
                            }}
                            onMouseDown={(e) => {
                                e.currentTarget.style.transform = "scale(0.97)";
                            }}
                            onMouseUp={(e) => {
                                e.currentTarget.style.transform = "scale(1)";
                            }}
                        >
                            {refreshing ? "Refreshing…" : "Refresh now"}
                        </button>
                    </div>
                </header>

                {/* Status / Error */}
                {loading && (
                    <p style={{ fontSize: 13, opacity: 0.8 }}>Loading latest weather…</p>
                )}
                {error && (
                    <p
                        style={{
                            fontSize: 13,
                            color: isDark ? "#fecaca" : "#b91c1c",
                            marginTop: 4,
                        }}
                    >
                        {error}
                    </p>
                )}

                {/* Cards grid (4 glowing cards) */}
                <div
                    style={{
                        marginTop: 16,
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                        gap: 25,
                    }}
                >
                    {CITY_LIST.map((cityName) => {
                        const cityData = weatherMap.get(cityName);
                        // if cityData is undefined, we still pass { city: cityName }
                        return (
                            <WeatherCard
                                key={cityName}
                                cityWeather={cityData || { city: cityName }}
                                themeMode={themeMode}
                            />
                        );
                    })}
                </div>

                {!loading && weather.length === 0 && !error && (
                    <p style={{ fontSize: 13, opacity: 0.8, marginTop: 24 }}>
                        No weather data yet. Try hitting{" "}
                        <strong>Refresh now</strong>.
                    </p>
                )}
            </div>
        </div>
    );
}
