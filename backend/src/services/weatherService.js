// src/services/weatherService.js
import axios from "axios";
import {
    findAllWeather,
    upsertWeatherByCity
} from "../models/weatherModel.js";

const CITIES = Object.freeze(["Toronto", "New York", "London", "Vancouver", "Calgary"]);
const OPEN_METEO_TIMEOUT_MS = 8000;

// Separate clients because base URLs are different
const geoClient = axios.create({
    baseURL: "https://geocoding-api.open-meteo.com/v1",
    timeout: OPEN_METEO_TIMEOUT_MS,
});

const forecastClient = axios.create({
    baseURL: "https://api.open-meteo.com/v1",
    timeout: OPEN_METEO_TIMEOUT_MS,
});

export class ExternalApiError extends Error {
    constructor(message, cause) {
        super(message);
        this.name = "ExternalApiError";
        this.cause = cause;
    }
}

function ensureNumber(value, fieldName) {
    const num = Number(value);
    if (!Number.isFinite(num)) {
        throw new ExternalApiError(
            `Invalid numeric value for '${fieldName}' from API`
        );
    }
    return num;
}

function ensureString(value, fieldName) {
    if (typeof value !== "string" || value.trim() === "") {
        throw new ExternalApiError(
            `Invalid string value for '${fieldName}' from API`
        );
    }
    return value.trim();
}

async function fetchCityGeo(city) {
    try {
        const res = await geoClient.get("/search", {
            params: {
                name: city,
                count: 1
            }
        });

        const data = res.data;
        if (!data.results || data.results.length === 0 || !Array.isArray(data.results)) {
            throw new ExternalApiError(`No geocoding result for city '${city}'`);
        }

        const result = data.results[0];
        const name = ensureString(result.name, "name");
        const country = ensureString(result.country, "country");
        const latitude = ensureNumber(result.latitude, "latitude");
        const longitude = ensureNumber(result.longitude, "longitude");

        return { city: name, country, latitude, longitude };
    } catch (err) {
        if (err instanceof ExternalApiError) throw err;
        throw new ExternalApiError(
            `Failed to fetch geocoding data for '${city}'`,
            err
        );
    }
}

async function fetchCityWeather(latitude, longitude, cityForErrorMsg) {
    try {
        const res = await forecastClient.get("/forecast", {
            params: {
                latitude,
                longitude,
                current: "temperature_2m,weather_code",
                timezone: "EST",
            }
        });

        const { current } = res.data || {};

        if (!current) {
            throw new ExternalApiError(
                `Missing 'current' field in weather response for '${cityForErrorMsg}'`
            );
        }

        const temperature = ensureNumber(
            current.temperature_2m,
            "temperature_2m"
        );
        const weatherCode = ensureNumber(current.weather_code, "weather_code");
        const updatedAt = ensureString(current.time, "time");

        // current.time is an ISO string, we'll convert later
        return { temperature, weatherCode, updatedAt };
    } catch (err) {
        if (err instanceof ExternalApiError) throw err;

        throw new ExternalApiError(
            `Failed to fetch weather data for '${cityForErrorMsg}'`,
            err
        );
    }
}

/**
 * Called by /weather/update
 * - loops over static city list
 * - calls geocoding + forecast
 * - upserts each into DB
 */
async function updateAllCitiesWeather() {
    const results = [];
    const errors = [];

    for (const city of CITIES) {
        try {
            const geo = await fetchCityGeo(city);
            const weather = await fetchCityWeather(
                geo.latitude,
                geo.longitude,
                geo.city
            );

            const record = await upsertWeatherByCity({ ...geo, ...weather });
            results.push(record);
        } catch (err) {
            console.error(`[WeatherService] Error updating city '${city}':`, err);
            errors.push({ city, message: err.message });
        }
    }

    if (results.length === 0 && errors.length > 0) {
        const combined = errors.map((e) => `${e.city}: ${e.message}`).join("; ");
        throw new ExternalApiError(
            `Failed to update weather for all cities: ${combined}`
        );
    }

    return { results, errors };
}

/**
 * Called by GET /weather – reads from DB only
 */
async function getAllWeatherFromDb() {
    return findAllWeather();
}

export {
    updateAllCitiesWeather,
    getAllWeatherFromDb
};
