#!/bin/sh

# Update script for derekandersen.net

now=$(date +"%H-%M-%S_%m_%d_%Y")
sudo systemctl stop website.service
cd /home/derek/derekandersen.net
git reset --hard -q
git pull -q
cd /home/derek/derekandersen.net/backend
npm install --silent
sudo systemctl start website.service
echo "$now updated" >> /home/derek/website.log
sleep 1
echo "derekandersen.net successfully updated!"
