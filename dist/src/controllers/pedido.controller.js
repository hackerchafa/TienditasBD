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
        const pedidos = yield prisma.pedido.findMany({
            include: {
                proveedor: true,
                detalles: {
                    include: { producto: true }
                }
            }
        });
        res.json(pedidos);
    }
    catch (err) {
        next(err);
    }
});
exports.getAll = getAll;
const getById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const pedido = yield prisma.pedido.findUnique({
            where: { id },
            include: {
                proveedor: true,
                detalles: {
                    include: { producto: true }
                }
            }
        });
        if (!pedido)
            return res.status(404).json({ error: 'Pedido no encontrado' });
        res.json(pedido);
    }
    catch (err) {
        next(err);
    }
});
exports.getById = getById;
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fecha, proveedorId } = req.body;
        if (!fecha || !proveedorId) {
            return res.status(400).json({ error: 'fecha y proveedorId son requeridos' });
        }
        const pedido = yield prisma.pedido.create({
            data: {
                fecha: new Date(fecha),
                proveedorId: Number(proveedorId)
            },
            include: { proveedor: true }
        });
        res.status(201).json(pedido);
    }
    catch (err) {
        next(err);
    }
});
exports.create = create;
const update = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const { fecha, proveedorId } = req.body;
        if (!fecha || !proveedorId) {
            return res.status(400).json({ error: 'fecha y proveedorId son requeridos' });
        }
        const pedido = yield prisma.pedido.update({
            where: { id },
            data: {
                fecha: new Date(fecha),
                proveedorId: Number(proveedorId)
            },
            include: { proveedor: true }
        });
        res.json(pedido);
    }
    catch (err) {
        next(err);
    }
});
exports.update = update;
const remove = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        yield prisma.pedido.delete({ where: { id } });
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
});
exports.remove = remove;
