import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const empleados = await prisma.empleado.findMany();
    res.json(empleados);
  } catch (err) {
    next(err);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const empleado = await prisma.empleado.findUnique({ where: { id } });
    if (!empleado) return res.status(404).json({ error: 'Empleado no encontrado' });
    res.json(empleado);
  } catch (err) {
    next(err);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nombre, puesto, salario } = req.body;
    if (!nombre || !puesto || salario === undefined) {
      return res.status(400).json({ error: 'nombre, puesto y salario son requeridos' });
    }
    const empleado = await prisma.empleado.create({
      data: { nombre, puesto, salario: Number(salario) },
    });
    res.status(201).json(empleado);
  } catch (err) {
    next(err);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const { nombre, puesto, salario } = req.body;
    if (!nombre || !puesto || salario === undefined) {
      return res.status(400).json({ error: 'nombre, puesto y salario son requeridos' });
    }
    const empleado = await prisma.empleado.update({
      where: { id },
      data: { nombre, puesto, salario: Number(salario) },
    });
    res.json(empleado);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    await prisma.empleado.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}; 