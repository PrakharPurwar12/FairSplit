import logging

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import exception_handler

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    """
    Custom exception handler that logs detailed context (view, path, method, payload, errors)
    and ensures standard DRF responses are returned so CorsMiddleware can attach CORS headers.
    """
    response = exception_handler(exc, context)
    view = context.get("view", None)
    request = context.get("request", None)

    view_name = view.__class__.__name__ if view else "UnknownView"
    path = request.path if request else "UnknownPath"
    method = request.method if request else "UnknownMethod"
    req_data = getattr(request, "data", None)

    if response is not None:
        logger.error(
            f"[API ERROR] View: {view_name} | Path: {path} | Method: {method} | "
            f"Status Code: {response.status_code} | "
            f"Payload: {req_data} | Error Detail: {response.data}"
        )
    else:
        logger.error(
            f"[UNHANDLED EXCEPTION] View: {view_name} | Path: {path} | Method: {method} | "
            f"Payload: {req_data} | Exception: {exc}",
            exc_info=True,
        )
        response = Response(
            {"error": "An internal server error occurred.", "detail": str(exc)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    return response
