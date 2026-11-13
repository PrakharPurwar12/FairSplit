# ---------------------------------------------------------------------------
# modules/nagios_server/manifests/init.pp
# Nagios 4 + Apache web UI on the Ops Node.
# ---------------------------------------------------------------------------
class nagios_server (
  String $nagios_cfg_dir    = '/etc/nagios4',
  String $nagios_objects_dir = '/etc/nagios4/conf.d',
  String $nagios_htpasswd   = '/etc/nagios4/htpasswd.users',
  String $apache_conf_dir   = '/etc/apache2/conf-available',
) {

  # -------------------------------------------------------------------------
  # 1. Packages
  # -------------------------------------------------------------------------
  package { ['nagios4', 'nagios-nrpe-plugin', 'nagios-plugins-extra']:
    ensure => installed,
  }

  package { ['apache2', 'libapache2-mod-php']:
    ensure => installed,
  }

  # -------------------------------------------------------------------------
  # 2. Apache modules needed by Nagios CGI
  # -------------------------------------------------------------------------
  exec { 'apache2-enable-cgi':
    command => '/usr/sbin/a2enmod cgi',
    unless  => '/usr/sbin/apache2ctl -M 2>/dev/null | /bin/grep -q cgi',
    path    => ['/usr/sbin', '/usr/bin', '/bin'],
    require => Package['apache2'],
    notify  => Service['apache2'],
  }

  exec { 'apache2-enable-rewrite':
    command => '/usr/sbin/a2enmod rewrite',
    unless  => '/usr/sbin/apache2ctl -M 2>/dev/null | /bin/grep -q rewrite',
    path    => ['/usr/sbin', '/usr/bin', '/bin'],
    require => Package['apache2'],
    notify  => Service['apache2'],
  }

  # -------------------------------------------------------------------------
  # 3. Apache vhost config for Nagios UI
  # -------------------------------------------------------------------------
  file { "${apache_conf_dir}/nagios4.conf":
    ensure  => file,
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    content => epp('nagios_server/apache_nagios.conf.epp', {
      'nagios_htpasswd' => $nagios_htpasswd,
    }),
    require => Package['apache2'],
    notify  => Service['apache2'],
  }

  exec { 'apache2-enable-nagios-conf':
    command => '/usr/sbin/a2enconf nagios4',
    unless  => '/usr/bin/test -L /etc/apache2/conf-enabled/nagios4.conf',
    path    => ['/usr/sbin', '/usr/bin', '/bin', '/usr/lib'],
    require => File["${apache_conf_dir}/nagios4.conf"],
    notify  => Service['apache2'],
  }

  # -------------------------------------------------------------------------
  # 4. Nagios main configuration
  # -------------------------------------------------------------------------
  file { "${nagios_cfg_dir}/nagios.cfg":
    ensure  => file,
    owner   => 'root',
    group   => 'nagios',
    mode    => '0640',
    content => epp('nagios_server/nagios.cfg.epp', {
      'nagios_objects_dir' => $nagios_objects_dir,
    }),
    require => Package['nagios4'],
    notify  => Service['nagios4'],
  }

  # Ensure objects directory exists
  file { $nagios_objects_dir:
    ensure  => directory,
    owner   => 'root',
    group   => 'nagios',
    mode    => '0750',
    require => Package['nagios4'],
  }

  # -------------------------------------------------------------------------
  # 5. Services
  # -------------------------------------------------------------------------
  service { 'apache2':
    ensure  => running,
    enable  => true,
    require => Package['apache2'],
  }

  service { 'nagios4':
    ensure  => running,
    enable  => true,
    require => [
      Package['nagios4'],
      File["${nagios_cfg_dir}/nagios.cfg"],
    ],
  }
}
