from django.conf import settings
from django.db import connection
from django.http import JsonResponse


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
