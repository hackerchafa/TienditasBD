import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ventas = await prisma.venta.findMany({
      include: {
        empleado: true,
        detalles: {
          include: { producto: true }
        }
      }
    });
    res.json(ventas);
  } catch (err) {
    next(err);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const venta = await prisma.venta.findUnique({
      where: { id },
      include: {
        empleado: true,
        detalles: {
          include: { producto: true }
        }
      }
    });
    if (!venta) return res.status(404).json({ error: 'Venta no encontrada' });
    res.json(venta);
  } catch (err) {
    next(err);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { fecha, empleadoId } = req.body;
    if (!fecha || !empleadoId) {
      return res.status(400).json({ error: 'fecha y empleadoId son requeridos' });
    }
    const venta = await prisma.venta.create({
      data: {
        fecha: new Date(fecha),
        empleadoId: Number(empleadoId)
      },
      include: { empleado: true }
    });
    res.status(201).json(venta);
  } catch (err) {
    next(err);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const { fecha, empleadoId } = req.body;
    if (!fecha || !empleadoId) {
      return res.status(400).json({ error: 'fecha y empleadoId son requeridos' });
    }
    const venta = await prisma.venta.update({
      where: { id },
      data: {
        fecha: new Date(fecha),
        empleadoId: Number(empleadoId)
      },
      include: { empleado: true }
    });
    res.json(venta);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    await prisma.venta.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}; 