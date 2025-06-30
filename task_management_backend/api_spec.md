# Task Management Backend API Specification

This document describes the REST API endpoints for user authentication and task management. It provides the details for each route, including parameters, request and response schemas, authentication requirements, and expected errors.

**Base URL:**  
`/` (e.g., `https://{your-domain}/`)

---

## Table of Contents

1. [Authentication & User Endpoints](#user-authentication--profile)
    - Register
    - Login
    - Logout
    - Get Profile
2. [Task Management Endpoints](#task-management)
    - Create Task
    - Get Tasks (List, with filtering/sorting)
    - Get Single Task
    - Update Task
    - Delete Task

---

## User Authentication & Profile

All responses use JSON. All routes requiring authentication use a Bearer JWT token in the `Authorization` header.

### 1. Register

`POST /api/auth/register`

Registers a new user.

#### Request Body

```json
{
  "username": "string (required)",
  "email": "string (required, valid email)",
  "password": "string (required, 6+ chars)"
}
```

#### Responses

- `201 Created`
    ```json
    {
      "user": { "id": "string", "username": "string", "email": "string" },
      "token": "jwt-token"
    }
    ```
- `400 Bad Request`
    ```json
    { "error": "Validation error details" }
    ```
- `409 Conflict`
    ```json
    { "error": "Email or username already exists" }
    ```

---

### 2. Login

`POST /api/auth/login`

User login (returns JWT on success).

#### Request Body

```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

#### Responses

- `200 OK`
    ```json
    {
      "user": { "id": "string", "username": "string", "email": "string" },
      "token": "jwt-token"
    }
    ```
- `401 Unauthorized`
    ```json
    { "error": "Invalid credentials" }
    ```

---

### 3. Logout

`POST /api/auth/logout`

(Stateless: no real backend token invalidation for JWT, but implemented for extensibility.)

#### Headers

- `Authorization: Bearer jwt-token`

#### Responses

- `204 No Content` (logout processed, client should discard JWT)
- `401 Unauthorized`
    ```json
    { "error": "Not authenticated" }
    ```

---

### 4. Get Profile

`GET /api/users/profile`

Returns the authenticated user's profile.

#### Headers

- `Authorization: Bearer jwt-token`

#### Responses

- `200 OK`
    ```json
    {
      "id": "string",
      "username": "string",
      "email": "string",
      "created_at": "2024-05-12T10:00:00Z"
    }
    ```
- `401 Unauthorized`
    ```json
    { "error": "Not authenticated" }
    ```

---

## Task Management

All CRUD routes below **require authentication** (`Authorization: Bearer jwt-token`).

### 1. Create Task

`POST /api/tasks`

#### Request Body

```json
{
  "title": "string (required)",
  "description": "string (optional)",
  "due_date": "2024-05-31T23:59:59Z (optional, iso8601)",
  "status": "pending|in_progress|completed (default: pending)",
  "priority": "low|medium|high (optional)"
}
```

#### Responses

- `201 Created`
    ```json
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "created_at": "2024-05-12T10:00:00Z",
      "due_date": "2024-05-31T23:59:59Z",
      "status": "pending",
      "priority": "medium",
      "user_id": "string"
    }
    ```
- `400 Bad Request`
    ```json
    { "error": "Validation error" }
    ```

---

### 2. Get Tasks (List, with Filtering and Sorting)

`GET /api/tasks`

Query parameters allow filtering and sorting.

#### Query Parameters

- `status`: Filter by status (`pending`, `in_progress`, `completed`)
- `priority`: Filter by priority (`low`, `medium`, `high`)
- `search`: Full-text search on title/description
- `sort_by`: Field name to sort by (`created_at`, `due_date`, `priority`, `status`)
- `sort_order`: `asc` (default) or `desc`
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

#### Example

`GET /api/tasks?status=in_progress&priority=high&sort_by=due_date&sort_order=asc&page=2&limit=5`

#### Responses

- `200 OK`
    ```json
    {
      "tasks": [
        {
          "id": "string",
          "title": "string",
          "description": "string",
          "created_at": "2024-05-12T10:00:00Z",
          "due_date": "2024-05-31T23:59:59Z",
          "status": "in_progress",
          "priority": "high",
          "user_id": "string"
        }
      ],
      "page": 2,
      "limit": 5,
      "total": 25
    }
    ```

---

### 3. Get Single Task

`GET /api/tasks/{id}`

#### Path Parameters

- `id` (string): Task ID

#### Responses

- `200 OK`
    ```json
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "created_at": "2024-05-12T10:00:00Z",
      "due_date": "2024-05-31T23:59:59Z",
      "status": "pending",
      "priority": "medium",
      "user_id": "string"
    }
    ```
- `404 Not Found`
    ```json
    { "error": "Task not found" }
    ```

---

### 4. Update Task

`PUT /api/tasks/{id}`

#### Path Parameters

- `id` (string): Task ID

#### Request Body

- Partial or full task object (fields optional except at least one must be present).

```json
{
  "title": "string (optional)",
  "description": "string (optional)",
  "due_date": "2024-05-31T23:59:59Z (optional)",
  "status": "pending|in_progress|completed (optional)",
  "priority": "low|medium|high (optional)"
}
```

#### Responses

- `200 OK`
    ```json
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "created_at": "2024-05-12T10:00:00Z",
      "due_date": "2024-05-31T23:59:59Z",
      "status": "completed",
      "priority": "high",
      "user_id": "string"
    }
    ```
- `400 Bad Request`
    ```json
    { "error": "Validation error" }
    ```
- `404 Not Found`
    ```json
    { "error": "Task not found" }
    ```

---

### 5. Delete Task

`DELETE /api/tasks/{id}`

#### Path Parameters

- `id` (string): Task ID

#### Responses

- `204 No Content` (task deleted)
- `404 Not Found`
    ```json
    { "error": "Task not found" }
    ```

---

## Authentication

All protected endpoints require this HTTP header:

```
Authorization: Bearer <jwt-token>
```

---

## Error Response Format

All errors use a consistent JSON structure:

```json
{
  "error": "Description of the error"
}
```

---

## Summary Table

| Endpoint                | Method | Auth required | Description                |
|-------------------------|--------|---------------|----------------------------|
| /api/auth/register      | POST   | No            | User registration          |
| /api/auth/login         | POST   | No            | Login, returns JWT         |
| /api/auth/logout        | POST   | Yes           | Logout (stateless/JWT)     |
| /api/users/profile      | GET    | Yes           | Current user's profile     |
| /api/tasks              | POST   | Yes           | Create a task              |
| /api/tasks              | GET    | Yes           | List tasks (filter/sort)   |
| /api/tasks/{id}         | GET    | Yes           | Get specific task          |
| /api/tasks/{id}         | PUT    | Yes           | Update specific task       |
| /api/tasks/{id}         | DELETE | Yes           | Delete a task              |

---

## Notes

- All time values use [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) date/time strings.
- All protected endpoints return `401 Unauthorized` if no or invalid JWT.
- Users can only manage their own tasks.
- For more details, see [OpenAPI docs](./docs).

---
