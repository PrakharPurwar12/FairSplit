# Controlled Automated Remediation Layer

Event handlers and verification scripts for FairSplit-Ops automated self-healing.

This layer will integrate with Nagios state changes to trigger controlled, bounded remediation actions (via Ansible playbooks) upon detecting predefined hard failures, logging recovery attempts and preventing recurring remediation loops.
