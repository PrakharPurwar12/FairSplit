# Production Gunicorn WSGI Configuration
import os

bind = f"0.0.0.0:{os.environ.get('PORT', '8000')}"
workers = int(os.environ.get("WEB_CONCURRENCY", 3))
threads = int(os.environ.get("PYTHON_GET_THREADS", 2))
timeout = int(os.environ.get("GUNICORN_TIMEOUT", 60))
keepalive = int(os.environ.get("GUNICORN_KEEPALIVE", 5))

accesslog = "-"
errorlog = "-"
loglevel = os.environ.get("LOG_LEVEL", "info").lower()

capture_output = True
enable_stdio_inheritance = True
