#!/bin/bash
var1="hello"
var2="Hello"
if [[ "${var1,,}" = "${var2,,}" ]]
then
echo 'matches'
fi
