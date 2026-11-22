#!/bin/bash
# Check memory usage percentage
# Usage: check_mem.sh [warn%] [crit%]
set -uo pipefail

WARN=${1:-80}
CRIT=${2:-90}

MEM_TOTAL=$(grep MemTotal /proc/meminfo | awk '{print $2}')
MEM_AVAIL=$(grep MemAvailable /proc/meminfo | awk '{print $2}')

if [ -z "$MEM_TOTAL" ] || [ -z "$MEM_AVAIL" ] || [ "$MEM_TOTAL" -eq 0 ]; then
    echo "UNKNOWN: Unable to read memory information from /proc/meminfo"
    exit 3
fi

MEM_USED=$((MEM_TOTAL - MEM_AVAIL))
PERCENT_USED=$((MEM_USED * 100 / MEM_TOTAL))

PERFDATA="mem_used=${PERCENT_USED}%;${WARN};${CRIT};0;100"

if [ "$PERCENT_USED" -ge "$CRIT" ]; then
    echo "CRITICAL: Memory usage is ${PERCENT_USED}% | ${PERFDATA}"
    exit 2
elif [ "$PERCENT_USED" -ge "$WARN" ]; then
    echo "WARNING: Memory usage is ${PERCENT_USED}% | ${PERFDATA}"
    exit 1
else
    echo "OK: Memory usage is ${PERCENT_USED}% | ${PERFDATA}"
    exit 0
fi
