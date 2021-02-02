#!/bin/sh

# Update script for derekandersen.net

now=$(date +"%H-%M-%S_%m_%d_%Y")
cd /home/derek/
touch ./website.log
cd /home/derek/derekandersen.net
git checkout master -q
rm -rf /var/www/derekandersennet
rsync -avq /home/derek/derekandersen.net/ /var/www/derekandersennet --exclude .git --exclude .gitattributes --exclude README.md --exclude update_website.sh --exclude nginx_config
echo "$now updated" >> /home/derek/website.log
sleep 1
echo "derekandersen.net successfully updated!"
