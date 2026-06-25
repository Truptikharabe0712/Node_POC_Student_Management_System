# Student Management REST API

## Requirements

- Node.js `22+`
- npm
- Optional for PostgreSQL mode: running PostgreSQL instance

## Setup

1. Install dependencies:
   `npm install`
2. Create a local env file from the example:
   `copy .env.example .env`
3. Update `.env` values as needed.
4. Start the API:
   `npm run dev`

## Environment Variables

```env
PORT=5000
STORAGE_MODE=postgres

# Use when STORAGE_MODE=postgres
# DATABASE_URL=postgres://postgres:root@localhost:5432/student_db
# or
# DB_HOST=127.0.0.1
# DB_PORT=5432
# DB_NAME=student_db
# DB_USER=postgres
# DB_PASSWORD=root
```

`PORT` and `STORAGE_MODE` belong in your local [backend/.env](backend/.env), while [backend/.env.example](backend/.env.example) should stay as the shareable template.

## Storage Modes

- `json` (default): persists records to `data/students.json`.
- `postgres`: uses PostgreSQL table `students` (auto-created on startup).

## API Endpoints

- `GET /health`
- `POST /students`
- `GET /students`
- `GET /students/:id`
- `PUT /students/:id`
- `DELETE /students/:id`

## Optional Query Support

- Search: `GET /students?name=john`
- Pagination: `GET /students?page=1&limit=5`

## Sample Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 22,
  "course": "Computer Science"
}
```

## Response Format

Success:

```json
{
  "success": true,
  "message": "Student created successfully",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

## Execution Evidence

The APIs were verified with local runs and build checks:

1. Backend startup from `backend/`:
   - Command: `npm run dev`
   - Result: server started on configured port with selected storage mode.
2. Frontend compile check from `frontend/student-ui/`:
   - Command: `npm run build`
   - Result: Angular build completed successfully and emitted `dist/student-ui`.
3. Postman collection for endpoint verification:
   - File: `student-api.postman_collection.json`

## Notes

- Validation is implemented using `express-validator`.
- Logging middleware prints timestamp, HTTP method, and endpoint URL.
- Responses follow assignment format with `success`, `message`, and `data` or `errors`.
- Email uniqueness is enforced (returns HTTP 409 on duplicates).
