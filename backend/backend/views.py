import json
import socket
import traceback
from django.conf import settings
from django.core.mail import send_mail
from django.db import connection
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


def health_check(request):
    status_data = {
        "status": "healthy",
        "database": "connected",
        "debug": settings.DEBUG,
    }
    try:
        connection.ensure_connection()
    except Exception as e:
        status_data["status"] = "unhealthy"
        status_data["database"] = f"error: {str(e)}"
        return JsonResponse(status_data, status=500)
    return JsonResponse(status_data, status=200)


def socket_diag(request):
    diag_results = {}
    
    # 1. Resolve smtp.gmail.com
    try:
        diag_results["addrinfo_all"] = [
            {"family": str(item[0]), "socktype": str(item[1]), "addr": item[4]}
            for item in socket.getaddrinfo("smtp.gmail.com", 587)
        ]
    except Exception as e:
        diag_results["addrinfo_all_error"] = str(e)

    # 2. Try IPv4 only
    try:
        s4 = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s4.settimeout(10)
        res4 = s4.connect_ex(("smtp.gmail.com", 587))
        s4.close()
        diag_results["ipv4_connect_ex"] = res4
        diag_results["ipv4_success"] = (res4 == 0)
    except Exception as e:
        diag_results["ipv4_error"] = str(e)
        diag_results["ipv4_success"] = False

    # 3. Try IPv6 only
    try:
        v6_addrs = socket.getaddrinfo("smtp.gmail.com", 587, socket.AF_INET6)
        if v6_addrs:
            target_v6 = v6_addrs[0][4]
            diag_results["ipv6_target_addr"] = target_v6
            s6 = socket.socket(socket.AF_INET6, socket.SOCK_STREAM)
            s6.settimeout(10)
            res6 = s6.connect_ex(target_v6)
            s6.close()
            diag_results["ipv6_connect_ex"] = res6
            diag_results["ipv6_success"] = (res6 == 0)
        else:
            diag_results["ipv6_error"] = "No IPv6 address resolved"
            diag_results["ipv6_success"] = False
    except Exception as e:
        diag_results["ipv6_error"] = str(e)
        diag_results["ipv6_success"] = False

    # 5. Try Port 465 SSL IPv4
    try:
        s465 = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s465.settimeout(10)
        res465 = s465.connect_ex(("smtp.gmail.com", 465))
        s465.close()
        diag_results["port465_ipv4_connect_ex"] = res465
        diag_results["port465_ipv4_success"] = (res465 == 0)
    except Exception as e:
        diag_results["port465_ipv4_error"] = str(e)
        diag_results["port465_ipv4_success"] = False

    return JsonResponse(diag_results, status=200)


@csrf_exempt
def send_test_email(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST method required"}, status=405)

    to_email = None
    try:
        if request.body:
            body_data = json.loads(request.body.decode("utf-8"))
            to_email = body_data.get("to_email") or body_data.get("recipient")
    except Exception:
        pass

    if not to_email:
        to_email = request.POST.get("to_email") or request.POST.get("recipient")

    if not to_email:
        return JsonResponse(
            {"success": False, "error": "Recipient email ('to_email') is required in POST body."},
            status=400,
        )

    response_data = {
        "success": False,
        "recipient": to_email,
        "exception_type": None,
        "exception_message": None,
    }

    try:
        from project.services.email_service import EmailService
        EmailService.send_email(
            to_email=to_email,
            subject="FairSplit Diagnostic Email (Brevo HTTPS)",
            text_content="This is a test email sent from the FairSplit Django diagnostic endpoint via Brevo HTTPS API.",
        )
        response_data["success"] = True
        response_data["sent_count"] = 1
        return JsonResponse(response_data, status=200)
    except Exception as e:
        response_data["success"] = False
        response_data["exception_type"] = type(e).__name__
        response_data["exception_message"] = str(e)
        if getattr(settings, "DEBUG", False):
            response_data["traceback"] = traceback.format_exc()
        return JsonResponse(response_data, status=500)
