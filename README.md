# GymDiary – Secure Workout Tracking API

A secure RESTful backend API for tracking workouts and gym sessions.  
Built with Node.js, Express, and TypeScript, using MongoDB for persistence and JWT-based authentication with access and refresh tokens.

---

## Tech Stack

- Node.js
- Express
- TypeScript
- MongoDB (Mongoose)
- JWT (Access & Refresh Tokens)
- Vitest (Testing)
- Helmet, CORS, Mongo-sanitize (Basic security hardening)

---

## Features

- User registration & login
- JWT authentication (access + refresh tokens)
- Protected workout routes
- Input validation layer
- ObjectId validation before database queries
- Centralized error handling middleware
- Health check endpoint

---

## Authentication Flow

1. User registers or logs in.
2. Server returns:
   - Short-lived access token
   - Long-lived refresh token
3. Access token is required for protected routes:
   Authorization: Bearer <access_token>
4. Refresh token can be used to obtain a new access token.

---

## API Endpoints (Overview)

Auth:
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/refresh
- POST /api/auth/logout

Workouts (Protected):
- GET /api/workouts
- POST /api/workouts
- GET /api/workouts/:id
- DELETE /api/workouts/:id

Health:
- GET /api/health

---

## Project Structure

```
src/
  controllers/
  middlewares/
  models/
  routes/
  schemas/
  utils/
  __test__/
  app.ts
  server.ts
  db.ts
  env.ts
```

---

## Setup

```
npm install
cp .env.example .env
# configure environment variables
npm run dev
```

---

## Environment Variables

```
PORT=
MONGODB_URI=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
ACCESS_EXPIRES_IN=
REFRESH_EXPIRES_IN=
```

---

## Running Tests

```
npm run test
```


---

## License

MIT