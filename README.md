# Student Management POC

This repository contains a full-stack student management proof-of-concept application.
It includes:

- `backend/` — Node.js + Express REST API
- `frontend/` — Angular student UI

---

## Project Overview

The backend supports two storage modes:

- `json` (default)
  - Persists student data in a local JSON file: `backend/data/students.json`
  - Uses Node's built-in `fs/promises` API for async file operations
  - Data is loaded into memory on startup and saved back to disk on changes
- `postgres`
  - Uses a PostgreSQL database
  - Requires a running PostgreSQL instance and database connection info

### `storage_mode`

The active storage mode is controlled by the environment variable `STORAGE_MODE`.

- `STORAGE_MODE=json` — local filesystem storage
- `STORAGE_MODE=postgres` — PostgreSQL storage

The backend reads this mode in `backend/src/config/env.js`:

```js
function getStorageMode() {
  return (process.env.STORAGE_MODE || "json").trim().toLowerCase();
}
```

### `fs.promises`

The JSON storage implementation uses Node's promise-based filesystem API in `backend/src/data/studentStore.js`:

- `import fs from "fs/promises";`
- `await fs.mkdir(path.dirname(dataFile), { recursive: true });`
- `await fs.writeFile(dataFile, JSON.stringify(data, null, 2));`
- `await fs.readFile(dataFile, "utf-8");`

This ensures file operations are performed asynchronously and avoids callback-based code.

---

## Required Software

- Node.js `22+`
- npm
- Angular CLI (recommended for frontend development)
- Optional: PostgreSQL for `STORAGE_MODE=postgres`

---

## Backend Setup

1. Open a terminal in `backend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a local environment file:
   ```bash
   copy .env.example .env
   ```
4. Edit `backend/.env` and set values:
   ```env
   PORT=5000
   STORAGE_MODE=json
   ```

### PostgreSQL configuration

If using `STORAGE_MODE=postgres`, also configure either `DATABASE_URL` or the vendor-specific variables:

```env
DATABASE_URL=postgres://postgres:root@localhost:5432/student_db
```

or

```env
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=student_db
DB_USER=postgres
DB_PASSWORD=root
```

---

## Frontend Setup

1. Open a terminal in `frontend/`
2. Install dependencies:
   ```bash
   npm install
   ```

## Run the application

### Start backend

From `backend/`:

```bash
npm run dev
```

This starts the Express API server using `nodemon`.

### Start frontend

From `frontend/`:

```bash
npm start
ng serve
```

Open the application at `http://localhost:4200/`.

---

## Useful Commands

### Backend

- `npm start` — run the backend server once
- `npm run dev` — run the backend server with `nodemon`

### Frontend

- `npm start` — run the Angular development server
- `npm run build` — build the frontend for production
- `npm run test` — run frontend unit tests

---

## Backend API Endpoints

- `GET /health`
- `GET /students`
- `GET /students/:id`
- `POST /students`
- `PUT /students/:id`
- `DELETE /students/:id`

### Optional query params

- `name` — search by student name
- `page` — page number for pagination
- `limit` — items per page

---

## Notes

- The backend is implemented using ES modules (`type: "module"` in `backend/package.json`).
- The frontend is built with Angular 19 and uses standalone components.
- The backend's JSON storage mode uses an in-memory cache plus `backend/data/students.json` persistence.
- When `STORAGE_MODE=json` is active, server changes are stored to disk automatically.

---

## Folder Structure

- `backend/`
  - `server.js` — Express bootstrap and route registration
  - `index.js` — exports backend helpers
  - `src/` — source code
    - `config/` — env and swagger config
    - `controllers/` — request handlers
    - `data/` — repository layer and storage implementation
    - `middleware/` — logging, error handling, validation
    - `routes/` — route definitions
    - `services/` — business logic
- `frontend/`
  - Angular UI application
  - `src/app/` — UI components and services

---

## Recommended workflow

1. Start the backend API.
2. Start the frontend app.
3. Use the UI to create, edit, search, and delete students.
4. If using `json` mode, verify `backend/data/students.json` persists data between restarts.

---

## Contact

If you need help running the project, confirm Node version and ensure the backend `.env` is configured correctly.
