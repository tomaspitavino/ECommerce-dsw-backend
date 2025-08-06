# Consultas para DSW

## Tareas pendientes para el backend

1. Implementar CRUD favoritos:
   - Hacer desde clientes un array de favoritos (sin fechaAgregado)
2. Reconsiderar relaciones con linea pedido:
   - oneToMany desde mueble (con pedidos), manyToOne desde pedido (con muebles)
3. HistorialCompras será eliminado, por lo menos por ahora. Posiblemente luego será implementado, es decir que no se eliminará en concepto:
   - Es un caso de uso para ver el histórico de pedidos (filtrar por pedido)

Un pedido es epic o caso de uso por tener valor para el negocio

## Consultas posibles para DSW

1. Consultar sobre el modelado de atributos que sean relaciones en el DER y sobr e cómo traducirlas a many to many o one to many, y qué implicaría hacerlo para el ORM.
2. Por qué haría falta una Base Entity? Por qué deberíamos modelar una clase que la extienda y use su primary key? (para no repetirla?)
3. Pedido no es CRUD, pero hace falta codificarlo con la capa MVC incluyendo el controller, repository, routes, etc?
4. Por qué no pude usar getReference en update de cliente?
5. Cómo manejo los populates? También hay para el descuento y cualquier otro atributo que se repita varias veces en entidad cliente?
