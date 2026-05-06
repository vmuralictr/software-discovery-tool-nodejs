# Running the Software Discovery Tool

## Prerequisites

### Without Docker
- [Node.js](https://nodejs.org/) v18 or later
- npm (bundled with Node.js)

### With Docker
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (includes Docker Compose)

---

## Running without Docker

### 1. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` directory:

```
PORT=8000
DB_PATH=./database.sqlite
```

Build the SQLite database from the package data files (run once):

```bash
npm run build-db
```

Start the backend server:

```bash
npm start
```

The API will be available at `http://localhost:5000`.

---

### 2. Set up the frontend

Open a new terminal window.

```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend/` directory:

```
REACT_APP_API_URL=http://localhost:8000/api
```

Start the frontend dev server:

```bash
npm start
```

The app will open at `http://localhost:3000`.

---

## Running with Docker

From the root of the project (where `docker-compose.yml` lives):

```bash
docker compose up --build
```

The app will be available at `http://localhost`.

> The first build takes a few minutes — it installs dependencies, compiles the native SQLite module, builds the React app, and populates the database.

To stop the containers:

```bash
docker compose down
```

To rebuild after making code changes:

```bash
docker compose up --build
```

---

## Summary

| | URL | Command |
|---|---|---|
| Frontend (no Docker) | http://localhost:3000 | `npm start` in `frontend/` |
| Backend (no Docker) | http://localhost:5000 | `npm start` in `backend/` |
| Full app (Docker) | http://localhost | `docker compose up --build` |
