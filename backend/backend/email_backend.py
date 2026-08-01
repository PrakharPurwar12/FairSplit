import logging
import socket
import smtplib
from django.core.mail.backends.smtp import EmailBackend as DjangoEmailBackend

logger = logging.getLogger(__name__)


class IPv4SMTP(smtplib.SMTP):
    """
    Production-safe SMTP client subclass that forces socket connection over IPv4 (AF_INET),
    bypassing IPv6 network unreachable errors on cloud container platforms like Render.
    """

    def _get_socket(self, host, port, timeout):
        if self.debuglevel > 0:
            self._print_debug("connect (IPv4 forced): to", (host, port))

        # Explicitly query IPv4 (AF_INET) address info
        addr_info = socket.getaddrinfo(host, port, socket.AF_INET, socket.SOCK_STREAM)
        if not addr_info:
            raise socket.error(f"IPv4 DNS resolution failed for {host}:{port}")

        last_err = None
        for af, socktype, proto, _canonname, sa in addr_info:
            sock = None
            try:
                sock = socket.socket(af, socktype, proto)
                if timeout is not None:
                    sock.settimeout(timeout)
                if self.source_address:
                    sock.bind(self.source_address)
                sock.connect(sa)
                logger.info(f"[IPv4 SMTP CONNECT SUCCESS] Connected to {host}:{port} via IPv4 address {sa[0]}")
                return sock
            except socket.error as e:
                last_err = e
                if sock is not None:
                    sock.close()

        if last_err is not None:
            raise last_err
        raise socket.error(f"Could not connect to {host}:{port} using IPv4")


class IPv4EmailBackend(DjangoEmailBackend):
    """
    Custom Django EmailBackend that uses IPv4SMTP to force IPv4 socket connections.
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.connection_class = IPv4SMTP
