# FairSplit-Ops: Nagios Core Monitoring & Ansible Self-Healing Architecture

## 1. Executive Summary

This document specifies the operational architecture, configuration standards, security boundaries, and validation procedures for the **Nagios Core 4** monitoring system and **Ansible-based self-healing** automation across the FairSplit infrastructure.

---

## 2. Infrastructure & Monitoring Topology

The deployment operates across two dedicated AWS EC2 instances within the Mumbai (`ap-south-1`) region:

| Component | Node Name | Private IP | Public IP | Roles & Managed Services |
| :--- | :--- | :--- | :--- | :--- |
| **Ops Node** | `fairsplit-ops` | `172.31.11.8` | — | Nagios Core 4, Apache2 (Web UI), Ansible Control Node, Puppet 8 Server |
| **App Node** | `fairsplit-app` | `172.31.14.13` | `3.110.114.164` | FairSplit Docker Compose Stack (`frontend`, `backend`, `postgres`), NRPE Server |

### Topology Diagram

```mermaid
flowchart LR
    subgraph OpsNode ["Ops Node (172.31.11.8)"]
        NagiosDaemon["Nagios Core 4\n(Active Systemd Service)"]
        Apache["Apache2\n(Basic Auth Web UI :80)"]
        EventHandler["Event Handler\n(nagios_event_handler.sh)"]
        Ansible["Ansible Engine\n(remediate.yml)"]
    end

    subgraph AppNode ["App Node (172.31.14.13)"]
        NRPE["Nagios NRPE Daemon\n(Port :5666)"]
        Nginx["fairsplit_frontend\n(Port :80)"]
        Backend["fairsplit_backend\n(Port :8000 internal)"]
        Postgres[("fairsplit_postgres\n(Port :5432 internal)")]
    end

    NagiosDaemon -->|Direct HTTP Check :80| Nginx
    NagiosDaemon -->|Direct API Health Check :80/api/health/| Backend
    NagiosDaemon -->|NRPE Query :5666| NRPE
    NRPE -->|Inspect Containers| Nginx
    NRPE -->|Inspect Containers| Backend
    NRPE -->|Inspect Containers| Postgres

    NagiosDaemon -->|Trigger on HARD CRITICAL| EventHandler
    EventHandler -->|Invoke Sudoers Privilege Boundary| Ansible
    Ansible -->|SSH :22 (Pinned Host Key)| AppNode
```

---

## 3. Monitored Services & Check Specifications

Nagios monitors 10 distinct operational checks across the infrastructure:

| Host | Service Description | Check Mechanism | Interval / Retry | Event Handler |
| :--- | :--- | :--- | :--- | :--- |
| `fairsplit-ops` | SSH Connectivity | `check_ssh!22` | 5m / 1m | None |
| `fairsplit-ops` | Disk Usage `/` | `check_disk!20%!10%!/` | 10m / 2m | None |
| `fairsplit-ops` | System Load | `check_load!5,4,3!10,8,6` | 5m / 1m | None |
| `fairsplit-ops` | Memory Usage | `check_mem!80!90` | 5m / 1m | None |
| `fairsplit-ops` | Puppet Server | `check_tcp!8140` | 5m / 1m | None |
| `fairsplit-app` | Host Reachability | `check_tcp!80` | 5m / 1m | None |
| `fairsplit-app` | SSH Connectivity | `check_ssh!22` | 5m / 1m | None |
| `fairsplit-app` | FairSplit Frontend | `check_http!-p 80 -u /` | 2m / 1m | `check_service_remediate` |
| `fairsplit-app` | FairSplit API Health | `check_fairsplit_api` | 2m / 1m | `check_service_remediate` |
| `fairsplit-app` | PostgreSQL Database | `check_fairsplit_db` | 2m / 1m | Disabled (Data Safety) |
| `fairsplit-app` | Container `fairsplit_frontend` | `check_nrpe!check_docker_frontend` | 2m / 1m | `check_service_remediate` |
| `fairsplit-app` | Container `fairsplit_backend` | `check_nrpe!check_docker_backend` | 2m / 1m | `check_service_remediate` |
| `fairsplit-app` | Container `fairsplit_postgres` | `check_nrpe!check_docker_postgres` | 2m / 1m | Disabled (Data Safety) |
| `fairsplit-app` | Disk Usage `/` | `check_nrpe!check_disk` | 10m / 2m | None |
| `fairsplit-app` | System Load | `check_nrpe!check_load` | 5m / 1m | None |
| `fairsplit-app` | Memory Usage | `check_nrpe!check_mem` | 5m / 1m | None |

