import { Router } from 'express';
import * as proveedorProductoController from '../controllers/proveedor_producto.controller';

const router = Router();

router.get('/', proveedorProductoController.getAll);
router.get('/:id', proveedorProductoController.getById);
router.post('/', proveedorProductoController.create);
router.put('/:id', proveedorProductoController.update);
router.delete('/:id', proveedorProductoController.remove);

export default router; 