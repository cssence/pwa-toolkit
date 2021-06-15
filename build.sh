#!/bin/bash
source=assets
target=public
mkdir -p $target
rm -r $target/*
cp $source/404.md $target/
cp $source/robots.txt $target/
for config in config/*.txt ; do
  script="${config##*/}"
  app="${script%.*}"
  cp -r $source/$app $target/
  cp $source/all.css $target/$app/
  cp $source/sw.js $target/$app/
  sed -f $config $source/manifest.json > $target/$app/manifest.json
  sed -f $config $source/template.html > $target/$app/index.html
done
