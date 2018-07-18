#!/bin/bash

stringSettings=${BASH_ARGV[0]}
filePath=$HOME"/.local/share/gnome-shell/extensions/cryptoTicker@Ricx8/settings.conf"

echo $stringSettings > $filePath
