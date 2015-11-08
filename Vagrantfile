# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|

  config.vm.provider :virtualbox do |vb, override|
    override.vm.box = 'ubuntu/trusty64'

    # Adjust these settings as needed.
    vb.memory = 2024
    vb.cpus = 2
  end

  config.vm.provider :aws do |aws, override|
    override.vm.box = 'dummy'
    override.vm.box_url = 'https://github.com/mitchellh/vagrant-aws/raw/master/dummy.box'
    aws.ami = "ami-d05e75b8"

    aws.instance_type = 'c4.xlarge'
    aws.block_device_mapping = [{ 'DeviceName' => '/dev/sda1', 'Ebs.VolumeSize' => 8 }]
    aws.tags = {
      'Name' => "#{$AWS_KEYPAIR_NAME}-wps-build-vagrant"
    }
    override.ssh.username = 'ubuntu'

    override.vm.synced_folder '.', '/vagrant', type: 'rsync', rsync__exclude: '.git/'
  end

  config.vm.provision :shell, privileged: false, inline: <<SCRIPT

    export sudo DEBIAN_FRONTEND=noninteractive

    sudo apt-get update

    wget --no-check-certificate https://github.com/aglover/ubuntu-equip/raw/master/equip_java7_64.sh && bash equip_java7_64.sh
    sudo apt-get -y install ant

    # the standard ubuntu node install doesnt work very well and is VERY old.  Use this one instead
    curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
    sudo  apt-get install -y nodejs

    sudo npm install -g bower
    sudo npm install -g grunt-cli
    sudo npm install -g gulp

    echo """#!/bin/bash
      cd /vagrant
      echo 'Starting build.'
      (ant -v 2>&1) | tee build_output.txt""" > ~/build
    chmod a+rx ~/build

    ~/build
SCRIPT
end
