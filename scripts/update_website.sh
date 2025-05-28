#!/bin/sh

# Update script for derekandersen.net

now=$(date +"%H-%M-%S_%m_%d_%Y")
sudo systemctl stop blog-engine.service
cd /home/derek/
touch ./website.log
cd /home/derek/derekandersen.net
git reset --hard -q
git pull -q
cd /home/derek/derekandersen.net/backend
npm install --silent
sudo chmod +x /home/derek/derekandersen.net/backend/blog-engine.js
rm -rf /var/www/derekandersennet
rsync -avq /home/derek/derekandersen.net/ /var/www/derekandersennet --exclude .git --exclude .gitattributes --exclude README.md --exclude update_website.sh --exclude nginx_config
sudo systemctl start blog-engine.service
echo "$now updated" >> /home/derek/website.log
sleep 1
echo "derekandersen.net successfully updated!"

