#!/bin/bash

# Takes a source image (arg 1) which is an image twice as large as it needs to be
# for the space, and transforms it to a webp file, one with a -2x.webp extension
# which is the same size as the orginal, and a half size with a .webp ext.
# It also produces a falback image, png by default, but actually according to
# arg 3 if set


#requires convert (imagemagik) and pngquant

SRCIMG=$1
DESTDIR=$2
FILENAME=`basename $1`
NAME=${FILENAME%%.*}
EXT=$3
FALLBACKEXT=${EXT:-png}
SRCIMGEXT="${SRCIMG##*.}"


# gen the webp version
convert $SRCIMG -resize 200% $DESTDIR/${NAME}-2x.webp
convert $SRCIMG $DESTDIR/${NAME}.webp
convert $SRCIMG -resize 50% $DESTDIR/${NAME}-half.webp
convert $SRCIMG -resize 25% $DESTDIR/${NAME}-quarter.webp

if [[ "${SRCIMGEXT,,}" = "png" ]] && [[ "${FALLBACKEXT,,}" = "png" ]]
then
	OPTNAME=${NAME}-opt.png
	cat $SRCIMG | pngquant - > ${OPTNAME}	
	SRCIMG=$OPTNAME
	# in other cases we're probably converting to jpeg or from a non png format, so no need for the
	# png optimization above
fi
convert $SRCIMG -resize 200% $DESTDIR/${NAME}-2x.${FALLBACKEXT}
convert $SRCIMG $DESTDIR/${NAME}.${FALLBACKEXT}
convert $SRCIMG -resize 50% $DESTDIR/${NAME}-half.${FALLBACKEXT}
convert $SRCIMG -resize 25% $DESTDIR/${NAME}-quarter.${FALLBACKEXT}


if [[ "${SRCIMGEXT,,}" = "png" ]] && [[ "${FALLBACKEXT,,}" = "png" ]]
then
	rm ${OPTNAME}
fi

# capture size information
SIZE=`identify $DESTDIR/${NAME}-2x.webp | cut -d' ' -f3`
DISPLAYSIZE=`identify $DESTDIR/${NAME}.webp | cut -d' ' -f3`

# generate the file information
echo '{' > $DESTDIR/${NAME}.json
echo ' "name": "'${NAME}'",' >> $DESTDIR/${NAME}.json
echo ' "size": "'${SIZE}'",' >> $DESTDIR/${NAME}.json
echo ' "displaySize": "'${DISPLAYSIZE}'",' >> $DESTDIR/${NAME}.json
echo ' "fallback": "'${FALLBACKEXT}'"}' >> $DESTDIR/${NAME}.json
