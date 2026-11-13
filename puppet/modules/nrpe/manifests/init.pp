# ---------------------------------------------------------------------------
# modules/nrpe/manifests/init.pp
# NRPE agent on the App Node – runs checks polled by Nagios on the Ops Node.
# ---------------------------------------------------------------------------
class nrpe (
  String $allowed_hosts      = "127.0.0.1,${lookup('fairsplit::ops_node_hostname')}",
  String $nrpe_cfg           = '/etc/nagios/nrpe.cfg',
  String $plugin_dir         = '/usr/local/lib/nagios/plugins',
) {

  # -------------------------------------------------------------------------
  # 1. Packages
  # -------------------------------------------------------------------------
  package { ['nagios-nrpe-server', 'nagios-plugins-extra', 'nagios-plugins-basic']:
    ensure => installed,
  }

  # -------------------------------------------------------------------------
  # 2. Custom plugin directory
  # -------------------------------------------------------------------------
  file { $plugin_dir:
    ensure  => directory,
    owner   => 'root',
    group   => 'root',
    mode    => '0755',
    require => Package['nagios-nrpe-server'],
  }

  # -------------------------------------------------------------------------
  # 3. check_mem script
  # -------------------------------------------------------------------------
  file { "${plugin_dir}/check_mem":
    ensure  => file,
    owner   => 'root',
    group   => 'root',
    mode    => '0755',
    content => @("SCRIPT"),
      #!/bin/bash
      # Simple memory check: warn at 80%, crit at 95%
      WARN=${1:-80}
      CRIT=${2:-95}
      TOTAL=$(grep MemTotal /proc/meminfo | awk '{print $2}')
      AVAIL=$(grep MemAvailable /proc/meminfo | awk '{print $2}')
      USED=$(( (TOTAL - AVAIL) * 100 / TOTAL ))
      if [ "$USED" -ge "$CRIT" ]; then
        echo "CRITICAL: Memory ${USED}% used|mem_used=${USED}%;${WARN};${CRIT};0;100"
        exit 2
      elif [ "$USED" -ge "$WARN" ]; then
        echo "WARNING: Memory ${USED}% used|mem_used=${USED}%;${WARN};${CRIT};0;100"
        exit 1
      else
        echo "OK: Memory ${USED}% used|mem_used=${USED}%;${WARN};${CRIT};0;100"
        exit 0
      fi
      | SCRIPT
    require => File[$plugin_dir],
  }

  # -------------------------------------------------------------------------
  # 4. check_docker_container script
  # -------------------------------------------------------------------------
  file { "${plugin_dir}/check_docker_container":
    ensure  => file,
    owner   => 'root',
    group   => 'root',
    mode    => '0755',
    content => @("SCRIPT"),
      #!/bin/bash
      # Check whether a named Docker container is running
      CONTAINER=${1:-fairsplit}
      STATUS=$(docker inspect --format='{{.State.Running}}' "$CONTAINER" 2>/dev/null)
      if [ "$STATUS" = "true" ]; then
        echo "OK: Container $CONTAINER is running"
        exit 0
      elif [ -z "$STATUS" ]; then
        echo "UNKNOWN: Container $CONTAINER not found"
        exit 3
      else
        echo "CRITICAL: Container $CONTAINER is NOT running"
        exit 2
      fi
      | SCRIPT
    require => File[$plugin_dir],
  }

  # -------------------------------------------------------------------------
  # 5. check_fairsplit script (HTTP health check)
  # -------------------------------------------------------------------------
  file { "${plugin_dir}/check_fairsplit":
    ensure  => file,
    owner   => 'root',
    group   => 'root',
    mode    => '0755',
    content => @("SCRIPT"),
      #!/bin/bash
      # HTTP health check for the FairSplit application
      URL=${1:-"http://localhost:5000/health"}
      HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$URL")
      if [ "$HTTP_CODE" = "200" ]; then
        echo "OK: FairSplit returned HTTP $HTTP_CODE"
        exit 0
      elif [ "$HTTP_CODE" = "000" ]; then
        echo "CRITICAL: FairSplit is unreachable (timeout or connection refused)"
        exit 2
      else
        echo "WARNING: FairSplit returned HTTP $HTTP_CODE"
        exit 1
      fi
      | SCRIPT
    require => File[$plugin_dir],
  }

  # -------------------------------------------------------------------------
  # 6. nrpe.cfg
  # -------------------------------------------------------------------------
  file { $nrpe_cfg:
    ensure  => file,
    owner   => 'root',
    group   => 'nagios',
    mode    => '0640',
    content => epp('nrpe/nrpe.cfg.epp', {
      'allowed_hosts' => $allowed_hosts,
      'plugin_dir'    => $plugin_dir,
    }),
    require => Package['nagios-nrpe-server'],
    notify  => Service['nagios-nrpe-server'],
  }

  # -------------------------------------------------------------------------
  # 7. NRPE service
  # -------------------------------------------------------------------------
  service { 'nagios-nrpe-server':
    ensure  => running,
    enable  => true,
    require => [
      Package['nagios-nrpe-server'],
      File[$nrpe_cfg],
    ],
  }
}
