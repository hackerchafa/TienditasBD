import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const marcas = await prisma.marca.findMany({
      include: { productos: true }
    });
    res.json(marcas);
  } catch (err) {
    next(err);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const marca = await prisma.marca.findUnique({
      where: { id },
      include: { productos: true }
    });
    if (!marca) return res.status(404).json({ error: 'Marca no encontrada' });
    res.json(marca);
  } catch (err) {
    next(err);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nombre } = req.body;
    if (!nombre) {
      return res.status(400).json({ error: 'nombre es requerido' });
    }
    const marca = await prisma.marca.create({
      data: { nombre }
    });
    res.status(201).json(marca);
  } catch (err) {
    next(err);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const { nombre } = req.body;
    if (!nombre) {
      return res.status(400).json({ error: 'nombre es requerido' });
    }
    const marca = await prisma.marca.update({
      where: { id },
      data: { nombre }
    });
    res.json(marca);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    await prisma.marca.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}; 