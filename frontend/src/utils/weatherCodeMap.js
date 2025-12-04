const WEATHER_CODE_MAP = {
    0: { label: "Clear sky", icon: "☀️", theme: "sunny" },
    1: { label: "Mainly clear", icon: "🌤️", theme: "sunny" },
    2: { label: "Partly cloudy", icon: "⛅", theme: "cloudy" },
    3: { label: "Overcast", icon: "☁️", theme: "cloudy" },

    45: { label: "Fog", icon: "🌫️", theme: "fog" },
    48: { label: "Rime fog", icon: "🌫️", theme: "fog" },

    51: { label: "Light drizzle", icon: "🌦️", theme: "rain" },
    53: { label: "Moderate drizzle", icon: "🌦️", theme: "rain" },
    55: { label: "Dense drizzle", icon: "🌧️", theme: "rain" },

    61: { label: "Slight rain", icon: "🌧️", theme: "rain" },
    63: { label: "Moderate rain", icon: "🌧️", theme: "rain" },
    65: { label: "Heavy rain", icon: "🌧️", theme: "rain" },

    71: { label: "Slight snow", icon: "🌨️", theme: "snow" },
    73: { label: "Moderate snow", icon: "🌨️", theme: "snow" },
    75: { label: "Heavy snow", icon: "❄️", theme: "snow" },

    80: { label: "Rain showers", icon: "🌧️", theme: "rain" },
    81: { label: "Rain showers", icon: "🌧️", theme: "rain" },
    82: { label: "Rain showers", icon: "🌧️", theme: "rain" },

    95: { label: "Thunderstorm", icon: "⛈️", theme: "storm" },
    96: { label: "Thunderstorm", icon: "⛈️", theme: "storm" },
    99: { label: "Thunderstorm", icon: "⛈️", theme: "storm" },
};

export function interpretWeatherCode(code) {
    return WEATHER_CODE_MAP[code] || {
        label: "Unknown",
        icon: "❓",
        theme: "default",
    };
}
