#!/bin/sh

# Update script for derekandersen.net
sudo systemctl stop nginx
cd /home/derek/derekandersen.net
git checkout master -q
rm -rf /var/www/derekandersennet
rsync -avq /home/derek/derekandersen.net/ /var/www/derekandersennet --exclude .git --exclude .gitattributes --exclude README.md --exclude update_website.sh
sudo systemctl start nginx
echo "derekandersen.net successfully updated"
