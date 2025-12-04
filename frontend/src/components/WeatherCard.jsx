// src/components/WeatherCard.jsx
import { interpretWeatherCode } from "../utils/weatherCodeMap";

const palettes = {
    dark: {
        sunny: {
            gradient: "linear-gradient(135deg, #f9d976, #f39f86)",
            glow: "0 0 25px rgba(249, 217, 118, 0.5)",
        },
        cloudy: {
            gradient: "linear-gradient(135deg, #bdc3c7, #2c3e50)",
            glow: "0 0 25px rgba(189,195,199,0.4)",
        },
        rain: {
            gradient: "linear-gradient(135deg, #4b79a1, #283e51)",
            glow: "0 0 25px rgba(75,121,161,0.5)",
        },
        snow: {
            gradient: "linear-gradient(135deg, #e0eafc, #cfdef3)",
            glow: "0 0 25px rgba(224,234,252,0.7)",
        },
        fog: {
            gradient: "linear-gradient(135deg, #757f9a, #d7dde8)",
            glow: "0 0 25px rgba(215,221,232,0.5)",
        },
        storm: {
            gradient: "linear-gradient(135deg, #141e30, #243b55)",
            glow: "0 0 25px rgba(36,59,85,0.7)",
        },
        default: {
            gradient: "linear-gradient(135deg, #667eea, #764ba2)",
            glow: "0 0 25px rgba(118,75,162,0.6)",
        },
    },
    light: {
        sunny: {
            gradient: "linear-gradient(135deg, #ffe29f, #ffa99f)",
            glow: "0 0 20px rgba(255, 226, 159, 0.6)",
        },
        cloudy: {
            gradient: "linear-gradient(135deg, #e0eafc, #cfdef3)",
            glow: "0 0 20px rgba(207, 222, 243, 0.6)",
        },
        rain: {
            gradient: "linear-gradient(135deg, #a3bded, #6991c7)",
            glow: "0 0 20px rgba(163,189,237,0.6)",
        },
        snow: {
            gradient: "linear-gradient(135deg, #fdfbfb, #ebedee)",
            glow: "0 0 20px rgba(235,237,238,0.7)",
        },
        fog: {
            gradient: "linear-gradient(135deg, #d7d2cc, #304352)",
            glow: "0 0 20px rgba(48,67,82,0.4)",
        },
        storm: {
            gradient: "linear-gradient(135deg, #283048, #859398)",
            glow: "0 0 20px rgba(40,48,72,0.5)",
        },
        default: {
            gradient: "linear-gradient(135deg, #89f7fe, #66a6ff)",
            glow: "0 0 20px rgba(102,166,255,0.6)",
        },
    },
};

export default function WeatherCard({ cityWeather, themeMode = "dark" }) {
    const {
        city,
        country,
        temperature,
        weatherCode,
        updatedAt,
        latitude,
        longitude,
    } = normalize(cityWeather);

    const { label, icon, theme } = interpretWeatherCode(weatherCode);
    const paletteSet = palettes[themeMode] || palettes.dark;
    const { gradient, glow } = paletteSet[theme] || paletteSet.default;

    const lastUpdated =
        updatedAt != null
            ? new Date(updatedAt).toLocaleString("en-CA", {
                timeZone: "EST",
                year: "numeric",
                month: "short",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            })
            : "N/A";


    return (
        <div
            style={{
                borderRadius: 24,
                padding: 20,
                backgroundImage: gradient,
                color: themeMode === "light" ? "#0f172a" : "white",
                boxShadow: glow,
                display: "flex",
                flexDirection: "column",
                gap: 14,
                minWidth: 220,
                minHeight: 160,
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* subtle overlay for glassy look */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background:
                        themeMode === "dark"
                            ? "linear-gradient(145deg, rgba(15,23,42,0.12), rgba(15,23,42,0.06))"
                            : "linear-gradient(145deg, rgba(255,255,255,0.25), rgba(255,255,255,0.1))",
                    pointerEvents: "none",
                }}
            />

            <div
                style={{
                    position: "relative",
                    zIndex: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                }}
            >
                <div>
                    <div style={{ fontSize: 18, fontWeight: 600 }}>
                        {city}
                        {country ? `, ${country}` : ""}
                    </div>
                    {latitude != null && longitude != null && (
                        <div style={{ fontSize: 11, opacity: 0.8 }}>
                            {latitude.toFixed(2)}°, {longitude.toFixed(2)}°
                        </div>
                    )}
                </div>
                <div style={{ fontSize: 32 }}>{icon}</div>
            </div>

            <div
                style={{
                    position: "relative",
                    zIndex: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                }}
            >
                <div style={{ fontSize: 32, fontWeight: 600 }}>
                    {temperature != null ? `${temperature.toFixed(1)}°C` : "—"}
                </div>
                <div
                    style={{
                        fontSize: 13,
                        padding: "4px 10px",
                        borderRadius: 999,
                        backgroundColor:
                            themeMode === "dark"
                                ? "rgba(15,23,42,0.4)"
                                : "rgba(255,255,255,0.7)",
                        color: themeMode === "dark" ? "#e5e7eb" : "#111827",
                    }}
                >
                    {label}
                </div>
            </div>

            <div
                style={{
                    position: "relative",
                    zIndex: 1,
                    fontSize: 11,
                    opacity: 0.9,
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 4,
                }}
            >
                <span>Last updated</span>
                <span>{lastUpdated}</span>
            </div>
        </div>
    );
}

function normalize(raw) {
    if (!raw) return {};
    return {
        city: raw.city,
        country: raw.country,
        temperature: raw.temperature ?? raw.temperature_2m,
        weatherCode: raw.weatherCode ?? raw.weather_code,
        updatedAt: raw.updatedAt ?? raw.updated_at,
        latitude: raw.latitude,
        longitude: raw.longitude,
    };
}
