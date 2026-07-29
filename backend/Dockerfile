# Production Dockerfile for Django Backend
FROM python:3.12-slim

# Prevent Python from writing .pyc files and enable unbuffered output
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies required for compilation & PostgreSQL
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies with caching
COPY requirements.txt /app/
RUN pip install --no-cache-dir --default-timeout=100 -r requirements.txt

# Copy application source code
COPY . /app/

# Expose Django WSGI port
EXPOSE 8000

# Run Gunicorn WSGI server
CMD ["gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:8000"]
