// src/routes/weatherRoutes.js
import { Router } from "express";
const router = Router();
import { getWeather, updateWeather } from "../controllers/weatherController.js";
// server.js or routes
import rateLimit from "express-rate-limit";

// Limit how often /update can be called per IP
const updateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 5,              // max 5 requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
});

// GET /api/weather
router.get("/", getWeather);

// POST /api/weather/update  (protected by rate limiter)
router.post("/update", updateLimiter, updateWeather);

export default router;
