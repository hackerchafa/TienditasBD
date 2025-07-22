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
        const marcas = yield prisma.marca.findMany({
            include: { productos: true }
        });
        res.json(marcas);
    }
    catch (err) {
        next(err);
    }
});
exports.getAll = getAll;
const getById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const marca = yield prisma.marca.findUnique({
            where: { id },
            include: { productos: true }
        });
        if (!marca)
            return res.status(404).json({ error: 'Marca no encontrada' });
        res.json(marca);
    }
    catch (err) {
        next(err);
    }
});
exports.getById = getById;
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre } = req.body;
        if (!nombre) {
            return res.status(400).json({ error: 'nombre es requerido' });
        }
        const marca = yield prisma.marca.create({
            data: { nombre }
        });
        res.status(201).json(marca);
    }
    catch (err) {
        next(err);
    }
});
exports.create = create;
const update = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const { nombre } = req.body;
        if (!nombre) {
            return res.status(400).json({ error: 'nombre es requerido' });
        }
        const marca = yield prisma.marca.update({
            where: { id },
            data: { nombre }
        });
        res.json(marca);
    }
    catch (err) {
        next(err);
    }
});
exports.update = update;
const remove = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        yield prisma.marca.delete({ where: { id } });
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
});
exports.remove = remove;
