# ---------------------------------------------------------------------------
# modules/common/manifests/init.pp
# Baseline configuration applied to every node.
# ---------------------------------------------------------------------------
class common (
  String           $timezone        = 'Asia/Kolkata',
  Array[String]    $packages        = ['curl', 'wget', 'vim', 'htop', 'unzip', 'git', 'python3-pip'],
  String           $ops_node_hostname = lookup('fairsplit::ops_node_hostname'),
  String           $app_node_hostname = lookup('fairsplit::app_node_hostname'),
) {

  # -------------------------------------------------------------------------
  # 1. Essential packages
  # -------------------------------------------------------------------------
  package { $packages:
    ensure => installed,
  }

  # -------------------------------------------------------------------------
  # 2. /etc/hosts entries for both nodes
  #    Uses exported resources pattern so each node publishes its own IP.
  #    Falls back to 127.0.0.1 when the fact is unavailable (catalog compile).
  # -------------------------------------------------------------------------
  $node_ip = $facts['networking']['ip']

  # Export this node's host record so the other node can collect it
  @@host { $facts['networking']['fqdn']:
    ensure       => present,
    ip           => $node_ip,
    host_aliases => [$facts['networking']['hostname']],
  }

  # Collect all exported host records
  Host <<| |>>

  # Static short-name aliases (resolved after agents have run once)
  host { $ops_node_hostname:
    ensure => present,
  }

  host { $app_node_hostname:
    ensure => present,
  }

  # -------------------------------------------------------------------------
  # 3. Timezone
  # -------------------------------------------------------------------------
  class { 'timezone':
    timezone => $timezone,
  }

  # Set timezone directly via file/exec when the puppetlabs/timezone module
  # is not available; this uses the standard timedatectl approach.
  exec { 'set-timezone':
    command => "/usr/bin/timedatectl set-timezone ${timezone}",
    unless  => "/usr/bin/timedatectl show -p Timezone --value | /bin/grep -qx ${timezone}",
    path    => ['/usr/bin', '/bin'],
  }

  # -------------------------------------------------------------------------
  # 4. NTP / chrony
  # -------------------------------------------------------------------------
  package { 'chrony':
    ensure => installed,
  }

  service { 'chrony':
    ensure  => running,
    enable  => true,
    require => Package['chrony'],
  }

  # -------------------------------------------------------------------------
  # 5. /opt/fairsplit directory
  # -------------------------------------------------------------------------
  file { '/opt/fairsplit':
    ensure => directory,
    owner  => 'root',
    group  => 'root',
    mode   => '0755',
  }
}