> **Host Reachability Note:** The AWS Security Group (`fairsplit-dev-app-sg`) enforces least privilege and drops ICMP echo requests. Using the standard Nagios `check-host-alive` (ICMP ping) results in false DOWN alerts. Host reachability for `fairsplit-app` is therefore explicitly pinned to `check_tcp!80`, matching the verified active listener.

---

## 4. NRPE Configuration & Security Confinement

The Nagios Remote Plugin Executor (NRPE) daemon on `fairsplit-app` is hardened against remote code execution:

1. **Strict Client Allowlist:**
   ```properties
   allowed_hosts=127.0.0.1,::1,172.31.11.8
   ```
   Only the Ops Node private IP and local loopback may connect.

2. **Command Argument Disallowance (`dont_blame_nrpe=0`):**
   Arbitrary command-line arguments from remote callers are strictly rejected.

3. **Explicit Command Map (`/etc/nagios/nrpe_local.cfg`):**
   ```properties
   command[check_disk]=/usr/lib/nagios/plugins/check_disk -w 20% -c 10% -p /
   command[check_load]=/usr/lib/nagios/plugins/check_load -r -w 5.0,4.0,3.0 -c 10.0,8.0,6.0
   command[check_mem]=/usr/lib/nagios/plugins/check_mem.sh 80 90
   command[check_docker_frontend]=/usr/lib/nagios/plugins/check_docker_container.sh fairsplit_frontend
   command[check_docker_backend]=/usr/lib/nagios/plugins/check_docker_container.sh fairsplit_backend
   command[check_docker_postgres]=/usr/lib/nagios/plugins/check_docker_container.sh fairsplit_postgres
   command[check_fairsplit]=/usr/lib/nagios/plugins/check_fairsplit.sh 127.0.0.1 80 /api/health/ 10
   ```

4. **Docker Socket Access:**
   The `nagios` system user is enrolled in the `docker` group (`usermod -aG docker nagios`), allowing `check_docker_container.sh` to query container state via `docker inspect` without requiring root `sudo`.

---

## 5. Self-Healing & Remediation Architecture

### Flow Lifecycle

```
Nagios detects HARD CRITICAL
       │
       ▼
Executes /usr/bin/sudo -u ubuntu /opt/fairsplit/remediation/event_handlers/nagios_event_handler.sh
       │
       ├─► 1. Verifies STATE_TYPE == "HARD" and STATE == "CRITICAL"
       ├─► 2. Validates service name against strict allowlist (frontend, backend)
       ├─► 3. Safety Gate: If PostgreSQL, aborts automatic restart to protect database
       ├─► 4. Checks concurrency lock (/tmp/fairsplit-remediation/<service>.lock)
       ├─► 5. Pre-validates failure via NRPE (skips restart if transiently recovered)
       ├─► 6. Executes Ansible remediation playbook:
       │        ansible-playbook -i /opt/fairsplit/ansible/inventory/hosts.ini
       │          /opt/fairsplit/ansible/playbooks/remediate.yml -e "service_name=<service>"
       ├─► 7. Ansible inspects container in /opt/fairsplit/repo
       ├─► 8. Executes: docker compose -f docker-compose.yml restart <service>
       ├─► 9. Post-restart stabilization pause (15 seconds)
       ├─► 10. Post-remediation health check:
       │         Backend:  GET http://127.0.0.1/api/health/ (HTTP 200)
       │         Frontend: GET http://127.0.0.1/ (HTTP 200)
       └─► 11. Records structured outcome in /opt/fairsplit/remediation.log
```

