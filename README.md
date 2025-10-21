# Documentación

A la hora de correr esto, lo primero que hay que hacer es instalar todas las
dependencias.

Con pnpm

```js

pnpm i

```

Con npm

```js

npm i

```

Ahora tenemos dos formas de correr esto en el backend.

## Método 1

La primera consiste en tener docker instalado y correr algo similar a este
comando en la terminal.

```docker

docker run -d --name mysql-desarollo \
 -v /home/tu-usuario/docker-volumes/mysql-muebleria/:/var/lib/mysql \
 -e MYSQL_ROOT_HOST='%' \
 -e MYSQL_ALLOW_EMPTY_PASSWORD="yes" \
 -e MYSQL_PASSWORD="dsw" \
 -e MYSQL_USER="dsw" \
 -e MYSQL_DATABASE='muebleria' \
 -p 3306:3306 \
 mysql:9.3.0

```

> [!NOTE] Reemplazando el usuario y el path dependiendo de si estás en Linux o Windows.

> [!NOTE] Si el puerto que aparece primero no se puede utilizar por alguna
> razón, se puede cambiar a cualquier otro puerto. El que no se debería cambiar
> es el segundo, porque MySQL siempre lo asigna a 3306.

> [!NOTE] Asegurarse de tener los permisos necesarios de docker (i.e asignar un
> usuario al grupo docker en Linux) para poder darle persistencia a la base de
> datos y no tener que correr el comando de docker cada vez

Recomiendo no cambiar los demás parámetros.

## Método 2

La segunda forma consiste en correr esto en una conexión en mysql workbench.
Utilizaremos los parámetros de MYSQL_USER y MYSQL_PASSWORD (ambos son **dsw**) a
la hora de crear la conexión. El nombre de la base de datos debería seguir
siendo "muebleria".

# Variables de entorno

Es conveniente crear un archivo .env en el directorio raíz que sea como el siguiente:

## Configuración general

CORS_ORIGIN=<URL del frontend o lista separada por comas>
DB_URL=<cadena de conexión a la base de datos>
DB_NAME=<nombre de la base de datos>
NODE_ENV=development

## Configuración del seeder

SEEDER_PATH=dist/src/seeders
SEEDER_PATH_TS=src/seeders
DEFAULT_SEEDER=DatabaseSeeder

> [!INFO] Para más información sobre variables de entorno de MikroORM, consultar [en la documentación de MikroORM versión 5.9](https://mikro-orm.io/docs/5.9/seeding), que es la versión que se usa en este proyecto.

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

Con esto, tendremos suficientes datos para mostrar en el frontend.
