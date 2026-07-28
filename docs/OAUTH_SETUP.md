# Production OAuth 2.0 Integration Setup Guide (Google & GitHub)

This guide documents the architecture, configuration steps, and environment requirements for FairSplit's production-grade OAuth 2.0 authentication system with Django DRF, SimpleJWT, and React Vite.

---

## 1. Architecture Overview

- **Providers**: Google & GitHub
- **Backend Stack**: Django REST Framework + `django-allauth` (`allauth.socialaccount`) + `djangorestframework-simplejwt`
- **Frontend Stack**: React (Vite) single-page application (SPA) with AuthContext & Axios interceptors
- **Authentication Protocol**:
  1. Frontend initiates OAuth request via `/api/account/oauth/url/?provider={google|github}`.
  2. User consents on provider screen and is redirected back to frontend `/auth/callback?code=...`.
  3. Frontend sends authorization code to backend `/api/account/oauth/login/`.
  4. Backend exchanges authorization code with provider for OAuth access token & user profile.
  5. If user email exists, OAuth account is linked (`SocialAccount`). If user is new, an account is created.
  6. Backend returns JWT Access Token, JWT Refresh Token, and user profile data.
  7. Frontend stores JWT tokens and redirects user to `/dashboard`.

---

## 2. Google Cloud Console Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing project for **FairSplit**.
3. Navigate to **APIs & Services > OAuth consent screen**:
   - Choose **External** user type.
   - Fill in App Name ("FairSplit"), User Support Email, and Developer Contact Info.
   - Add Scopes: `.../auth/userinfo.email`, `.../auth/userinfo.profile`, `openid`.
4. Navigate to **APIs & Services > Credentials**:
   - Click **Create Credentials > OAuth client ID**.
   - Select **Web Application**.
   - Set Name: `FairSplit Production Web App`.
   - Add **Authorized JavaScript origins**:
     - Local: `http://localhost:5173`, `http://localhost:8000`
     - Production: `https://your-production-domain.com`
   - Add **Authorized redirect URIs**:
     - Local: `http://localhost:5173/auth/callback`
     - Production: `https://your-production-domain.com/auth/callback`
5. Copy the generated **Client ID** and **Client Secret**.

---

## 3. GitHub OAuth App Setup

1. Go to GitHub Settings: [GitHub Developer Settings > OAuth Apps](https://github.com/settings/developers).
2. Click **New OAuth App**.
3. Configure App Settings:
   - **Application Name**: `FairSplit`
   - **Homepage URL**: `http://localhost:5173` (or `https://your-production-domain.com`)
   - **Authorization callback URL**: `http://localhost:5173/auth/callback` (or `https://your-production-domain.com/auth/callback`)
4. Click **Register application**.
5. Copy the **Client ID**.
6. Generate and copy a new **Client Secret**.

---

## 4. Required Environment Variables

Set the following environment variables in your backend environment (or `.env` file):

```env
# Google OAuth Credentials
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# GitHub OAuth Credentials
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

> **Security Note**: Never commit real Client IDs or Client Secrets to Git repositories. Always store secrets in secure key vaults or environment configuration files (`.env`).

---

## 5. Local Development Instructions

1. **Backend Environment Setup**:
   ```bash
   cd backend
   ..\myenv\Scripts\python manage.py migrate
   ..\myenv\Scripts\python manage.py runserver
   ```

2. **Frontend Setup**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Testing OAuth Login**:
   - Navigate to `http://localhost:5173/login` or `http://localhost:5173/register`.
   - Click **Continue with Google** or **Continue with GitHub**.
   - Complete provider consent.
   - Verify redirection back to `/auth/callback`, token exchange, and landing on `/dashboard`.

---

## 6. Production Deployment Instructions

1. Set `DEBUG = False` and update `ALLOWED_HOSTS` & `CORS_ALLOWED_ORIGINS` in `settings.py`.
2. Configure production OAuth Client IDs and Secrets in your production server environment variables.
3. Update Authorized Redirect URIs in Google Cloud Console and GitHub Developer settings to match your HTTPS production domain (`https://your-domain.com/auth/callback`).
4. Ensure SSL/TLS HTTPS certificate is enabled on production servers for secure OAuth token transit.
