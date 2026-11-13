#!/bin/bash
##############################################################################
# Nagios Plugin: check_disk.sh
# Description : Check disk usage on the root filesystem.
# Usage       : check_disk.sh [warn%] [crit%]
# Defaults    : warn=80, crit=90
# Exit codes  : 0=OK  1=WARNING  2=CRITICAL  3=UNKNOWN
##############################################################################

WARN=${1:-80}
CRIT=${2:-90}

# Validate thresholds are integers
if ! [[ "$WARN" =~ ^[0-9]+$ ]] || ! [[ "$CRIT" =~ ^[0-9]+$ ]]; then
    echo "UNKNOWN: Invalid threshold values (warn=${WARN}, crit=${CRIT})"
    exit 3
fi

if [ "$WARN" -ge "$CRIT" ]; then
    echo "UNKNOWN: Warning threshold (${WARN}%) must be less than critical threshold (${CRIT}%)"
    exit 3
fi

DISK=$(df -h / | awk 'NR==2 {print $5}' | tr -d '%')

if ! [[ "$DISK" =~ ^[0-9]+$ ]]; then
    echo "UNKNOWN: Could not determine disk usage (got: '${DISK}')"
    exit 3
fi

if [ "$DISK" -ge "$CRIT" ]; then
    echo "CRITICAL: Disk usage is ${DISK}% | disk_used=${DISK}%;${WARN};${CRIT};0;100"
    exit 2
elif [ "$DISK" -ge "$WARN" ]; then
    echo "WARNING: Disk usage is ${DISK}% | disk_used=${DISK}%;${WARN};${CRIT};0;100"
    exit 1
else
    echo "OK: Disk usage is ${DISK}% | disk_used=${DISK}%;${WARN};${CRIT};0;100"
    exit 0
fi
