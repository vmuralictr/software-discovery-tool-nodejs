# Running the Software Discovery Tool

## What you need

**Without Docker:** [Node.js](https://nodejs.org/) v18 or later (npm is included)

**With Docker:** [Docker Desktop](https://www.docker.com/products/docker-desktop/)

---

## Option 1 — Run locally (no Docker)

You'll need two terminal windows — one for the backend, one for the frontend.

### Terminal 1 — Backend

```bash
cd backend
cp .env.example .env
npm install
npm run build-db
npm start
```

> `build-db` only needs to run once. After that, just use `npm start`.

The API will be available at `http://localhost:5000`.

### Terminal 2 — Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm start
```

The app will open automatically at `http://localhost:3000`.

---

## Option 2 — Run with Docker

From the project root (where `docker-compose.yml` lives):

```bash
docker compose up --build
```

The app will be available at `http://localhost`.

> The first build takes a few minutes — it installs dependencies, compiles SQLite, builds the React app, and populates the database. Subsequent builds are faster.

To stop:

```bash
docker compose down
```

To rebuild after code changes:

```bash
docker compose up --build
```

---

## Quick reference

| | URL | How to start |
|---|---|---|
| Frontend (local) | http://localhost:3000 | `npm start` in `frontend/` |
| Backend (local) | http://localhost:5000 | `npm start` in `backend/` |
| Full app (Docker) | http://localhost | `docker compose up --build` |
