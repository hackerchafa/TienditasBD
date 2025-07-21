import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productos = await prisma.producto.findMany({
      include: {
        marca: true,
        proveedorProducto: {
          include: { proveedor: true }
        }
      }
    });
    res.json(productos);
  } catch (err) {
    next(err);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const producto = await prisma.producto.findUnique({
      where: { id },
      include: {
        marca: true,
        proveedorProducto: {
          include: { proveedor: true }
        }
      }
    });
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(producto);
  } catch (err) {
    next(err);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nombre, precio, stock, marcaId } = req.body;
    if (!nombre || precio === undefined || stock === undefined || !marcaId) {
      return res.status(400).json({ error: 'nombre, precio, stock y marcaId son requeridos' });
    }
    const producto = await prisma.producto.create({
      data: {
        nombre,
        precio: Number(precio),
        stock: Number(stock),
        marcaId: Number(marcaId)
      },
      include: { marca: true }
    });
    res.status(201).json(producto);
  } catch (err) {
    next(err);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const { nombre, precio, stock, marcaId } = req.body;
    if (!nombre || precio === undefined || stock === undefined || !marcaId) {
      return res.status(400).json({ error: 'nombre, precio, stock y marcaId son requeridos' });
    }
    const producto = await prisma.producto.update({
      where: { id },
      data: {
        nombre,
        precio: Number(precio),
        stock: Number(stock),
        marcaId: Number(marcaId)
      },
      include: { marca: true }
    });
    res.json(producto);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    await prisma.producto.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}; 