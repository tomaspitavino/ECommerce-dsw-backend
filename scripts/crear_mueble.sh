#!/bin/sh

API_URL="localhost:3000"

echo "Creando usuario admin..."
curl -s -X POST http://"$API_URL"/api/clientes \
	-H "Content-Type: application/json" \
	-d '{
    "nombre": "John",
    "apellido": "Desk",
    "direccion": "Gingertown 413",
    "telefono": "47384728",
    "dni": "47402713",
    "usuario": "admin2",
    "email": "admin2@muebleria.com",
    "contrasenia": "johndeskadmin327",
    "rol": "admin",
    "fondos": 1025
  }'

echo ""
echo "Logeando usuario"

response=$(
	curl -s -X POST http://"$API_URL"/api/auth/login \
		-H "Content-Type: application/json" \
		-d '{"email": "admin2@muebleria.com", "contrasenia": "johndeskadmin327"}'
)

# Extraer el accessToken del JSON
access_token=$(echo $response | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

echo "\nToken: $access_token\n"

echo "Prueba para crear un mueble con admin"
curl -s -X POST http://"$API_URL"/api/muebles \
	-H "Content-Type: application/json" \
	-H "Authorization: Bearer $access_token" \
	-d '{
    "descripcion": "Silla ergonómica de oficina con soporte lumbar",
    "stock": 10,
    "etiqueta": "silla-oficina",
    "precioUnitario": 15000,
    "imagenes": ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format"],
    "categoria": 1,
    "material": 1
  }'

echo ""
echo "Prueba para crear un mueble SIN token (debe dar 401)..."
curl -s -X POST http://"$API_URL"/api/muebles \
	-H "Content-Type: application/json" \
	-d '{
    "descripcion": "Silla ergonómica de oficina con soporte lumbar",
    "stock": 10,
    "etiqueta": "silla-oficina",
    "precioUnitario": 15000,
    "imagenes": ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format"],
    "categoria": 1,
    "material": 1
  }'

echo ""
echo "Prueba para crear un mueble con rol USER (debe dar 403)..."
user_response=$(
	curl -s -X POST http://"$API_URL"/api/auth/login \
		-H "Content-Type: application/json" \
		-d '{"email": "goku@kamehouse.com", "contrasenia": "kamehameha123a"}'
)

user_token=$(echo $user_response | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

curl -s -X POST http://"$API_URL"/api/muebles \
	-H "Content-Type: application/json" \
	-H "Authorization: Bearer $user_token" \
	-d '{
    "descripcion": "Silla ergonómica de oficina con soporte lumbar",
    "stock": 10,
    "etiqueta": "silla-oficina",
    "precioUnitario": 15000,
    "imagenes": ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format"],
    "categoria": 1,
    "material": 1
  }'
