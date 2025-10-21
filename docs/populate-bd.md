# Populate database

Al iniciar el backend, si ya tenemos docker o la conexión de mysql (por ejemplo,
en workbench o mariadb) iniciada, entonces después de correr pnpm
start:dev tendremos que utilizar cualquiera de estos dos comandos para hacer un
populate de la base de datos.

```js

npx mikro-orm seeder:run

```

O bien podemos correrlo desde el script que está en package.json

```js

pnpm seed

```
