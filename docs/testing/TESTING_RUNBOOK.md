# FairSplit-Ops: Operational Testing & Runbook

This document details common operational procedures, testing scenarios, self-healing validation, disaster recovery, and cost management.

---

## 1. Routine Operational Commands

### Check Services & Health
| Target | Command | Expected Output |
| :--- | :--- | :--- |
| FairSplit Web App | `curl -f -s http://<app_ip>/api/health/` | `{"status":"ok", ...}` with HTTP 200 |
| Docker Containers | `ssh ubuntu@<app_ip> "docker ps"` | 3 containers up: `fairsplit_frontend`, `fairsplit_backend`, `fairsplit_postgres` |
| Nagios Daemon | `ssh ubuntu@<ops_ip> "systemctl status nagios4"` | `active (running)` |
| Puppet Server | `ssh ubuntu@<ops_ip> "systemctl status puppetserver"` | `active (running)` |
| Puppet Agent | `ssh ubuntu@<app_ip> "systemctl status puppet"` | `active (running)` |
| NRPE Daemon | `ssh ubuntu@<app_ip> "systemctl status nagios-nrpe-server"` | `active (running)` |

---

## 2. Testing Self-Healing & Failure Recovery

### Scenario: Simulate Application Backend Crash
To test the end-to-end monitoring and self-healing loop:

1. **Simulate failure:**
   SSH into the App Node and stop the backend container:
   ```bash
   ssh ubuntu@<app_ip> "docker stop fairsplit_backend"
   ```

2. **Observe failure detection:**
   - On the App Node, verify the container is stopped: `docker ps -a`
   - Nagios Core polls NRPE via `check_docker_container.sh fairsplit_backend`.
   - Nagios transitions from `OK` → `CRITICAL (SOFT attempt 1/3)`.
   - After 3 consecutive failed checks, Nagios enters `CRITICAL (HARD)`.

3. **Verify automated remediation:**
   - Nagios calls `/opt/fairsplit/remediation/event_handlers/nagios_event_handler.sh`.
   - Event handler validates the failure with `validate_failure.sh`.
   - Event handler acquires lock and dispatches Ansible:
     ```bash
     ansible-playbook -i /opt/fairsplit/ansible/inventory/hosts.ini \
       /opt/fairsplit/ansible/playbooks/remediate.yml \
       -e "service_name=fairsplit_backend"
     ```
   - Ansible executes `docker compose restart backend` on the App Node.
   - Ansible validates `/api/health/` returns 200 OK.

4. **Verify remediation logs:**
   On the Ops Node:
   ```bash
   cat /opt/fairsplit/remediation.log
   ```
   You should see entries corresponding to:
   - `REMEDIATION TRIGGERED: fairsplit_backend (CRITICAL HARD)`
   - `VALIDATE: fairsplit_backend confirmed failing`
   - `Ansible remediation dispatched`
   - `RECOVERY: fairsplit_backend recovered, no remediation needed`

5. **Verify container restoration:**
   ```bash
   ssh ubuntu@<app_ip> "docker ps --filter name=fairsplit_backend"
   curl -I http://<app_ip>/api/health/
   ```

---

## 3. Manual Operations Runbook

### Trigger Manual Remediation via Ansible
If automated remediation is disabled or you wish to manually restart a degraded component:
```bash
cd /opt/fairsplit/ansible
ansible-playbook -i inventory/hosts.ini playbooks/remediate.yml -e "service_name=fairsplit_backend"
```

### Trigger Database Backup
To perform an on-demand PostgreSQL backup:
```bash
cd /opt/fairsplit/ansible
ansible-playbook -i inventory/hosts.ini playbooks/backup.yml
```
Backups are stored at `/opt/fairsplit/backups/fairsplit_backup_YYYY-MM-DD.sql.gz` on the App Node with automated 7-day retention cleanup.

### Trigger Database Restore
To restore the database from a specific snapshot:
```bash
cd /opt/fairsplit/ansible
ansible-playbook -i inventory/hosts.ini playbooks/restore.yml \
  -e "backup_file=/opt/fairsplit/backups/fairsplit_backup_2026-11-14.sql.gz"
```

### Rollback Application Version
To rollback the application to a prior Git commit or image:
```bash
cd /opt/fairsplit/ansible
ansible-playbook -i inventory/hosts.ini playbooks/rollback.yml \
  -e "rollback_target=HEAD~1"
```

---

## 4. Cost Optimization & Lifecycle Management

To prevent unnecessary AWS charges when testing is paused:

### Stopping EC2 Instances
```bash
aws ec2 stop-instances --instance-ids <ops_instance_id> <app_instance_id> --region ap-south-1
```
*Note: Stopped instances incur only EBS storage charges (~$2.40/month for 30 GB total).*

### Restarting EC2 Instances
```bash
aws ec2 start-instances --instance-ids <ops_instance_id> <app_instance_id> --region ap-south-1
```
*Note: Public IPs may change upon restart unless Elastic IPs are attached. Re-run `terraform refresh` or update `ansible/inventory/hosts.ini` if needed.*

### Destroying Infrastructure (End of Lab)
```bash
cd terraform
terraform destroy -auto-approve
```

