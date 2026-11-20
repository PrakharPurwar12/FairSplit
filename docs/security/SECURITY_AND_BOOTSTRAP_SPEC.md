# FairSplit-Ops: Security Architecture, Dedicated Key Lifecycle & Privilege Confinement Specification

## 1. System Overview & Trust Model

The FairSplit-Ops DevOps architecture uses an isolated, dual-tier trust boundary separating human administration from autonomous inter-node automation:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   Administrator Workstation (Windows)                  │
│       Identity: arn:aws:iam::818566829648:user/terra-admin             │
│       Private Key: fairsplit-dev-key.pem (Local Only)                  │
└───────────────────┬────────────────────────────────┬───────────────────┘
                    │                                │
    1. Primary Path │ AWS SSM Session Manager        │ 3. Fallback Path
       (Outbound    │ TLS/HTTPS (Port 443)           │    Direct SSH (Port 22)
        polling)    │ No inbound ports required      │    Restricted to admin IP
                    ▼                                ▼    (0.0.0.0/0 forbidden)
         ┌──────────────────────────────────────────────────┐
         │              AWS Systems Manager Service         │
         │          (ssm.ap-south-1.amazonaws.com)          │
         └──────────────────────────┬───────────────────────┘
                                    │ TLS 443 Outbound
                                    ▼
         ┌──────────────────────────────────────────────────┐
         │           Ops Node (fairsplit-ops)               │
         │  - IAM Profile: AmazonSSMManagedInstanceCore     │
         │  - SSM Agent (snap/deb service)                  │
         │  - Internal Ed25519 Deploy Key (~/.ssh/id_ed25519│
         └──────────────────────────┬───────────────────────┘
                                    │ 2. Internal Automation Path
                                    │    SSH (Port 22 Private IP)
                                    │    StrictHostKeyChecking=yes
                                    ▼
         ┌──────────────────────────────────────────────────┐
         │           App Node (fairsplit-app)               │
         │  - Authorized Keys: id_ed25519.pub               │
         │  - SG: Allows port 22 strictly from Ops SG       │
         └──────────────────────────────────────────────────┘
```

### Trust Boundary Principles
1. **Zero Workstation Key Transit**: The human administrator private key (`fairsplit-dev-key.pem`) is retained exclusively on the local Windows workstation. It is **never** copied, piped, or transferred to any EC2 instance.
2. **SSM Session Manager as Primary Administrative Path**: Human administration of the Ops Node is conducted via AWS Systems Manager Session Manager (`aws ssm start-session` or SSH-over-SSM proxy). This relies on IAM authentication and outbound TLS 443 polling from the EC2 instance to AWS SSM endpoints. It does not require a static public IP or opening inbound port 22 to `0.0.0.0/0`.
3. **Strict Separation of Administrative and Automation Channels**:
   - **Administrative Channel**: Workstation ➔ AWS SSM ➔ Ops Node (`ssm-user` / `ubuntu`).
   - **Internal Automation Channel**: Ops Node ➔ App Node over private VPC IPs (`172.31.0.0/16`) on port 22, authenticated exclusively via the dedicated `~/.ssh/id_ed25519` key pair generated on the Ops Node.
4. **Least-Privilege Ops Instance IAM Role**: The Ops Node EC2 instance profile is granted only `AmazonSSMManagedInstanceCore`. It is strictly **denied** `AdministratorAccess` and cannot modify AWS infrastructure or access unauthorized services.
5. **No Open Inbound SSH to the Public**: Terraform security group variables strictly disallow `admin_ip_cidr = "0.0.0.0/0"`. Fallback SSH (port 22) is allowed only from the explicit administrator CIDR.

---

## 2. Dedicated Deployment-Key Bootstrap Sequence

### Step-by-Step Execution Protocol

1. **Step 1: Provisioning (Terraform)**
   - Developer workstation provisions the infrastructure using `fairsplit-dev-key` as the AWS EC2 Key Pair.
   - Terraform renders `ansible/inventory/hosts.ini` with:
     * `ops-node ansible_host=127.0.0.1 ansible_connection=local`
     * `app-node ansible_host=${app_private_ip}`
     * `ansible_ssh_private_key_file=~/.ssh/id_ed25519`
     * `ansible_ssh_common_args='-o StrictHostKeyChecking=yes -o UserKnownHostsFile=~/.ssh/known_hosts'`

2. **Step 2: Ops Node Bootstrap (`bootstrap_ops.sh`)**
   - Connect from Windows workstation:
     ```powershell
     ssh -i ~/.ssh/fairsplit-dev-key.pem ubuntu@<ops_public_ip>
     ```
   - Run `bootstrap_ops.sh`:
     * Generates dedicated Ed25519 deployment key:
       ```bash
       ssh-keygen -t ed25519 -f /home/ubuntu/.ssh/id_ed25519 -N "" -C "fairsplit-ops-deploy"
       ```
     * Enforces POSIX permissions:
       - `/home/ubuntu/.ssh`: mode `0700` (`ubuntu:ubuntu`)
       - `/home/ubuntu/.ssh/id_ed25519`: mode `0400` (`ubuntu:ubuntu`)
       - `/home/ubuntu/.ssh/id_ed25519.pub`: mode `0644` (`ubuntu:ubuntu`)
     * Installs Puppet Server 8 (pinned to Java 17 OpenJDK), Ansible, Nagios Core 4, and the remediation privilege boundary.

3. **Step 3: Public Key Retrieval**
   - Workstation captures the public key string via SSH:
     ```powershell
     $OPS_PUBKEY = (ssh -i ~/.ssh/fairsplit-dev-key.pem ubuntu@<ops_public_ip> 'cat ~/.ssh/id_ed25519.pub').Trim()
     ```

4. **Step 4: App Node Bootstrap (`bootstrap_app.sh`)**
   - Connect from Windows workstation:
     ```powershell
     ssh -i ~/.ssh/fairsplit-dev-key.pem ubuntu@<app_public_ip>
     ```
   - Run `bootstrap_app.sh`:
     ```bash
     bash scripts/bootstrap/bootstrap_app.sh --ops-ip <ops_private_ip> --ops-pubkey "$OPS_PUBKEY"
     ```
   - Validates public key format (`^ssh-ed25519 [A-Za-z0-9+/=]+( .*)?$`) and idempotently appends to `/home/ubuntu/.ssh/authorized_keys` (mode `0600`).

5. **Step 5: Authenticated Host-Key Pinning (`verify_and_pin_ssh_host_key.sh`)**
   - On the Ops Node, verify and pin the App Node's host key against AWS EC2 serial console output:
     ```bash
     bash scripts/security/verify_and_pin_ssh_host_key.sh --instance-id <app_instance_id> --host-ip <app_private_ip>
     ```
   - Pins the verified key to `~/.ssh/known_hosts`, allowing Ansible to execute with `StrictHostKeyChecking=yes`.

---

## 3. SSH Host-Key Verification & Pinning Strategy

### The TOFU Limitation of `accept-new`
`StrictHostKeyChecking=accept-new` is Trust-On-First-Use (TOFU). It records whatever key is presented upon initial connection without authentication. If a network path is poisoned (e.g. ARP/DNS spoofing), `accept-new` silently accepts the attacker's key. Similarly, `ssh-keyscan` alone is an unauthenticated probe.

### Authenticated Out-of-Band Verification Protocol
1. **Authoritative Source**: During first boot, Ubuntu cloud-init generates host keys and prints their SHA256 fingerprints to the system serial console (`/dev/console`).
2. **Control-Plane Query**: The Ops Node (or administrator) queries the AWS control-plane API:
   ```bash
   aws ec2 get-console-output --instance-id <instance_id> --region ap-south-1 --output text
   ```
3. **Comparison**: `scripts/security/verify_and_pin_ssh_host_key.sh` computes the fingerprint of the network-scanned key:
   ```bash
   ACTUAL_FP=$(ssh-keyscan -t ed25519 "$HOST_IP" 2>/dev/null | ssh-keygen -lf - | awk '{print $2}')
   ```
4. **Pinning**: Only if `EXPECTED_FP == ACTUAL_FP` is the key appended to `~/.ssh/known_hosts`.
5. **Strict Enforcement**: All Ansible runs enforce `StrictHostKeyChecking=yes`.

---

## 4. Nagios Privilege Boundary & Event Handler Security

### Sudoers Configuration (`/etc/sudoers.d/99-nagios-remediation`)
```sudoers
nagios ALL=(ubuntu) NOPASSWD: /opt/fairsplit/remediation/event_handlers/nagios_event_handler.sh
```
- **Target User**: Strictly confined to `(ubuntu)`. Refuses elevation to `root`.
- **Target Binary**: Strictly confined to `/opt/fairsplit/remediation/event_handlers/nagios_event_handler.sh`.
- **Permissions**: Mode `0440`, owned by `root:root`. Parent `/etc/sudoers.d/` mode `0755`. Validated via `visudo -cf`.

### Event Handler Confinement (`nagios_event_handler.sh`)
1. **Positional Arguments**: Strictly validates `$# -eq 4` (`<STATE> <STATE_TYPE> <ATTEMPT> <SERVICE_DESC>`).
2. **Environment Sanitization**: Enforces `export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"` and unsets `LD_PRELOAD`, `LD_LIBRARY_PATH`.
3. **Whitelist Mapping**: Evaluates `$SERVICE_DESC` against fixed patterns:
   - `*"Backend"*|*"backend"*|*"FairSplit_API"*` ➔ `SERVICE="backend"`, `CONTAINER="fairsplit_backend"`
   - `*"Postgres"*|*"postgres"*|*"Database"*` ➔ `SERVICE="postgres"`, `CONTAINER="fairsplit_postgres"`
   - `*"Frontend"*|*"frontend"*|*"Nginx"*` ➔ `SERVICE="frontend"`, `CONTAINER="fairsplit_frontend"`
   - Any unrecognized pattern ➔ `exit 1` immediately.
4. **Race Condition Prevention**: Enforces a 300-second file lock (`/tmp/fairsplit-remediation/<CONTAINER>.lock`).
5. **Asynchronous Dispatch**: Dispatches `ansible-playbook -i /opt/fairsplit/ansible/inventory/hosts.ini /opt/fairsplit/ansible/playbooks/remediate.yml -e "service_name=$SERVICE"` in the background as user `ubuntu`.

---

## 5. Key Rotation & Revocation Protocol

### Zero-Downtime Rotation
1. Generate new Ed25519 key on Ops Node:
   ```bash
   ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519_new -N ""
   ```
2. Append `id_ed25519_new.pub` to App Node `/home/ubuntu/.ssh/authorized_keys` (dual-key window).
3. Test connectivity: `ansible app -m ping --private-key=~/.ssh/id_ed25519_new`.
4. Replace `~/.ssh/id_ed25519` with `~/.ssh/id_ed25519_new`.
5. Remove the old public key from App Node `authorized_keys`.

### Emergency Revocation
1. Workstation connects directly to App Node via out-of-band `fairsplit-dev-key.pem`.
2. Delete the Ops Node deployment key line from `/home/ubuntu/.ssh/authorized_keys`.
3. Terminate active sessions: `sudo pkill -9 -u ubuntu -f "sshd: ubuntu@"`.
4. Intra-VPC SSH access from the Ops Node is severed immediately. Administrator access remains intact.

---

## 6. Rollback & Recovery Procedures

### Database Rollback
Restore from compressed SQL snapshot:
```bash
ansible-playbook -i inventory/hosts.ini playbooks/restore.yml \
  -e "backup_file=/opt/fairsplit/backups/fairsplit_backup_YYYY-MM-DD.sql.gz"
```

### Application Code Rollback
Roll back git commit / container state:
```bash
ansible-playbook -i inventory/hosts.ini playbooks/rollback.yml \
  -e "rollback_target=HEAD~1"
```
