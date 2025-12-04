// src/controllers/weatherController.js
import { HttpStatusCode } from "axios";
import { updateAllCitiesWeather, getAllWeatherFromDb } from "../services/weatherService.js";

async function getWeather(req, res) {
  try {
    const data = await getAllWeatherFromDb();
    return res.status(HttpStatusCode.Ok).json(data);
  } catch (err) {
    console.error("Error in getWeather:", err);
    return res.status(HttpStatusCode.InternalServerError).json({ error: "Failed to fetch weather data" });
  }
}

async function updateWeather(req, res) {
  try {
    const data = await updateAllCitiesWeather();
    return res.status(HttpStatusCode.Ok).json({
      message: "Weather updated",
      data
    });
  } catch (err) {
    console.error("Error in updateWeather:", err);
    return res.status(HttpStatusCode.InternalServerError).json({ error: "Failed to update weather data" });
  }
}

export {
  getWeather,
  updateWeather
};
