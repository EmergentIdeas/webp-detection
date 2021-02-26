#!/bin/bash

# Takes a source image (arg 1) which is an image twice as large as it needs to be
# for the space, and transforms it to a webp file, one with a -2x.webp extension
# which is the same size as the orginal, and a half size with a .webp ext.
# It also produces a falback image, png by default, but actually according to
# arg 3 if set
SRCIMG=$1
DESTDIR=$2
FILENAME=`basename $1`
NAME=${FILENAME%%.*}
EXT=$3
FALLBACKEXT=${EXT:-png}
convert $SRCIMG $DESTDIR/${NAME}-2x.webp
convert $SRCIMG -resize 50% $DESTDIR/${NAME}.webp
convert $SRCIMG -resize 25% $DESTDIR/${NAME}-half.webp
convert $SRCIMG -resize 12.5% $DESTDIR/${NAME}-quarter.webp
convert $SRCIMG $DESTDIR/${NAME}-2x.${FALLBACKEXT}
convert $SRCIMG -resize 50% $DESTDIR/${NAME}.${FALLBACKEXT}
convert $SRCIMG -resize 25% $DESTDIR/${NAME}-half.${FALLBACKEXT}
convert $SRCIMG -resize 12.5% $DESTDIR/${NAME}-quarter.${FALLBACKEXT}
SIZE=`identify ${SRCIMG} | cut -d' ' -f3`
echo '{' > $DESTDIR/${NAME}.json
echo ' "name": "'${NAME}'",' >> $DESTDIR/${NAME}.json
echo ' "size": "'${SIZE}'",' >> $DESTDIR/${NAME}.json
echo ' "fallback": "'${FALLBACKEXT}'"}' >> $DESTDIR/${NAME}.json
