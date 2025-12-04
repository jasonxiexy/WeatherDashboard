// src/models/weatherModel.js
import prisma from "./prismaClient.js";

async function findAllWeather() {
    return prisma.weather.findMany({
        orderBy: { city: "asc" }
    });
}

async function upsertWeatherByCity(data) {
    const {
        city,
        country,
        latitude,
        longitude,
        temperature,
        weatherCode,
        updatedAt
    } = data;

    if (!city || typeof city !== "string") {
        throw new Error("weatherModel.upsertWeatherByCity: 'city' is required");
    }

    return prisma.weather.upsert({
        where: { city },
        update: {
            country,
            latitude,
            longitude,
            temperature,
            weatherCode,
            updatedAt: new Date(updatedAt)
        },
        create: {
            city,
            country,
            latitude,
            longitude,
            temperature,
            weatherCode,
            updatedAt: new Date(updatedAt)
        }
    });
}

export {
    findAllWeather,
    upsertWeatherByCity
};
