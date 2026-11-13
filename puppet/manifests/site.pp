# ---------------------------------------------------------------------------
# puppet/manifests/site.pp
# Main Puppet manifest for FairSplit-Ops project.
# ---------------------------------------------------------------------------

# Ops Node: Puppet Server, Ansible control node, Nagios Core
node 'fairsplit-ops' {
  include common
  include security
  include nagios_server

  # 2 GB swap for the ops node (Hiera provides swap_file::files data)
  include swap_file
}

# App Node: FairSplit application via Docker Compose, Puppet Agent, NRPE
node 'fairsplit-app' {
  include common
  include security
  include docker
  include nrpe
}

# Catch-all: apply baseline configuration to any other node
node default {
  include common
}
