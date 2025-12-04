const API_BASE = import.meta.env.API_BASE_URL || "http://localhost:8080";

/**
 * GET /api/weather
 * -> returns an array of weather rows from DB
 */
export async function fetchWeather() {
    const res = await fetch(`${API_BASE}/api/weather`);
    if (!res.ok) {
        throw new Error(`Failed to fetch weather: ${res.status}`);
    }

    const data = await res.json();

    // GET returns a plain array
    if (Array.isArray(data)) return data;

    if (Array.isArray(data.items)) return data.items;

    return [];
}

/**
 * POST /api/weather/update
 * -> returns { message, data: { results: [...], errors: [...] } }
 */
export async function refreshWeather() {
    const res = await fetch(`${API_BASE}/api/weather/update`, {
        method: "POST",
    });

    if (!res.ok) {
        if (res.status === 429) {
            // nice human-friendly message
            throw new Error(
                "You’ve refreshed too many times. Please wait a moment before trying again."
            );
        }
        throw new Error(`Failed to refresh weather: ${res.status}`);
    }

    const json = await res.json();
    const results = json?.data?.results;

    // normalize: always return an array of rows
    if (Array.isArray(results)) return results;

    return [];
}