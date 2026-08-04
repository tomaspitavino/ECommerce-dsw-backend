#!/bin/sh

API_URL="localhost:3000"

echo ""
echo "Probando login con usuario admin..."
curl -s -X POST http://"$API_URL"/api/auth/login \
	-H "Content-Type: application/json" \
	-d '{
    "email": "admin@muebleria.com",
    "contrasenia": "admin1234a"
  }'

echo ""
echo "Probando login con usuario normal..."
curl -s -X POST http://"$API_URL"/api/auth/login \
	-H "Content-Type: application/json" \
	-d '{
    "email": "goku@kamehouse.com",
    "contrasenia": "kamehameha123a"
  }'
