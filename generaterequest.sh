#!/bin/bash

qty=$1

request="{\"merchant\": {\"lat\": 0, \"lng\": 0, \"ateco\": 0, \"name\": \"referring\"}, \"merchants\":["
request="$request{\"lat\": 1, \"lng\": 2, \"ateco\": 2, \"name\": \"anearmerchant\"},"
for i in $(seq 1 $qty)
do
    ateco=$((1 + RANDOM % 10))
    lat=$((10 + RANDOM % 50))
    lng=$((10 + RANDOM % 50))
    name=$((RANDOM % 180))
    request="$request{\"lat\": $lat, \"lng\": $lng, \"ateco\": $ateco, \"name\": \"$name\"},"
done
request="${request%?}]}"

curl -X POST https://olivetticlubmerchants.herokuapp.com/merchants --header 'content-type: application/json' \
  --data "$request"
