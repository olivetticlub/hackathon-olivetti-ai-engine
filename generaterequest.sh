#!/bin/bash

qty=100

function aMerchant() {
    echo "{\"coordinates\":{\"lat\": $1, \"lng\": $2}, \"ateco\": $3, \"name\": \"$4\"}"
}

referringMerchant=$(aMerchant 0 0 1 referringMerchant)
nearMerchant=$(aMerchant 2 1 3 nearMerchant)

request="{\"referringMerchant\": $referringMerchant, \"merchantsPool\":[$nearMerchant,"
for i in $(seq 1 $qty)
do
    lat=$((10 + RANDOM % 50))
    lng=$((10 + RANDOM % 50))
    ateco=$((1 + RANDOM % 10))
    name=$((RANDOM % 180))
    merchant=$(aMerchant $lat $lng $ateco $name)
    request="$request$merchant,"
done
request="${request%?}]}"

curl -X POST https://olivetticlubmerchants.herokuapp.com/merchants --header 'content-type: application/json' \
  --data "$request"
