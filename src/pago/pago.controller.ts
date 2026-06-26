import { Request, Response } from "express";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { orm } from "../shared/db/orm.js";
import { Pedido } from "../pedido/pedido.entity.mysql.js";
import { Pago } from "./pago.entity.mysql.js";

const em = orm.em;

const mp = new MercadoPagoConfig({
  accessToken: process.env.SELLER_ACCESS_TOKEN!,
});

export async function crearPreferencia(req: Request, res: Response) {
  try {
    const pedidoId = Number(req.params.pedidoId);
    const pedido = await em.findOneOrFail(
      Pedido,
      { id: pedidoId },
      { populate: ["items.mueble"] },
    );

    const preference = new Preference(mp);
    const response = await preference.create({
      body: {
        items: pedido.items.getItems().map((item) => ({
          id: String(item.id),
          title: item.mueble.etiqueta,
          quantity: item.cantidad,
          unit_price: Number(item.mueble.precioUnitario),
        })),
        back_urls: {
          success: "http://localhost:5173/pagos",
          failure: "http://localhost:5173/carrito",
          pending: "http://localhost:5173/pedidos",
        },
        auto_return: "approved",
        external_reference: String(pedidoId),
      },
    });

    // Crear el pago en la base de datos
    const pago = em.create(Pago, {
      metodoPago: "mercadopago",
      importe: pedido.total,
    });

    pedido.pago = pago;
    await em.persistAndFlush(pago);

    res.status(201).json({
      message: "Preferencia creada",
      checkoutUrl: response.init_point,
      preferenceId: response.id,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function webhook(req: Request, res: Response) {
  try {
    const { type, data } = req.body;

    if (type === "payment") {
      const paymentId = data.id;

      // Consultamos el pago a MercadoPago
      const mpResponse = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
          },
        },
      );
      const payment = await mpResponse.json();

      const pedidoId = Number(payment.external_reference);
      const pedido = await em.findOneOrFail(Pedido, { id: pedidoId });

      if (payment.status === "approved") {
        pedido.estado = "pagado";
        await em.flush();
      }
    }

    res.status(200).send();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
