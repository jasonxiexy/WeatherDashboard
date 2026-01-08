// src/utils/weatherCode.js
export function weatherCodeInfo(code) {
    // Keep it simple and readable; add more codes later
    if (code === 0) return { label: "Clear", icon: "☀️", tone: "sun" };
    if (code === 1 || code === 2) return { label: "Partly cloudy", icon: "🌤️", tone: "sky" };
    if (code === 3) return { label: "Cloudy", icon: "☁️", tone: "cloud" };
    if (code >= 51 && code <= 67) return { label: "Drizzle/Rain", icon: "🌧️", tone: "rain" };
    if (code >= 71 && code <= 77) return { label: "Snow", icon: "❄️", tone: "snow" };
    if (code >= 80 && code <= 99) return { label: "Showers/Storm", icon: "⛈️", tone: "storm" };
    return { label: "Unknown", icon: "🌡️", tone: "neutral" };
}
