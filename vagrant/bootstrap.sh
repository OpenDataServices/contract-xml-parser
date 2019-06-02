#!/bin/bash

set -e

apt-get update
apt-get install -y python3 python3-pip unzip

# python stuff
pip3 install pytest selenium

# chrome driver
cd /home/vagrant
wget  https://chromedriver.storage.googleapis.com/2.36/chromedriver_linux64.zip;
unzip chromedriver_linux64.zip -d chromedriver;

export PATH=$PATH:/home/vagrant/chromedriver

# needed by chrome driver
apt-get install -y libglib2.0-0 libnss3 libgconf-2-4 libfontconfig1

# an actual browser
apt-get install -y chromium-browser

