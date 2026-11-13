# ---------------------------------------------------------------------------
# modules/docker/manifests/init.pp
# Docker CE + docker-compose plugin for the App Node.
# Uses puppetlabs/docker forge module.
# ---------------------------------------------------------------------------
class docker (
  String $ubuntu_user = 'ubuntu',
) {

  # -------------------------------------------------------------------------
  # 1. Install Docker CE via puppetlabs/docker
  # -------------------------------------------------------------------------
  class { '::docker':
    manage_package      => true,
    manage_service      => true,
    service_state       => running,
    service_enable      => true,
    docker_ce_start_command => 'start',
    # Use the official Docker apt repo
    repo_opt            => '',
  }

  # -------------------------------------------------------------------------
  # 2. Docker Compose plugin (v2 – installed as a Docker CLI plugin)
  # -------------------------------------------------------------------------
  class { '::docker::compose':
    ensure  => present,
    version => 'latest',
  }

  # -------------------------------------------------------------------------
  # 3. Add ubuntu user to docker group
  # -------------------------------------------------------------------------
  user { $ubuntu_user:
    ensure  => present,
    groups  => ['docker'],
    require => Class['::docker'],
  }

  # -------------------------------------------------------------------------
  # 4. Application directories
  # -------------------------------------------------------------------------
  file { '/opt/fairsplit/app':
    ensure  => directory,
    owner   => $ubuntu_user,
    group   => $ubuntu_user,
    mode    => '0755',
    require => File['/opt/fairsplit'],
  }

  file { '/opt/fairsplit/backups':
    ensure  => directory,
    owner   => $ubuntu_user,
    group   => $ubuntu_user,
    mode    => '0750',
    require => File['/opt/fairsplit'],
  }

  # Ensure /opt/fairsplit exists (created by common, but declare relationship)
  File['/opt/fairsplit'] -> File['/opt/fairsplit/app']
  File['/opt/fairsplit'] -> File['/opt/fairsplit/backups']
}
