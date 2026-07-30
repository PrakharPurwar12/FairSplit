from django.db import connection
from django.http import JsonResponse


def health_check(request):
    status_data = {"status": "healthy", "database": "connected"}
    try:
        connection.ensure_connection()
    except Exception as e:
        status_data["status"] = "unhealthy"
        status_data["database"] = f"error: {str(e)}"
        return JsonResponse(status_data, status=500)
    return JsonResponse(status_data, status=200)
