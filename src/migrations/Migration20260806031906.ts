import { Migration } from '@mikro-orm/migrations';

export class Migration20260806031906 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `categoria` (`id` int unsigned not null auto_increment primary key, `fecha_creacion` datetime not null, `fecha_actualizado` datetime not null, `nombre` varchar(255) not null, `descripcion` varchar(255) not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `categoria` add unique `categoria_nombre_unique`(`nombre`);');

    this.addSql('create table `material` (`id` int unsigned not null auto_increment primary key, `fecha_creacion` datetime not null, `fecha_actualizado` datetime not null, `nro_material` varchar(255) not null, `nombre` varchar(255) not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `material` add unique `material_nro_material_unique`(`nro_material`);');

    this.addSql('create table `mueble` (`id` int unsigned not null auto_increment primary key, `fecha_creacion` datetime not null, `fecha_actualizado` datetime not null, `descripcion` varchar(255) not null, `stock` int not null, `etiqueta` varchar(255) not null, `precio_unitario` numeric(10,2) not null, `imagenes` text not null, `activo` tinyint(1) not null default true, `categoria_id` int unsigned not null, `material_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `mueble` add index `mueble_categoria_id_index`(`categoria_id`);');
    this.addSql('alter table `mueble` add index `mueble_material_id_index`(`material_id`);');

    this.addSql('create table `pago` (`id` int unsigned not null auto_increment primary key, `fecha_creacion` datetime not null, `fecha_actualizado` datetime not null, `metodo_pago` varchar(255) not null, `importe` numeric(10,2) not null) default character set utf8mb4 engine = InnoDB;');

    this.addSql('create table `usuario` (`id` int unsigned not null auto_increment primary key, `fecha_creacion` datetime not null, `fecha_actualizado` datetime not null, `nombre` varchar(255) not null, `apellido` varchar(255) not null, `direccion` varchar(255) not null, `telefono` varchar(255) not null, `dni` varchar(255) not null, `usuario` varchar(255) not null, `email` varchar(255) not null, `password_hash` varchar(255) not null, `rol` varchar(255) not null default \'cliente\', `fondos` int not null default 0) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `usuario` add unique `usuario_dni_unique`(`dni`);');
    this.addSql('alter table `usuario` add unique `usuario_usuario_unique`(`usuario`);');
    this.addSql('alter table `usuario` add unique `usuario_email_unique`(`email`);');

    this.addSql('create table `pedido` (`id` int unsigned not null auto_increment primary key, `fecha_creacion` datetime not null, `fecha_actualizado` datetime not null, `usuario_id` int unsigned not null, `fecha_hora` varchar(255) not null, `estado` varchar(255) not null default \'pendiente\', `total` numeric(10,2) not null default 0, `pago_id` int unsigned null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `pedido` add index `pedido_usuario_id_index`(`usuario_id`);');
    this.addSql('alter table `pedido` add index `pedido_pago_id_index`(`pago_id`);');

    this.addSql('create table `item` (`id` int unsigned not null auto_increment primary key, `fecha_creacion` datetime not null, `fecha_actualizado` datetime not null, `subtotal` numeric(10,2) not null, `estado` varchar(255) not null default \'pendiente\', `cantidad` int not null default 1, `mueble_id` int unsigned not null, `pedido_id` int unsigned null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `item` add index `item_mueble_id_index`(`mueble_id`);');
    this.addSql('alter table `item` add index `item_pedido_id_index`(`pedido_id`);');

    this.addSql('create table `descuento` (`id` int unsigned not null auto_increment primary key, `fecha_creacion` datetime not null, `fecha_actualizado` datetime not null, `codigo` varchar(255) not null, `tipo` varchar(255) not null, `porcentaje` int not null, `descripcion` varchar(255) not null, `fecha_expiracion` datetime null, `pedido_id` int unsigned null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `descuento` add index `descuento_pedido_id_index`(`pedido_id`);');

    this.addSql('create table `favorito` (`id` int unsigned not null auto_increment primary key, `fecha_creacion` datetime not null, `fecha_actualizado` datetime not null, `usuario_id` int unsigned not null, `mueble_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `favorito` add index `favorito_usuario_id_index`(`usuario_id`);');
    this.addSql('alter table `favorito` add index `favorito_mueble_id_index`(`mueble_id`);');

    this.addSql('alter table `mueble` add constraint `mueble_categoria_id_foreign` foreign key (`categoria_id`) references `categoria` (`id`) on update cascade;');
    this.addSql('alter table `mueble` add constraint `mueble_material_id_foreign` foreign key (`material_id`) references `material` (`id`) on update cascade;');

    this.addSql('alter table `pedido` add constraint `pedido_usuario_id_foreign` foreign key (`usuario_id`) references `usuario` (`id`) on update cascade;');
    this.addSql('alter table `pedido` add constraint `pedido_pago_id_foreign` foreign key (`pago_id`) references `pago` (`id`) on update cascade on delete set null;');

    this.addSql('alter table `item` add constraint `item_mueble_id_foreign` foreign key (`mueble_id`) references `mueble` (`id`) on update cascade;');
    this.addSql('alter table `item` add constraint `item_pedido_id_foreign` foreign key (`pedido_id`) references `pedido` (`id`) on update cascade on delete set null;');

    this.addSql('alter table `descuento` add constraint `descuento_pedido_id_foreign` foreign key (`pedido_id`) references `pedido` (`id`) on update cascade on delete set null;');

    this.addSql('alter table `favorito` add constraint `favorito_usuario_id_foreign` foreign key (`usuario_id`) references `usuario` (`id`) on update cascade;');
    this.addSql('alter table `favorito` add constraint `favorito_mueble_id_foreign` foreign key (`mueble_id`) references `mueble` (`id`) on update cascade;');
  }

}
