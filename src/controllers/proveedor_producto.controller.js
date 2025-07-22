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
        const proveedorProductos = yield prisma.proveedor_Producto.findMany({
            include: {
                proveedor: true,
                producto: true
            }
        });
        res.json(proveedorProductos);
    }
    catch (err) {
        next(err);
    }
});
exports.getAll = getAll;
const getById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const proveedorProducto = yield prisma.proveedor_Producto.findUnique({
            where: { id },
            include: {
                proveedor: true,
                producto: true
            }
        });
        if (!proveedorProducto)
            return res.status(404).json({ error: 'Relación Proveedor-Producto no encontrada' });
        res.json(proveedorProducto);
    }
    catch (err) {
        next(err);
    }
});
exports.getById = getById;
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { proveedorId, productoId } = req.body;
        if (!proveedorId || !productoId) {
            return res.status(400).json({ error: 'proveedorId y productoId son requeridos' });
        }
        const proveedorProducto = yield prisma.proveedor_Producto.create({
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
    }
    catch (err) {
        next(err);
    }
});
exports.create = create;
const update = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const { proveedorId, productoId } = req.body;
        if (!proveedorId || !productoId) {
            return res.status(400).json({ error: 'proveedorId y productoId son requeridos' });
        }
        const proveedorProducto = yield prisma.proveedor_Producto.update({
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
    }
    catch (err) {
        next(err);
    }
});
exports.update = update;
const remove = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        yield prisma.proveedor_Producto.delete({ where: { id } });
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
});
exports.remove = remove;
