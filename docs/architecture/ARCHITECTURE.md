# FairSplit-Ops: System Architecture Specification

## 1. Overview & Core Philosophy

**FairSplit-Ops** is an enterprise-grade DevOps implementation for the FairSplit expense-sharing application. The infrastructure and automation are structured around strict separation of concerns across five discrete operational layers:

```
┌─────────────────────────────────────────────────────────────┐
│                 FairSplit-Ops Architecture                  │
├───────────────┬─────────────────────────────────────────────┤
│ Tool          │ Primary Responsibility                      │
├───────────────┼─────────────────────────────────────────────┤
│ Terraform     │ Infrastructure as Code (AWS VPC, EC2, SG)   │
│ Puppet        │ Configuration Management & Baseline State   │
│ Ansible       │ Application Deployment & Remediation Engine │
│ Nagios Core   │ Health Monitoring & Failure Detection       │
│ Docker / Cmp  │ Containerized Application Runtime           │
└───────────────┴─────────────────────────────────────────────┘
```

---

## 2. Infrastructure Topology

The system is deployed in AWS region **Mumbai (`ap-south-1`)** across a two-node topology inside the default VPC.

```mermaid
flowchart TB
    subgraph Internet ["Public Internet / Administrator"]
        Admin["Administrator Workstation"]
        EndUser["End Users (Web Browsers)"]
    end

    subgraph AWS ["AWS ap-south-1 (Mumbai) - Default VPC"]
        subgraph OpsNode ["Ops Node (t3.small, 15GB gp3)"]
            PuppetServer["Puppet 8 Server\n(Port 8140)"]
            NagiosCore["Nagios Core 4\n(Web UI Port 80)"]
            AnsibleCN["Ansible Control Node\n(Playbooks & Inventory)"]
            EventHandler["Nagios Event Handler\n(Self-Healing Dispatcher)"]
        end

        subgraph AppNode ["App Node (t3.small, 15GB gp3)"]
            PuppetAgent["Puppet 8 Agent\n(Cert: fairsplit-app)"]
            NRPEServer["NRPE Daemon\n(Port 5666)"]
            subgraph DockerCompose ["Docker Compose Stack"]
                Frontend["fairsplit_frontend\n(Nginx :80)"]
                Backend["fairsplit_backend\n(Django/Gunicorn :8000)"]
                Postgres[("fairsplit_postgres\n(PostgreSQL 16 :5432)")]
            end
        end
    end

    Admin -->|SSH :22 & Nagios :80| OpsNode
    Admin -->|SSH :22| AppNode
    EndUser -->|HTTP :80| Frontend

    PuppetAgent -->|Catalog Pull :8140| PuppetServer
    NagiosCore -->|NRPE Health Checks :5666| NRPEServer
    NagiosCore -->|Trigger on HARD Failure| EventHandler
    EventHandler -->|Dispatch Remediation| AnsibleCN
    AnsibleCN -->|SSH Automation| AppNode

    Frontend --> Backend
    Backend --> Postgres
```

---

## 3. Security Boundary & Firewall Rules

Discrete security groups enforce least privilege with zero cross-contamination:

### Ops Security Group (`fairsplit-dev-ops-sg`)
| Direction | Port | Protocol | Source / Destination | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| Ingress | `22` | TCP | `${admin_ip_cidr}` | Secure administrative SSH access |
| Ingress | `80` | TCP | `${admin_ip_cidr}` | Nagios Core monitoring web interface |
| Ingress | `8140`| TCP | `fairsplit-dev-app-sg` | Puppet agent catalog retrieval |
| Egress | All | All | `0.0.0.0/0` | Outbound package updates & orchestration |

