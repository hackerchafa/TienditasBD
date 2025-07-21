import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pedidos = await prisma.pedido.findMany({
      include: {
        proveedor: true,
        detalles: {
          include: { producto: true }
        }
      }
    });
    res.json(pedidos);
  } catch (err) {
    next(err);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const pedido = await prisma.pedido.findUnique({
      where: { id },
      include: {
        proveedor: true,
        detalles: {
          include: { producto: true }
        }
      }
    });
    if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' });
    res.json(pedido);
  } catch (err) {
    next(err);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { fecha, proveedorId } = req.body;
    if (!fecha || !proveedorId) {
      return res.status(400).json({ error: 'fecha y proveedorId son requeridos' });
    }
    const pedido = await prisma.pedido.create({
      data: {
        fecha: new Date(fecha),
        proveedorId: Number(proveedorId)
      },
      include: { proveedor: true }
    });
    res.status(201).json(pedido);
  } catch (err) {
    next(err);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const { fecha, proveedorId } = req.body;
    if (!fecha || !proveedorId) {
      return res.status(400).json({ error: 'fecha y proveedorId son requeridos' });
    }
    const pedido = await prisma.pedido.update({
      where: { id },
      data: {
        fecha: new Date(fecha),
        proveedorId: Number(proveedorId)
      },
      include: { proveedor: true }
    });
    res.json(pedido);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    await prisma.pedido.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}; 