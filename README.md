# WeatherDashboard
![Weather Dashboard Screenshot](/frontend/src/assets/home.png)

## Backend
This backend service exposes REST APIs to:

- GET /api/weather — Fetch weather data stored in MySQL
- POST /api/weather/update — Call Open-Meteo APIs → Validate responses → Store updates in DB

### Tech Stack

- **Runtime**: Node.js
- **Framework**: Express
- **Database**: MySQL
- **ORM**: Prisma
- **HTTP Client**: Axios
- **Config**: dotenv

## Frontend
A modern React dashboard displaying four reusable weather cards with:
- Weather icon
- Dynamic background color based on weather code
- Toronto-localized “Last updated” timestamp
- Light / dark theme toggle
- Manual refresh button
- Auto-refresh every 10 minutes

### Tech Stack
- **Framework**: React

## Repo Structure
```
WeatherDashboard/
│
├── backend/
|   ├── .env.sample                # Template for environment variables
│   ├── Dockerfile                 # Backend Docker build file
│   ├── server.js                  # Entry point (Express app & middleware)
│   ├── package.json
│   ├── prisma/
│   │   ├── schema.prisma          # Prisma data model definitions
│   │   └── migrations/            # Auto-generated Prisma migrations
│   └── src/
│       ├── models/
│       │   ├── prismaClient.js    # PrismaClient singleton using MariaDB adapter
│       │   └── weatherModel.js    # Weather DB operations (CRUD + query helpers)
│       ├── services/
│       │   └── weatherService.js  # Calls Open-Meteo + validation + DB upsert logic
│       ├── controllers/
│       │   └── weatherController.js
│       │       # Maps HTTP → service logic
│       └── routes/
│           └── weatherRoutes.js   # Express router + rate limiter
│
├── frontend/
│   ├── Dockerfile                 # Frontend Docker build file
│   ├── nginx.conf                 # SPA fallback config for Nginx
│   ├── package.json
│   └── src/
│       ├── pages/
│       │   └── Dashboard.jsx      # Main view + theme toggle + auto refresh
│       ├── components/
│       │   └── WeatherCard.jsx    # Reusable card component
│       └── api/
│           └── weather.js         # GET/POST weather API client
│
├── docker-compose.yml             # Runs MySQL + backend + frontend together
└── README.md                      # Project documentation
```

## Getting Started
### **Clone the Repository**
```bash
git clone https://github.com/jasonxiexy/WeatherDashboard.git
cd WeatherDashboard
```
## 1. Run from Docker

```bash
docker compose up --build

// To Stop
docker compose down
```

## 2. Run from manually setup
### Backend Setup

The Backend is built using Node.js with Mysql and Prisma.

### **Navigate to the Backend Directory**
```bash
cd ./backend
```

### **Install Dependencies**
```bash
npm install
```

### **Set up environment variables**
Make a copy of the `.env.sample` file as `.env` in the backend folder, and replace the `DATABASE_URL` with your actual database url inside the `.env` file, as well as username and password:
```bash
cp .env.sample .env
```
And make sure your mysql server is started, and change the username and password in DATABASE_URL in .env to your own.

### **Run Prisma migration**
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### **Start the Backend**
```bash
npm run dev
```
Once the backend server is successfully started, the server will be at `http://localhost:8080/`.
And next, prepare to set up for the frontend.


### Frontend Setup

The frontend is built using React.js with Ant Design for UI components.

### **Navigate to the Frontend Directory**
```bash
cd ./frontend
```

### **Install Dependencies**
```bash
npm install
```

### **Start the Frontend**
```bash
npm run dev
```
Once you started the frontend server, you should be able to access it through `http://localhost:5173/`.