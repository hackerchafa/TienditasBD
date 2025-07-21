import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const proveedores = await prisma.proveedor.findMany({
      include: {
        proveedorProducto: {
          include: { producto: true }
        }
      }
    });
    res.json(proveedores);
  } catch (err) {
    next(err);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const proveedor = await prisma.proveedor.findUnique({
      where: { id },
      include: {
        proveedorProducto: {
          include: { producto: true }
        }
      }
    });
    if (!proveedor) return res.status(404).json({ error: 'Proveedor no encontrado' });
    res.json(proveedor);
  } catch (err) {
    next(err);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nombre, contacto } = req.body;
    if (!nombre || !contacto) {
      return res.status(400).json({ error: 'nombre y contacto son requeridos' });
    }
    const proveedor = await prisma.proveedor.create({
      data: { nombre, contacto }
    });
    res.status(201).json(proveedor);
  } catch (err) {
    next(err);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const { nombre, contacto } = req.body;
    if (!nombre || !contacto) {
      return res.status(400).json({ error: 'nombre y contacto son requeridos' });
    }
    const proveedor = await prisma.proveedor.update({
      where: { id },
      data: { nombre, contacto }
    });
    res.json(proveedor);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    await prisma.proveedor.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}; 