### Safety Rules Enforced

- **Database Protection:** Automated remediation of PostgreSQL is blocked. If `fairsplit_postgres` enters a critical state, an alert is logged to `/opt/fairsplit/escalation.log` requiring manual DBA intervention.
- **Path Accuracy:** All Docker Compose operations strictly target `/opt/fairsplit/repo` (the actual live repository), never the deprecated `/opt/fairsplit/app`.
- **Credential & Environment Preservation:** The live `.env` file on App is never overwritten or regenerated.
- **Race Condition Prevention:** File locks under `/tmp/fairsplit-remediation/` expire after 300 seconds and prevent overlapping concurrent playbooks.
- **Sudoers Confinement:**
  ```sudoers
  # /etc/sudoers.d/99-nagios-remediation (mode 0440, root:root)
  nagios ALL=(ubuntu) NOPASSWD: /opt/fairsplit/remediation/event_handlers/nagios_event_handler.sh
  ```

---

## 6. Log Locations & Operational Diagnostics

| Log / State File | Location | Content |
| :--- | :--- | :--- |
| **Remediation Log** | `/opt/fairsplit/remediation.log` | Event handler triggers, pre-checks, Ansible execution output, and recovery outcomes |
| **Escalation Log** | `/opt/fairsplit/escalation.log` | Events requiring manual SRE intervention (e.g. PostgreSQL incidents) |
| **Nagios Core Log** | `/var/log/nagios4/nagios.log` | Monitoring scheduler, check results, and alert notifications |
| **Nagios Live State** | `/var/lib/nagios4/status.dat` | Real-time status cache for all monitored hosts and services |
| **Apache Access Log** | `/var/log/apache2/access.log` | Nagios web UI access records |
| **Apache Error Log** | `/var/log/apache2/error.log` | CGI and authentication errors |

---

## 7. Operational Runbook & Validation Commands

### Validate Nagios Daemon & Syntax
```bash
# Validate Nagios configuration syntax (must report 0 errors, 0 warnings)
sudo /usr/sbin/nagios4 -v /etc/nagios4/nagios.cfg

# Check service status (both aliases active)
sudo systemctl status nagios
sudo systemctl status nagios4

# Check Web UI response
curl -s -I -u nagiosadmin:$(sudo cat /etc/nagios4/.nagiosadmin_credential) http://127.0.0.1/nagios4/
```

### Validate Ansible Orchestration
```bash
# Test connectivity from Ops to all nodes
ansible -i /opt/fairsplit/ansible/inventory/hosts.ini all -m ping

# Syntax check remediation playbook
ansible-playbook --syntax-check -i /opt/fairsplit/ansible/inventory/hosts.ini \
  /opt/fairsplit/ansible/playbooks/remediate.yml

# Execute non-disruptive health check via Ansible
ansible -i /opt/fairsplit/ansible/inventory/hosts.ini fairsplit-app -m uri \
  -a "url=http://127.0.0.1/api/health/ return_content=yes"
```

### Execute Automated Test Suites
```bash
# Live Nagios test suite
bash /opt/fairsplit/repo/scripts/validation/validate_nagios.sh --live --app-ip 172.31.14.13

# Live Ansible test suite
bash /opt/fairsplit/repo/scripts/validation/validate_ansible.sh --live
```

---

## 8. Web Interface Access

- **Internal URL:** `http://172.31.11.8/nagios4/`
- **Username:** `nagiosadmin`
- **Password:** Stored securely on the Ops Node at `/etc/nagios4/.nagiosadmin_credential` (mode `0600 root:root`).
- **Firewall Restriction:** Ops Security Group restricts port 80 to the authorized administrator CIDR block.
