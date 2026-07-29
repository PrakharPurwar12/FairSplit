# FairSplit — Production Docker Deployment & AI Engine

FairSplit is an enterprise-grade, AI-powered project management platform that automates fair task allocation, predicts task delivery risks using Machine Learning, and provides real-time team workload analytics.

---

## Production Docker Architecture

```text
                               Client Browser
                                     │
                                     ▼ (Port 80)
                       Frontend Container (Nginx Alpine)
                        [Serves Vite Build + SPA Routing]
                                     │
                                     ▼ (Port 8000 via Docker Bridge Network)
                       Backend Container (Django + Gunicorn)
                        [Python 3.12-slim + WSGI Server]
                                     │
                                     ▼ (Port 5432)
                       PostgreSQL Container (Postgres 16)
                        [Persistent Volume: postgres_data]
```

---

## Quick Start (Docker Deployment)

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (v20.10+)
- Docker Compose (v2.0+)

---

### Step 1: Environment Setup

Copy `.env.example` to `.env` at the project root:

```bash
cp .env.example .env
```

*(Optionally configure SMTP credentials and OAuth Client IDs in `.env`)*

---

### Step 2: Build & Start All Services

```bash
docker compose up -d --build
```

This single command will:
1. Initialize the PostgreSQL 16 database container with healthchecks.
2. Build the Django backend container on `python:3.12-slim`.
3. Auto-apply all database migrations on PostgreSQL.
4. Execute `collectstatic` for admin & static assets.
5. Initialize Gunicorn WSGI workers on port 8000.
6. Build the multi-stage React Vite production bundle on Nginx Alpine.
7. Expose Nginx reverse proxy on port 80.

---

### Step 3: Access Services

- **Frontend Application**: `http://localhost`
- **Django Admin Console**: `http://localhost:8000/admin/`
- **API Endpoint Health**: `http://localhost:8000/api/account/profile/`

---

## Docker Operations & Commands

### View Container Status & Health

```bash
docker compose ps
```

### View Live Logs

```bash
# All services
docker compose logs -f

# Specific service logs
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres
```

### Create Django Superuser in Container

```bash
docker compose exec backend python manage.py createsuperuser
```

### Run Django Migrations Manually

```bash
docker compose exec backend python manage.py migrate
```

### Database Shell Access (PostgreSQL)

```bash
docker compose exec postgres psql -U fairsplit -d fairsplit
```

### Stop Services

```bash
# Stop containers while preserving data
docker compose down

# Stop containers and purge volumes (Reset Database)
docker compose down -v
```

---

## Environment Variables Configuration

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `DB_ENGINE` | `django.db.backends.postgresql` | Database engine (`sqlite3` or `postgresql`) |
| `POSTGRES_DB` | `fairsplit` | PostgreSQL database name |
| `POSTGRES_USER` | `fairsplit` | PostgreSQL database user |
| `POSTGRES_PASSWORD` | `fairsplit_password` | PostgreSQL database password |
| `POSTGRES_HOST` | `postgres` | PostgreSQL hostname inside Docker network |
| `POSTGRES_PORT` | `5432` | PostgreSQL port |
| `SECRET_KEY` | *(Configurable)* | Django Secret Key |
| `DEBUG` | `False` | Toggle Django Debug mode |
| `FRONTEND_URL` | `http://localhost` | Client URL for CORS & email links |

---

## Project Structure

```text
FairSplit/
├── backend/
│   ├── account/                 # Authentication & User Profiles
│   ├── allocation/              # Fair Task Allocation Optimization Engine
│   ├── analytics/               # Real-time Team & Risk Analytics
│   ├── ml/                      # Machine Learning Predictor & RF Models
│   ├── notifications/          # Real-time User Notifications
│   ├── project/                 # Projects & Member Management
│   ├── skills/                  # User Skills & Proficiency Tracking
│   ├── tasks/                   # Task Management & Assignments
│   ├── Dockerfile               # Backend Gunicorn Dockerfile (Python 3.12)
│   ├── .dockerignore            # Context Exclusions for Backend
│   └── requirements.txt         # Production Dependencies
├── frontend/
│   ├── src/                     # React Application Source (Vite)
│   ├── Dockerfile               # Multi-Stage Nginx Build Dockerfile
│   ├── nginx.conf               # SPA Routing & API Reverse Proxy Config
│   └── .dockerignore            # Context Exclusions for Frontend
├── docker-compose.yml           # Master Multi-Container Orchestration
├── .dockerignore                # Root Context Exclusions
├── .env.example                 # Environment Template File
└── README.md                    # Project Documentation
```

---

## License

Developed as an academic M.Tech AI Project and open-source project management platform.