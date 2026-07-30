# GitHub Actions Secrets Guide

This document outlines the required repository secrets for FairSplit GitHub Actions CI/CD workflows and how to configure them securely in GitHub.

---

## Required GitHub Secrets

The following environment secrets must be configured in your GitHub repository to enable CI testing, automated checks, and deployment pipelines without hardcoding sensitive credentials:

| Secret Name | Description | Example / Note |
| :--- | :--- | :--- |
| `SECRET_KEY` | Cryptographically secure Django Secret Key | Generated string used for cryptographic signing |
| `GOOGLE_CLIENT_ID` | OAuth Client ID for Google Authentication | Created in Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | OAuth Client Secret for Google Authentication | Generated in Google Cloud Console |
| `GITHUB_CLIENT_ID` | OAuth Client ID for GitHub Authentication | Created in GitHub Developer Settings |
| `GITHUB_CLIENT_SECRET` | OAuth Client Secret for GitHub Authentication | Generated in GitHub Developer Settings |

---

## How to Configure Secrets in GitHub

To add these secrets to your repository, follow these steps:

1. **Navigate to Repository Settings**:
   Open your repository on GitHub (`https://github.com/<owner>/<repository>`) and click on the **Settings** tab at the top.

2. **Access Actions Secrets**:
   In the left sidebar menu, scroll down to **Security** → **Secrets and variables** → click on **Actions**.

3. **Create New Repository Secret**:
   Click the green **New repository secret** button in the top right.

4. **Add Secret Name and Value**:
   - Enter the **Name** (e.g., `SECRET_KEY`).
   - Enter the corresponding **Secret** value.
   - Click **Add secret**.

5. **Repeat for All Required Secrets**:
   Repeat the process for `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GITHUB_CLIENT_ID`, and `GITHUB_CLIENT_SECRET`.

---

> [!IMPORTANT]
> - **Never expose actual secret values** in repository files, commits, issues, or pull requests.
> - Secrets are automatically masked in GitHub Actions execution logs.
