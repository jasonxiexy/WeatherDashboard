# WeatherDashboard

## Backend
This backend service exposes REST APIs to:

- Fetch current weather data for a fixed list of cities (Toronto, New York, London, Vancouver)
- Refresh weather data by calling the Open-Meteo APIs and storing the results in a MySQL database

### Tech Stack

- **Runtime**: Node.js
- **Framework**: Express
- **Database**: MySQL
- **ORM**: Prisma
- **HTTP Client**: Axios
- **Config**: dotenv

---

## Frontend

### Tech Stack


## Repo Structure

```
backend/
  server.js                 # Entry point (Express app)
  package.json
  prisma/
    schema.prisma           # Prisma models & datasource provider
    prisma.config.ts        # Prisma 7 configuration (datasource URL, migrations, etc.)
    migrations/             # Prisma migration files (auto-generated)
  src/
    models/
      prismaClient.js       # PrismaClient singleton
      weatherModel.js       # Weather repository (DB access for Weather model)
    services/
      weatherService.js     # Business logic: call Open-Meteo, update DB
    controllers/
      weatherController.js  # HTTP handlers: translate requests ↔ services
    routes/
      weatherRoutes.js      # Express routes for /api/weather
frontend/
.env.sample                      # Environment variables sample
README.md
```

## Get Start
