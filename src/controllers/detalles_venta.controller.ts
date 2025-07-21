import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const detallesVentas = await prisma.detalles_Venta.findMany({
      include: {
        venta: true,
        producto: true
      }
    });
    res.json(detallesVentas);
  } catch (err) {
    next(err);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const detalleVenta = await prisma.detalles_Venta.findUnique({
      where: { id },
      include: {
        venta: true,
        producto: true
      }
    });
    if (!detalleVenta) return res.status(404).json({ error: 'Detalle de venta no encontrado' });
    res.json(detalleVenta);
  } catch (err) {
    next(err);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ventaId, productoId, cantidad } = req.body;
    if (!ventaId || !productoId || cantidad === undefined) {
      return res.status(400).json({ error: 'ventaId, productoId y cantidad son requeridos' });
    }
    const detalleVenta = await prisma.detalles_Venta.create({
      data: {
        ventaId: Number(ventaId),
        productoId: Number(productoId),
        cantidad: Number(cantidad)
      },
      include: {
        venta: true,
        producto: true
      }
    });
    res.status(201).json(detalleVenta);
  } catch (err) {
    next(err);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const { ventaId, productoId, cantidad } = req.body;
    if (!ventaId || !productoId || cantidad === undefined) {
      return res.status(400).json({ error: 'ventaId, productoId y cantidad son requeridos' });
    }
    const detalleVenta = await prisma.detalles_Venta.update({
      where: { id },
      data: {
        ventaId: Number(ventaId),
        productoId: Number(productoId),
        cantidad: Number(cantidad)
      },
      include: {
        venta: true,
        producto: true
      }
    });
    res.json(detalleVenta);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    await prisma.detalles_Venta.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}; 