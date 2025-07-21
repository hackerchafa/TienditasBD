import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const proveedorProductos = await prisma.proveedor_Producto.findMany({
      include: {
        proveedor: true,
        producto: true
      }
    });
    res.json(proveedorProductos);
  } catch (err) {
    next(err);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const proveedorProducto = await prisma.proveedor_Producto.findUnique({
      where: { id },
      include: {
        proveedor: true,
        producto: true
      }
    });
    if (!proveedorProducto) return res.status(404).json({ error: 'Relación Proveedor-Producto no encontrada' });
    res.json(proveedorProducto);
  } catch (err) {
    next(err);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { proveedorId, productoId } = req.body;
    if (!proveedorId || !productoId) {
      return res.status(400).json({ error: 'proveedorId y productoId son requeridos' });
    }
    const proveedorProducto = await prisma.proveedor_Producto.create({
      data: {
        proveedorId: Number(proveedorId),
        productoId: Number(productoId)
      },
      include: {
        proveedor: true,
        producto: true
      }
    });
    res.status(201).json(proveedorProducto);
  } catch (err) {
    next(err);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const { proveedorId, productoId } = req.body;
    if (!proveedorId || !productoId) {
      return res.status(400).json({ error: 'proveedorId y productoId son requeridos' });
    }
    const proveedorProducto = await prisma.proveedor_Producto.update({
      where: { id },
      data: {
        proveedorId: Number(proveedorId),
        productoId: Number(productoId)
      },
      include: {
        proveedor: true,
        producto: true
      }
    });
    res.json(proveedorProducto);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    await prisma.proveedor_Producto.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}; 