#!/bin/bash
cd `dirname $0`

if [ -z `which kss-node` ]; then
  echo "Please install kss first by executing: 'npm install kss -g'"
  exit 1
fi

echo 'Generating KSS Stylesheets...'
KSS_STDERR='/tmp/kss_debug.log'
kss-node ./kss ./public/styleguide --template ./kss/template/ --sass ./kss/styles.scss &> $KSS_STDERR
if [ $? -ne 0 ]; then
  echo "Error compiling stylesheets"
  cat $KSS_STDERR
  exit 2
fi
