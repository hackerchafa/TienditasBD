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
        const detallesPedidos = yield prisma.detalles_Pedido.findMany({
            include: {
                pedido: true,
                producto: true
            }
        });
        res.json(detallesPedidos);
    }
    catch (err) {
        next(err);
    }
});
exports.getAll = getAll;
const getById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const detallePedido = yield prisma.detalles_Pedido.findUnique({
            where: { id },
            include: {
                pedido: true,
                producto: true
            }
        });
        if (!detallePedido)
            return res.status(404).json({ error: 'Detalle de pedido no encontrado' });
        res.json(detallePedido);
    }
    catch (err) {
        next(err);
    }
});
exports.getById = getById;
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pedidoId, productoId, cantidad } = req.body;
        if (!pedidoId || !productoId || cantidad === undefined) {
            return res.status(400).json({ error: 'pedidoId, productoId y cantidad son requeridos' });
        }
        const detallePedido = yield prisma.detalles_Pedido.create({
            data: {
                pedidoId: Number(pedidoId),
                productoId: Number(productoId),
                cantidad: Number(cantidad)
            },
            include: {
                pedido: true,
                producto: true
            }
        });
        res.status(201).json(detallePedido);
    }
    catch (err) {
        next(err);
    }
});
exports.create = create;
const update = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const { pedidoId, productoId, cantidad } = req.body;
        if (!pedidoId || !productoId || cantidad === undefined) {
            return res.status(400).json({ error: 'pedidoId, productoId y cantidad son requeridos' });
        }
        const detallePedido = yield prisma.detalles_Pedido.update({
            where: { id },
            data: {
                pedidoId: Number(pedidoId),
                productoId: Number(productoId),
                cantidad: Number(cantidad)
            },
            include: {
                pedido: true,
                producto: true
            }
        });
        res.json(detallePedido);
    }
    catch (err) {
        next(err);
    }
});
exports.update = update;
const remove = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        yield prisma.detalles_Pedido.delete({ where: { id } });
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
});
exports.remove = remove;
