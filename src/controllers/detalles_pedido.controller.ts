import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const detallesPedidos = await prisma.detalles_Pedido.findMany({
      include: {
        pedido: true,
        producto: true
      }
    });
    res.json(detallesPedidos);
  } catch (err) {
    next(err);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const detallePedido = await prisma.detalles_Pedido.findUnique({
      where: { id },
      include: {
        pedido: true,
        producto: true
      }
    });
    if (!detallePedido) return res.status(404).json({ error: 'Detalle de pedido no encontrado' });
    res.json(detallePedido);
  } catch (err) {
    next(err);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { pedidoId, productoId, cantidad } = req.body;
    if (!pedidoId || !productoId || cantidad === undefined) {
      return res.status(400).json({ error: 'pedidoId, productoId y cantidad son requeridos' });
    }
    const detallePedido = await prisma.detalles_Pedido.create({
      data: {
        pedidoId: Number(pedidoId),
        productoId: Number(productoId),
        cantidad: Number(cantidad)
      },
      include: {
        pedido: true,
        producto: true
      }
    });
    res.status(201).json(detallePedido);
  } catch (err) {
    next(err);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const { pedidoId, productoId, cantidad } = req.body;
    if (!pedidoId || !productoId || cantidad === undefined) {
      return res.status(400).json({ error: 'pedidoId, productoId y cantidad son requeridos' });
    }
    const detallePedido = await prisma.detalles_Pedido.update({
      where: { id },
      data: {
        pedidoId: Number(pedidoId),
        productoId: Number(productoId),
        cantidad: Number(cantidad)
      },
      include: {
        pedido: true,
        producto: true
      }
    });
    res.json(detallePedido);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    await prisma.detalles_Pedido.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}; 