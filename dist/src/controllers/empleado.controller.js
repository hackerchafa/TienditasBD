"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.create = exports.getById = exports.getAll = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const empleados = yield prisma.empleado.findMany();
        res.json(empleados);
    }
    catch (err) {
        next(err);
    }
});
exports.getAll = getAll;
const getById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const empleado = yield prisma.empleado.findUnique({ where: { id } });
        if (!empleado)
            return res.status(404).json({ error: 'Empleado no encontrado' });
        res.json(empleado);
    }
    catch (err) {
        next(err);
    }
});
exports.getById = getById;
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre, puesto, salario } = req.body;
        if (!nombre || !puesto || salario === undefined) {
            return res.status(400).json({ error: 'nombre, puesto y salario son requeridos' });
        }
        const empleado = yield prisma.empleado.create({
            data: { nombre, puesto, salario: Number(salario) },
        });
        res.status(201).json(empleado);
    }
    catch (err) {
        next(err);
    }
});
exports.create = create;
const update = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const { nombre, puesto, salario } = req.body;
        if (!nombre || !puesto || salario === undefined) {
            return res.status(400).json({ error: 'nombre, puesto y salario son requeridos' });
        }
        const empleado = yield prisma.empleado.update({
            where: { id },
            data: { nombre, puesto, salario: Number(salario) },
        });
        res.json(empleado);
    }
    catch (err) {
        next(err);
    }
});
exports.update = update;
const remove = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        yield prisma.empleado.delete({ where: { id } });
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
});
exports.remove = remove;