### App Security Group (`fairsplit-dev-app-sg`)
| Direction | Port | Protocol | Source / Destination | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| Ingress | `80` | TCP | `0.0.0.0/0` | Public end-user access to FairSplit |
| Ingress | `22` | TCP | `${admin_ip_cidr}` & Ops SG | Admin & Ansible SSH management |
| Ingress | `5666`| TCP | `fairsplit-dev-ops-sg` | NRPE health monitoring queries |
| Egress | All | All | `0.0.0.0/0` | Container image pulls & outbound traffic |

> **Security Note:** Ports `5432` (PostgreSQL) and `8000` (Django/Gunicorn) have **zero public ingress**. They are reachable exclusively inside the private Docker network (`fairsplit_net`) on the App Node.

---

## 4. Self-Healing & Automated Remediation Workflow

The self-healing pipeline ensures high availability without manual human intervention:

```mermaid
sequenceDiagram
    autonumber
    participant App as App Node Container (e.g. backend)
    participant NRPE as NRPE Plugin (check_docker_container)
    participant Nagios as Nagios Core (Ops Node)
    participant Handler as nagios_event_handler.sh
    participant Validator as validate_failure.sh
    participant Ansible as Ansible remediate.yml
    participant Logger as recovery_log.sh

    App->>App: Container crashes or healthcheck fails
    Nagios->>NRPE: Poll check_docker_container!fairsplit_backend
    NRPE-->>Nagios: CRITICAL: Container not running
    Note over Nagios: Enters SOFT state (Attempt 1/3)
    Nagios->>NRPE: Polls 2 more times (max_check_attempts: 3)
    NRPE-->>Nagios: CRITICAL confirmed
    Note over Nagios: Transitions to HARD state
    Nagios->>Handler: Invokes event handler with args (CRITICAL, HARD, 3, "Backend Container")
    Handler->>Validator: Confirm failure is genuine (3 retry probes)
    Validator-->>Handler: Confirmed dead (Exit 1)
    Handler->>Logger: Log remediation attempt
    Handler->>Ansible: Dispatch ansible-playbook remediate.yml -e service_name=backend
    Ansible->>App: SSH docker compose restart backend
    Ansible->>App: Verify /api/health/ returns 200 OK
    App-->>Ansible: Healthy
    Nagios->>NRPE: Next check returns OK
    Note over Nagios: Transitions to OK / RECOVERY
    Nagios->>Handler: Invoked with RECOVERY state
    Handler->>Logger: Log successful auto-recovery
```

---

## 5. Component Responsibilities

### 1. Terraform (`terraform/`)
- Manages AWS compute (EC2), network data sources (VPC/Subnets), and security groups.
- Discovers existing default VPC (`vpc-012757c89854197cd`) without creating redundant VPCs or NAT gateways.
- Generates dynamic Ansible inventory template (`inventory/hosts.ini`).

### 2. Puppet (`puppet/`)
- Declarative node configuration via Hiera 5 hierarchy (`puppet/data/common.yaml`).
- Configures system swap (2GB swap file on Ops Node for JVM memory stability).
- Manages base packages, SSH hardening, chrony NTP, timezone, UFW rules, and Docker daemon runtime.
- Installs and configures Nagios Server and NRPE agent.

### 3. Ansible (`ansible/`)
- **`deploy.yml`**: Clones repository, sets up environment files, builds and starts Docker containers, runs database migrations, and verifies application health.
- **`remediate.yml`**: Restarts degraded containers, inspects container logs, and validates health restoration.
- **`backup.yml`**: Executes `pg_dump` via Docker, compresses SQL dumps with gzip, validates dump size, and rotates historical backups.
- **`restore.yml`**: Drops and recreates target PostgreSQL database from compressed backup file, restarts backend, and verifies database integrity.
- **`rollback.yml`**: Rolls back application to a previous Git commit or image tag gracefully.

### 4. Nagios Core (`nagios/`)
- Monitored services: Host ping, SSH, Disk utilization (`check_disk.sh`), Docker container health (`check_docker_container.sh`), and HTTP end-to-end API health (`check_fairsplit.sh`).
- Event handlers integrated directly with Ansible remediation scripts.

