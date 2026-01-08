// src/api/weatherApi.js
const BASE_URL =
    // "http://192.168.2.10:8080";
    process.env.EXPO_PUBLIC_API_BASE_URL;

export async function fetchWeather() {
    const res = await fetch(`${BASE_URL}/api/weather`);
    if (!res.ok) throw new Error(`Failed to load weather: ${res.status}`);
    return res.json();
}

export async function refreshWeather() {
    const res = await fetch(`${BASE_URL}/api/weather/update`, { method: "POST" });
    if (!res.ok) {
        // show a more user-friendly message for 429
        if (res.status === 429) {
            throw new Error("Too many refreshes. Please wait 1 minute and try again.");
        }
        throw new Error(`Failed to refresh weather: ${res.status}`);
    }
    const data = await res.json();
    // your update endpoint returns { message, data: { results, errors } }
    return data?.data?.results ?? [];
}

// If you run backend on your laptop, mobile cannot call localhost.

// Android emulator: http://10.0.2.2:8080

// iOS simulator: http://localhost:8080 (usually works)

// Real phone: use your machine LAN IP like http://192.168.x.x:8080