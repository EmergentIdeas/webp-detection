#!/bin/bash

echo "start $#"
while getopts u:a:f: flag
do
#	echo ${flag}
    case "${flag}" in
        u) username=${OPTARG};;
        a) age=${OPTARG};;
        f) fullname=${OPTARG};;
    esac
done

echo "optind $OPTIND"
echo "username: ${username}"
echo "age: ${age}"
echo "fullname: ${fullname}"

# makes it so that only the arguments to the program not picked up by getopts are $1 $2 $3 etc.
# this is how you use arguments which are not named parameters
shift $(expr $OPTIND - 1 )

echo "1: ${1}"
echo "2: ${2}"
echo "3: ${3}"
#printf "%s\n" "$#" 
echo $#
