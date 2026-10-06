# Docker Task Manager

A full-stack task manager application built with React, Node.js, Express, and PostgreSQL, containerized and orchestrated using Docker Compose.

## Architecture

```text
                        Docker Compose
                             │
            ┌────────────────┼────────────────┐
            │                │                │
            ▼                ▼                ▼
      Frontend/Nginx      Backend          PostgreSQL
          :80              :3000             :5432
            │                │                 │
            │ /api           │                 │
            └───────────────►│                 │
                             │                 │
                             └────────────────►│
                                               │
                                         postgres_data
```

### Request Flow

```text
Browser
   │
   │ http://localhost:5173
   ▼
Nginx
   │
   │ /api/*
   ▼
Express Backend
   │
   │ PostgreSQL connection
   ▼
PostgreSQL
```

## Tech Stack

### Frontend

- React
- Vite
- Axios
- Nginx

### Backend

- Node.js
- Express
- PostgreSQL
- `pg`

### Infrastructure

- Docker
- Docker Compose
- Docker Hub

## Features

- Create tasks
- View tasks
- Mark tasks as completed
- Delete tasks
- PostgreSQL data persistence
- Dockerized frontend and backend
- Nginx reverse proxy
- Multi-container orchestration with Docker Compose
- Persistent Docker volume for PostgreSQL
- Docker Hub images

## Project Structure

```text
docker-task-manager/
│
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   └── database.js
│   │   └── server.js
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── package.json
│   └── pnpm-lock.yaml
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── ...
│   ├── nginx/
│   │   └── default.conf
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── package.json
│   └── pnpm-lock.yaml
│
├── .env.example
├── .gitignore
├── compose.yaml
└── README.md
```

## Prerequisites

Make sure you have:

- Docker
- Docker Compose

Docker Compose is included with modern Docker installations as `docker compose`.

## Environment Variables

Create a `.env` file in the project root:

```env
POSTGRES_DB=taskmanager
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
```

Do not commit the `.env` file to Git.

An example configuration is provided in `.env.example`.

## Running the Application

Clone the repository:

```bash
git clone <your-github-repository-url>
cd docker-task-manager
```

Create your environment file:

```bash
cp .env.example .env
```

Start the application:

```bash
docker compose up -d
```

Docker Compose will:

1. Pull the frontend image from Docker Hub.
2. Pull the backend image from Docker Hub.
3. Pull the PostgreSQL image.
4. Create the required Docker network.
5. Create the PostgreSQL persistent volume.
6. Start PostgreSQL.
7. Wait for PostgreSQL to become healthy.
8. Start the backend.
9. Start the Nginx frontend.

Open the application:

```text
http://localhost:5173
```

## Services

| Service    | Host Port | Container Port | Purpose       |
| ---------- | --------: | -------------: | ------------- |
| Frontend   |    `5173` |           `80` | React + Nginx |
| Backend    |    `3000` |         `3000` | Express API   |
| PostgreSQL |    `8080` |         `5432` | Database      |

### Important

The PostgreSQL container uses port `5432` internally.

The host uses port `8080` because port `5432` is already occupied by a local PostgreSQL installation.

The backend connects to PostgreSQL using:

```text
postgres:5432
```

not:

```text
localhost:8080
```

`postgres` is the Docker Compose service name and is resolved through Docker's internal DNS.

## API Endpoints

### Health Check

```http
GET /api/health
```

### Get Tasks

```http
GET /api/tasks
```

### Create Task

```http
POST /api/tasks
```

Example request body:

```json
{
  "title": "Learn Docker"
}
```

### Toggle Task

```http
PATCH /api/tasks/:id
```

### Delete Task

```http
DELETE /api/tasks/:id
```

## Docker Architecture

The frontend uses a multi-stage Docker build.

### Build Stage

```text
Node.js
   │
   ├── Install dependencies
   ├── Copy source code
   └── pnpm build
           │
           ▼
        /dist
```

### Production Stage

```text
Nginx
   │
   └── Serves the generated /dist files
```

This keeps Node.js, pnpm, source files, and development dependencies out of the final frontend image.

## Nginx Reverse Proxy

The frontend uses Nginx to serve the React application and forward API requests to the backend.

```text
Browser
   │
   │ /api/tasks
   ▼
Nginx :80
   │
   │ proxy_pass
   ▼
backend:3000
```

The frontend therefore uses:

```text
/api
```

instead of hardcoding:

```text
http://localhost:3000/api
```

## Docker Hub Images

The application uses the following Docker Hub images:

```text
meetdubeyaditya/task-manager-frontend:1.0
meetdubeyaditya/task-manager-backend:1.0
```

Replace `meetdubeyaditya` with the Docker Hub account that owns the repositories.

## Useful Docker Commands

### Start

```bash
docker compose up -d
```

### Start and rebuild

```bash
docker compose up -d --build
```

### View running containers

```bash
docker compose ps
```

### View logs

```bash
docker compose logs
```

### Follow logs

```bash
docker compose logs -f
```

### View logs for a specific service

```bash
docker compose logs -f backend
```

```bash
docker compose logs -f frontend
```

```bash
docker compose logs -f postgres
```

### Stop containers

```bash
docker compose down
```

### Stop containers and remove the database volume

```bash
docker compose down -v
```

> **Warning:** `docker compose down -v` deletes the PostgreSQL Docker volume and therefore removes the stored database data.

## Persistent Storage

PostgreSQL uses a named Docker volume:

```yaml
volumes:
  - postgres_data:/var/lib/postgresql/data
```

The volume allows database data to survive container removal.

Therefore:

```bash
docker compose down
```

does not delete the database data.

Whereas:

```bash
docker compose down -v
```

removes the volume and deletes the stored database data.

## Development vs Production

During frontend development, Vite runs the development server:

```text
localhost:5173
```

Inside the production Docker image, the React application is built using:

```bash
pnpm build
```

and served by Nginx:

```text
Nginx :80
```

Docker maps the host port `5173` to Nginx's container port `80`:

```text
localhost:5173 → Nginx:80
```

## GitHub

Source code and Docker configuration are available in this repository.

```text
https://github.com/dubeyaditya543/Docker-Tutorial-Project
```

## Docker Hub

Docker images:

```text
meetdubeyaditya/task-manager-frontend
meetdubeyaditya/task-manager-backend
```

## License

This project is intended for learning and portfolio purposes.
