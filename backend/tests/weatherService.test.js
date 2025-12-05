// backend/tests/weatherService.test.js
import { jest } from "@jest/globals";

// Shared fake for axios.create().get()
const fakeGet = jest.fn();

// Mock axios BEFORE importing the service
jest.unstable_mockModule("axios", () => ({
  default: {
    create: () => ({
      get: fakeGet,
    }),
  },
}));

// Mock prisma client
jest.unstable_mockModule("../src/models/prismaClient.js", () => ({
  default: {
    weather: {
      findMany: jest.fn(),
      upsert: jest.fn(),
    },
  },
}));

const prisma = (await import("../src/models/prismaClient.js")).default;
const service = await import("../src/services/weatherService.js");
const { getAllWeatherFromDb, updateAllCitiesWeather } = service;

describe("weatherService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("getAllWeatherFromDb returns rows from prisma.weather.findMany", async () => {
    const fakeRows = [
      { city: "Toronto", temperature: 1.2, weatherCode: 2 },
      { city: "New York", temperature: 4.5, weatherCode: 0 },
    ];

    prisma.weather.findMany.mockResolvedValue(fakeRows);

    const result = await getAllWeatherFromDb();

    expect(prisma.weather.findMany).toHaveBeenCalledTimes(1);
    expect(result).toEqual(fakeRows);
  });

  test("updateAllCitiesWeather aggregates errors and throws ExternalApiError when all cities fail", async () => {
    // Here we deliberately return bad/malformed responses for every axios GET
    // so that the service goes through its error path.
    fakeGet.mockResolvedValue({ data: {} }); // no results / no current

    // We expect the service to reject with your custom ExternalApiError
    await expect(updateAllCitiesWeather()).rejects.toThrow(
      "Failed to update weather for all cities"
    );
  });
});
