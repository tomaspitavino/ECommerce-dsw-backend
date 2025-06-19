docker run -d --name mysql-desarollo \
 -v /home/utane/Escritorio/docker-volumes/mysql-muebleria/:/var/lib/mysql \
 -e MYSQL_ROOT_HOST='%' \
 -e MYSQL_ALLOW_EMPTY_PASSWORD="yes" \
 -e MYSQL_PASSWORD="dsw" \
 -e MYSQL_USER="dsw" \
 -e MYSQL_DATABASE='muebleria' \
 -p 3306:3306 \
 mysql:9.3.0
