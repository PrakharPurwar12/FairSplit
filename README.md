# ⚖️ FairSplit

> **A modern AI-powered project management platform that intelligently forms balanced teams, predicts project risks, recommends workload redistribution, and provides real-time analytics.**

[![Live Frontend](https://img.shields.io/badge/Production%20App-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://fair-split-5w3v.vercel.app)
[![Live Backend API](https://img.shields.io/badge/Production%20API-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://fairsplit-backend-e67j.onrender.com/api/health/)
[![GitHub Actions CI](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)](https://github.com/PrakharPurwar12/FairSplit/actions)

---

## 🛡️ Badges

![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Django](https://img.shields.io/badge/Django-6.0.7-092E20?style=for-the-badge&logo=django&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon%20DB-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-CI%2FCD-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Frontend-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-Backend-46E3B7?style=for-the-badge&logo=render&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)

---

## 📌 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [Deployment](#-deployment)
- [Environment Variables](#-environment-variables)
- [API Overview](#-api-overview)
- [Screenshots](#-screenshots)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Security Implementation](#-security-implementation)
- [Performance Optimization](#-performance-optimization)
- [Future Improvements](#-future-improvements)
- [Contributors](#-contributors)
- [License](#-license)

---

## ✨ Features

### 🔹 Core Features
- **Kanban Task Board**: Manage tasks across `Todo`, `In Progress`, `In Review`, and `Completed` statuses.
- **Difficulty & Priority Scoring**: Fine-grained task categorization with numeric difficulty scales (1–5) and priority levels (`low`, `medium`, `high`, `critical`).
- **Progress Tracking**: Real-time completion percentage tracking (0–100%) and estimated vs. actual hours auditing.

### 🤖 AI Features
- **Intelligent Task Allocation Engine**: Multi-factor algorithm (`Skill Match × Available Capacity − Fairness Penalty`) automatically assigns unassigned tasks to the best-suited team member.
- **Machine Learning Delivery Risk Prediction**: Trained Random Forest model evaluates project health on every task update, flagging tasks with high delivery risk before deadlines pass.
- **Smart Reassignment Recommendations**: Recommends optimal alternative assignees with human-readable assignment rationale when timeline bottlenecks occur.

### 🔐 Authentication
- **JWT Authentication**: SimpleJWT implementation with 24-hour access tokens and 7-day refresh token rotation.
- **OAuth 2.0 Integration**: One-click social authentication via Google OAuth 2.0 and GitHub OAuth.
- **Protected Routes & Role-Based Access**: Strict frontend and backend permission checks (`manager` vs. `member`).

### 📊 Analytics
- **Project KPIs**: Completion percentages, total task breakdown, and milestone tracking.
- **Member Workload Distribution**: Visual tracking of active tasks, logged hours, and member capacity metrics.
- **AI Risk Analytics**: Real-time risk ratings (`Healthy`, `Moderate Strain`, `High Risk Slippage`) and prediction model confidence metrics.

### 🔔 Notifications
- **In-App Notification Feed**: Automatic alerts for task assignments, project invitations, and risk flags.
- **Notification Management**: Unread counter badges, mark-as-read, mark-all-as-read, and deletion actions.

### 📁 Project Management
- **Multi-Tenant Workspaces**: Create, edit, and delete software projects.
- **Team Invitations**: Email invitation flow backed by Gmail SMTP with rate-limit cooldown timers and secure token previews.
- **Skill Mapping**: Project skill catalogue with weighted proficiency mappings per team member.

### 🛠️ DevOps
- **Dockerized Stack**: Multi-stage Docker builds for production deployment.
- **Automated CI/CD**: GitHub Actions workflows for continuous integration, linting, and vulnerability scanning.
- **Deployment Targets**: Zero-downtime deployment setup on Vercel, Render, and Neon DB.

---

## 🛠️ Tech Stack

| Domain | Technologies Used |
|---|---|
| **Frontend** | React 19, Vite 8, React Router 7, Vanilla CSS / Tailwind CSS, Framer Motion, Lucide Icons |
| **Backend** | Django 6.0, Django REST Framework, Gunicorn WSGI Server |
| **Database** | PostgreSQL 16 (Neon Serverless DB in Production), SQLite3 (Local Dev) |
| **Machine Learning** | scikit-learn (Random Forest Classifier), Joblib, Pandas, NumPy |
| **Authentication** | SimpleJWT (JSON Web Tokens), Google OAuth 2.0, GitHub OAuth, `django-allauth` |
| **Deployment** | Vercel (Frontend SPA), Render (Backend Web Service), Neon (Cloud PostgreSQL) |
| **DevOps & Infrastructure** | Docker, Docker Compose, Nginx Alpine, GitHub Actions CI/CD |

---

## 🏗️ System Architecture

```text
+-----------------------------------------------------------------------------------+
|                                     USER                                          |
|                         (Browser / Client Application)                            |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                                   VERCEL                                          |
|                      (Frontend Static SPA / React 19)                             |
|                    URL: https://fair-split-5w3v.vercel.app                        |
+-----------------------------------------------------------------------------------+
                                         |
                                  HTTPS / REST API
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                                   RENDER                                          |
|                    (Backend Docker Container / Gunicorn)                          |
|             Base API: https://fairsplit-backend-e67j.onrender.com/api             |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                                  DJANGO 6.0                                       |
|                    (Django REST Framework + Auth Interceptors)                    |
+-----------------------------------------------------------------------------------+
                 |                                                 |
                 v                                                 v
+---------------------------------+               +---------------------------------+
|        NEON POSTGRESQL          |               |            ML ENGINE            |
|   (Serverless Postgres Database)|               | (Random Forest Risk Classifier) |
+---------------------------------+               +---------------------------------+
                                         ^
                                         |
+-----------------------------------------------------------------------------------+
|                             GITHUB ACTIONS CI/CD                                  |
|         (Continuous Integration, Code Quality Linting, Security Audits)           |
+-----------------------------------------------------------------------------------+
```

---

## 📁 Project Structure

```text
FairSplit/
├── .github/
│   └── workflows/
│       ├── ci.yml               # Continuous Integration & Build Workflow
│       ├── lint.yml             # Code Linting & Style Workflow
│       └── security.yml         # Vulnerability Audit Workflow
├── backend/
│   ├── account/                 # User Accounts, Auth, & OAuth Handlers
│   ├── allocation/              # AI Task Allocation Engine
│   ├── analytics/               # Project & Workload Analytics Views
│   ├── backend/                 # Django Core Settings & URL Routing
│   ├── ml/                      # Machine Learning Models & Inference Engine
│   ├── notifications/           # Notification Feed Service
│   ├── project/                 # Projects & Member Management
│   ├── skills/                  # Skill Catalogue & User Proficiencies
│   ├── tasks/                   # Task CRUD & Lifecycle Management
│   ├── Dockerfile               # Backend Production Docker Container
│   ├── manage.py                # Django CLI Management Script
│   └── requirements.txt         # Backend Python Dependencies
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI & Dashboard Components
│   │   ├── context/             # React Auth Context Provider
│   │   ├── pages/               # 17 SPA Views (Dashboard, Tasks, Prediction, etc.)
│   │   ├── services/            # Axios API Service Layer
│   │   └── utils/               # Formatting & Greeting Helpers
│   ├── Dockerfile               # Multi-Stage Frontend Container Build
│   ├── nginx.conf               # Nginx SPA Rewrite & Proxy Configuration
│   ├── package.json             # Frontend Dependencies & Scripts
│   ├── vercel.json              # Vercel SPA Rewrite Specification
│   └── vite.config.js           # Vite Build Tool Configuration
├── docker-compose.yml           # Local Multi-Container Orchestration Spec
├── render.yaml                  # Render Infrastructure-as-Code Spec
└── README.md                    # Project Documentation
```

---

## 💻 Installation & Setup

### Prerequisites
- **Node.js**: `v20` or `v22`
- **Python**: `v3.12`
- **Docker & Docker Compose** (Optional, for containerized local development)

### 1. Clone Repository
```bash
git clone https://github.com/PrakharPurwar12/FairSplit.git
cd FairSplit
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start backend server
python manage.py runserver 8000
```

### 3. Frontend Setup
```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

### 4. Docker & Docker Compose
To run the full stack locally inside Docker containers:
```bash
# From repository root
docker compose config
docker compose up --build
```

---

## 🚀 Deployment

### 🔹 Vercel (Frontend SPA)
The frontend application is deployed to **Vercel** with SPA rewrites enabled via `frontend/vercel.json`:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Production URL**: `https://fair-split-5w3v.vercel.app`

### 🔹 Render (Backend Docker Web Service)
The Django REST backend is deployed to **Render** as a Docker Web Service configured via `render.yaml`:
- **Docker Context**: `backend`
- **Health Check Path**: `/api/health/`
- **Pre-Deploy Command**: `python manage.py migrate`
- **Production URL**: `https://fairsplit-backend-e67j.onrender.com`

### 🔹 Neon (PostgreSQL Database)
Database persistence is hosted on **Neon PostgreSQL**, providing a serverless database instance connected securely via `DATABASE_URL` with SSL mode enabled.

---

## 🔑 Environment Variables

> **Note**: Never commit actual secrets to version control. Below are the required environment keys:

### Backend (`backend/.env`)
| Variable | Description |
|---|---|
| `SECRET_KEY` | Django application cryptographic secret key |
| `DEBUG` | Set to `False` in production |
| `ALLOWED_HOSTS` | Comma-separated list of authorized host domains |
| `DB_ENGINE` | `django.db.backends.postgresql` or `django.db.backends.sqlite3` |
| `DATABASE_URL` | PostgreSQL connection string for Neon DB |
| `GOOGLE_CLIENT_ID` | OAuth 2.0 Client ID from Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | OAuth 2.0 Client Secret from Google Cloud Console |
| `GITHUB_CLIENT_ID` | OAuth Client ID from GitHub Developer Settings |
| `GITHUB_CLIENT_SECRET` | OAuth Client Secret from GitHub Developer Settings |
| `EMAIL_HOST_USER` | SMTP email address for sending member invites |
| `EMAIL_HOST_PASSWORD` | SMTP app password for Gmail backend |
| `FRONTEND_URL` | Client URL (`https://fair-split-5w3v.vercel.app`) |

### Frontend (`frontend/.env`)
| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Base API URL (`https://fairsplit-backend-e67j.onrender.com/api`) |

---

## 📖 API Overview

| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `GET` | `/api/health/` | System & Database Health Check | ❌ |
| `POST` | `/api/account/login/` | Obtain JWT Access & Refresh Tokens | ❌ |
| `POST` | `/api/account/register/` | Register a new user account | ❌ |
| `GET` | `/api/account/profile/` | Fetch authenticated user profile | ✅ |
| `GET` | `/api/projects/` | List user projects | ✅ |
| `POST` | `/api/projects/` | Create a new project | ✅ |
| `GET` | `/api/tasks/` | List project tasks | ✅ |
| `POST` | `/api/tasks/` | Create a new task | ✅ |
| `PATCH` | `/api/tasks/{id}/progress/` | Update task completion % & trigger ML risk model | ✅ |
| `POST` | `/api/allocation/generate/{project_id}/` | Trigger AI Task Allocation algorithm | ✅ |
| `POST` | `/api/allocation/recommend/{task_id}/` | Request AI task reassignment recommendation | ✅ |
| `GET` | `/api/analytics/risk/{project_id}/` | Fetch AI risk analytics & confidence scores | ✅ |
| `GET` | `/api/notifications/` | Fetch user notification feed | ✅ |

---

## 🖼️ Screenshots

<details>
<summary><b>View Application Screenshots (Placeholders)</b></summary>

<br/>

### 1. Landing Page
```text
+-----------------------------------------------------------------------------------+
| [ FairSplit ]  Hero Section  |  Features  |  How It Works  | [ Sign In ] [ Start ] |
|                                                                                   |
|                   AI-Powered Project Management & Workload Balancing               |
|            Stop project burnout before it happens with intelligent ML allocation.  |
+-----------------------------------------------------------------------------------+
```

### 2. Dashboard
```text
+-----------------------------------------------------------------------------------+
| Welcome back, User!  | [ + New Project ] [ View Projects ]                        |
| [ Active Projects: 4 ] [ Total Tasks: 28 ] [ Team Members: 12 ] [ High Risk: 2 ]  |
| +------------------------------------+ +----------------------------------------+ |
| | AI Insights: High Risk Alert       | | Project Overview Table                 | |
| +------------------------------------+ +----------------------------------------+ |
+-----------------------------------------------------------------------------------+
```

### 3. Projects
```text
+-----------------------------------------------------------------------------------+
| Projects Workspace                             [ Search Projects... ] [ + Create ]|
| +-------------------------+ +-------------------------+ +-----------------------+ |
| | E-Commerce Replatform   | | Mobile App V2           | | AI Recommendation Engine |
| | Progress: 75% | Active  | | Progress: 30% | Active  | | Progress: 100% | Done |
| +-------------------------+ +-------------------------+ +-----------------------+ |
+-----------------------------------------------------------------------------------+
```

### 4. Analytics
```text
+-----------------------------------------------------------------------------------+
| Analytics Dashboard                            [ Select Project: E-Commerce v ]   |
| [ Completion: 75% ] [ Workload Balance: 92% ] [ Avg Model Confidence: 94.5% ]     |
| ( Bar Chart: Task Status Distribution )   ( Pie Chart: Member Capacity Load )     |
+-----------------------------------------------------------------------------------+
```

### 5. Prediction
```text
+-----------------------------------------------------------------------------------+
| AI Allocation & Prediction Hub                 [ Run AI Allocation ]              |
| Health Rating: High Risk Slippage              Critical Tasks (2 Flagged)          |
| Task: Payment Gateway Integration --------------> [ Reassign Candidate... ]       |
+-----------------------------------------------------------------------------------+
```

### 6. Settings
```text
+-----------------------------------------------------------------------------------+
| Settings                                                                          |
| [ Profile Settings ]  [ Theme & Appearance ]  [ Security & Password ]            |
| First Name: [ Prakhar ]  Last Name: [ Purwar ]  Email: [ user@example.com ]       |
| [ Save Profile Changes ]                                                          |
+-----------------------------------------------------------------------------------+
```

</details>

---

## ⚙️ CI/CD Pipeline

The project includes 3 GitHub Actions workflows residing in `.github/workflows/`:

1. **`ci.yml` (Continuous Integration & Health Verification)**
   - Executes Django system check (`python manage.py check`) and runs the backend unit test suite (`python manage.py test`).
   - Installs Node.js 22 dependencies (`npm ci`), builds production React SPA bundle (`npm run build`), and uploads build artifacts.
   - Validates `docker compose config` and executes non-cached container builds.
   - Runs post-build deployment target health checks against Render and Vercel production endpoints.

2. **`lint.yml` (Code Quality & Style Enforcer)**
   - Enforces Python formatting using **Black** (`black --check backend/`).
   - Verifies Python import ordering using **isort** (`isort --check-only --profile black backend/`).
   - Enforces PEP 8 compliance using **flake8** (`flake8 backend/`).
   - Enforces React JS/JSX quality standards using **ESLint** (`npm run lint`).

3. **`security.yml` (Security & Vulnerability Audit)**
   - Audits Python packages using **pip-audit** (`pip-audit -r backend/requirements.txt`).
   - Audits Node modules using **npm audit** (`npm audit --audit-level=critical`).
   - Performs automated filesystem security scans using **Trivy** and uploads SARIF security reports.

---

## 🔒 Security Implementation

- **JWT Authentication**: Secure token pair rotation via SimpleJWT preventing replay attacks.
- **OAuth Server Handshake**: OAuth authorization codes are exchanged server-side; client secrets are never exposed to client browsers.
- **CORS & CSRF Safeguards**: Whitelisted origin headers restricted strictly to production domains (`https://fair-split-5w3v.vercel.app`).
- **Protected Routing**: `ProtectedRoute` authorization guards protect private dashboard routes from unauthenticated access.
- **SQL Injection Prevention**: Django ORM parameterized database queries prevent SQL injection attacks.

---

## ⚡ Performance Optimization

- **Vite Build Tooling**: Instant HMR dev server and ultra-fast production bundle minification (built in under 500ms).
- **Lazy Component & Route Splitting**: Modular React component structure ensuring fast initial load times.
- **Docker Multi-Stage Build**: Multi-stage Dockerfile compiling frontend static assets into lightweight Nginx Alpine containers.
- **Database Query Indexing**: Optimized Django ORM select related queries for project member list lookups.

---

## 🔮 Future Improvements

- [ ] Real-time WebSocket notifications using Django Channels and Redis.
- [ ] Drag-and-drop Kanban board interface for task status transitions.
- [ ] Exportable CSV/PDF analytics reports for project managers.
- [ ] Mobile app client built with React Native.

---

## 👥 Contributors

- **Prakhar Purwar** - *Lead Engineer & Creator* - [PrakharPurwar12](https://github.com/PrakharPurwar12)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.