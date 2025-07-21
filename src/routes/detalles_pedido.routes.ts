import { Router } from 'express';
import * as detallesPedidoController from '../controllers/detalles_pedido.controller';

const router = Router();

router.get('/', detallesPedidoController.getAll);
router.get('/:id', detallesPedidoController.getById);
router.post('/', detallesPedidoController.create);
router.put('/:id', detallesPedidoController.update);
router.delete('/:id', detallesPedidoController.remove);

export default router; 