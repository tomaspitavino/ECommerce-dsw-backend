import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response } from "express";

const mockFind = vi.fn();
const mockFindOneOrFail = vi.fn();

// sirve para simular la importación de find y findOneOrFail para que podamos controlar su comportamiento en los tests
vi.mock("../shared/db/orm.js", () => ({
  orm: {
    em: {
      find: (...args: unknown[]) => mockFind(...args),
      findOneOrFail: (...args: unknown[]) => mockFindOneOrFail(...args),
    },
  },
}));

import { findAllPedidos, findAllPedidosAdmin } from "./pedido.controller.js";

function createPedidoMock(overrides: Record<string, unknown> = {}) {
  const items = {
    isInitialized: () => true,
    getItems: () => [
      {
        id: 10,
        cantidad: 2,
        subtotal: 5000,
        mueble: {
          id: 3,
          descripcion: "Silla nordica",
          etiqueta: "Silla",
        },
      },
    ],
  };

  return {
    id: 1,
    fechaHora: new Date("2024-06-15T12:00:00"),
    estado: "pendiente",
    total: 5000,
    items,
    usuario: {
      id: 2,
      nombre: "Ana",
      apellido: "Garcia",
      email: "ana@test.com",
    },
    ...overrides,
  };
}

describe("findAllPedidos", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("devuelve pedidos serializados con items para el cliente autenticado", async () => {
    const pedido = createPedidoMock();
    mockFindOneOrFail.mockResolvedValue({ id: 2 });
    mockFind.mockResolvedValue([pedido]);

    const req = { user: { id: 2, rol: "cliente" } } as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await findAllPedidos(req, res);

    expect(mockFind).toHaveBeenCalledWith(
      // expect.anything() se utiliza para ignorar el primer argumento, que es el tipo de entidad (Pedido)
      expect.anything(),
      { usuario: { id: 2 } },
      expect.objectContaining({
        populate: ["items.mueble", "pago"],
      }),
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      data: [
        expect.objectContaining({
          id: 1,
          items: [
            expect.objectContaining({
              cantidad: 2,
              mueble: expect.objectContaining({
                descripcion: "Silla nordica",
              }),
            }),
          ],
        }),
      ],
    });
  });
});

describe("findAllPedidosAdmin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("aplica filtros de fecha y estado en la consulta", async () => {
    mockFind.mockResolvedValue([]);

    const req = {
      query: {
        fechaDesde: "2024-06-01",
        fechaHasta: "2024-06-30",
        estado: "pagado",
      },
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await findAllPedidosAdmin(req, res);

    expect(mockFind).toHaveBeenCalledWith(
      // expect.anything() se utiliza para ignorar el primer argumento
      expect.anything(),
      expect.objectContaining({
        estado: "pagado",
        fechaHora: expect.objectContaining({
          $gte: expect.any(Date),
          $lte: expect.any(Date),
        }),
      }),
      expect.objectContaining({
        populate: ["items.mueble", "pago", "usuario"],
      }),
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: [] });
  });

  it("devuelve pedidos con usuario e items serializados", async () => {
    mockFind.mockResolvedValue([createPedidoMock({ estado: "pagado" })]);

    const req = { query: {} } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    await findAllPedidosAdmin(req, res);

    expect(res.json).toHaveBeenCalledWith({
      data: [
        expect.objectContaining({
          estado: "pagado",
          usuario: {
            id: 2,
            nombre: "Ana",
            apellido: "Garcia",
            email: "ana@test.com",
          },
          items: [
            expect.objectContaining({
              subtotal: 5000,
              mueble: expect.objectContaining({
                descripcion: "Silla nordica",
              }),
            }),
          ],
        }),
      ],
    });
  });
});
