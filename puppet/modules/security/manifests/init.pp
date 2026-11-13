# ---------------------------------------------------------------------------
# modules/security/manifests/init.pp
# Hardening baseline applied to every node.
# ---------------------------------------------------------------------------
class security (
  Hash $sysctl_settings = lookup('security::sysctl_settings', Hash, 'hash', {}),
) {

  # -------------------------------------------------------------------------
  # 1. UFW firewall
  # -------------------------------------------------------------------------
  package { 'ufw':
    ensure => installed,
  }

  # Ensure ufw is enabled
  exec { 'ufw-enable':
    command => '/usr/sbin/ufw --force enable',
    unless  => '/usr/sbin/ufw status | /bin/grep -q "Status: active"',
    path    => ['/usr/sbin', '/usr/bin', '/bin'],
    require => Package['ufw'],
  }

  # Allow SSH before enabling so we don't lock ourselves out
  exec { 'ufw-allow-ssh':
    command => '/usr/sbin/ufw allow 22/tcp',
    unless  => '/usr/sbin/ufw status | /bin/grep -q "22/tcp"',
    path    => ['/usr/sbin', '/usr/bin', '/bin'],
    before  => Exec['ufw-enable'],
    require => Package['ufw'],
  }

  # -------------------------------------------------------------------------
  # 2. Disable SSH password authentication
  # -------------------------------------------------------------------------
  # Ensure openssh-server is present
  package { 'openssh-server':
    ensure => installed,
  }

  # Disable password auth
  file_line { 'sshd-disable-password-auth':
    path    => '/etc/ssh/sshd_config',
    line    => 'PasswordAuthentication no',
    match   => '^#?PasswordAuthentication',
    require => Package['openssh-server'],
    notify  => Service['sshd'],
  }

  # Disable challenge-response auth
  file_line { 'sshd-disable-challenge-response':
    path    => '/etc/ssh/sshd_config',
    line    => 'ChallengeResponseAuthentication no',
    match   => '^#?ChallengeResponseAuthentication',
    require => Package['openssh-server'],
    notify  => Service['sshd'],
  }

  # Disable root login
  file_line { 'sshd-disable-root-login':
    path    => '/etc/ssh/sshd_config',
    line    => 'PermitRootLogin no',
    match   => '^#?PermitRootLogin',
    require => Package['openssh-server'],
    notify  => Service['sshd'],
  }

  service { 'sshd':
    ensure  => running,
    enable  => true,
    require => Package['openssh-server'],
  }

  # -------------------------------------------------------------------------
  # 3. fail2ban
  # -------------------------------------------------------------------------
  package { 'fail2ban':
    ensure => installed,
  }

  service { 'fail2ban':
    ensure  => running,
    enable  => true,
    require => Package['fail2ban'],
  }

  # Basic jail.local – don't edit jail.conf (it gets overwritten on upgrade)
  file { '/etc/fail2ban/jail.local':
    ensure  => file,
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    content => @("JAIL"),
      [DEFAULT]
      bantime  = 3600
      findtime = 600
      maxretry = 5
      backend  = auto

      [sshd]
      enabled = true
      port    = ssh
      logpath = %(sshd_log)s
      | JAIL
    require => Package['fail2ban'],
    notify  => Service['fail2ban'],
  }

  # -------------------------------------------------------------------------
  # 4. sysctl settings
  # -------------------------------------------------------------------------
  $sysctl_settings.each |String $key, Hash $opts| {
    sysctl { $key:
      ensure    => present,
      value     => $opts['value'],
      permanent => true,
    }
  }
}
