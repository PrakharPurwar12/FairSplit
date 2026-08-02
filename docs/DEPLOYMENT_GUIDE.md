# FairSplit Backend Production Deployment Guide

This guide provides step-by-step instructions for deploying the FairSplit Django backend to major production platforms: **Railway**, **Render**, **DigitalOcean**, and **AWS EC2**.

---

## 1. Prerequisites

Before deploying, ensure you have:
1. Production PostgreSQL Database URL (e.g., Neon PostgreSQL, AWS RDS, DigitalOcean Managed Database).
2. Django `SECRET_KEY` generated for production (`python -c "import secrets; print(secrets.token_urlsafe(50))"`).
3. Frontend URL (e.g., `https://fairsplit.vercel.app`).
4. OAuth credentials configured in Google Cloud Console & GitHub Developer Settings for your production domain.

---

## 2. Platform 1: Railway Deployment

Railway supports zero-config deployment using the repository's `backend/Dockerfile`.

### Steps:
1. Log into [Railway.app](https://railway.app) and click **New Project**.
2. Select **Deploy from GitHub repo** and choose `FairSplit`.
3. Set the **Root Directory** to `backend`.
4. Add a **PostgreSQL Database** plugin in Railway or attach your `DATABASE_URL`.
5. Add the following Environment Variables in Railway Dashboard:
   ```env
   SECRET_KEY=<your-production-secret-key>
   DEBUG=False
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   FRONTEND_URL=https://fairsplit.vercel.app
   ALLOWED_HOSTS=.railway.app
   CORS_ALLOWED_ORIGINS=https://fairsplit.vercel.app
   CSRF_TRUSTED_ORIGINS=https://fairsplit.vercel.app,https://*.railway.app
   ```
6. Railway automatically provisions a domain (`https://<app-name>.up.railway.app`).
7. Verify deployment health at: `https://<app-name>.up.railway.app/api/health/`.

---

## 3. Platform 2: Render Deployment

Render uses the included `render.yaml` or manual Web Service creation.

### Manual Setup via Render Dashboard:
1. Log into [Render Dashboard](https://dashboard.render.com).
2. Click **New +** ➔ **Web Service**.
3. Connect your GitHub repository `FairSplit`.
4. Choose **Docker** as the Runtime and set **Root Directory** to `backend`.
5. Select instance type (Free / Starter).
6. In **Environment Variables**, add:
   ```env
   SECRET_KEY=<your-production-secret-key>
   DEBUG=False
   DATABASE_URL=<your-postgres-connection-string>
   FRONTEND_URL=https://fairsplit.vercel.app
   CORS_ALLOWED_ORIGINS=https://fairsplit.vercel.app
   CSRF_TRUSTED_ORIGINS=https://fairsplit.vercel.app,https://*.onrender.com
   ```
7. Set the **Health Check Path** to `/api/health/`.
8. Click **Create Web Service**.

---

## 4. Platform 3: DigitalOcean Deployment

### Option A: App Platform (Serverless Containers)
1. Log into DigitalOcean and navigate to **Apps** ➔ **Create App**.
2. Source: Select GitHub ➔ `FairSplit`.
3. Component: Set resource path to `backend` and use `Dockerfile`.
4. Add Database: Attach a DigitalOcean Managed PostgreSQL database.
5. Environment Variables: Configure `SECRET_KEY`, `DATABASE_URL`, `FRONTEND_URL`, `CSRF_TRUSTED_ORIGINS`.
6. Deploy App.

### Option B: Droplet (Docker Compose Deployment)
1. Create a Ubuntu 24.04 LTS Droplet.
2. Install Docker & Docker Compose:
   ```bash
   sudo apt update && sudo apt install -y docker.io docker-compose-v2
   ```
3. Clone repository and create `.env`:
   ```bash
   git clone https://github.com/PrakharPurwar12/FairSplit.git
   cd FairSplit
   cp backend/.env.example .env
   nano .env
   ```
4. Build and start services:
   ```bash
   docker compose up -d --build
   ```
5. Verify health: `curl http://localhost:8000/api/health/`.

---

## 5. Platform 4: AWS EC2 Deployment

### Steps:
1. Launch an Amazon EC2 Instance (Ubuntu 24.04 LTS, t3.small or larger).
2. Configure Security Group:
   - Allow Port `22` (SSH)
   - Allow Port `80` (HTTP)
   - Allow Port `443` (HTTPS)
   - Allow Port `8000` (Optional / Proxy)
3. SSH into instance and install Docker:
   ```bash
   sudo apt update
   sudo apt install -y docker.io docker-compose-v2 nginx certbot python3-certbot-nginx
   sudo usermod -aG docker ubuntu
   ```
4. Clone code & launch Docker Compose:
   ```bash
   git clone https://github.com/PrakharPurwar12/FairSplit.git
   cd FairSplit
   docker compose up -d --build
   ```
5. Nginx Reverse Proxy Setup (`/etc/nginx/sites-available/fairsplit`):
   ```nginx
   server {
       server_name api.yourdomain.com;

       location / {
           proxy_pass http://127.0.0.1:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```
6. Enable Nginx site and SSL Certbot:
   ```bash
   sudo ln -s /etc/nginx/sites-available/fairsplit /etc/nginx/sites-enabled/
   sudo nginx -t && sudo systemctl reload nginx
   sudo certbot --nginx -d api.yourdomain.com
   ```

---

## 6. Production Health Check Verification

Ensure the health check endpoint returns `HTTP 200` JSON:
```bash
curl -i https://<your-backend-domain>/api/health/
```
Expected Output:
```json
{
  "status": "healthy",
  "database": "connected",
  "debug": false
}
```
