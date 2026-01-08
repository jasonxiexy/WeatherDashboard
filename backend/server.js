// server.js
import express, { json } from "express";
import cors from "cors";
import weatherRoutes from "./src/routes/weatherRoutes.js";
import prisma from "./src/models/prismaClient.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// log api requests
app.use((req, res, next) => {
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.method} ${req.originalUrl}`);
  next();
});

// Routes
app.use("/api/weather", weatherRoutes);

app.get("/", (req, res) => {
  res.send("Weather API is running");
});

// bind to 0.0.0.0 so it listens on all network interface
// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
});

// Clean shutdown (nice touch for interviews)
process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});
