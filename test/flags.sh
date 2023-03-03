#!/bin/bash

while getopts u:a:f: flag
do
	echo ${flag}
    case "${flag}" in
        u) username=${OPTARG};;
        a) age=${OPTARG};;
        f) fullname=${OPTARG};;
    esac
done

echo "username: ${username}"
echo "age: ${age}"
echo "fullname: ${fullname}"
echo "1: ${1}"
echo "2: ${2}"
echo "3: ${3}"
