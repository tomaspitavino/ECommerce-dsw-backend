# Características implementadas

1. Framework web con Express: Cumple con el requisito de usar un framework que permita integración.
2. Middlewares:
   - cors: Para permitir peticiones desde el frontend
   - morgan: Para logging de peticiones
   - express.json: Para parsear JSON
   - Validador personalizado para los datos del mueble
3. REST API completa:
   - POST /api/muebles - Crear mueble
   - GET /api/muebles - Listar todos
   - GET /api/muebles/:codigo - Obtener uno
   - PUT /api/muebles/:codigo - Actualizar
   - DELETE /api/muebles/:codigo - Eliminar
   - GET /api/muebles/filtrar/categoria?categoria=X - Filtrar por categoría
   - GET /api/muebles/filtrar/etiqueta?etiqueta=X - Filtrar por etiqueta
4. Persistencia en memoria: Usa un objeto JavaScript como almacenamiento.
5. Validaciones: Middleware para validar datos antes de crear o actualizar.

# Pruebas con curl

# Crear un mueble

curl -X POST -H "Content-Type: application/json" -d '{
"descripcion": "Silla moderna",
"tipoMaterial": "Madera",
"dimensiones": "40x50x80",
"categoria": "Sillas",
"stock": 10,
"etiqueta": "moderno",
"precioUnitario": 150.50
}' <http://localhost:3000/api/muebles>

# Listar todos los muebles

curl <http://localhost:3000/api/muebles>

# Filtrar por categoría

curl <http://localhost:3000/api/muebles/filtrar/categoria?categoria=Sillas>

prueba
