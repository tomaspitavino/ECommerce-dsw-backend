#!/bin/sh

API_URL="localhost:3000"

echo "Creando usuario admin..."
curl -s -X POST http://"$API_URL"/api/clientes \
	-H "Content-Type: application/json" \
	-d '{
    "nombre": "Administrador",
    "apellido": "General",
    "direccion": "Calle Central 100",
    "telefono": "1122334455",
    "dni": "273456789",
    "usuario": "admin",
    "email": "admin@muebleria.com",
    "contrasenia": "admin1234a",
    "rol": "admin",
    "fondos": 100000
  }'

echo ""
echo "Creando usuario normal..."
curl -s -X POST http://"$API_URL"/api/clientes \
	-H "Content-Type: application/json" \
	-d '{
    "nombre": "Goku",
    "apellido": "Son",
    "direccion": "Monte Paoz 77",
    "telefono": "1199988877",
    "dni": "30125456",
    "usuario": "gokuson",
    "email": "goku@kamehouse.com",
    "contrasenia": "kamehameha123a",
    "rol": "cliente",
    "fondos": 1500
  }'

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
